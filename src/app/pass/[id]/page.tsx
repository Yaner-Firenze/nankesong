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
    <div className="grid gap-1 border-t border-border/70 py-4 first:border-t-0 first:pt-0">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-base text-foreground">{value}</dd>
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
    <main className="page-shell max-w-4xl">
      <section className="panel p-8 md:p-10">
        <div className="space-y-4">
          <span className="status-pill">有效直通卡</span>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            直通卡信息
          </h1>
          <p className="text-base leading-8 text-muted-foreground">
            本页面供南客松 S2 工作人员现场扫码后核验使用。
          </p>
        </div>

        <dl className="mt-8">
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
    </main>
  );
}
