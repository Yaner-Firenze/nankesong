import { notFound } from "next/navigation";

import { AdminNoteForm } from "@/components/admin-note-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getPassById } from "@/lib/passes";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <div className="grid gap-1 border-t border-neutral-200 py-4 first:border-t-0 first:pt-0">
      <dt className="text-sm font-medium text-neutral-500">{label}</dt>
      <dd className="text-base text-neutral-950">{value}</dd>
    </div>
  );
}

export default async function AdminPassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const pass = await getPassById(id);

  if (!pass) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <section className="grid gap-8 rounded-3xl border border-neutral-200 bg-white p-8 md:grid-cols-[1fr_0.9fr]">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            {pass.projectName}
          </h1>
          <dl className="mt-6">
            <DetailRow
              label={pass.type === "team" ? "Team Name" : "Name"}
              value={pass.type === "team" ? pass.teamName : pass.name}
            />
            <DetailRow label="Contact Name" value={pass.contactName} />
            <DetailRow label="Contact Info" value={pass.contactInfo} />
            <DetailRow label="Role" value={pass.role} />
            <DetailRow label="Project Summary" value={pass.projectSummary} />
            <DetailRow label="Current Note" value={pass.internalNote} />
          </dl>
        </div>

        <AdminNoteForm id={pass.id} internalNote={pass.internalNote} />
      </section>
    </main>
  );
}
