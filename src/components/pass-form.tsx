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
    <form action={createPassAction} className="panel grid gap-8 p-8 sm:p-10">
      <input name="type" type="hidden" value={type} />

      <div className="space-y-4">
        <span className="status-pill">
          {isTeam ? "团队直通卡" : "个人直通卡"}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {isTeam ? "团队直通卡登记" : "个人直通卡登记"}
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          {isTeam
            ? "请填写团队基础信息与主联系人信息。提交后将生成一张可用于现场核验的团队直通卡。"
            : "请填写个人基础信息。提交后将生成一张可用于现场核验的个人直通卡。"}
        </p>
      </div>

      <div className="grid gap-6">
        <section className="panel-soft grid gap-4 p-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">基础信息</h2>
            <p className="text-sm text-muted-foreground">
              {isTeam
                ? "优先填写团队名称、联系人和项目概览。"
                : "请填写你的个人信息与项目概览。"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
        </section>

        <section className="panel-soft grid gap-4 p-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">项目说明</h2>
            <p className="text-sm text-muted-foreground">
              这部分信息会展示在核验页中，建议尽量简洁清楚。
            </p>
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
            <textarea className="field-input min-h-24 resize-y" name="userNote" />
          </label>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm leading-6 text-muted-foreground">
          提交后将立即生成专属直通卡二维码，请截图保存。
        </p>
        <button className="primary-button" type="submit">
          生成直通卡
        </button>
      </div>
    </form>
  );
}
