import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const scriptPath = path.join(import.meta.dirname, "run-migrate.ts");
const tsxBin = path.join(import.meta.dirname, "..", "node_modules", "tsx", "dist", "cli.mjs");

describe("migrate command — real invalid-configuration exit behavior", () => {
  it("exits non-zero with safe diagnostics when DATABASE_URL is missing, and never reaches Prisma", () => {
    const result = spawnSync(process.execPath, [tsxBin, scriptPath], {
      env: { ...process.env, DATABASE_URL: undefined },
      encoding: "utf8",
      timeout: 15_000,
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("DATABASE_URL");
    expect(result.stderr).toContain("CONFIG_MISSING");

    // Prisma's own error text (e.g. for a missing/invalid connection
    // string, or an unreachable database) must never appear — proving our
    // validation intercepted before Prisma ever ran, not that Prisma
    // itself happened to fail for the same reason.
    expect(result.stdout).not.toMatch(/prisma/i);
    expect(result.stderr).not.toMatch(/environment variable not found/i);
  });

  it("exits non-zero with safe diagnostics when DATABASE_URL is structurally invalid", () => {
    const result = spawnSync(process.execPath, [tsxBin, scriptPath], {
      env: { ...process.env, DATABASE_URL: "postgresql://localhost:99999/db" },
      encoding: "utf8",
      timeout: 15_000,
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("CONFIG_INVALID");
    expect(result.stderr).not.toContain("99999");
  });
});
