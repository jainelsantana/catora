import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-cloud px-4 text-center dark:bg-slate-950">
      <div>
        <p className="text-sm font-black uppercase text-lagoon">404</p>
        <h1 className="mt-2 text-3xl font-black text-ink dark:text-white">Pagina nao encontrada</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">O item solicitado nao existe ou nao esta disponivel.</p>
        <Link href="/" className="btn-primary mt-6">
          Voltar ao catalogo
        </Link>
      </div>
    </main>
  );
}
