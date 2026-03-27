import { notFound } from "next/navigation";

import { PassSuccessCard } from "@/components/pass-success-card";
import { getPassById } from "@/lib/passes";
import { buildPassQrDataUrl, buildPassUrl } from "@/lib/qr";

export default async function PassCreatedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pass = await getPassById(id);

  if (!pass) {
    notFound();
  }

  const qrDataUrl = await buildPassQrDataUrl(id);
  const passUrl = buildPassUrl(id);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <PassSuccessCard id={id} passUrl={passUrl} qrDataUrl={qrDataUrl} />
    </main>
  );
}
