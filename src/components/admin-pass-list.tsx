import Link from "next/link";

import type { Pass } from "@/lib/db/schema";

export function AdminPassList({
  items,
  query,
}: {
  items: Pass[];
  query?: string;
}) {
  return (
    <section className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">内部管理</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            直通卡管理后台
          </h1>
          <p className="text-sm leading-7 text-muted-foreground">
            搜索、查看并补充直通卡记录，供活动现场和后续运营使用。
          </p>
        </div>
      </div>

      <form action="/admin" className="grid gap-2">
        <label className="field-label">
          <span>搜索直通卡</span>
          <input
            className="field-input"
            defaultValue={query}
            name="q"
            placeholder="输入团队名称、姓名、联系人或项目名称"
          />
        </label>
      </form>

      <div className="grid gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            className="panel block p-5 hover:border-primary/60"
            href={`/admin/pass/${item.id}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {item.projectName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {item.type === "team" ? item.teamName : item.name} ·{" "}
                  {item.contactName}
                </p>
              </div>
              <span className="status-pill">
                {item.type === "team" ? "团队" : "个人"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
