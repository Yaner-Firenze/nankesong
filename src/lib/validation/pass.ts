import { z } from "zod";

const identityNumberSchema = z
  .string()
  .trim()
  .regex(/^\d{17}[\dXx]$/, "身份证号码格式不正确");

const teamMemberSchema = z.object({
  identityNumber: identityNumberSchema,
  name: z.string().trim().min(1),
});

const basePassSchema = z.object({
  contactInfo: z.string().trim().min(1),
  projectName: z.string().trim().min(1),
  role: z.string().trim().min(1),
  projectSummary: z.string().trim().min(1),
  submissionKey: z.string().uuid().optional(),
  userNote: z.string().trim().optional(),
});

export const individualPassSchema = basePassSchema.extend({
  type: z.literal("individual"),
  identityNumber: identityNumberSchema,
  name: z.string().trim().min(1),
});

export const teamPassSchema = basePassSchema.extend({
  type: z.literal("team"),
  teamName: z.string().trim().min(1),
  contactName: z.string().trim().min(1),
  members: z.array(teamMemberSchema).min(2).max(5),
  projectCode: z.string().trim().min(1),
  teamSize: z.coerce.number().int().positive(),
}).superRefine((value, ctx) => {
  if (value.teamSize !== value.members.length) {
    ctx.addIssue({
      code: "custom",
      message: "团队人数必须与成员数量一致",
      path: ["members"],
    });
  }

  const seen = new Set<string>();

  for (const [index, member] of value.members.entries()) {
    const normalized = member.identityNumber.toUpperCase();

    if (seen.has(normalized)) {
      ctx.addIssue({
        code: "custom",
        message: "团队成员身份证号不能重复",
        path: ["members", index, "identityNumber"],
      });
    }

    seen.add(normalized);
  }
});

export const createPassSchema = z.discriminatedUnion("type", [
  individualPassSchema,
  teamPassSchema,
]);

export type CreatePassInput = z.infer<typeof createPassSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
