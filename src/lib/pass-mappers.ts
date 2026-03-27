import type { NewPass } from "@/lib/db/schema";
import type { CreatePassInput } from "@/lib/validation/pass";

export function toPassInsert(input: CreatePassInput): NewPass {
  const baseRecord = {
    id: crypto.randomUUID(),
    type: input.type,
    status: "active",
    contactInfo: input.contactInfo,
    role: input.role,
    projectName: input.projectName,
    projectSummary: input.projectSummary,
    userNote: input.userNote ?? null,
    internalNote: null,
  } satisfies Partial<NewPass>;

  if (input.type === "individual") {
    return {
      ...baseRecord,
      id: baseRecord.id,
      type: "individual",
      status: "active",
      name: input.name,
      teamName: null,
      contactName: input.name,
      contactInfo: input.contactInfo,
      role: input.role,
      projectName: input.projectName,
      projectSummary: input.projectSummary,
      teamSize: null,
      userNote: input.userNote ?? null,
      internalNote: null,
    };
  }

  return {
    ...baseRecord,
    id: baseRecord.id,
    type: "team",
    status: "active",
    name: null,
    teamName: input.teamName,
    contactName: input.contactName,
    contactInfo: input.contactInfo,
    role: input.role,
    projectName: input.projectName,
    projectSummary: input.projectSummary,
    teamSize: input.teamSize,
    userNote: input.userNote ?? null,
    internalNote: null,
  };
}
