import { PassTypePicker } from "@/components/pass-type-picker";

export default function Home() {
  return (
    <main className="page-shell" id="main-content">
      <section className="page-rule-heavy grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="grid gap-8">
          <div className="grid gap-5">
            <p className="eyebrow">南客松 S2 直通卡入口</p>
            <h1
              aria-label="南客松 S2 直通卡登记"
              className="font-serif text-[clamp(2.75rem,9vw,7rem)] leading-none tracking-tight"
            >
              <span className="block text-xl font-medium uppercase tracking-[0.08em] md:text-2xl">
                南客松 S2
              </span>
              <span className="mt-3 block">直通卡登记</span>
            </h1>
            <div className="grid max-w-3xl gap-4 border-l-4 border-foreground pl-5">
              <p className="text-lg leading-relaxed md:text-xl">
                这里是南客松 S2 的直通卡登记入口。无论是个人还是团队，都可以在这里完成信息登记。提交后，你会获得一张专属二维码，在南客松 S2 的报名中投递这个二维码，可直通南客松 S2 录取。
              </p>
            </div>
          </div>

          <div className="grid gap-0 border-y-4 border-foreground">
            <div className="grid gap-4 border-b border-foreground py-6 md:grid-cols-[160px_1fr]">
              <p className="eyebrow text-foreground">流程 01</p>
              <p className="text-lg leading-relaxed">
                先选择登记类型，再进入对应表单，个人和团队都从这里开始。
              </p>
            </div>
            <div className="grid gap-4 border-b border-foreground py-6 md:grid-cols-[160px_1fr]">
              <p className="eyebrow text-foreground">流程 02</p>
              <p className="text-lg leading-relaxed">
                提交完成后会生成一张直通卡二维码，现场扫码即可查看登记信息。
              </p>
            </div>
            <div className="grid gap-4 py-6 md:grid-cols-[160px_1fr]">
              <p className="eyebrow text-foreground">流程 03</p>
              <p className="text-lg leading-relaxed">
                南客松可在后台添加备注，以便进行身份核验。
              </p>
            </div>
          </div>
        </div>

        <div className="panel-invert panel-pattern-grid p-6 md:p-8">
          <div className="grid gap-6">
            <div className="grid gap-3 border-b border-background/30 pb-5">
              <p className="eyebrow text-background/70">选择入口</p>
              <h2 className="section-title text-background">选择登记方式</h2>
              <p className="text-base leading-relaxed text-background/80">
                请根据你的参会方式，选择个人或团队入口继续填写。
              </p>
            </div>
            <PassTypePicker />
          </div>
        </div>
      </section>
    </main>
  );
}
