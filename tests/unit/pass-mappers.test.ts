import { describe, expect, it } from "vitest";

describe("toPassInsert", () => {
  it("maps an individual payload into a pass record", async () => {
    const { toPassInsert } = await import("@/lib/pass-mappers");

    const record = toPassInsert({
      type: "individual",
      name: "Ada Lovelace",
      contactInfo: "ada@example.com",
      projectName: "Solo Agent",
      role: "Builder",
      projectSummary: "A compact AI helper",
      userNote: "VIP",
    });

    expect(record.type).toBe("individual");
    expect(record.status).toBe("active");
    expect(record.name).toBe("Ada Lovelace");
    expect(record.contactName).toBe("Ada Lovelace");
    expect(record.teamName).toBeNull();
  });

  it("keeps team and contact names distinct for a team payload", async () => {
    const { toPassInsert } = await import("@/lib/pass-mappers");

    const record = toPassInsert({
      type: "team",
      teamName: "Flux Crew",
      contactName: "Lin",
      contactInfo: "lin@example.com",
      teamSize: 4,
      projectName: "Team Console",
      role: "Founder",
      projectSummary: "A shared ops dashboard",
      userNote: "Priority review",
    });

    expect(record.type).toBe("team");
    expect(record.status).toBe("active");
    expect(record.name).toBeNull();
    expect(record.teamName).toBe("Flux Crew");
    expect(record.contactName).toBe("Lin");
    expect(record.teamSize).toBe(4);
  });
});
