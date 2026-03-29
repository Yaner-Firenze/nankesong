"use server";

import { redirect } from "next/navigation";

import { createPass } from "@/lib/passes";
import { createPassSchema } from "@/lib/validation/pass";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function createPassAction(formData: FormData) {
  const type = readString(formData, "type");

  const parsed = createPassSchema.parse(
    type === "team"
      ? {
          type,
          teamName: readString(formData, "teamName"),
          contactName: readString(formData, "contactName"),
          contactInfo: readString(formData, "contactInfo"),
          teamSize: readString(formData, "teamSize"),
          projectName: readString(formData, "projectName"),
          role: readString(formData, "role"),
          projectSummary: readString(formData, "projectSummary"),
          submissionKey: readString(formData, "submissionKey") || undefined,
          userNote: readString(formData, "userNote") || undefined,
        }
      : {
          type,
          name: readString(formData, "name"),
          contactInfo: readString(formData, "contactInfo"),
          projectName: readString(formData, "projectName"),
          role: readString(formData, "role"),
          projectSummary: readString(formData, "projectSummary"),
          submissionKey: readString(formData, "submissionKey") || undefined,
          userNote: readString(formData, "userNote") || undefined,
        }
  );

  const record = await createPass(parsed);

  redirect(`/pass/${record.id}/created`);
}
