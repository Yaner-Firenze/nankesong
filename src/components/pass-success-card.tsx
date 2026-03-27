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
            请保存下方二维码，并在南客松 S2 报名时投递。活动方打开后，即可查看你的登记信息。
          </p>
        </div>

        <div className="grid gap-0 border-t border-foreground">
          <div className="grid gap-3 border-b border-foreground py-5">
            <dt className="data-key">直通卡编号</dt>
            <dd className="text-lg break-all">{id}</dd>
          </div>
          <div className="grid gap-3 border-b border-foreground py-5">
            <dt className="data-key">直通卡链接</dt>
            <dd className="text-base break-all leading-relaxed">{passUrl}</dd>
          </div>
          <div className="grid gap-3 py-5">
            <dt className="data-key">使用说明</dt>
            <dd className="text-base leading-relaxed text-muted-foreground">
              建议先截图保存。报名时请提交这张二维码，便于活动方查看你的直通卡信息。
            </dd>
          </div>
        </div>
      </div>

      <div className="panel-invert panel-pattern-grid flex flex-col items-center justify-center gap-6 px-0 py-8 lg:px-8 lg:py-10">
        <span className="status-pill border-current text-current">
          报名投递二维码
        </span>
        <div className="border-4 border-background bg-background p-4">
          <img
            alt={`QR code for direct pass ${id}`}
            className="block w-full max-w-72 bg-white"
            src={qrDataUrl}
          />
        </div>
        <p className="max-w-sm text-center text-base leading-relaxed text-background/80">
          扫描后会打开这张直通卡的详情页，方便活动方在报名环节查看信息。
        </p>
      </div>
    </section>
  );
}
