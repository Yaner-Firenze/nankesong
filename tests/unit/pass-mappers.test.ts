import { describe, expect, it } from "vitest";

describe("toPassInsert", () => {
  it("maps an individual payload into a pass record", async () => {
    const { toPassInsert } = await import("@/lib/pass-mappers");

    const record = toPassInsert({
      type: "individual",
      name: "Ada Lovelace",
      contactInfo: "ada@example.com",
      identityNumber: "110101199001011234",
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
    expect(record.identityNumber).toBe("110101199001011234");
  });

  it("keeps team and contact names distinct for a team payload", async () => {
    const { toPassInsert } = await import("@/lib/pass-mappers");

    const record = toPassInsert({
      type: "team",
      teamName: "Flux Crew",
      contactName: "Lin",
      contactInfo: "lin@example.com",
      teamSize: 4,
      projectCode: "PRJ-001",
      projectName: "Team Console",
      role: "Founder",
      projectSummary: "A shared ops dashboard",
      members: [
        { name: "Lin", identityNumber: "110101199001011234" },
        { name: "Ada", identityNumber: "110101199001011235" },
        { name: "Mina", identityNumber: "110101199001011236" },
        { name: "Casey", identityNumber: "110101199001011237" },
      ],
      userNote: "Priority review",
    });

    expect(record.type).toBe("team");
    expect(record.status).toBe("active");
    expect(record.name).toBeNull();
    expect(record.teamName).toBe("Flux Crew");
    expect(record.contactName).toBe("Lin");
    expect(record.teamSize).toBe(4);
    expect(record.projectCode).toBe("PRJ-001");
    expect(record.members).toHaveLength(4);
  });
});
