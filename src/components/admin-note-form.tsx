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
      <label className="field-label">
        <span>内部备注</span>
        <textarea
          className="field-input min-h-32 resize-y"
          defaultValue={internalNote ?? ""}
          name="internalNote"
        />
      </label>
      <button className="primary-button" type="submit">
        保存备注
      </button>
    </form>
  );
}
