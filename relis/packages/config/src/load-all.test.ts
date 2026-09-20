import { describe, expect, it } from "vitest";
import { ConfigValidationError } from "./errors";
import { loadAllConfigs } from "./load-all";

const VALID_ENV = {
  NODE_ENV: "test",
  PORT: "3000",
  API_PORT: "3001",
  DATABASE_URL: "postgresql://u:p@localhost:5432/db",
  NEXT_PUBLIC_API_URL: "https://api.example.com",
};

describe("loadAllConfigs", () => {
  it("returns every process config when the environment satisfies all of them", () => {
    const result = loadAllConfigs(VALID_ENV);
    expect(result.api.DATABASE_URL).toBe(VALID_ENV.DATABASE_URL);
    expect(result.api.API_PORT).toBe(3001);
    expect(result.worker.DATABASE_URL).toBe(VALID_ENV.DATABASE_URL);
    expect(result.webServer.PORT).toBe(3000);
    expect(result.webPublic.NEXT_PUBLIC_API_URL).toBe(VALID_ENV.NEXT_PUBLIC_API_URL);
    expect(result.migration.DATABASE_URL).toBe(VALID_ENV.DATABASE_URL);
  });

  it("rejects API_PORT and PORT resolving to the same numeric port, even though they're distinct variables", () => {
    expect.assertions(3);
    try {
      loadAllConfigs({ ...VALID_ENV, API_PORT: "4000", PORT: "4000" });
    } catch (error) {
      const err = error as ConfigValidationError;
      expect(err.process).toBe("deploy");
      expect(err.issues).toContainEqual({ variable: "API_PORT", category: "network", code: "CONFIG_CONFLICT" });
      expect(err.issues).toContainEqual({ variable: "PORT", category: "network", code: "CONFIG_CONFLICT" });
    }
  });

  it("does NOT conflict merely because both defaulted independently to different numbers", () => {
    // API_PORT defaults to 3001, PORT (web) defaults to 3000 — distinct, no conflict.
    const result = loadAllConfigs({
      DATABASE_URL: "postgresql://u:p@localhost:5432/db",
      NEXT_PUBLIC_API_URL: "https://api.example.com",
    });
    expect(result.api.API_PORT).not.toBe(result.webServer.PORT);
  });

  it("aggregates issues from every failing process instead of stopping at the first", () => {
    expect.assertions(3);
    try {
      loadAllConfigs({});
    } catch (error) {
      const err = error as ConfigValidationError;
      expect(err.process).toBe("deploy");
      // DATABASE_URL is missing for api, worker, AND migration — three
      // separate issues, not deduplicated away or silently dropped.
      const databaseIssues = err.issues.filter((issue) => issue.variable === "DATABASE_URL");
      expect(databaseIssues.length).toBeGreaterThanOrEqual(3);
      expect(err.issues).toContainEqual({
        variable: "NEXT_PUBLIC_API_URL",
        category: "web-public",
        code: "CONFIG_MISSING",
      });
    }
  });

  it("never leaks values in the aggregated diagnostics", () => {
    expect.assertions(1);
    try {
      loadAllConfigs({ DATABASE_URL: "postgresql://leaked-user:leaked-pass@localhost:5432/db" });
    } catch (error) {
      const err = error as ConfigValidationError;
      expect(JSON.stringify(err.toSafeDiagnostics())).not.toContain("leaked-pass");
    }
  });
});
