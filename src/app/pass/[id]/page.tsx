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
    <div className="grid gap-3 border-b border-foreground py-5 last:border-b-0">
      <dt className="data-key">{label}</dt>
      <dd className="text-lg leading-relaxed">{value}</dd>
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
    <main className="page-shell" id="main-content">
      <section className="page-rule-heavy grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-6">
          <div className="grid gap-4">
            <span className="status-pill">有效直通卡</span>
            <h1 className="section-title">直通卡信息</h1>
            <p className="text-lg leading-relaxed">
              南客松直通卡，请在飞书报名表单中提交，南客松运营团队审核后即刻直通。
            </p>
          </div>

          <div className="panel-invert panel-pattern-diagonal p-6 md:p-8">
            <div className="grid gap-3">
              <p className="eyebrow text-background/70">报名说明</p>
              <p className="font-serif text-3xl tracking-tight">
                请在飞书报名表单中提交
              </p>
              <p className="text-base leading-relaxed text-background/80">
                南客松运营团队审核后即刻直通。
              </p>
            </div>
          </div>
        </div>

        <section className="panel p-6 md:p-8">
          <dl className="grid gap-0 border-t border-foreground">
            <DetailRow label="状态" value="有效" />
            <DetailRow
              label="直通卡类型"
              value={pass.type === "team" ? "团队" : "个人"}
            />
            <DetailRow label="直通卡编号" value={pass.id} />
            <DetailRow
              label={pass.type === "team" ? "团队名称" : "姓名"}
              value={pass.type === "team" ? pass.teamName : pass.name}
            />
            <DetailRow label="主联系人" value={pass.contactName} />
            <DetailRow label="联系方式" value={pass.contactInfo} />
            <DetailRow label="项目名称" value={pass.projectName} />
            <DetailRow label="角色" value={pass.role} />
            <DetailRow label="团队人数" value={pass.teamSize} />
            <DetailRow label="项目一句话介绍" value={pass.projectSummary} />
            <DetailRow
              label="提交时间"
              value={new Intl.DateTimeFormat("zh-CN", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(pass.createdAt)}
            />
          </dl>
        </section>
      </section>
    </main>
  );
}
