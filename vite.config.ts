import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    globals: true,
    server: {
      deps: {
        inline: [
          "@mui/material",
          "@mui/system",
          "@mui/styled-engine",
          "@mui/icons-material",
        ],
      },
    },
  },
});
