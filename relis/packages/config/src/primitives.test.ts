import { describe, expect, it } from "vitest";
import { ConfigValidationError } from "./errors";
import { apiUrlSchema, databaseUrlSchema } from "./primitives";
import { loadApiConfig } from "./processes/api";
import { loadWebPublicConfig } from "./processes/web";

describe("databaseUrlSchema", () => {
  it.each([
    "postgresql://user:pass@localhost:5432/db",
    "postgres://user:pass@localhost:5432/db",
    "postgresql://localhost/db",
    "postgresql://[::1]:5432/db",
    "postgresql:///dbname?host=/cloudsql/project:region:instance",
    // Prisma's documented Unix-socket form: placeholder network host +
    // real socket path in host=. Matches relis/.env.example.
    "postgresql://user:password@localhost/database?host=/var/run/postgresql",
  ])("accepts a structurally valid connection string: %s", (value) => {
    expect(databaseUrlSchema.safeParse(value).success).toBe(true);
  });

  it.each([
    ["postgresql://user:pass@", "empty host with credentials"],
    ["postgresql://localhost:99999/db", "out-of-range port"],
    ["mysql://user:pass@localhost:5432/db", "unsupported scheme"],
    ["not a url", "not a URL at all"],
    ["", "empty string"],
    ["postgresql://", "no host, no socket host param"],
    ["postgresql:///db?host=", "socket host param present but empty"],
    ["postgresql:garbage?host=", "opaque-path form, no scheme:// authority, empty host param"],
    ["postgresql:garbage?host=/real/socket/path", "opaque-path form, no scheme:// authority, even with a real-looking host param"],
  ])("rejects %s (%s)", (value) => {
    expect(databaseUrlSchema.safeParse(value).success).toBe(false);
  });

  it("never echoes the rejected value in the ConfigValidationError raised by a process loader", () => {
    expect.assertions(2);
    const badValue = "postgresql://localhost:99999/db";
    try {
      loadApiConfig({ DATABASE_URL: badValue });
    } catch (error) {
      const err = error as ConfigValidationError;
      expect(err.message).not.toContain(badValue);
      expect(JSON.stringify(err.toSafeDiagnostics())).not.toContain("99999");
    }
  });
});

describe("apiUrlSchema", () => {
  it.each(["https://api.example.com", "http://localhost:3001", "https://api.example.com:8443/v1"])(
    "accepts a valid http(s) URL: %s",
    (value) => {
      expect(apiUrlSchema.safeParse(value).success).toBe(true);
    },
  );

  it.each([
    ["javascript:alert(1)", "javascript: scheme"],
    ["file:///etc/passwd", "file: scheme"],
    ["http://user:pass@example.com", "embedded credentials"],
    ["not a url", "not a URL at all"],
    ["ftp://example.com", "unsupported scheme"],
  ])("rejects %s (%s)", (value) => {
    expect(apiUrlSchema.safeParse(value).success).toBe(false);
  });

  it("never echoes the rejected value or credentials in the ConfigValidationError raised by a process loader", () => {
    expect.assertions(2);
    const badValue = "http://leaked-user:leaked-pass@example.com";
    try {
      loadWebPublicConfig({ NEXT_PUBLIC_API_URL: badValue });
    } catch (error) {
      const err = error as ConfigValidationError;
      expect(err.message).not.toContain("leaked-pass");
      expect(JSON.stringify(err.toSafeDiagnostics())).not.toContain("leaked-user");
    }
  });
});
