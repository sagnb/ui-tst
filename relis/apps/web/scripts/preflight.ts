import { spawn } from "node:child_process";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { ConfigValidationError, loadWebPublicConfig, loadWebServerConfig } from "@relis/config";

/**
 * Gates every Next.js startup command (dev/build/start) behind our
 * configuration contract, running strictly BEFORE Next.js itself is even
 * spawned. This exists because validating from inside the Next process
 * (see ../src/instrumentation.ts) is too late for two things:
 *
 *  - With PORT=0, Next asks the OS for a free port and overwrites
 *    process.env.PORT with whatever it got *before* instrumentation runs,
 *    silently discarding our contract's `PORT` minimum. Validating the
 *    raw/effective PORT here, before Next ever sees it, catches this.
 *  - Next's own listener can already be bound and briefly accepting TCP
 *    connections before an in-process check has a chance to reject and
 *    exit. Refusing to spawn Next at all means no listener ever opens.
 *
 * instrumentation.ts still validates as defense in depth (e.g. for a
 * process that invokes `next` directly, bypassing this script), but this
 * script is the primary, documented gate — see relis/README.md and
 * packages/config/README.md for the build-time vs. runtime distinction
 * applied below.
 */

const webRoot = path.join(import.meta.dirname, "..");
const mode = process.argv[2];
const passthroughArgs = process.argv.slice(3);

if (mode !== "dev" && mode !== "build" && mode !== "start") {
  console.error(JSON.stringify({ message: "Usage: preflight <dev|build|start> [next args...]" }));
  process.exit(1);
}

/**
 * Extracts the effective --port/-p value from `args` and returns the
 * remaining args with EVERY --port/-p/--port= occurrence stripped out.
 *
 * When a flag is repeated (`--port 41244 --port 0`), Next's own CLI keeps
 * the *last* occurrence (confirmed by reproduction), so that's what we
 * validate here too — the whole point is to validate the value Next will
 * actually use. But we don't just validate-and-trust: we also strip every
 * occurrence from the args we pass through and re-append exactly one
 * `--port <value>` (see call site below) with the validated value. That
 * way Next is never handed the original, possibly-repeated flags at all —
 * its own resolution of duplicates (whatever it happens to be, on this or
 * any future Next version) is never in play for the actual spawn, because
 * there's only ever one `--port` left for it to see.
 */
function extractCliPort(args: string[]): { port?: string; rest: string[] } {
  const rest: string[] = [];
  let port: string | undefined;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "-p" || arg === "--port") {
      port = args[i + 1];
      i++; // also skip the consumed value token
      continue;
    }
    if (arg !== undefined && arg.startsWith("--port=")) {
      port = arg.slice("--port=".length);
      continue;
    }
    if (arg !== undefined) rest.push(arg);
  }
  return { port, rest };
}

// Replicates Next.js's own .env loading precedence (.env.local, .env.<mode>,
// .env, ...) for the given mode, populating process.env the same way `next`
// itself would before it reads anything.
loadEnvConfig(webRoot, mode === "dev");

const { port: cliPort, rest: argsWithoutPort } = extractCliPort(passthroughArgs);
const effectiveEnv: NodeJS.ProcessEnv = { ...process.env };
if (cliPort !== undefined) {
  // A CLI --port/-p flag overrides the environment, exactly like Next's own
  // precedence — so we must validate the value Next will actually use, not
  // just whatever PORT happens to be set to.
  effectiveEnv.PORT = cliPort;
}

try {
  if (mode === "build") {
    // Build only embeds NEXT_PUBLIC_* values into the client bundle; it
    // never opens a listener, so server/runtime config (PORT, NODE_ENV) is
    // not this step's concern.
    loadWebPublicConfig(effectiveEnv);
  } else if (mode === "dev") {
    // Dev serves and re-embeds on every run: both matter up front.
    loadWebServerConfig(effectiveEnv);
    loadWebPublicConfig(effectiveEnv);
  } else {
    // start serves an already-built bundle. The public values it contains
    // were embedded at build time and are not re-read here — requiring
    // NEXT_PUBLIC_API_URL again at start would incorrectly imply that
    // changing it now could change what's already in the shipped client
    // JS, which it cannot. Only the server's own runtime config gates it.
    loadWebServerConfig(effectiveEnv);
  }
} catch (error) {
  if (error instanceof ConfigValidationError) {
    console.error(JSON.stringify({ message: "Configuration validation failed", step: mode, ...error.toSafeDiagnostics() }));
    process.exit(1);
  }
  throw error;
}

// Pass through exactly one --port, the value that was actually validated
// above — never the original (possibly repeated/conflicting) flags.
const nextArgs = cliPort !== undefined ? [...argsWithoutPort, "--port", cliPort] : argsWithoutPort;

const nextBin = path.join(webRoot, "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, mode, ...nextArgs], {
  cwd: webRoot,
  stdio: "inherit",
  env: process.env,
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});
