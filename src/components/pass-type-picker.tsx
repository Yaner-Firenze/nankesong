import Link from "next/link";

const passTypes = [
  {
    type: "individual",
    title: "Individual Direct Pass",
    description: "Create a pass for a single builder, operator, or creator.",
  },
  {
    type: "team",
    title: "Team Direct Pass",
    description: "Create a pass for a team and its primary contact.",
  },
] as const;

export function PassTypePicker() {
  return (
    <div className="grid gap-4">
      {passTypes.map((passType) => (
        <Link
          key={passType.type}
          className="rounded-3xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-950 hover:bg-neutral-50"
          href={`/apply?type=${passType.type}`}
        >
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-950">
              {passType.title}
            </h2>
            <p className="text-sm leading-6 text-neutral-600">
              {passType.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
