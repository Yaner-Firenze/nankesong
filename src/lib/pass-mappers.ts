import type { NewPass } from "@/lib/db/schema";
import type { CreatePassInput } from "@/lib/validation/pass";

export function toPassInsert(input: CreatePassInput): NewPass {
  const baseRecord = {
    id: crypto.randomUUID(),
    submissionKey: input.submissionKey ?? null,
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
      submissionKey: baseRecord.submissionKey,
      type: "individual",
      status: "active",
      name: input.name,
      teamName: null,
      identityNumber: input.identityNumber.toUpperCase(),
      projectCode: null,
      members: null,
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
    submissionKey: baseRecord.submissionKey,
    type: "team",
    status: "active",
    name: null,
    teamName: input.teamName,
    identityNumber: null,
    projectCode: input.projectCode,
    members: input.members.map((member) => ({
      ...member,
      identityNumber: member.identityNumber.toUpperCase(),
    })),
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
