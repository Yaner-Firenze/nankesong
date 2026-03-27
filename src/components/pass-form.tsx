import { createPassAction } from "@/actions/pass-actions";

type PassType = "individual" | "team";

type PassFormProps = {
  type: PassType;
};

function Field({
  label,
  name,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <input
        className="field-input"
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

export function PassForm({ type }: PassFormProps) {
  const isTeam = type === "team";

  return (
    <form action={createPassAction} className="grid gap-10">
      <input name="type" type="hidden" value={type} />

      <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <section className="panel panel-invert panel-pattern-diagonal p-6 md:p-8">
          <div className="grid gap-6">
            <div className="grid gap-3 border-b border-background/30 pb-5">
              <span className="status-pill border-current text-current">
                {isTeam ? "团队直通卡" : "个人直通卡"}
              </span>
              <h2 className="font-serif text-4xl tracking-tight md:text-5xl">
                {isTeam ? "提交团队信息" : "提交个人信息"}
              </h2>
              <p className="text-base leading-relaxed text-background/80">
                {isTeam
                  ? "请填写团队信息和主联系人信息。提交完成后，页面会生成一张团队直通卡。"
                  : "请填写个人信息。提交完成后，页面会生成一张个人直通卡。"}
              </p>
            </div>

            <div className="grid gap-0 border-y border-background/30">
              <div className="grid gap-3 border-b border-background/30 py-5">
                <p className="eyebrow text-background/70">步骤 01</p>
                <p className="text-lg leading-relaxed">
                  {isTeam ? "先填写团队信息和主联系人信息。" : "先填写个人信息和项目信息。"}
                </p>
              </div>
              <div className="grid gap-3 border-b border-background/30 py-5">
                <p className="eyebrow text-background/70">步骤 02</p>
                <p className="text-lg leading-relaxed">
                  提交后，页面会生成一张专属二维码。
                </p>
              </div>
              <div className="grid gap-3 py-5">
                <p className="eyebrow text-background/70">步骤 03</p>
                <p className="text-lg leading-relaxed">
                  到场后出示二维码，工作人员扫码即可核对信息。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel p-6 md:p-8">
          <div className="grid gap-8">
            <div className="grid gap-5">
              <div className="grid gap-2 border-b-4 border-foreground pb-4">
                <p className="eyebrow text-foreground">Section A</p>
                <h2 className="font-serif text-3xl tracking-tight">基础信息</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {isTeam ? (
                  <>
                    <Field label="团队名称" name="teamName" />
                    <Field label="主联系人姓名" name="contactName" />
                    <Field label="联系方式" name="contactInfo" />
                    <Field label="团队人数" name="teamSize" type="number" />
                  </>
                ) : (
                  <>
                    <Field label="姓名" name="name" />
                    <Field label="联系方式" name="contactInfo" />
                  </>
                )}
                <Field label="项目名称" name="projectName" />
                <Field label="角色" name="role" />
              </div>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-2 border-b-4 border-foreground pb-4">
                <p className="eyebrow text-foreground">Section B</p>
                <h2 className="font-serif text-3xl tracking-tight">项目说明</h2>
              </div>

              <label className="field-label">
                <span>项目一句话介绍</span>
                <textarea
                  className="field-input min-h-32 resize-y"
                  name="projectSummary"
                  required
                />
              </label>

              <label className="field-label">
                <span>备注</span>
                <textarea
                  className="field-input min-h-24 resize-y"
                  name="userNote"
                />
              </label>
            </div>

            <div className="grid gap-4 border-t-4 border-foreground pt-6 md:grid-cols-[1fr_auto] md:items-end">
              <p className="text-base leading-relaxed text-muted-foreground">
                提交后会直接生成直通卡二维码。建议先截图保存，方便现场出示。
              </p>
              <button className="primary-button" type="submit">
                生成直通卡 →
              </button>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
