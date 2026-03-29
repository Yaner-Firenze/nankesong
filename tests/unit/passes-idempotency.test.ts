import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.resetModules();
});

describe("createPass idempotency", () => {
  it("returns the existing pass when the same submission key is sent twice", async () => {
    process.env.DATABASE_URL = "memory://local";
    process.env.APP_URL = "http://127.0.0.1:3000";
    process.env.ADMIN_PASSWORD = "test-admin";
    process.env.ADMIN_COOKIE_SECRET = "test-cookie-secret";

    const { createPass, searchPasses } = await import("@/lib/passes");

    const payload = {
      type: "individual",
      name: "Ada Lovelace",
      contactInfo: "ada@example.com",
      projectName: "Solo Agent",
      role: "Builder",
      projectSummary: "A compact AI helper",
      userNote: "VIP",
      submissionKey: "550e8400-e29b-41d4-a716-446655440000",
    } as const;

    const first = await createPass(payload as never);
    const second = await createPass(payload as never);

    expect(second.id).toBe(first.id);

    const records = await searchPasses("Solo Agent");
    expect(
      records.filter((record) => record.projectName === "Solo Agent")
    ).toHaveLength(1);
  });

  it("still creates a new pass when the submission key is different", async () => {
    process.env.DATABASE_URL = "memory://local";
    process.env.APP_URL = "http://127.0.0.1:3000";
    process.env.ADMIN_PASSWORD = "test-admin";
    process.env.ADMIN_COOKIE_SECRET = "test-cookie-secret";

    const { createPass, searchPasses } = await import("@/lib/passes");

    const first = await createPass({
      type: "individual",
      name: "Ada Lovelace",
      contactInfo: "ada@example.com",
      projectName: "Solo Agent",
      role: "Builder",
      projectSummary: "A compact AI helper",
      userNote: "VIP",
      submissionKey: "550e8400-e29b-41d4-a716-446655440000",
    } as never);

    const second = await createPass({
      type: "individual",
      name: "Ada Lovelace",
      contactInfo: "ada@example.com",
      projectName: "Solo Agent",
      role: "Builder",
      projectSummary: "A compact AI helper",
      userNote: "VIP",
      submissionKey: "550e8400-e29b-41d4-a716-446655440001",
    } as never);

    expect(second.id).not.toBe(first.id);

    const records = await searchPasses("Solo Agent");
    expect(
      records.filter((record) => record.projectName === "Solo Agent")
    ).toHaveLength(2);
  });
});
