import { Hono } from "hono";
import { registerHealthRoutes } from "./platform/http/health";

export function createApp(): Hono {
  const app = new Hono();
  registerHealthRoutes(app);
  return app;
}
