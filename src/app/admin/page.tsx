import { AdminPassList } from "@/components/admin-pass-list";
import { requireAdmin } from "@/lib/admin-auth";
import { searchPasses } from "@/lib/passes";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : undefined;
  const items = await searchPasses(query);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <AdminPassList items={items} query={query} />
    </main>
  );
}
