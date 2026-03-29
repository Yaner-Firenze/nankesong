import { notFound, redirect } from "next/navigation";

import { getPassById } from "@/lib/passes";

export default async function PassCreatedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pass = await getPassById(id);

  if (!pass) {
    notFound();
  }

  redirect(`/pass/${id}`);
}
