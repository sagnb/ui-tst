import { ConfigValidationError, type ConfigIssue } from "./errors";
import { loadApiConfig, type ApiConfig } from "./processes/api";
import { loadMigrationConfig, type MigrationConfig } from "./processes/migration";
import { loadWebPublicConfig, loadWebServerConfig, type WebPublicConfig, type WebServerConfig } from "./processes/web";
import { loadWorkerConfig, type WorkerConfig } from "./processes/worker";

export interface AllProcessConfigs {
  api: ApiConfig;
  worker: WorkerConfig;
  webServer: WebServerConfig;
  webPublic: WebPublicConfig;
  migration: MigrationConfig;
}

/**
 * Validates every process's contract against the same environment and
 * aggregates every failing variable into a single `ConfigValidationError`
 * (process name `"deploy"`), instead of stopping at the first failure. Used
 * by the deployment gate, which must report every problem across every
 * process it is about to start before doing anything, not just the first
 * one it happens to check.
 */
export function loadAllConfigs(
  env: Record<string, string | undefined> = process.env,
): AllProcessConfigs {
  const issues: ConfigIssue[] = [];
  const results: Partial<AllProcessConfigs> = {};

  function attempt<K extends keyof AllProcessConfigs>(key: K, load: () => AllProcessConfigs[K]): void {
    try {
      results[key] = load();
    } catch (error) {
      if (error instanceof ConfigValidationError) {
        issues.push(...error.issues);
      } else {
        throw error;
      }
    }
  }

  attempt("api", () => loadApiConfig(env));
  attempt("worker", () => loadWorkerConfig(env));
  attempt("webServer", () => loadWebServerConfig(env));
  attempt("webPublic", () => loadWebPublicConfig(env));
  attempt("migration", () => loadMigrationConfig(env));

  if (issues.length > 0) {
    throw new ConfigValidationError("deploy", issues);
  }

  const configs = results as AllProcessConfigs;

  // Cross-process invariant: this only shows up once every process's
  // config is known together (not from validating any single schema in
  // isolation) — api and web use distinct variables (API_PORT, PORT)
  // specifically to avoid colliding on one shared value, but nothing stops
  // someone from independently setting both to the same number.
  if (configs.api.API_PORT === configs.webServer.PORT) {
    throw new ConfigValidationError("deploy", [
      { variable: "API_PORT", category: "network", code: "CONFIG_CONFLICT" },
      { variable: "PORT", category: "network", code: "CONFIG_CONFLICT" },
    ]);
  }

  return configs;
}
