"use client";

import { deletePassAction } from "@/actions/admin-actions";

export function AdminDeleteForm({ id }: { id: string }) {
  return (
    <form
      action={deletePassAction}
      className="grid gap-4 border-t border-background/30 pt-5"
      onSubmit={(event) => {
        if (!window.confirm("确认软删除这条记录吗？删除后将不会出现在后台列表和公开页面中。")) {
          event.preventDefault();
        }
      }}
    >
      <input name="id" type="hidden" value={id} />
      <p className="text-sm leading-relaxed text-background/80">
        软删除后，这条记录不会继续出现在后台列表或公开直通卡页面中，但数据库记录仍会保留。
      </p>
      <div className="flex justify-end">
        <button
          className="secondary-button border-background text-background hover:bg-background hover:text-foreground"
          type="submit"
        >
          删除记录 →
        </button>
      </div>
    </form>
  );
}
