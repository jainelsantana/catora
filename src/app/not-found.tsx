import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-cloud px-4 text-center">
      <div>
        <p className="text-sm font-black uppercase text-lagoon">404</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Pagina nao encontrada</h1>
        <p className="mt-3 text-slate-600">O item solicitado nao existe ou nao esta disponivel.</p>
        <Link href="/" className="btn-primary mt-6">
          Voltar ao catalogo
        </Link>
      </div>
    </main>
  );
}
