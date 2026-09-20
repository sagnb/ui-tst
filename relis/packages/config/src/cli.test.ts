import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const cliPath = path.join(import.meta.dirname, "cli.ts");
const tsxBin = path.join(import.meta.dirname, "..", "node_modules", "tsx", "dist", "cli.mjs");

function runCli(target: string, env: Record<string, string | undefined> = {}) {
  return spawnSync(process.execPath, [tsxBin, cliPath, target], {
    env: { ...process.env, ...env },
    encoding: "utf8",
    timeout: 10_000,
  });
}

describe("check:env CLI", () => {
  it.each(["toString", "constructor", "__proto__", "hasOwnProperty", "valueOf"])(
    "rejects the JS-prototype-derived target %s with a nonzero exit and safe diagnostics, never executing it as a loader",
    (target) => {
      const result = runCli(target);
      expect(result.status).not.toBe(0);
      const output = JSON.parse(result.stderr);
      expect(output.status).not.toBe("valid");
      expect(output.knownProcesses).toEqual(["api", "worker", "migration", "web-public", "web-server"]);
    },
  );

  it("accepts a known target and validates it for real", () => {
    const result = runCli("api", { DATABASE_URL: "postgresql://u:p@localhost:5432/db" });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ process: "api", status: "valid" });
  });

  it("reports invalid configuration for a known target with a nonzero exit", () => {
    const result = runCli("api", { DATABASE_URL: undefined });
    expect(result.status).not.toBe(0);
    const output = JSON.parse(result.stderr);
    expect(output.status).toBe("invalid");
    expect(output.issues).toContainEqual({ variable: "DATABASE_URL", category: "database", code: "CONFIG_MISSING" });
  });
});
