import type { SpawnSyncReturns } from "node:child_process";
import { describe, expect, it, vi } from "vitest";
import { ConfigValidationError } from "@relis/config";
import { runMigration } from "./migrate";

const VALID_CONFIG = { DATABASE_URL: "postgresql://u:p@localhost:5432/db" };

describe("runMigration ordering (spy-based, no real Postgres or prisma process)", () => {
  it("validates configuration before invoking the migration tool, and passes it the validated config", () => {
    const calls: string[] = [];
    const loadConfig = vi.fn(() => {
      calls.push("validate");
      return VALID_CONFIG;
    });
    const runPrisma = vi.fn(() => {
      calls.push("migrate");
      return { status: 0 } as SpawnSyncReturns<string>;
    });

    const exitCode = runMigration({ loadConfig, runPrisma });

    expect(calls).toEqual(["validate", "migrate"]);
    expect(exitCode).toBe(0);
    expect(runPrisma).toHaveBeenCalledWith(VALID_CONFIG);
  });

  it("never invokes the migration tool when configuration is invalid — no database activity happens", () => {
    const runPrisma = vi.fn();
    const loadConfig = vi.fn(() => {
      throw new ConfigValidationError("migration", [
        { variable: "DATABASE_URL", category: "database", code: "CONFIG_MISSING" },
      ]);
    });

    const exitCode = runMigration({ loadConfig, runPrisma });

    expect(runPrisma).not.toHaveBeenCalled();
    expect(exitCode).toBe(1);
  });

  it("propagates the migration tool's own exit code when configuration is valid but the tool fails", () => {
    const loadConfig = vi.fn(() => VALID_CONFIG);
    const runPrisma = vi.fn(() => ({ status: 7 }) as SpawnSyncReturns<string>);

    const exitCode = runMigration({ loadConfig, runPrisma });

    expect(exitCode).toBe(7);
  });
});
