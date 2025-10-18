import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 800,

  e2e: {
    supportFile: false,
    setupNodeEvents(on, config) {
      config.baseUrl = "http://localhost:5173";
      return config;
    },
  },
});
