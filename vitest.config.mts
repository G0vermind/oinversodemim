import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    exclude: [
      "**/node_modules/**",
      "**/.git/**",
      "**/.upgrade-worktree/**",
      "**/_originais/**",
      "**/.cache/**",
    ],
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
    },
  },
});
