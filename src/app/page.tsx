export default function Home() {
  return (
    <main className="page-shell" id="main-content">
      <section className="page-rule-heavy grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="grid gap-8">
          <div className="grid gap-5">
            <p className="eyebrow">南客松 S2 直通卡</p>
            <h1
              aria-label="南客松 S2 直通卡"
              className="font-serif text-[clamp(2.75rem,9vw,7rem)] leading-none tracking-tight"
            >
              <span className="block text-xl font-medium uppercase tracking-[0.08em] md:text-2xl">
                南客松 S2
              </span>
              <span className="mt-3 block">直通卡</span>
            </h1>
            <div className="grid max-w-3xl gap-4 border-l-4 border-foreground pl-5">
              <p className="text-lg leading-relaxed md:text-xl">
                这里展示的是南客松 S2 的直通卡说明。直通卡由主办方在后台发放；获得直通卡后，请在飞书报名表单中提交对应二维码或链接。
              </p>
            </div>
          </div>

          <div className="grid gap-0 border-y-4 border-foreground">
            <div className="grid gap-4 border-b border-foreground py-6 md:grid-cols-[160px_1fr]">
              <p className="eyebrow text-foreground">流程 01</p>
              <p className="text-lg leading-relaxed">
                主办方先通过飞书或其他渠道收集信息，并在内部确认直通资格。
              </p>
            </div>
            <div className="grid gap-4 border-b border-foreground py-6 md:grid-cols-[160px_1fr]">
              <p className="eyebrow text-foreground">流程 02</p>
              <p className="text-lg leading-relaxed">
                主办方在后台录入信息并生成直通卡，再将二维码发给对应个人或团队。
              </p>
            </div>
            <div className="grid gap-4 py-6 md:grid-cols-[160px_1fr]">
              <p className="eyebrow text-foreground">流程 03</p>
              <p className="text-lg leading-relaxed">
                获得直通卡后，请在南客松 S2 的飞书报名表单中提交该二维码或链接。
              </p>
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            备注：目前生成的二维码需使用 VPN 扫描打开。
          </p>
        </div>

        <section className="panel-invert panel-pattern-grid p-6 md:p-8">
          <div className="grid gap-6">
            <div className="grid gap-3 border-b border-background/30 pb-5">
              <p className="eyebrow text-background/70">使用说明</p>
              <h2 className="section-title text-background">主办方发放</h2>
              <p className="text-base leading-relaxed text-background/80">
                本页面不提供公开申请或自助生成直通卡的入口。若你已获得南客松 S2 直通资格，请联系主办方获取对应二维码。
              </p>
            </div>
            <div className="grid gap-0 border-y border-background/30">
              <div className="grid gap-3 border-b border-background/30 py-5">
                <p className="eyebrow text-background/70">对外口径</p>
                <p className="text-lg leading-relaxed">
                  直通卡由南客松主办方统一发放，不面向公开申请。
                </p>
              </div>
              <div className="grid gap-3 py-5">
                <p className="eyebrow text-background/70">提交方式</p>
                <p className="text-lg leading-relaxed">
                  请在飞书报名表单中提交二维码或链接，供运营团队后续核对。
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
