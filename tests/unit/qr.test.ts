import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.resetModules();
});

describe("buildPassUrl", () => {
  it("builds a pass detail URL from APP_URL and the record id", async () => {
    process.env.APP_URL = "https://passes.example.com";
    process.env.DATABASE_URL = "https://db.example.com";
    process.env.ADMIN_PASSWORD = "secret";
    process.env.ADMIN_COOKIE_SECRET = "cookie-secret";

    const { buildPassUrl } = await import("@/lib/qr");

    expect(buildPassUrl("pass_123")).toBe(
      "https://passes.example.com/pass/pass_123"
    );
  });

  it("falls back to localhost when APP_URL is missing", async () => {
    delete process.env.APP_URL;
    process.env.DATABASE_URL = "https://db.example.com";
    process.env.ADMIN_PASSWORD = "secret";
    process.env.ADMIN_COOKIE_SECRET = "cookie-secret";

    const { buildPassUrl } = await import("@/lib/qr");

    expect(buildPassUrl("pass_123")).toBe("http://localhost:3000/pass/pass_123");
  });
});
