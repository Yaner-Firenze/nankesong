import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.resetModules();
});

describe("admin auth helpers", () => {
  it("issues a signed session token for the correct password", async () => {
    process.env.DATABASE_URL = "memory://local";
    process.env.APP_URL = "http://127.0.0.1:3000";
    process.env.ADMIN_PASSWORD = "test-admin";
    process.env.ADMIN_COOKIE_SECRET = "test-cookie-secret";

    const {
      issueAdminSessionToken,
      verifyAdminSessionToken,
    } = await import("@/lib/admin-auth");

    const token = issueAdminSessionToken("test-admin");

    expect(token).toBeTruthy();
    expect(verifyAdminSessionToken(token as string)).toBe(true);
  });

  it("rejects an invalid password", async () => {
    process.env.DATABASE_URL = "memory://local";
    process.env.APP_URL = "http://127.0.0.1:3000";
    process.env.ADMIN_PASSWORD = "test-admin";
    process.env.ADMIN_COOKIE_SECRET = "test-cookie-secret";

    const { issueAdminSessionToken } = await import("@/lib/admin-auth");

    expect(issueAdminSessionToken("wrong-password")).toBeNull();
  });

  it("treats an invalid token as unauthenticated", async () => {
    process.env.DATABASE_URL = "memory://local";
    process.env.APP_URL = "http://127.0.0.1:3000";
    process.env.ADMIN_PASSWORD = "test-admin";
    process.env.ADMIN_COOKIE_SECRET = "test-cookie-secret";

    const { verifyAdminSessionToken } = await import("@/lib/admin-auth");

    expect(verifyAdminSessionToken("not-a-real-token")).toBe(false);
  });
});
