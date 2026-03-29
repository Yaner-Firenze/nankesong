"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  clearAdminSessionCookie,
  issueAdminSessionToken,
  requireAdmin,
  setAdminSessionCookie,
} from "@/lib/admin-auth";
import {
  checkAdminLoginAllowed,
  clearAdminLoginAttempts,
  getClientIp,
  registerFailedAdminLogin,
} from "@/lib/admin-rate-limit";
import { deletePass, updateInternalNote } from "@/lib/passes";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function loginAdminAction(formData: FormData) {
  const headerStore = await headers();
  const ip = getClientIp(
    headerStore.get("x-forwarded-for") ?? headerStore.get("x-real-ip")
  );
  const loginStatus = await checkAdminLoginAllowed(ip);

  if (!loginStatus.allowed) {
    redirect("/admin/login?error=rate_limited");
  }

  const token = issueAdminSessionToken(readString(formData, "password"));

  if (!token) {
    await registerFailedAdminLogin(ip);
    redirect("/admin/login?error=invalid");
  }

  await clearAdminLoginAttempts(ip);
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

export async function deletePassAction(formData: FormData) {
  await requireAdmin();

  const id = readString(formData, "id");

  await deletePass(id);

  revalidatePath("/admin");
  revalidatePath(`/admin/pass/${id}`);
  revalidatePath(`/pass/${id}`);
  redirect("/admin");
}
