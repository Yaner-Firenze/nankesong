import Link from "next/link";
import { redirect } from "next/navigation";

import { PassForm } from "@/components/pass-form";

type PassType = "individual" | "team";

function isPassType(value: string | string[] | undefined): value is PassType {
  return value === "individual" || value === "team";
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>;
}) {
  const params = await searchParams;
  const type = params.type;

  if (!isPassType(type)) {
    redirect("/");
  }

  return (
    <main className="page-shell" id="main-content">
      <section className="page-rule-heavy grid gap-8">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
          <div className="grid gap-3">
            <p className="eyebrow">填写说明</p>
            <h1 className="section-title">
              {type === "team" ? "团队直通卡登记" : "个人直通卡登记"}
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed">
              请按页面提示填写信息。提交完成后，页面会生成一张专属直通卡二维码，在南客松 S2 报名时投递即可。
            </p>
          </div>
          <Link className="ghost-button" href="/">
            返回入口
          </Link>
        </div>

        <PassForm submissionKey={crypto.randomUUID()} type={type} />
      </section>
    </main>
  );
}
