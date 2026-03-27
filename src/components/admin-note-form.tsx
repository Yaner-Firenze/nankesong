import { saveInternalNoteAction } from "@/actions/admin-actions";

export function AdminNoteForm({
  id,
  internalNote,
}: {
  id: string;
  internalNote: string | null;
}) {
  return (
    <form action={saveInternalNoteAction} className="grid gap-5">
      <input name="id" type="hidden" value={id} />
      <label className="field-label text-background">
        <span>内部备注</span>
        <textarea
          className="field-input border-background text-background placeholder:text-background/60"
          defaultValue={internalNote ?? ""}
          name="internalNote"
        />
      </label>
      <div className="flex justify-end">
        <button className="secondary-button border-background text-background hover:bg-background hover:text-foreground" type="submit">
          保存备注 →
        </button>
      </div>
    </form>
  );
}
