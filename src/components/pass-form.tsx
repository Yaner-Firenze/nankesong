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
    <label className="grid gap-2 text-sm font-medium text-neutral-800">
      <span>{label}</span>
      <input
        className="rounded-2xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-950"
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
    <form action={createPassAction} className="grid gap-5 rounded-3xl border border-neutral-200 bg-white p-6">
      <input name="type" type="hidden" value={type} />

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          {isTeam ? "Team Direct Pass" : "Individual Direct Pass"}
        </h1>
        <p className="text-sm leading-6 text-neutral-600">
          {isTeam
            ? "Submit the team and primary contact details to generate a pass."
            : "Submit the individual details to generate a pass."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {isTeam ? (
          <>
            <Field label="Team Name" name="teamName" />
            <Field label="Contact Name" name="contactName" />
            <Field label="Contact Info" name="contactInfo" />
            <Field label="Team Size" name="teamSize" type="number" />
          </>
        ) : (
          <>
            <Field label="Name" name="name" />
            <Field label="Contact Info" name="contactInfo" />
          </>
        )}
        <Field label="Project Name" name="projectName" />
        <Field label="Role" name="role" />
      </div>

      <label className="grid gap-2 text-sm font-medium text-neutral-800">
        <span>Project Summary</span>
        <textarea
          className="min-h-32 rounded-2xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-950"
          name="projectSummary"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-neutral-800">
        <span>Note</span>
        <textarea
          className="min-h-24 rounded-2xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-950"
          name="userNote"
        />
      </label>

      <button
        className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        type="submit"
      >
        Generate Direct Pass
      </button>
    </form>
  );
}
