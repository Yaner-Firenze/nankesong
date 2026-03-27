import { describe, expect, it } from "vitest";

const validIndividual = {
  type: "individual",
  name: "Ada Lovelace",
  contactInfo: "ada@example.com",
  projectName: "Solo Agent",
  role: "Builder",
  projectSummary: "A compact AI helper",
  userNote: "VIP",
};

const validTeam = {
  type: "team",
  teamName: "Flux Crew",
  contactName: "Lin",
  contactInfo: "lin@example.com",
  teamSize: 4,
  projectName: "Team Console",
  role: "Founder",
  projectSummary: "A shared ops dashboard",
  userNote: "Priority review",
};

describe("createPassSchema", () => {
  it("accepts a valid individual payload", async () => {
    const { createPassSchema } = await import("@/lib/validation/pass");

    const result = createPassSchema.safeParse(validIndividual);

    expect(result.success).toBe(true);
  });

  it("requires individual-specific fields", async () => {
    const { createPassSchema } = await import("@/lib/validation/pass");

    const result = createPassSchema.safeParse({
      ...validIndividual,
      name: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid team payload", async () => {
    const { createPassSchema } = await import("@/lib/validation/pass");

    const result = createPassSchema.safeParse(validTeam);

    expect(result.success).toBe(true);
  });

  it("requires team-specific fields", async () => {
    const { createPassSchema } = await import("@/lib/validation/pass");

    const result = createPassSchema.safeParse({
      ...validTeam,
      teamSize: undefined,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an unknown pass type", async () => {
    const { createPassSchema } = await import("@/lib/validation/pass");

    const result = createPassSchema.safeParse({
      ...validIndividual,
      type: "guest",
    });

    expect(result.success).toBe(false);
  });
});
