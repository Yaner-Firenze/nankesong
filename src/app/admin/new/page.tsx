import Link from "next/link";

import { PassForm } from "@/components/pass-form";
import { requireAdmin } from "@/lib/admin-auth";

type PassType = "individual" | "team";

function getType(value: string | string[] | undefined): PassType {
  return value === "team" ? "team" : "individual";
}

export default async function AdminNewPassPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[]; type?: string | string[] }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const type = getType(params.type);
  const error = typeof params.error === "string" ? params.error : undefined;

  return (
    <main className="page-shell" id="main-content">
      <section className="page-rule-heavy grid gap-8">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
          <div className="grid gap-3">
            <p className="eyebrow">活动方后台</p>
            <h1 className="section-title">新建直通卡</h1>
            <p className="max-w-3xl text-lg leading-relaxed">
              请在确认直通资格后录入信息。创建完成后，这张直通卡会立即生效，并可直接发给对应个人或团队。
            </p>
          </div>
          <Link className="ghost-button" href="/admin">
            返回后台
          </Link>
        </div>

        <div className="grid gap-3 border-y-2 border-foreground py-5 md:grid-cols-2">
          <Link
            aria-current={type === "individual" ? "page" : undefined}
            className={
              type === "individual" ? "primary-button justify-center text-center" : "secondary-button justify-center text-center"
            }
            href="/admin/new?type=individual"
          >
            个人直通卡
          </Link>
          <Link
            aria-current={type === "team" ? "page" : undefined}
            className={
              type === "team" ? "primary-button justify-center text-center" : "secondary-button justify-center text-center"
            }
            href="/admin/new?type=team"
          >
            团队直通卡
          </Link>
        </div>

        {error === "validation" ? (
          <p className="border-2 border-foreground bg-foreground px-4 py-3 text-sm text-background">
            提交失败，请检查必填项、身份证号码格式，以及团队成员人数后再试。
          </p>
        ) : null}

        <PassForm mode="admin" submissionKey={crypto.randomUUID()} type={type} />
      </section>
    </main>
  );
}
