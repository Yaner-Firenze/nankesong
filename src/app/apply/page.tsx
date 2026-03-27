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
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <PassForm type={type} />
    </main>
  );
}
