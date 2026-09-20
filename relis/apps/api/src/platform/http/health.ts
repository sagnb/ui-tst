import { apiSchema, describeCategories } from "@relis/config";
import { Hono } from "hono";

const CONFIGURED_CATEGORIES = describeCategories(Object.keys(apiSchema.shape));

/**
 * Liveness reports only that the process is responding — it never touches
 * configuration or downstream dependencies. Readiness reports that startup
 * initialization (currently: configuration validation) completed; since
 * `main.ts` validates configuration before this app is ever mounted, a
 * reachable /ready response always reflects a validated process.
 */
export function registerHealthRoutes(app: Hono): void {
  app.get("/health/live", (c) => c.json({ status: "ok" }));

  app.get("/health/ready", (c) =>
    c.json({
      status: "ok",
      config: { categories: CONFIGURED_CATEGORIES },
    }),
  );
}
