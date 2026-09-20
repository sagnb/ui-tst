import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const mainPath = path.join(import.meta.dirname, "main.ts");
const tsxBin = path.join(import.meta.dirname, "..", "node_modules", "tsx", "dist", "cli.mjs");

describe("api startup validates configuration before serving traffic", () => {
  it("exits non-zero with safe diagnostics when DATABASE_URL is missing", () => {
    const result = spawnSync(process.execPath, [tsxBin, mainPath], {
      env: { ...process.env, DATABASE_URL: undefined, API_PORT: "3998" },
      encoding: "utf8",
      timeout: 10_000,
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("DATABASE_URL");
    expect(result.stderr).toContain("CONFIG_MISSING");
    expect(result.stdout).not.toContain("API listening");
  });

  it(
    "starts and reports listening when configuration is valid",
    async () => {
      const child = spawn(process.execPath, [tsxBin, mainPath], {
        env: { ...process.env, DATABASE_URL: "postgresql://u:p@localhost:5432/db", API_PORT: "3999" },
      });

      const reachedListening = await new Promise<boolean>((resolve) => {
        let stdout = "";
        const timer = setTimeout(() => resolve(false), 12_000);
        child.stdout?.on("data", (chunk: Buffer) => {
          stdout += chunk.toString();
          if (stdout.includes("API listening")) {
            clearTimeout(timer);
            resolve(true);
          }
        });
      });

      child.kill();
      expect(reachedListening).toBe(true);
    },
    15_000,
  );
});
