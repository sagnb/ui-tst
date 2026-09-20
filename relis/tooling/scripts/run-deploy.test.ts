import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfigValidationError, type AllProcessConfigs } from "@relis/config";
import { runDeploy, runServiceGroup, type DeployDeps, type ServiceSpec } from "./run-deploy";

const FAKE_CONFIGS: AllProcessConfigs = {
  api: { NODE_ENV: "test", API_PORT: 3001, DATABASE_URL: "postgresql://u:p@localhost:5432/db" },
  worker: { NODE_ENV: "test", DATABASE_URL: "postgresql://u:p@localhost:5432/db" },
  webServer: { NODE_ENV: "test", PORT: 3000 },
  webPublic: { NEXT_PUBLIC_API_URL: "https://api.example.com" },
  migration: { DATABASE_URL: "postgresql://u:p@localhost:5432/db" },
};

function makeDeps(overrides: Partial<DeployDeps> = {}): DeployDeps {
  return {
    validateAll: vi.fn(() => FAKE_CONFIGS),
    buildWeb: vi.fn(() => 0),
    migrate: vi.fn(() => 0),
    startServices: vi.fn(() => Promise.resolve(0)),
    ...overrides,
  };
}

describe("runDeploy ordering and short-circuiting (spy-based, no real build/migrate/start)", () => {
  it("runs validate -> build -> migrate -> start, in that order, when every step succeeds, passing the resolved configs downstream", async () => {
    const calls: string[] = [];
    const deps = makeDeps({
      validateAll: vi.fn(() => {
        calls.push("validate");
        return FAKE_CONFIGS;
      }),
      buildWeb: vi.fn((configs) => {
        expect(configs).toBe(FAKE_CONFIGS);
        calls.push("build");
        return 0;
      }),
      migrate: vi.fn(() => {
        calls.push("migrate");
        return 0;
      }),
      startServices: vi.fn((configs) => {
        expect(configs).toBe(FAKE_CONFIGS);
        calls.push("start");
        return Promise.resolve(0);
      }),
    });

    await expect(runDeploy(deps)).resolves.toBe(0);
    expect(calls).toEqual(["validate", "build", "migrate", "start"]);
  });

  it("stops before build/migrate/start when validation fails — the first side effect never happens", async () => {
    const deps = makeDeps({
      validateAll: vi.fn(() => {
        throw new ConfigValidationError("deploy", [
          { variable: "DATABASE_URL", category: "database", code: "CONFIG_MISSING" },
        ]);
      }),
    });

    await expect(runDeploy(deps)).resolves.toBe(1);
    expect(deps.buildWeb).not.toHaveBeenCalled();
    expect(deps.migrate).not.toHaveBeenCalled();
    expect(deps.startServices).not.toHaveBeenCalled();
  });

  it("stops before migrate/start when the build step fails, propagating its exit code", async () => {
    const deps = makeDeps({ buildWeb: vi.fn(() => 3) });

    await expect(runDeploy(deps)).resolves.toBe(3);
    expect(deps.migrate).not.toHaveBeenCalled();
    expect(deps.startServices).not.toHaveBeenCalled();
  });

  it("stops before start when migrate fails, propagating its exit code — no service starts if the database write failed", async () => {
    const deps = makeDeps({ migrate: vi.fn(() => 5) });

    await expect(runDeploy(deps)).resolves.toBe(5);
    expect(deps.startServices).not.toHaveBeenCalled();
  });
});

// --- runServiceGroup: real child processes, no mocking of the monitoring
// logic itself. Uses tiny inline `node -e` scripts standing in for
// api/worker/web, so these stay fast and self-contained.

const markerFiles: string[] = [];
function newMarkerFile(): string {
  const file = path.join(os.tmpdir(), `relis-deploy-test-${randomUUID()}.marker`);
  markerFiles.push(file);
  return file;
}
afterEach(() => {
  while (markerFiles.length > 0) {
    const file = markerFiles.pop();
    if (file && existsSync(file)) rmSync(file);
  }
});

/**
 * A service that runs forever and immediately writes its own PID to
 * `pidFile`. On Windows, `child.kill("SIGTERM"/"SIGINT")` terminates the
 * process directly (there are no real POSIX signals) without necessarily
 * giving it a chance to run its own JS signal handler first — so rather
 * than have the child self-report "I was asked to stop" (unreliable
 * cross-platform), the test independently polls whether this PID is still
 * alive after runServiceGroup resolves. That works everywhere, and proves
 * the process was actually terminated, not merely that runServiceGroup
 * returned.
 */
function healthyService(name: string, pidFile: string): ServiceSpec {
  return {
    name,
    command: process.execPath,
    args: ["-e", `require("node:fs").writeFileSync(process.argv[1], String(process.pid)); setInterval(() => {}, 1 << 30);`, pidFile],
    cwd: os.tmpdir(),
    env: process.env,
  };
}

function readPid(pidFile: string): number {
  return Number(readFileSync(pidFile, "utf8"));
}

function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function waitUntilDead(pid: number, timeoutMs = 5_000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (!isAlive(pid)) return true;
    await new Promise((r) => setTimeout(r, 50));
  }
  return !isAlive(pid);
}

async function waitUntilPidFileWritten(pidFile: string, timeoutMs = 5_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (existsSync(pidFile)) return;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error(`${pidFile} was never written`);
}

/** A service that exits immediately with `code`. */
function failingService(name: string, code: number): ServiceSpec {
  return {
    name,
    command: process.execPath,
    // A short delay before exiting, not an immediate process.exit(): an
    // instant exit can race ahead of a sibling `node -e` process that is
    // still in its own Node startup and hasn't reached its first line yet
    // (see healthyService), which would make this test flaky rather than
    // proving anything about our stop-the-others logic specifically.
    args: ["-e", `setTimeout(() => process.exit(${code}), 150)`],
    cwd: os.tmpdir(),
    env: process.env,
  };
}

/** A service whose command does not exist at all (spawn-time failure). */
function unspawnableService(name: string): ServiceSpec {
  return {
    name,
    command: path.join(os.tmpdir(), `relis-deploy-test-does-not-exist-${randomUUID()}`),
    args: [],
    cwd: os.tmpdir(),
    env: process.env,
  };
}

describe("runServiceGroup — real process lifecycle monitoring", () => {
  it(
    "when one service exits unexpectedly, stops every other service and resolves with a nonzero code",
    async () => {
      const pidFile = newMarkerFile();
      const resultPromise = runServiceGroup([healthyService("web", pidFile), failingService("api", 7)]);

      const code = await resultPromise;
      expect(code).toBe(7);
      // Direct, cross-platform-safe evidence the healthy service was
      // actually terminated as a result of the failure, not just that
      // runServiceGroup happened to return a nonzero code independently.
      // (It must have written its PID at some point before being killed —
      // failingService waits 150ms before exiting specifically to give it
      // time to.)
      await waitUntilPidFileWritten(pidFile);
      const healthyPid = readPid(pidFile);
      expect(await waitUntilDead(healthyPid)).toBe(true);
    },
    15_000,
  );

  it(
    "when a service fails to spawn at all, stops every other service and resolves with exit code 1",
    async () => {
      // Unlike the other two lifecycle tests, this one does not also
      // assert the healthy sibling was killed: `spawn()` failing with
      // ENOENT fires near-instantly, often before the healthy `node -e`
      // process has even finished booting far enough to write its PID
      // file — asserting liveness-then-death here would be asserting
      // against an inherently racy startup, not against our stop logic.
      // "Stop the other services" is already proven cross-platform by the
      // sibling tests below/above; this one's job is the 'error'-event
      // path specifically (a service that never even starts).
      const pidFile = newMarkerFile();
      const code = await runServiceGroup([healthyService("web", pidFile), unspawnableService("api")]);

      expect(code).toBe(1);
    },
    15_000,
  );

  it(
    "a synthetic SIGINT (the deploy process being interrupted) stops every service and resolves with 0 — a clean shutdown, not a failure",
    async () => {
      const pidFileA = newMarkerFile();
      const pidFileB = newMarkerFile();
      const resultPromise = runServiceGroup([healthyService("api", pidFileA), healthyService("web", pidFileB)]);

      await Promise.all([waitUntilPidFileWritten(pidFileA), waitUntilPidFileWritten(pidFileB)]);
      const pidA = readPid(pidFileA);
      const pidB = readPid(pidFileB);
      expect(isAlive(pidA) && isAlive(pidB)).toBe(true); // sanity: both really are running

      // Synthetic emit, not a real OS signal — this only invokes listeners
      // registered via process.on, the same mechanism runServiceGroup
      // itself uses; it does not affect the real test process the way an
      // actual `kill -SIGINT` from the shell would.
      process.emit("SIGINT");

      const code = await resultPromise;
      expect(code).toBe(0);
      expect(await waitUntilDead(pidA)).toBe(true);
      expect(await waitUntilDead(pidB)).toBe(true);
    },
    15_000,
  );
});
