import { z } from "zod";
import { databaseUrlSchema, nodeEnvSchema, portSchema } from "../primitives";
import { parseEnv } from "../validate";

/**
 * Uses API_PORT, not PORT — the web server's own contract (see
 * processes/web.ts) also resolves a PORT variable, and when both processes
 * run in the same environment (as in a local deploy), sharing one variable
 * name means an explicitly-set PORT silently applies to both, and both try
 * to bind the identical port. Distinct variable names make that structurally
 * impossible instead of relying on runtime conflict detection alone (see
 * load-all.ts's cross-process port check, which still guards the case
 * where API_PORT and PORT are independently set to the same numeric value).
 */
export const apiSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  API_PORT: portSchema(3001),
  DATABASE_URL: databaseUrlSchema,
});
export type ApiConfig = z.infer<typeof apiSchema>;

export function loadApiConfig(
  env: Record<string, string | undefined> = process.env,
): ApiConfig {
  return parseEnv(apiSchema, env, "api");
}
