import { describe, expect, it } from "vitest";

describe("identity binding validation", () => {
  it("rejects an individual pass without identity number", async () => {
    const { createPassSchema } = await import("@/lib/validation/pass");

    expect(() =>
      createPassSchema.parse({
        type: "individual",
        name: "Ada",
        contactInfo: "ada@example.com",
        projectName: "Solo",
        role: "Builder",
        projectSummary: "AI helper",
      })
    ).toThrow();
  });

  it("rejects a team pass with fewer than 2 members", async () => {
    const { createPassSchema } = await import("@/lib/validation/pass");

    expect(() =>
      createPassSchema.parse({
        type: "team",
        teamName: "Flux",
        contactName: "Lin",
        contactInfo: "lin@example.com",
        teamSize: 2,
        projectCode: "PRJ-001",
        projectName: "Console",
        role: "Founder",
        projectSummary: "Ops dashboard",
        members: [{ name: "Lin", identityNumber: "110101199001011234" }],
      })
    ).toThrow();
  });

  it("rejects duplicate identity numbers within the same team", async () => {
    const { createPassSchema } = await import("@/lib/validation/pass");

    expect(() =>
      createPassSchema.parse({
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
          { name: "Ada", identityNumber: "110101199001011234" },
        ],
      })
    ).toThrow();
  });
});
