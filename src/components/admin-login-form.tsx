import { loginAdminAction } from "@/actions/admin-actions";

export function AdminLoginForm({ error }: { error?: string }) {
  return (
    <form action={loginAdminAction} className="grid gap-5 rounded-3xl border border-neutral-200 bg-white p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          Admin Login
        </h1>
        <p className="text-sm leading-6 text-neutral-600">
          Use the shared admin password to access internal direct-pass records.
        </p>
      </div>

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Invalid password. Try again.
        </p>
      ) : null}

      <label className="grid gap-2 text-sm font-medium text-neutral-800">
        <span>Password</span>
        <input
          className="rounded-2xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-950"
          name="password"
          required
          type="password"
        />
      </label>

      <button
        className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        type="submit"
      >
        Sign In
      </button>
    </form>
  );
}
