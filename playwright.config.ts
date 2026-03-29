import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command:
      "DATABASE_URL=memory://local APP_URL=http://127.0.0.1:3000 ADMIN_PASSWORD=test-admin ADMIN_COOKIE_SECRET=test-cookie pnpm dev --hostname 127.0.0.1",
    timeout: 120_000,
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
