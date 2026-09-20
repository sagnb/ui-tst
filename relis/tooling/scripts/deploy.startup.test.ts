import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const scriptPath = path.join(import.meta.dirname, "deploy.ts");
const tsxBin = path.join(import.meta.dirname, "..", "node_modules", "tsx", "dist", "cli.mjs");

describe("deploy command — real invalid-configuration exit behavior", () => {
  it("exits non-zero with safe diagnostics when required configuration is missing, before any build/migrate/start side effect", () => {
    const result = spawnSync(process.execPath, [tsxBin, scriptPath], {
      env: {
        ...process.env,
        DATABASE_URL: undefined,
        NEXT_PUBLIC_API_URL: undefined,
      },
      encoding: "utf8",
      timeout: 15_000,
    });

    expect(result.status).not.toBe(0);

    const diagnostics = JSON.parse(result.stderr);
    expect(diagnostics.step).toBe("deploy-preflight");
    expect(diagnostics.process).toBe("deploy");
    expect(diagnostics.issues).toContainEqual({
      variable: "DATABASE_URL",
      category: "database",
      code: "CONFIG_MISSING",
    });
    expect(diagnostics.issues).toContainEqual({
      variable: "NEXT_PUBLIC_API_URL",
      category: "web-public",
      code: "CONFIG_MISSING",
    });

    // None of the downstream steps' telltale output may appear — proving
    // build/migrate/start never ran, not merely that they also happened to
    // fail for the same underlying reason.
    expect(result.stdout).not.toMatch(/compiled successfully/i);
    expect(result.stdout).not.toMatch(/prisma/i);
    expect(result.stdout).not.toMatch(/listening/i);
  });

  it("exits non-zero with safe diagnostics when configuration is structurally invalid, before any downstream action", () => {
    const result = spawnSync(process.execPath, [tsxBin, scriptPath], {
      env: {
        ...process.env,
        DATABASE_URL: "postgresql://localhost:99999/db",
        NEXT_PUBLIC_API_URL: "javascript:alert(1)",
      },
      encoding: "utf8",
      timeout: 15_000,
    });

    expect(result.status).not.toBe(0);
    const diagnostics = JSON.parse(result.stderr);
    expect(diagnostics.issues).toContainEqual({ variable: "DATABASE_URL", category: "database", code: "CONFIG_INVALID" });
    expect(diagnostics.issues).toContainEqual({
      variable: "NEXT_PUBLIC_API_URL",
      category: "web-public",
      code: "CONFIG_INVALID",
    });
    expect(result.stderr).not.toContain("99999");
    expect(result.stderr).not.toContain("javascript:alert");
    expect(result.stdout).not.toMatch(/compiled successfully|prisma|listening/i);
  });
});
