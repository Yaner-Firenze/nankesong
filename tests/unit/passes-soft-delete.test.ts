import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.resetModules();
});

describe("soft delete passes", () => {
  it("hides deleted records from public lookups and search while retaining the row", async () => {
    process.env.DATABASE_URL = "memory://local";
    process.env.APP_URL = "http://127.0.0.1:3000";
    process.env.ADMIN_PASSWORD = "test-admin";
    process.env.ADMIN_COOKIE_SECRET = "test-cookie-secret";

    const {
      createPass,
      deletePass,
      getPassById,
      getPassRecordById,
      searchPasses,
    } = await import("@/lib/passes");

    const created = await createPass({
      type: "individual",
      name: "Ada Lovelace",
      contactInfo: "ada@example.com",
      projectName: "Soft Delete Console",
      role: "Builder",
      projectSummary: "A compact AI helper",
      submissionKey: "550e8400-e29b-41d4-a716-446655440099",
      userNote: "VIP",
    } as never);

    await deletePass(created.id);

    expect(await getPassById(created.id)).toBeUndefined();
    expect(await searchPasses()).toHaveLength(0);
    expect(await searchPasses("Soft Delete Console")).toHaveLength(0);

    const record = await getPassRecordById(created.id);
    expect(record?.status).toBe("deleted");
  });
});
