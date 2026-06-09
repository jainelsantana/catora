import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";

export function Header() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const contactUrl = phone ? `https://wa.me/${phone}` : "#produtos";

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="CatalogoOra">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-sm font-black text-white">CO</span>
          <span className="text-lg font-black tracking-normal text-ink">CatalogoOra</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-graphite md:flex">
          <Link href="/#produtos" className="transition hover:text-lagoon">
            Produtos
          </Link>
          <Link href="/admin" className="transition hover:text-lagoon">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/admin" className="btn-secondary hidden px-3 py-2 sm:inline-flex" title="Area administrativa">
            <ShieldCheck size={17} />
            Admin
          </Link>
          <a href={contactUrl} className="btn-primary px-3 py-2" target={phone ? "_blank" : undefined}>
            <MessageCircle size={17} />
            Contato
          </a>
        </div>
      </div>
    </header>
  );
}
