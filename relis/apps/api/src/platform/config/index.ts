import { loadApiConfig, type ApiConfig } from "@relis/config";

export type { ApiConfig };

/** Validates the API's required environment before any HTTP handling starts. */
export function loadConfig(): ApiConfig {
  return loadApiConfig();
}
