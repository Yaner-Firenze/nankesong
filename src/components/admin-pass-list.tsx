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
    <section className="grid gap-8">
      <div className="page-rule-heavy grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="grid gap-3">
          <p className="eyebrow">活动方后台</p>
          <h1 className="section-title">直通卡管理后台</h1>
          <p className="max-w-3xl text-lg leading-relaxed">
            你可以在这里新建直通卡、搜索记录、查看详情，并补充内部备注。
          </p>
        </div>
        <div className="grid gap-4 md:justify-items-end">
          <Link className="primary-button justify-center text-center" href="/admin/new">
            新建直通卡 →
          </Link>
          <div className="grid min-w-56 gap-0 border-2 border-foreground">
            <div className="border-b border-foreground px-4 py-3">
              <p className="data-key">当前记录数</p>
              <p className="mt-2 text-2xl font-serif">{items.length}</p>
            </div>
            <div className="px-4 py-3">
              <p className="data-key">搜索状态</p>
              <p className="mt-2 text-sm leading-relaxed">
                {query ? `当前关键词：${query}` : "当前显示全部记录"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form action="/admin" className="panel p-6">
        <label className="field-label">
          <span>搜索直通卡</span>
          <input
            className="field-input"
            defaultValue={query}
            name="q"
            placeholder="输入团队名称、姓名、联系人、项目名称或项目编号"
          />
        </label>
      </form>

      <div className="grid gap-0 border-t-4 border-foreground">
        {items.length ? (
          items.map((item) => (
            <Link
              key={item.id}
              className="group grid gap-4 border-b-2 border-foreground px-0 py-6 hover:bg-foreground hover:text-background"
              href={`/admin/pass/${item.id}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="grid gap-2">
                  <p className="font-serif text-3xl tracking-tight">
                    {item.projectName}
                  </p>
                  <p className="text-base leading-relaxed text-muted-foreground group-hover:text-background/80">
                    {item.type === "team" ? item.teamName : item.name} ·{" "}
                    {item.contactName}
                  </p>
                </div>
                <span className="status-pill border-current text-current">
                  {item.type === "team" ? "团队" : "个人"}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.1em]">
                <span>{item.id}</span>
                <span aria-hidden="true">查看详情 →</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="panel-soft p-6">
            <p className="font-serif text-2xl">暂无匹配结果</p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              没有找到符合当前关键词的记录，建议换个关键词再试一次。
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
