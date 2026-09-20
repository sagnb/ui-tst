import { ConfigValidationError } from "@relis/config";
import { loadConfig } from "./platform/config";

/**
 * Minimal worker entry point. It validates configuration before doing
 * anything else and then stays alive as a placeholder process — actual
 * job/queue processing is out of scope for this change (background_jobs
 * is still undecided between pg-boss and BullMQ in stack.yml).
 */
function main(): void {
  try {
    loadConfig();
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      console.error(JSON.stringify({ message: "Configuration validation failed", ...error.toSafeDiagnostics() }));
      process.exit(1);
    }
    throw error;
  }

  console.log(JSON.stringify({ message: "Worker configuration validated; no job processing implemented yet" }));

  const keepAlive = setInterval(() => {}, 1 << 30);
  const shutdown = () => {
    clearInterval(keepAlive);
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main();
