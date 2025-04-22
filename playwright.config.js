import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "node src/index.js",
    port: 3000,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI
  }
});
