import { PassTypePicker } from "@/components/pass-type-picker";

export default function Home() {
  return (
    <main className="page-shell max-w-6xl">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel relative overflow-hidden p-8 sm:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <div className="space-y-6">
            <p className="eyebrow">南客松 S2</p>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                南客松 S2 直通卡登记
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                面向正式活动流程的直通卡登记入口。填写个人或团队信息后，
                系统会生成唯一二维码，用于现场人工核验与后续放行。
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="panel-soft p-4">
                <p className="text-sm font-semibold text-foreground">统一入口</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  一个页面区分个人与团队，不需要维护多套二维码。
                </p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-sm font-semibold text-foreground">即时生成</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  提交后直接获得专属直通卡二维码，可立即保存与使用。
                </p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-sm font-semibold text-foreground">人工核验</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  扫码后展示清晰信息，方便工作人员现场快速判断。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-stretch">
          <PassTypePicker />
        </div>
      </section>
    </main>
  );
}
