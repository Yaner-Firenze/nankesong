import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.resetModules();
});

describe("identity binding persistence", () => {
  it("stores identity number for individual passes and blocks duplicates", async () => {
    process.env.DATABASE_URL = "memory://local";
    process.env.APP_URL = "http://127.0.0.1:3000";
    process.env.ADMIN_PASSWORD = "test-admin";
    process.env.ADMIN_COOKIE_SECRET = "test-cookie-secret";

    const { createPass } = await import("@/lib/passes");

    const first = await createPass({
      type: "individual",
      name: "Ada",
      contactInfo: "ada@example.com",
      identityNumber: "110101199001011234",
      projectName: "Solo",
      role: "Builder",
      projectSummary: "AI helper",
      submissionKey: "550e8400-e29b-41d4-a716-446655440010",
    } as never);

    expect(first.identityNumber).toBe("110101199001011234");

    await expect(
      createPass({
        type: "individual",
        name: "Ada 2",
        contactInfo: "ada2@example.com",
        identityNumber: "110101199001011234",
        projectName: "Solo 2",
        role: "Builder",
        projectSummary: "AI helper 2",
        submissionKey: "550e8400-e29b-41d4-a716-446655440011",
      } as never)
    ).rejects.toThrow("该身份证号码已绑定个人直通卡");
  });

  it("stores project code and members for team passes", async () => {
    process.env.DATABASE_URL = "memory://local";
    process.env.APP_URL = "http://127.0.0.1:3000";
    process.env.ADMIN_PASSWORD = "test-admin";
    process.env.ADMIN_COOKIE_SECRET = "test-cookie-secret";

    const { createPass, getPassRecordById } = await import("@/lib/passes");

    const created = await createPass({
      type: "team",
      teamName: "Flux",
      contactName: "Lin",
      contactInfo: "lin@example.com",
      teamSize: 2,
      projectCode: "PRJ-001",
      projectName: "Console",
      role: "Founder",
      projectSummary: "Ops dashboard",
      members: [
        { name: "Lin", identityNumber: "110101199001011234" },
        { name: "Ada", identityNumber: "110101199001011235" },
      ],
      submissionKey: "550e8400-e29b-41d4-a716-446655440012",
    } as never);

    const stored = await getPassRecordById(created.id);

    expect(stored?.projectCode).toBe("PRJ-001");
    expect(stored?.members).toEqual([
      { name: "Lin", identityNumber: "110101199001011234" },
      { name: "Ada", identityNumber: "110101199001011235" },
    ]);
  });
});
