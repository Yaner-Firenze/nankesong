import { notFound } from "next/navigation";

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

export default async function PassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pass = await getPassById(id);

  if (!pass) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-neutral-500">
            Nankesong S2
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Direct Pass
          </h1>
          <p className="text-base leading-7 text-neutral-600">
            Manual review page for this direct pass record.
          </p>
        </div>

        <dl className="mt-8">
          <DetailRow label="Status" value="Valid" />
          <DetailRow
            label="Pass Type"
            value={pass.type === "team" ? "Team" : "Individual"}
          />
          <DetailRow label="Pass ID" value={pass.id} />
          <DetailRow
            label={pass.type === "team" ? "Team Name" : "Name"}
            value={pass.type === "team" ? pass.teamName : pass.name}
          />
          <DetailRow label="Contact Name" value={pass.contactName} />
          <DetailRow label="Contact Info" value={pass.contactInfo} />
          <DetailRow label="Project Name" value={pass.projectName} />
          <DetailRow label="Role" value={pass.role} />
          <DetailRow label="Team Size" value={pass.teamSize} />
          <DetailRow label="Project Summary" value={pass.projectSummary} />
          <DetailRow
            label="Submitted At"
            value={new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(pass.createdAt)}
          />
        </dl>
      </section>
    </main>
  );
}
