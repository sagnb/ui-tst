/**
 * Authoritative metadata for every environment variable known to the shared
 * configuration contract. Each process schema (see `processes/*.ts`) is
 * built from a subset of these fields, so a variable is defined exactly
 * once and reused wherever it applies.
 */

export const CONFIG_CATEGORIES = [
  "core",
  "network",
  "database",
  "web-public",
] as const;

export type ConfigCategory = (typeof CONFIG_CATEGORIES)[number];

export interface ConfigVariableMeta {
  /** Configuration category used for diagnostics grouping. */
  category: ConfigCategory;
  /** Whether the value must never be exposed to a browser bundle or logs. */
  secret: boolean;
  /** Short human-readable description for documentation and CLI output. */
  description: string;
}

export const ENV_VARIABLES = {
  NODE_ENV: {
    category: "core",
    secret: false,
    description: "Runtime environment mode (development, test, or production).",
  },
  PORT: {
    category: "network",
    secret: false,
    description: "TCP port the web server listens on. Distinct from API_PORT so the api and web processes never resolve to the same port from one shared variable.",
  },
  API_PORT: {
    category: "network",
    secret: false,
    description: "TCP port the API service listens on. Distinct from PORT (the web server's own port).",
  },
  DATABASE_URL: {
    category: "database",
    secret: true,
    description: "PostgreSQL connection string for the control database.",
  },
  NEXT_PUBLIC_API_URL: {
    category: "web-public",
    secret: false,
    description: "Base URL the browser uses to reach the API. Inlined into the client bundle.",
  },
} as const satisfies Record<string, ConfigVariableMeta>;

export type EnvVariableName = keyof typeof ENV_VARIABLES;

export function getVariableMeta(name: string): ConfigVariableMeta | undefined {
  return Object.prototype.hasOwnProperty.call(ENV_VARIABLES, name)
    ? ENV_VARIABLES[name as EnvVariableName]
    : undefined;
}
