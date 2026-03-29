import { notFound } from "next/navigation";
import Link from "next/link";

import { AdminDeleteForm } from "@/components/admin-delete-form";
import { AdminNoteForm } from "@/components/admin-note-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getPassRecordById } from "@/lib/passes";
import { buildPassQrDataUrl, buildPassUrl } from "@/lib/qr";

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
    <div className="grid gap-3 border-b border-foreground py-5 last:border-b-0">
      <dt className="data-key">{label}</dt>
      <dd className="text-lg leading-relaxed">{value}</dd>
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
  const pass = await getPassRecordById(id);

  if (!pass) {
    notFound();
  }

  const passUrl = buildPassUrl(pass.id);
  const qrDataUrl = await buildPassQrDataUrl(pass.id);

  return (
    <main className="page-shell" id="main-content">
      <section className="page-rule-heavy grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <p className="eyebrow">记录详情</p>
            <h1 className="section-title">{pass.projectName}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="status-pill">
                {pass.type === "team" ? "团队记录" : "个人记录"}
              </span>
              <span className="status-pill">后台可编辑备注</span>
            </div>
          </div>

          <section className="panel p-6 md:p-8">
            <dl className="grid gap-0 border-t border-foreground">
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
          </section>
        </div>

        <section className="panel-invert panel-pattern-grid p-6 md:p-8">
          <div className="grid gap-5">
            <div className="grid gap-3 border-b border-background/30 pb-5">
              <p className="eyebrow text-background/70">内部备注</p>
              <h2 className="font-serif text-4xl tracking-tight">内部备注</h2>
              <p className="text-base leading-relaxed text-background/80">
                这里填写的内容只在后台可见，公开核验页不会显示。
              </p>
            </div>
            <div className="grid gap-4 border-b border-background/30 pb-5">
              <p className="eyebrow text-background/70">对外发放</p>
              <div className="border-4 border-background bg-background p-4">
                <img
                  alt={`${pass.projectName} 的直通卡二维码`}
                  className="mx-auto block w-full max-w-56 bg-white"
                  src={qrDataUrl}
                />
              </div>
              <div className="grid gap-2 text-sm leading-relaxed text-background/80">
                <p className="data-key text-background/60">公开链接</p>
                <p className="break-all">{passUrl}</p>
                <p>创建完成后，可将这张二维码或公开链接发给对应个人或团队。</p>
                <Link className="secondary-button border-background text-background hover:bg-background hover:text-foreground" href={passUrl} target="_blank">
                  打开公开详情页 →
                </Link>
              </div>
            </div>
            <AdminNoteForm id={pass.id} internalNote={pass.internalNote} />
            <AdminDeleteForm id={pass.id} />
          </div>
        </section>
      </section>
    </main>
  );
}
