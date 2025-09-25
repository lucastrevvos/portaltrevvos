export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-neutral-600">
        O link pode ter mudado. Volte para a{" "}
        <a className="underline" href="/">
          home
        </a>
        .
      </p>
    </main>
  );
}
