"use client";

import { useFormStatus } from "react-dom";

export function PassSubmitButton({
  idleLabel = "生成直通卡 →",
  pendingLabel = "生成中...",
}: {
  idleLabel?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-disabled={pending}
      className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
