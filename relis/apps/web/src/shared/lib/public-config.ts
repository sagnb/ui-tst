import { loadWebPublicConfig } from "@relis/config/web-public";

/**
 * Resolved once per module evaluation. Safe to import from client
 * components — it only ever touches `@relis/config/web-public`, which
 * cannot reach `DATABASE_URL` or any other server-only field, and its
 * default env source is the static `process.env.NEXT_PUBLIC_API_URL`
 * reference Next.js's compiler knows how to inline into the client bundle
 * at build time (see packages/config/src/processes/web.ts).
 */
export const publicConfig = loadWebPublicConfig();
