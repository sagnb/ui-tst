import { describe, expect, it } from "vitest";
import { ConfigValidationError } from "./errors";
import { loadApiConfig } from "./processes/api";
import { loadMigrationConfig } from "./processes/migration";
import { loadWebPublicConfig, loadWebServerConfig } from "./processes/web";
import { loadWorkerConfig } from "./processes/worker";

const SECRET_DB_URL = "postgresql://user:sup3r-secret-pw@db.internal:5432/relis_control";

describe("api config", () => {
  it("accepts a valid environment and applies the API_PORT default", () => {
    const config = loadApiConfig({ NODE_ENV: "production", DATABASE_URL: SECRET_DB_URL });
    expect(config).toEqual({ NODE_ENV: "production", API_PORT: 3001, DATABASE_URL: SECRET_DB_URL });
  });

  it("rejects a missing DATABASE_URL with a CONFIG_MISSING issue and no value in the message", () => {
    expect.assertions(4);
    try {
      loadApiConfig({ NODE_ENV: "production" });
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigValidationError);
      const err = error as ConfigValidationError;
      expect(err.issues).toContainEqual({ variable: "DATABASE_URL", category: "database", code: "CONFIG_MISSING" });
      expect(err.message).not.toContain(SECRET_DB_URL);
      expect(err.process).toBe("api");
    }
  });

  it("rejects a malformed DATABASE_URL with CONFIG_INVALID and never echoes the value", () => {
    const badValue = "mysql://not-postgres";
    expect.assertions(3);
    try {
      loadApiConfig({ DATABASE_URL: badValue });
    } catch (error) {
      const err = error as ConfigValidationError;
      expect(err.issues).toContainEqual({ variable: "DATABASE_URL", category: "database", code: "CONFIG_INVALID" });
      expect(err.message).not.toContain(badValue);
      expect(JSON.stringify(err.toSafeDiagnostics())).not.toContain(badValue);
    }
  });

  it("rejects a non-numeric API_PORT", () => {
    expect.assertions(1);
    try {
      loadApiConfig({ DATABASE_URL: SECRET_DB_URL, API_PORT: "not-a-port" });
    } catch (error) {
      const err = error as ConfigValidationError;
      expect(err.issues).toContainEqual({ variable: "API_PORT", category: "network", code: "CONFIG_INVALID" });
    }
  });
});

describe("worker config (process-specific requirements)", () => {
  it("does not require a port at all, unlike the API and web server", () => {
    const config = loadWorkerConfig({ DATABASE_URL: SECRET_DB_URL });
    expect(config).toEqual({ NODE_ENV: "development", DATABASE_URL: SECRET_DB_URL });
    expect(config).not.toHaveProperty("PORT");
    expect(config).not.toHaveProperty("API_PORT");
  });

  it("still requires DATABASE_URL", () => {
    expect(() => loadWorkerConfig({})).toThrow(ConfigValidationError);
  });
});

describe("migration config", () => {
  it("requires only DATABASE_URL", () => {
    const config = loadMigrationConfig({ DATABASE_URL: SECRET_DB_URL });
    expect(config).toEqual({ DATABASE_URL: SECRET_DB_URL });
  });
});

describe("web public/server separation", () => {
  it("web-public config never requires or accepts DATABASE_URL", () => {
    const config = loadWebPublicConfig({ NEXT_PUBLIC_API_URL: "https://api.example.com" });
    expect(config).toEqual({ NEXT_PUBLIC_API_URL: "https://api.example.com" });
    expect(config).not.toHaveProperty("DATABASE_URL");
  });

  it("rejects a missing NEXT_PUBLIC_API_URL", () => {
    expect.assertions(1);
    try {
      loadWebPublicConfig({});
    } catch (error) {
      const err = error as ConfigValidationError;
      expect(err.issues).toContainEqual({ variable: "NEXT_PUBLIC_API_URL", category: "web-public", code: "CONFIG_MISSING" });
    }
  });

  it("rejects a non-URL value", () => {
    expect.assertions(1);
    try {
      loadWebPublicConfig({ NEXT_PUBLIC_API_URL: "not-a-url" });
    } catch (error) {
      const err = error as ConfigValidationError;
      expect(err.issues).toContainEqual({ variable: "NEXT_PUBLIC_API_URL", category: "web-public", code: "CONFIG_INVALID" });
    }
  });

  it("web-server config carries no secrets and applies its own PORT default", () => {
    const config = loadWebServerConfig({ NODE_ENV: "test" });
    expect(config).toEqual({ NODE_ENV: "test", PORT: 3000 });
  });
});

describe("safe diagnostics", () => {
  it("toSafeDiagnostics() never includes raw environment values, only names/categories/codes", () => {
    expect.assertions(1);
    try {
      loadApiConfig({ DATABASE_URL: SECRET_DB_URL.slice(0, 5) });
    } catch (error) {
      const err = error as ConfigValidationError;
      const serialized = JSON.stringify(err.toSafeDiagnostics());
      expect(serialized).not.toMatch(/sup3r-secret-pw/);
    }
  });
});
