/**
 * Browser-safe entry point. Import this module (never `.`/index) from
 * client components — it only touches NEXT_PUBLIC_-prefixed variables and
 * never pulls in DATABASE_URL or any other server-only schema.
 */
export { ConfigValidationError, type ConfigIssue, type SafeConfigDiagnostics } from "./errors";
export { webPublicSchema, loadWebPublicConfig, type WebPublicConfig } from "./processes/web";
