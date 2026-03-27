import { loginAdminAction } from "@/actions/admin-actions";

export function AdminLoginForm({ error }: { error?: string }) {
  return (
    <form action={loginAdminAction} className="grid gap-6 border-y-8 border-foreground py-8">
      <div className="grid gap-3">
        <p className="eyebrow">活动方后台</p>
        <h1 className="section-title">管理后台登录</h1>
        <p className="text-lg leading-relaxed">
          请输入后台密码。登录后可查看直通卡记录，并补充内部备注。
        </p>
      </div>

      {error ? (
        <p className="border-2 border-foreground bg-foreground px-4 py-3 text-sm text-background">
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

      <div className="grid gap-3 border-t-2 border-foreground pt-5">
        <p className="text-base leading-relaxed text-muted-foreground">
          后台备注仅供活动方内部查看，不会显示在公开核验页。
        </p>
      </div>

      <div className="flex justify-end">
        <button className="primary-button" type="submit">
          登录后台 →
        </button>
      </div>
    </form>
  );
}
