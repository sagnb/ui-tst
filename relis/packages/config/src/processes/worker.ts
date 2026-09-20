import { z } from "zod";
import { databaseUrlSchema, nodeEnvSchema } from "../primitives";
import { parseEnv } from "../validate";

/**
 * The worker has no HTTP surface, so it does not require PORT. Queue
 * technology (pg-boss vs. BullMQ) is still undecided in stack.yml, so no
 * queue/broker variable is declared here yet — see PENDING-DECISIONS.md.
 */
export const workerSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  DATABASE_URL: databaseUrlSchema,
});
export type WorkerConfig = z.infer<typeof workerSchema>;

export function loadWorkerConfig(
  env: Record<string, string | undefined> = process.env,
): WorkerConfig {
  return parseEnv(workerSchema, env, "worker");
}
