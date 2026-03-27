import { saveInternalNoteAction } from "@/actions/admin-actions";

export function AdminNoteForm({
  id,
  internalNote,
}: {
  id: string;
  internalNote: string | null;
}) {
  return (
    <form action={saveInternalNoteAction} className="grid gap-3">
      <input name="id" type="hidden" value={id} />
      <label className="grid gap-2 text-sm font-medium text-neutral-800">
        <span>Internal Note</span>
        <textarea
          className="min-h-32 rounded-2xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-950"
          defaultValue={internalNote ?? ""}
          name="internalNote"
        />
      </label>
      <button
        className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        type="submit"
      >
        Save Note
      </button>
    </form>
  );
}
