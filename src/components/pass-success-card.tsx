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
    <section className="grid gap-0 border-y-8 border-foreground lg:grid-cols-[1.05fr_0.95fr]">
      <div className="grid gap-8 border-b-4 border-foreground py-8 lg:border-b-0 lg:border-r-4 lg:px-0 lg:py-10 lg:pr-8">
        <div className="grid gap-4">
          <p className="eyebrow">提交完成</p>
          <h1 className="section-title">直通卡已生成</h1>
          <p className="max-w-2xl text-lg leading-relaxed">
            请保存下方二维码，并在签到或人工审核时出示。工作人员扫码后，就能看到你的登记信息。
          </p>
        </div>

        <div className="grid gap-0 border-t border-foreground">
          <div className="grid gap-3 border-b border-foreground py-5">
            <dt className="data-key">直通卡编号</dt>
            <dd className="text-lg break-all">{id}</dd>
          </div>
          <div className="grid gap-3 border-b border-foreground py-5">
            <dt className="data-key">核验链接</dt>
            <dd className="text-base break-all leading-relaxed">{passUrl}</dd>
          </div>
          <div className="grid gap-3 py-5">
            <dt className="data-key">使用说明</dt>
            <dd className="text-base leading-relaxed text-muted-foreground">
              建议先截图保存。如果现场用手机出示，请保持二维码完整清晰，方便工作人员扫描。
            </dd>
          </div>
        </div>
      </div>

      <div className="panel-invert panel-pattern-grid flex flex-col items-center justify-center gap-6 px-0 py-8 lg:px-8 lg:py-10">
        <span className="status-pill border-current text-current">
          活动核验二维码
        </span>
        <div className="border-4 border-background bg-background p-4">
          <img
            alt={`QR code for direct pass ${id}`}
            className="block w-full max-w-72 bg-white"
            src={qrDataUrl}
          />
        </div>
        <p className="max-w-sm text-center text-base leading-relaxed text-background/80">
          现场扫码后会打开这张直通卡的详情页，工作人员可直接核对信息。
        </p>
      </div>
    </section>
  );
}
