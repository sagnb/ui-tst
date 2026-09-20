import { loadWorkerConfig, type WorkerConfig } from "@relis/config";

export type { WorkerConfig };

/** Validates the worker's required environment before any job processing starts. */
export function loadConfig(): WorkerConfig {
  return loadWorkerConfig();
}
