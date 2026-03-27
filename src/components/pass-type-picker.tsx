import Link from "next/link";

const passTypes = [
  {
    type: "individual",
    title: "个人直通卡登记",
    description: "适用于个人项目、独立参赛者或单一联系人场景。",
  },
  {
    type: "team",
    title: "团队直通卡登记",
    description: "适用于完整团队，由主联系人统一提交团队信息。",
  },
] as const;

export function PassTypePicker() {
  return (
    <div className="grid w-full gap-4">
      {passTypes.map((passType) => (
        <Link
          key={passType.type}
          className="panel group p-6 hover:border-primary/70 hover:bg-card"
          href={`/apply?type=${passType.type}`}
        >
          <div className="flex h-full flex-col justify-between gap-8">
            <div className="space-y-3">
              <span className="status-pill">
                {passType.type === "individual" ? "个人" : "团队"}
              </span>
              <h2 className="text-xl font-semibold text-foreground">
                {passType.title}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {passType.description}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm font-medium text-primary">
              <span>进入登记</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
