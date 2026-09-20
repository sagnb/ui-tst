import { serve } from "@hono/node-server";
import { ConfigValidationError } from "@relis/config";
import { createApp } from "./app";
import { loadConfig } from "./platform/config";

function main(): void {
  let config;
  try {
    config = loadConfig();
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      console.error(JSON.stringify({ message: "Configuration validation failed", ...error.toSafeDiagnostics() }));
      process.exit(1);
    }
    throw error;
  }

  const app = createApp();
  serve({ fetch: app.fetch, port: config.API_PORT }, (info) => {
    console.log(JSON.stringify({ message: "API listening", port: info.port }));
  });
}

main();
