import { loginAdminAction } from "@/actions/admin-actions";

export function AdminLoginForm({ error }: { error?: string }) {
  return (
    <form action={loginAdminAction} className="panel grid gap-6 p-8">
      <div className="space-y-3">
        <p className="eyebrow">内部使用</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          管理后台登录
        </h1>
        <p className="text-sm leading-7 text-muted-foreground">
          输入后台共享密码后，可查看直通卡记录并填写内部备注。
        </p>
      </div>

      {error ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
          密码错误，请重新输入。
        </p>
      ) : null}

      <label className="field-label">
        <span>密码</span>
        <input
          className="field-input"
          name="password"
          required
          type="password"
        />
      </label>

      <button className="primary-button" type="submit">
        登录后台
      </button>
    </form>
  );
}
