"use client";
export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Deu ruim por aqui</h1>
      <p className="mt-2 text-neutral-600">
        {error.message || "Tenta novamente."}
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50"
      >
        Tentar de novo
      </button>
    </main>
  );
}
