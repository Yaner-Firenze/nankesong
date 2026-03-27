import { z } from "zod";

const basePassSchema = z.object({
  contactInfo: z.string().trim().min(1),
  projectName: z.string().trim().min(1),
  role: z.string().trim().min(1),
  projectSummary: z.string().trim().min(1),
  userNote: z.string().trim().optional(),
});

export const individualPassSchema = basePassSchema.extend({
  type: z.literal("individual"),
  name: z.string().trim().min(1),
});

export const teamPassSchema = basePassSchema.extend({
  type: z.literal("team"),
  teamName: z.string().trim().min(1),
  contactName: z.string().trim().min(1),
  teamSize: z.coerce.number().int().positive(),
});

export const createPassSchema = z.discriminatedUnion("type", [
  individualPassSchema,
  teamPassSchema,
]);

export type CreatePassInput = z.infer<typeof createPassSchema>;
