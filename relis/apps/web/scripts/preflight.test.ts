import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const webRoot = path.join(import.meta.dirname, "..");
const preflightPath = path.join(import.meta.dirname, "preflight.ts");
const tsxBin = path.join(webRoot, "node_modules", "tsx", "dist", "cli.mjs");

const VALID_PUBLIC = { NEXT_PUBLIC_API_URL: "http://localhost:3001" };

function run(args: string[], env: Record<string, string | undefined>, timeout = 10_000) {
  return spawnSync(process.execPath, [tsxBin, preflightPath, ...args], {
    cwd: webRoot,
    env: { ...process.env, ...env },
    encoding: "utf8",
    timeout,
  });
}

describe("web preflight — dev", () => {
  it("rejects PORT=0 before any Next.js process is spawned (no listener ever opens)", () => {
    const result = run(["dev"], { ...VALID_PUBLIC, PORT: "0" });
    expect(result.status).not.toBe(0);
    const diagnostics = JSON.parse(result.stderr);
    expect(diagnostics.issues).toContainEqual({ variable: "PORT", category: "network", code: "CONFIG_INVALID" });
    // Next always prints this banner once it actually starts; its absence
    // is direct evidence Next was never spawned.
    expect(result.stdout).not.toContain("Next.js");
  });

  it("a CLI --port flag overriding a valid PORT env var to 0 is still rejected (CLI wins, and the override is what's validated)", () => {
    const result = run(["dev", "--port", "0"], { ...VALID_PUBLIC, PORT: "3000" });
    expect(result.status).not.toBe(0);
    const diagnostics = JSON.parse(result.stderr);
    expect(diagnostics.issues).toContainEqual({ variable: "PORT", category: "network", code: "CONFIG_INVALID" });
  });

  it("a CLI --port flag overriding an invalid PORT env var with a valid one is accepted", async () => {
    const child = spawn(process.execPath, [tsxBin, preflightPath, "dev", "--port", "3993"], {
      cwd: webRoot,
      env: { ...process.env, ...VALID_PUBLIC, PORT: "not-a-number" },
    });

    const sawNextBanner = await new Promise<boolean>((resolve) => {
      let stdout = "";
      const timer = setTimeout(() => resolve(false), 15_000);
      child.stdout?.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
        if (stdout.includes("Next.js")) {
          clearTimeout(timer);
          resolve(true);
        }
      });
    });

    child.kill();
    expect(sawNextBanner).toBe(true);
  }, 20_000);

  it("rejects a missing NEXT_PUBLIC_API_URL in dev mode too (dev re-embeds on every run)", () => {
    const result = run(["dev"], { NEXT_PUBLIC_API_URL: undefined });
    expect(result.status).not.toBe(0);
    const diagnostics = JSON.parse(result.stderr);
    expect(diagnostics.issues).toContainEqual({
      variable: "NEXT_PUBLIC_API_URL",
      category: "web-public",
      code: "CONFIG_MISSING",
    });
  });

  it("starts Next.js when configuration is valid", async () => {
    const child = spawn(process.execPath, [tsxBin, preflightPath, "dev", "--port", "3991"], {
      cwd: webRoot,
      env: { ...process.env, ...VALID_PUBLIC },
    });

    const sawNextBanner = await new Promise<boolean>((resolve) => {
      let stdout = "";
      const timer = setTimeout(() => resolve(false), 15_000);
      child.stdout?.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
        if (stdout.includes("Next.js")) {
          clearTimeout(timer);
          resolve(true);
        }
      });
    });

    child.kill();
    expect(sawNextBanner).toBe(true);
  }, 20_000);
});

describe("web preflight — build (public config only; no PORT/server concern)", () => {
  it("rejects a missing NEXT_PUBLIC_API_URL before compiling", () => {
    const result = run(["build"], { NEXT_PUBLIC_API_URL: undefined });
    expect(result.status).not.toBe(0);
    const diagnostics = JSON.parse(result.stderr);
    expect(diagnostics.step).toBe("build");
    expect(diagnostics.issues).toContainEqual({
      variable: "NEXT_PUBLIC_API_URL",
      category: "web-public",
      code: "CONFIG_MISSING",
    });
    expect(result.stdout).not.toContain("Compiled successfully");
  });

  it("does not require PORT at build time (build never opens a listener)", () => {
    // PORT is invalid/absent entirely, but build must not care about it.
    const result = run(["build"], { ...VALID_PUBLIC, PORT: "not-a-number" });
    // It will proceed to spawn `next build` (which may take a while / fail
    // for unrelated reasons in this sandbox); what matters is that our own
    // diagnostics never fire for PORT here.
    if (result.status !== 0) {
      let diagnostics: unknown;
      try {
        diagnostics = JSON.parse(result.stderr);
      } catch {
        diagnostics = undefined;
      }
      if (diagnostics && typeof diagnostics === "object" && "issues" in diagnostics) {
        expect((diagnostics as { issues: unknown[] }).issues).not.toContainEqual(
          expect.objectContaining({ variable: "PORT" }),
        );
      }
    }
  }, 120_000);
});

describe("web preflight — start (server config only; public already embedded)", () => {
  it("does NOT require NEXT_PUBLIC_API_URL at start time", () => {
    const result = run(["start", "--port", "3990"], { NEXT_PUBLIC_API_URL: undefined, PORT: "3990" }, 8_000);
    // Whatever happens next (e.g. Next refusing because no build output
    // exists yet) is Next's own concern; our preflight must not be the one
    // rejecting it for a missing public var.
    if (result.status !== 0 && result.stderr) {
      let diagnostics: unknown;
      try {
        diagnostics = JSON.parse(result.stderr.trim().split("\n")[0] ?? "");
      } catch {
        diagnostics = undefined;
      }
      if (diagnostics && typeof diagnostics === "object" && "issues" in diagnostics) {
        expect((diagnostics as { issues: unknown[] }).issues).not.toContainEqual(
          expect.objectContaining({ variable: "NEXT_PUBLIC_API_URL" }),
        );
      }
    }
  });

  it("rejects an invalid PORT at start time before any listener opens", () => {
    const result = run(["start"], { PORT: "0" });
    expect(result.status).not.toBe(0);
    const diagnostics = JSON.parse(result.stderr);
    expect(diagnostics.issues).toContainEqual({ variable: "PORT", category: "network", code: "CONFIG_INVALID" });
    expect(result.stdout).not.toContain("Next.js");
  });

  it(
    "reproduction: `start --port 41244 --port 0` is rejected, not silently started on a random port " +
      "(Next itself keeps the LAST --port; validating only the first one used to let this slip through)",
    () => {
      const result = run(["start", "--port", "41244", "--port", "0"], {});
      expect(result.status).not.toBe(0);
      const diagnostics = JSON.parse(result.stderr);
      expect(diagnostics.issues).toContainEqual({ variable: "PORT", category: "network", code: "CONFIG_INVALID" });
      // Direct evidence nothing was spawned at all, on any port.
      expect(result.stdout).not.toContain("Next.js");
    },
  );

  it("repeated --port flags: the LAST one is validated, and is the exact value Next receives", async () => {
    const child = spawn(process.execPath, [tsxBin, preflightPath, "start", "--port", "3989", "--port", "3988"], {
      cwd: webRoot,
      env: { ...process.env },
    });

    const stdout = await new Promise<string>((resolve) => {
      let buf = "";
      const timer = setTimeout(() => resolve(buf), 8_000);
      child.stdout?.on("data", (chunk: Buffer) => {
        buf += chunk.toString();
        if (buf.includes("Local:")) {
          clearTimeout(timer);
          resolve(buf);
        }
      });
    });

    child.kill();
    // The last value (3988) is what Next reports listening on; the first
    // (3989, discarded) must not appear as the bound port.
    expect(stdout).toContain("3988");
    expect(stdout).not.toContain("localhost:3989");
  }, 15_000);
});
