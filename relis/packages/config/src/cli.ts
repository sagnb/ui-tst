#!/usr/bin/env node
/**
 * Standalone validation entry point for deployment processes. No CI/CD
 * pipeline exists yet in this repository (see project report), so this is
 * not wired into one — a future pipeline can shell out to it, e.g.:
 *
 *   pnpm --filter @relis/config check:env -- api
 */
import { ConfigValidationError } from "./errors";
import { loadApiConfig } from "./processes/api";
import { loadMigrationConfig } from "./processes/migration";
import { loadWebPublicConfig, loadWebServerConfig } from "./processes/web";
import { loadWorkerConfig } from "./processes/worker";

/**
 * A `Map`, not a plain object: a plain object's lookups fall through to
 * `Object.prototype` (`toString`, `constructor`, `__proto__`, ...), which
 * are functions too and would be silently "found" and invoked as if they
 * were a real, successfully-validated process. `Map#get` has no prototype
 * chain to fall through, so an unsupported target is reliably `undefined`.
 */
const loaders = new Map<string, () => unknown>([
  ["api", loadApiConfig],
  ["worker", loadWorkerConfig],
  ["migration", loadMigrationConfig],
  ["web-public", loadWebPublicConfig],
  ["web-server", loadWebServerConfig],
]);

function main(): void {
  // Nested `pnpm --filter ... run ... -- <args>` forwarding (as used by the
  // root "check:env" script) can relay a literal "--" separator through to
  // us as an argv token; strip it so `pnpm run check:env -- api` (from the
  // repo root) and `tsx src/cli.ts api` (direct) both resolve the same target.
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const target = args[0];
  const loader = target ? loaders.get(target) : undefined;
  if (!loader) {
    console.error(
      JSON.stringify({
        message: "Usage: check:env <process>",
        knownProcesses: [...loaders.keys()],
      }),
    );
    process.exitCode = 1;
    return;
  }

  try {
    loader();
    console.log(JSON.stringify({ process: target, status: "valid" }));
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      console.error(JSON.stringify({ status: "invalid", ...error.toSafeDiagnostics() }));
      process.exitCode = 1;
      return;
    }
    throw error;
  }
}

main();
