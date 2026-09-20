import { describe, expect, it } from "vitest";
import { createApp } from "./app";

describe("health routes", () => {
  it("liveness responds ok without touching configuration", async () => {
    const app = createApp();
    const res = await app.request("/health/live");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("readiness reports safe configuration categories, no values", async () => {
    const app = createApp();
    const res = await app.request("/health/ready");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; config: { categories: string[] } };
    expect(body.status).toBe("ok");
    expect([...body.config.categories].sort()).toEqual(["core", "database", "network"]);
    expect(JSON.stringify(body)).not.toMatch(/postgres/i);
  });
});
