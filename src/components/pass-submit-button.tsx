"use client";

import { useFormStatus } from "react-dom";

export function PassSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      aria-disabled={pending}
      className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "生成中..." : "生成直通卡 →"}
    </button>
  );
}
