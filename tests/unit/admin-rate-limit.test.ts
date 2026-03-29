import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-03-29T12:00:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
  process.env = { ...originalEnv };
  vi.resetModules();
});

describe("admin login rate limit", () => {
  it("blocks an IP after too many failed attempts", async () => {
    process.env.DATABASE_URL = "memory://local";
    process.env.APP_URL = "http://127.0.0.1:3000";
    process.env.ADMIN_PASSWORD = "test-admin";
    process.env.ADMIN_COOKIE_SECRET = "test-cookie-secret";

    const {
      checkAdminLoginAllowed,
      registerFailedAdminLogin,
    } = await import("@/lib/admin-rate-limit");

    for (let index = 0; index < 5; index += 1) {
      await registerFailedAdminLogin("203.0.113.10");
    }

    const status = await checkAdminLoginAllowed("203.0.113.10");

    expect(status.allowed).toBe(false);
    expect(status.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("clears failed attempts after a successful login", async () => {
    process.env.DATABASE_URL = "memory://local";
    process.env.APP_URL = "http://127.0.0.1:3000";
    process.env.ADMIN_PASSWORD = "test-admin";
    process.env.ADMIN_COOKIE_SECRET = "test-cookie-secret";

    const {
      checkAdminLoginAllowed,
      clearAdminLoginAttempts,
      registerFailedAdminLogin,
    } = await import("@/lib/admin-rate-limit");

    await registerFailedAdminLogin("203.0.113.10");
    await registerFailedAdminLogin("203.0.113.10");
    await clearAdminLoginAttempts("203.0.113.10");

    const status = await checkAdminLoginAllowed("203.0.113.10");

    expect(status.allowed).toBe(true);
    expect(status.retryAfterSeconds).toBe(0);
  });

  it("lets an IP try again after the lock window expires", async () => {
    process.env.DATABASE_URL = "memory://local";
    process.env.APP_URL = "http://127.0.0.1:3000";
    process.env.ADMIN_PASSWORD = "test-admin";
    process.env.ADMIN_COOKIE_SECRET = "test-cookie-secret";

    const {
      checkAdminLoginAllowed,
      registerFailedAdminLogin,
    } = await import("@/lib/admin-rate-limit");

    for (let index = 0; index < 5; index += 1) {
      await registerFailedAdminLogin("203.0.113.10");
    }

    vi.advanceTimersByTime(15 * 60 * 1000 + 1000);

    const status = await checkAdminLoginAllowed("203.0.113.10");

    expect(status.allowed).toBe(true);
    expect(status.retryAfterSeconds).toBe(0);
  });
});
