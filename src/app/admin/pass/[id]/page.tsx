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
    <div className="grid gap-1 border-t border-border/70 py-4 first:border-t-0 first:pt-0">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-base text-foreground">{value}</dd>
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
    <main className="page-shell max-w-5xl">
      <section className="panel grid gap-8 p-8 md:grid-cols-[1fr_0.9fr] md:p-10">
        <div>
          <p className="eyebrow">记录详情</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {pass.projectName}
          </h1>
          <dl className="mt-6">
            <DetailRow
              label={pass.type === "team" ? "团队名称" : "姓名"}
              value={pass.type === "team" ? pass.teamName : pass.name}
            />
            <DetailRow label="主联系人" value={pass.contactName} />
            <DetailRow label="联系方式" value={pass.contactInfo} />
            <DetailRow label="角色" value={pass.role} />
            <DetailRow label="项目一句话介绍" value={pass.projectSummary} />
            <DetailRow label="当前备注" value={pass.internalNote} />
          </dl>
        </div>

        <div className="panel-soft p-5">
          <div className="mb-4 space-y-1">
            <h2 className="text-lg font-semibold text-foreground">内部备注</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              该备注仅在后台显示，不会出现在公开核验页。
            </p>
          </div>
          <AdminNoteForm id={pass.id} internalNote={pass.internalNote} />
        </div>
      </section>
    </main>
  );
}
