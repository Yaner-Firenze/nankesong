import Link from "next/link";

const passTypes = [
  {
    type: "individual",
    title: "个人直通卡登记",
    description: "适合个人报名、独立参赛，或由一位联系人单独提交信息的情况。",
    scenario: "个人报名 / 单人项目 / 单一联系人",
  },
  {
    type: "team",
    title: "团队直通卡登记",
    description: "适合团队统一登记，由一位主联系人提交整支队伍的信息。",
    scenario: "团队报名 / 主联系人提交 / 集中登记",
  },
] as const;

export function PassTypePicker() {
  return (
    <div className="grid gap-0 border-t border-background/30">
      {passTypes.map((passType, index) => (
        <Link
          key={passType.type}
          className="group border-b border-background/30 px-0 py-6 text-background hover:bg-background hover:text-foreground"
          href={`/apply?type=${passType.type}`}
        >
          <div className="grid gap-5">
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.1em] opacity-70">
                {`0${index + 1}`}
              </span>
              <span className="status-pill border-current text-current">
                {passType.type === "individual" ? "个人" : "团队"}
              </span>
            </div>

            <div className="grid gap-3">
              <h3 className="font-serif text-3xl tracking-tight">
                {passType.title}
              </h3>
              <p className="text-base leading-relaxed opacity-80">
                {passType.description}
              </p>
            </div>

            <div className="grid gap-2 border-t border-current/25 pt-4">
              <p className="font-mono text-xs uppercase tracking-[0.1em] opacity-70">
                适用场景
              </p>
              <p className="text-sm leading-relaxed">{passType.scenario}</p>
            </div>

            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.1em]">
              <span>进入登记</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
