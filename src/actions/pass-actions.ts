"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";
import { createPass } from "@/lib/passes";
import { createPassSchema } from "@/lib/validation/pass";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function readTeamMembers(formData: FormData) {
  return Array.from({ length: 5 }, (_, index) => index + 1)
    .map((memberIndex) => ({
      name: readString(formData, `memberName${memberIndex}`).trim(),
      identityNumber: readString(
        formData,
        `memberIdentityNumber${memberIndex}`
      ).trim(),
    }))
    .filter((member) => member.name || member.identityNumber);
}

function buildValidationRedirectPath(mode: string, type: string) {
  if (mode === "admin") {
    const searchParams = new URLSearchParams({
      error: "validation",
      type: type === "team" ? "team" : "individual",
    });

    return `/admin/new?${searchParams.toString()}`;
  }

  return "/";
}

export async function createPassAction(formData: FormData) {
  const mode = readString(formData, "mode");
  const type = readString(formData, "type");

  if (mode === "admin") {
    await requireAdmin();
  }

  const parsed = createPassSchema.safeParse(
    type === "team"
      ? {
          type,
          teamName: readString(formData, "teamName"),
          contactName: readString(formData, "contactName"),
          contactInfo: readString(formData, "contactInfo"),
          teamSize: readString(formData, "teamSize"),
          projectCode: readString(formData, "projectCode"),
          projectName: readString(formData, "projectName"),
          role: readString(formData, "role"),
          projectSummary: readString(formData, "projectSummary"),
          members: readTeamMembers(formData),
          submissionKey: readString(formData, "submissionKey") || undefined,
          userNote: readString(formData, "userNote") || undefined,
        }
      : {
          type,
          name: readString(formData, "name"),
          contactInfo: readString(formData, "contactInfo"),
          identityNumber: readString(formData, "identityNumber"),
          projectName: readString(formData, "projectName"),
          role: readString(formData, "role"),
          projectSummary: readString(formData, "projectSummary"),
          submissionKey: readString(formData, "submissionKey") || undefined,
          userNote: readString(formData, "userNote") || undefined,
        }
  );

  if (!parsed.success) {
    redirect(buildValidationRedirectPath(mode, type));
  }

  const record = await createPass(parsed.data);

  revalidatePath("/admin");
  revalidatePath(`/admin/pass/${record.id}`);
  revalidatePath(`/pass/${record.id}`);

  if (mode === "admin") {
    redirect(`/admin/pass/${record.id}`);
  }

  redirect(`/pass/${record.id}/created`);
}
