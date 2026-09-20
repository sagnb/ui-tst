import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import path from "node:path";
import { ConfigValidationError, loadAllConfigs, type AllProcessConfigs } from "@relis/config";
import { runMigration } from "@relis/database";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const apiDir = path.join(repoRoot, "apps", "api");
const workerDir = path.join(repoRoot, "apps", "worker");
const webDir = path.join(repoRoot, "apps", "web");

export interface DeployDeps {
  /** Throws ConfigValidationError (aggregated across every process) on failure. */
  validateAll: () => AllProcessConfigs;
  buildWeb: (configs: AllProcessConfigs) => number;
  migrate: () => number;
  /**
   * Resolves once the group of services should stop — either because one
   * of them failed (nonzero result) or a shutdown was requested cleanly
   * (0). Never resolves while every service is healthy; that's what keeps
   * `deploy.ts` alive.
   */
  startServices: (configs: AllProcessConfigs) => Promise<number>;
}

function defaultValidateAll(): AllProcessConfigs {
  return loadAllConfigs();
}

function spawnAndWait(command: string, args: string[], cwd: string, env: NodeJS.ProcessEnv): number {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", env });
  return result.status ?? 1;
}

/** Build step: this is where NEXT_PUBLIC_* gets embedded into the client bundle. */
function defaultBuildWeb(configs: AllProcessConfigs): number {
  const tsxBin = path.join(webDir, "node_modules", "tsx", "dist", "cli.mjs");
  return spawnAndWait(process.execPath, [tsxBin, path.join(webDir, "scripts", "preflight.ts"), "build"], webDir, {
    ...process.env,
    // Explicit, not just inherited: the value that was actually validated
    // a moment ago in the aggregated preflight is what gets built with.
    NEXT_PUBLIC_API_URL: configs.webPublic.NEXT_PUBLIC_API_URL,
  });
}

/** Data-writing step: control-database migrations. */
function defaultMigrate(): number {
  return runMigration();
}

export interface ServiceSpec {
  name: string;
  command: string;
  args: string[];
  cwd: string;
  env: NodeJS.ProcessEnv;
}

function buildServiceSpecs(configs: AllProcessConfigs): ServiceSpec[] {
  const apiTsx = path.join(apiDir, "node_modules", "tsx", "dist", "cli.mjs");
  const workerTsx = path.join(workerDir, "node_modules", "tsx", "dist", "cli.mjs");
  const webTsx = path.join(webDir, "node_modules", "tsx", "dist", "cli.mjs");
  const webPreflight = path.join(webDir, "scripts", "preflight.ts");

  return [
    {
      name: "api",
      command: process.execPath,
      args: [apiTsx, path.join(apiDir, "src", "main.ts")],
      cwd: apiDir,
      // Each service gets its OWN explicit, already-resolved values, not a
      // blindly-inherited process.env — API_PORT/PORT are distinct
      // variables precisely so api and web can never collide on one
      // shared value (see packages/config/src/processes/api.ts), and
      // passing the validated value through directly (rather than trusting
      // each child to independently re-read and re-resolve the same
      // ambient environment the same way) is what "use the validated
      // configuration for the operation" means in practice for a
      // multi-service deploy.
      env: {
        ...process.env,
        NODE_ENV: configs.api.NODE_ENV,
        API_PORT: String(configs.api.API_PORT),
        DATABASE_URL: configs.api.DATABASE_URL,
      },
    },
    {
      name: "worker",
      command: process.execPath,
      args: [workerTsx, path.join(workerDir, "src", "main.ts")],
      cwd: workerDir,
      env: {
        ...process.env,
        NODE_ENV: configs.worker.NODE_ENV,
        DATABASE_URL: configs.worker.DATABASE_URL,
      },
    },
    {
      name: "web",
      command: process.execPath,
      // Through the frontend's own preflight gate, not `next start`
      // directly — it re-validates server config before Next opens a
      // listener (see apps/web/scripts/preflight.ts) and keeps this
      // orchestrator from bypassing that gate for the one service that has
      // its own extra build-time/runtime distinction to enforce.
      args: [webTsx, webPreflight, "start", "--port", String(configs.webServer.PORT)],
      cwd: webDir,
      env: {
        ...process.env,
        NODE_ENV: configs.webServer.NODE_ENV,
        PORT: String(configs.webServer.PORT),
      },
    },
  ];
}

/**
 * Starts every service in `specs`, then monitors them for the lifetime of
 * the deployment:
 *  - a child failing to even spawn (`error`), or exiting unexpectedly
 *    (`exit`) before a shutdown was requested, is treated as the whole
 *    group failing — every other service is stopped immediately and the
 *    returned promise resolves with a nonzero code;
 *  - SIGINT/SIGTERM (this process itself being interrupted) stops every
 *    service and resolves with 0 — a clean, requested shutdown, not a
 *    failure.
 *
 * Exported and generic (plain `ServiceSpec`s, not api/worker/web-specific)
 * so this lifecycle logic — the actual "monitor and stop the others on
 * failure" behavior — can be exercised with small real child processes in
 * tests, not only mocked out entirely.
 */
export function runServiceGroup(specs: ServiceSpec[]): Promise<number> {
  return new Promise((resolve) => {
    const children = new Map<string, ChildProcess>();
    let settled = false;
    let shuttingDown = false;

    const removeSignalHandlers = () => {
      process.off("SIGINT", onSigint);
      process.off("SIGTERM", onSigterm);
    };

    function finish(code: number): void {
      if (settled) return;
      settled = true;
      removeSignalHandlers();
      resolve(code);
    }

    function stopAll(signal: NodeJS.Signals): void {
      shuttingDown = true;
      for (const child of children.values()) {
        if (!child.killed) child.kill(signal);
      }
    }

    function onSigint(): void {
      stopAll("SIGINT");
      finish(0);
    }
    function onSigterm(): void {
      stopAll("SIGTERM");
      finish(0);
    }
    process.on("SIGINT", onSigint);
    process.on("SIGTERM", onSigterm);

    for (const spec of specs) {
      const child = spawn(spec.command, spec.args, { cwd: spec.cwd, stdio: "inherit", env: spec.env });
      children.set(spec.name, child);

      child.on("error", (error) => {
        if (shuttingDown) return;
        console.error(JSON.stringify({ message: "Service failed to start", service: spec.name, error: error.message }));
        stopAll("SIGTERM");
        finish(1);
      });

      child.on("exit", (code, signal) => {
        if (shuttingDown) return;
        console.error(
          JSON.stringify({
            message: "Service exited unexpectedly; stopping the rest of the deployment",
            service: spec.name,
            exitCode: code,
            signal,
          }),
        );
        stopAll("SIGTERM");
        finish(code && code !== 0 ? code : 1);
      });
    }
  });
}

function defaultStartServices(configs: AllProcessConfigs): Promise<number> {
  return runServiceGroup(buildServiceSpecs(configs));
}

const defaultDeps: DeployDeps = {
  validateAll: defaultValidateAll,
  buildWeb: defaultBuildWeb,
  migrate: defaultMigrate,
  startServices: defaultStartServices,
};

/**
 * Minimal local deployment orchestration gate. No CI/CD platform, cloud
 * provider, or container architecture exists in this repository, so this
 * command IS the deployment entry point for now (see relis/README.md).
 *
 * Every process involved (api, worker, web server, web public, migration)
 * is validated together, in one aggregated pass, BEFORE the first side
 * effect — before the web bundle is built (which embeds config), before
 * migrations run (which write to the database), and before any service
 * starts (which accepts traffic). Any step failing stops every subsequent
 * step and propagates a nonzero exit code; steps are injectable so this can
 * be tested for ordering and short-circuiting without touching a real
 * database or actually building/starting anything.
 */
export async function runDeploy(deps: DeployDeps = defaultDeps): Promise<number> {
  let configs: AllProcessConfigs;
  try {
    configs = deps.validateAll();
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      console.error(JSON.stringify({ message: "Configuration validation failed", step: "deploy-preflight", ...error.toSafeDiagnostics() }));
      return 1;
    }
    throw error;
  }

  const buildCode = deps.buildWeb(configs);
  if (buildCode !== 0) return buildCode;

  const migrateCode = deps.migrate();
  if (migrateCode !== 0) return migrateCode;

  return deps.startServices(configs);
}
