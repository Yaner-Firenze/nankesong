import { PassTypePicker } from "@/components/pass-type-picker";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-24">
      <section className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div className="space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-neutral-500">
            Nankesong S2
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
            Nankesong S2 Direct Pass
          </h1>
          <p className="max-w-2xl text-base leading-7 text-neutral-600">
            Register an individual or team direct pass, submit key project
            details, and receive a unique QR-backed pass page for manual review.
          </p>
        </div>
        <PassTypePicker />
      </section>
    </main>
  );
}
