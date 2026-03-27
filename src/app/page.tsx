export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-24">
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          Nankesong S2
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
          Direct pass flow is being built.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-neutral-600">
          This app will collect individual and team pass information, generate a
          unique QR code after submission, and provide an admin area for internal
          notes.
        </p>
      </section>
    </main>
  );
}
