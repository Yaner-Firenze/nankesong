type PassSuccessCardProps = {
  id: string;
  qrDataUrl: string;
  passUrl: string;
};

export function PassSuccessCard({
  id,
  qrDataUrl,
  passUrl,
}: PassSuccessCardProps) {
  return (
    <section className="grid gap-8 rounded-3xl border border-neutral-200 bg-white p-8 md:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-neutral-500">
          Nankesong S2
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          Your direct pass is ready
        </h1>
        <p className="text-base leading-7 text-neutral-600">
          Save this QR code and present it during manual review. The QR code
          opens your unique direct pass page.
        </p>
        <dl className="grid gap-3 text-sm text-neutral-700">
          <div>
            <dt className="font-medium text-neutral-950">Pass ID</dt>
            <dd>{id}</dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-950">Pass URL</dt>
            <dd className="break-all">{passUrl}</dd>
          </div>
        </dl>
      </div>

      {/* Plain img is sufficient here because the source is a generated data URL. */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-neutral-50 p-6">
        <img alt={`QR code for direct pass ${id}`} className="w-full max-w-72" src={qrDataUrl} />
        <p className="text-center text-sm text-neutral-500">
          Screenshot or download this page for easy access.
        </p>
      </div>
    </section>
  );
}
