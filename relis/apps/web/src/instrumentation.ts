/**
 * Defense-in-depth only. The primary, documented startup gate is
 * ../scripts/preflight.ts, which validates configuration *before* the
 * `next` process is even spawned — required because PORT=0/Next's own
 * listener timing make an in-process check here alone insufficient (see
 * preflight.ts's header comment). This hook still runs once when the
 * Next.js server process starts (dev and prod, Node runtime), so it also
 * catches anything that invokes `next` directly, bypassing preflight.
 * Deliberately unconditional (checks both server and public config
 * regardless of dev/prod) rather than mirroring preflight's build-vs-start
 * distinction: as a safety net it's better to fail loudly here if a
 * runtime environment is missing something the build-time environment had,
 * rather than risk a later crash.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { loadWebServerConfig, loadWebPublicConfig, ConfigValidationError } = await import("@relis/config");

  try {
    loadWebServerConfig();
    loadWebPublicConfig();
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      console.error(JSON.stringify({ message: "Configuration validation failed", ...error.toSafeDiagnostics() }));
      process.exit(1);
    }
    throw error;
  }
}
