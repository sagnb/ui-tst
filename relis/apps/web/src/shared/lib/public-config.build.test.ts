import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Integration test, not a unit test: it runs a real `next build` and
 * inspects the actual emitted client bundle, rather than only asserting
 * that `webPublicSchema.parse()` accepts a manually-constructed object.
 * That distinction matters here specifically because the bug this guards
 * against (passing the whole `process.env` object instead of a static
 * `process.env.NEXT_PUBLIC_API_URL` reference) is invisible to schema-only
 * tests — the schema parses either input identically. Only an actual
 * Next.js compilation can prove the value was inlined into shipped
 * browser code. Slow by design (a real build); kept in its own file.
 */

const webRoot = path.join(import.meta.dirname, "..", "..", "..");
const nextBin = path.join(webRoot, "node_modules", "next", "dist", "bin", "next");

const PUBLIC_URL_SENTINEL = "https://build-probe.relis.test";
const SECRET_MARKER = "definitely-not-in-the-client-bundle-9f3ac2";

function listClientChunkFiles(): string[] {
  const chunksDir = path.join(webRoot, ".next", "static", "chunks");
  const entries = readdirSync(chunksDir, { recursive: true }) as string[];
  return entries.filter((f) => f.endsWith(".js")).map((f) => path.join(chunksDir, f));
}

describe("NEXT_PUBLIC_API_URL client-bundle inlining", () => {
  it(
    "embeds the public API URL literally into the built client bundle, and never embeds DATABASE_URL",
    () => {
      const result = spawnSync(process.execPath, [nextBin, "build"], {
        cwd: webRoot,
        env: {
          ...process.env,
          NEXT_TELEMETRY_DISABLED: "1",
          NEXT_PUBLIC_API_URL: PUBLIC_URL_SENTINEL,
          // A decoy secret present in the build environment. It must never
          // reach the client bundle — proving the public/server boundary
          // holds at the level of actual emitted bytes, not just types.
          DATABASE_URL: `postgresql://build-secret:${SECRET_MARKER}@localhost:5432/db`,
        },
        encoding: "utf8",
        timeout: 120_000,
      });

      expect(result.status).toBe(0);

      const chunkFiles = listClientChunkFiles();
      expect(chunkFiles.length).toBeGreaterThan(0);

      const contents = chunkFiles.map((f) => readFileSync(f, "utf8"));
      const foundPublicUrl = contents.some((c) => c.includes(PUBLIC_URL_SENTINEL));
      const foundSecret = contents.some((c) => c.includes(SECRET_MARKER));

      expect(foundPublicUrl).toBe(true);
      expect(foundSecret).toBe(false);
    },
    150_000,
  );
});
