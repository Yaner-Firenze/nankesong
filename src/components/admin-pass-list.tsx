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
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Admin Direct Passes
          </h1>
          <p className="text-sm leading-6 text-neutral-600">
            Search and review direct-pass records, then add internal notes.
          </p>
        </div>
      </div>

      <form action="/admin" className="grid gap-2">
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          <span>Search Passes</span>
          <input
            className="rounded-2xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-950"
            defaultValue={query}
            name="q"
          />
        </label>
      </form>

      <div className="grid gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            className="rounded-3xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-950 hover:bg-neutral-50"
            href={`/admin/pass/${item.id}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-neutral-950">
                  {item.projectName}
                </h2>
                <p className="text-sm text-neutral-600">
                  {item.type === "team" ? item.teamName : item.name} ·{" "}
                  {item.contactName}
                </p>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-neutral-600">
                {item.type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
