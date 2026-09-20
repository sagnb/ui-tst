import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import path from "node:path";
import { ConfigValidationError, loadMigrationConfig, type MigrationConfig } from "@relis/config";

const controlSchemaPath = path.join(import.meta.dirname, "..", "prisma", "control", "schema.prisma");

/**
 * Real, non-interactive migration runner for the control database schema.
 * `DATABASE_URL` is taken from the already-validated `config`, not re-read
 * from `process.env` — the whole point of validating first is that
 * everything downstream uses the value that was actually checked.
 */
export function defaultRunPrisma(config: MigrationConfig): SpawnSyncReturns<string> {
  const prismaBin = path.join(import.meta.dirname, "..", "node_modules", "prisma", "build", "index.js");
  return spawnSync(process.execPath, [prismaBin, "migrate", "deploy", "--schema", controlSchemaPath], {
    env: { ...process.env, DATABASE_URL: config.DATABASE_URL },
    stdio: "inherit",
    encoding: "utf8",
  });
}

export interface MigrateDeps {
  loadConfig: () => MigrationConfig;
  runPrisma: (config: MigrationConfig) => SpawnSyncReturns<string>;
}

const defaultDeps: MigrateDeps = {
  loadConfig: loadMigrationConfig,
  runPrisma: defaultRunPrisma,
};

/**
 * Validates configuration BEFORE creating any database client, opening a
 * connection, or invoking Prisma — if validation fails, `runPrisma` is
 * never called and no database activity happens at all. Dependencies are
 * injectable so tests can prove that ordering (and the invalid-config
 * short-circuit) with spies instead of a real Postgres instance and a real
 * `prisma` subprocess.
 */
export function runMigration(deps: MigrateDeps = defaultDeps): number {
  let config: MigrationConfig;
  try {
    config = deps.loadConfig();
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      console.error(JSON.stringify({ message: "Configuration validation failed", step: "migrate", ...error.toSafeDiagnostics() }));
      return 1;
    }
    throw error;
  }

  const result = deps.runPrisma(config);
  return result.status ?? 1;
}
