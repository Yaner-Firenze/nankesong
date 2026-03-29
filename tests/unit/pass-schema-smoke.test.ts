import { describe, expect, it } from "vitest";

describe("getEnv", () => {
  it("throws when required environment variables are missing", async () => {
    const { getEnv } = await import("@/lib/env");

    expect(() => getEnv()).toThrow();
  });

  it("does not require APP_URL to read server-only configuration", async () => {
    const { getEnv } = await import("@/lib/env");

    expect(() =>
      getEnv({
        DATABASE_URL: "memory://local",
        ADMIN_PASSWORD: "test-admin",
        ADMIN_COOKIE_SECRET: "test-cookie",
      })
    ).not.toThrow();
  });
});

describe("passes schema", () => {
  it("exposes identity binding fields", async () => {
    const { passes } = await import("@/lib/db/schema");

    expect(passes.identityNumber).toBeDefined();
    expect(passes.projectCode).toBeDefined();
    expect(passes.members).toBeDefined();
  });
});
