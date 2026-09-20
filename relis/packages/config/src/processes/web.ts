import { z } from "zod";
import { apiUrlSchema, nodeEnvSchema, portSchema } from "../primitives";
import { parseEnv } from "../validate";

/**
 * Browser-safe subset. Only NEXT_PUBLIC_-prefixed values belong here —
 * Next.js inlines them into the client bundle, so this schema must never
 * gain a secret field.
 */
export const webPublicSchema = z.object({
  NEXT_PUBLIC_API_URL: apiUrlSchema,
});
export type WebPublicConfig = z.infer<typeof webPublicSchema>;

/** Server-only subset for the Next.js server process itself (never sent to the browser). */
export const webServerSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  PORT: portSchema(3000),
});
export type WebServerConfig = z.infer<typeof webServerSchema>;

/**
 * The default parameter below must reference `process.env.NEXT_PUBLIC_API_URL`
 * as a static member expression, not the whole `process.env` object. Next.js's
 * build-time inlining for NEXT_PUBLIC_-prefixed variables only recognizes
 * exactly this pattern (`process.env.NEXT_PUBLIC_X`) textually in code that
 * reaches the client bundle; passing the entire `process.env` object (as a
 * reference or via spread) is not something Next can statically replace, and
 * `process.env` is not even defined in the browser at runtime. Callers that
 * need a different source (tests, the deployment preflight) can still pass an
 * explicit object.
 */
export function loadWebPublicConfig(
  env: Record<string, string | undefined> = { NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL },
): WebPublicConfig {
  return parseEnv(webPublicSchema, env, "web");
}

export function loadWebServerConfig(
  env: Record<string, string | undefined> = process.env,
): WebServerConfig {
  return parseEnv(webServerSchema, env, "web");
}
