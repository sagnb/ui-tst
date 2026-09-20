import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
    // Several test files here spawn real `next build`/`next dev` processes
    // against this project's own shared `.next` output directory. Running
    // test files in parallel would race two builds against it at once and
    // corrupt the output non-deterministically — run files sequentially.
    fileParallelism: false,
  },
});
