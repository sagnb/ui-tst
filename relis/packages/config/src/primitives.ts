import { z } from "zod";

/** NODE_ENV — shared by every process. Defaults to "development". */
export const nodeEnvSchema = z
  .enum(["development", "test", "production"])
  .default("development");

/** PORT — optional per process; each process schema supplies its own default. */
export function portSchema(defaultPort: number) {
  return z
    .string()
    .regex(/^\d+$/, "PORT must contain only digits")
    .optional()
    .default(String(defaultPort))
    .transform((value) => Number(value))
    .pipe(z.number().int().min(1).max(65535));
}

/**
 * DATABASE_URL — required wherever a process talks to the control database.
 * Validated structurally (via WHATWG URL parsing), not by prefix regex, so
 * malformed authorities (e.g. an empty host) and out-of-range ports (e.g.
 * `:99999`, which the URL parser itself rejects) are caught.
 *
 * Two Unix-socket forms are supported, matching Prisma's documented Cloud
 * SQL / Unix-socket connection strings:
 *  - a placeholder network host plus a real socket path in `host=`, e.g.
 *    `postgresql://user:pass@localhost/db?host=/cloudsql/project:region:instance`;
 *  - no network host at all, e.g. `postgresql:///db?host=/var/run/postgresql`
 *    (only valid with the `scheme://` authority form below — NOT the same
 *    as omitting `//` entirely).
 *
 * In both cases the `host=` value itself must be non-empty — `?host=` with
 * no value is not a real socket path, and previously slipped through
 * because `URLSearchParams#has` only checks the key is present, not that
 * it has a value. A malformed opaque-path string like `postgresql:garbage`
 * is rejected outright: `new URL()` happily parses it as a non-special-
 * scheme URI with an empty host and an opaque path, which looks
 * superficially like the no-network-host socket form above but was never a
 * `scheme://` connection string to begin with — checking the raw string
 * for the `scheme://` prefix (not just parsed `hostname`/`searchParams`)
 * catches that.
 */
export const databaseUrlSchema = z
  .string({ required_error: "DATABASE_URL is required" })
  .min(1, "DATABASE_URL is required")
  .refine((value) => {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      return false;
    }
    if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") return false;
    if (!value.toLowerCase().startsWith(`${url.protocol}//`)) return false;

    const hasNetworkHost = url.hostname !== "";
    const socketHostParam = url.searchParams.get("host");
    const hasSocketHost = socketHostParam !== null && socketHostParam.length > 0;

    return hasNetworkHost || hasSocketHost;
  }, "DATABASE_URL must be a valid postgres:// or postgresql:// connection string with a host, or a non-empty host= query parameter for a Unix socket");

/**
 * NEXT_PUBLIC_API_URL — the only cross-process URL currently exposed to the
 * browser. Restricted to absolute http(s) URLs with a real host and no
 * embedded credentials (rejects `javascript:`, `file:`, `user:pass@host`).
 */
export const apiUrlSchema = z
  .string({ required_error: "NEXT_PUBLIC_API_URL is required" })
  .refine((value) => {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      return false;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (url.hostname === "") return false;
    if (url.username !== "" || url.password !== "") return false;
    return true;
  }, "NEXT_PUBLIC_API_URL must be an absolute http(s) URL with a host and no embedded credentials");
