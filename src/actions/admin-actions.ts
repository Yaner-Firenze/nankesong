"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  clearAdminSessionCookie,
  issueAdminSessionToken,
  requireAdmin,
  setAdminSessionCookie,
} from "@/lib/admin-auth";
import { updateInternalNote } from "@/lib/passes";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function loginAdminAction(formData: FormData) {
  const token = issueAdminSessionToken(readString(formData, "password"));

  if (!token) {
    redirect("/admin/login?error=invalid");
  }

  await setAdminSessionCookie(token);
  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

export async function saveInternalNoteAction(formData: FormData) {
  await requireAdmin();

  const id = readString(formData, "id");
  const internalNote = readString(formData, "internalNote");

  await updateInternalNote(id, internalNote);

  revalidatePath("/admin");
  revalidatePath(`/admin/pass/${id}`);
  redirect(`/admin/pass/${id}`);
}
