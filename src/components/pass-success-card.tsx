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
    <section className="panel grid gap-8 overflow-hidden p-8 md:grid-cols-[1.1fr_0.9fr] md:p-10">
      <div className="space-y-5">
        <p className="eyebrow">南客松 S2</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          直通卡已生成
        </h1>
        <p className="text-base leading-8 text-muted-foreground">
          请保存下方二维码，并在签到或人工审核环节出示。工作人员扫码后可直接查看这张直通卡对应的信息。
        </p>

        <div className="grid gap-3 text-sm text-muted-foreground">
          <div className="panel-soft p-4">
            <dt className="font-medium text-foreground">直通卡编号</dt>
            <dd className="mt-2 break-all text-sm">{id}</dd>
          </div>
          <div className="panel-soft p-4">
            <dt className="font-medium text-foreground">核验链接</dt>
            <dd className="mt-2 break-all text-sm">{passUrl}</dd>
          </div>
          <div className="panel-soft p-4">
            <dt className="font-medium text-foreground">使用说明</dt>
            <dd className="mt-2 text-sm leading-7">
              建议截图保存本页。若现场使用手机出示，请确保二维码完整清晰，便于工作人员扫描。
            </dd>
          </div>
        </div>
      </div>

      <div className="panel-soft flex flex-col items-center justify-center gap-4 p-6">
        <span className="status-pill">活动核验二维码</span>
        <img
          alt={`QR code for direct pass ${id}`}
          className="w-full max-w-72 rounded-3xl bg-white p-3 shadow-lg shadow-black/20"
          src={qrDataUrl}
        />
        <p className="text-center text-sm leading-6 text-muted-foreground">
          南客松 S2 现场扫码后将跳转至直通卡详情页。
        </p>
      </div>
    </section>
  );
}
