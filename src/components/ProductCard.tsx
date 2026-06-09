import Link from "next/link";
import { MessageCircle, Tag } from "lucide-react";
import type { Produto } from "@/types/catalogo";
import { formatCurrency } from "@/utils/format";

type ProductCardProps = {
  produto: Produto;
};

export function ProductCard({ produto }: ProductCardProps) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsapp = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Ola! Tenho interesse no produto ${produto.nome}.`)}`
    : undefined;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/produtos/${produto.id}`} className="block aspect-[4/3] overflow-hidden bg-slate-100">
        {produto.imagem ? (
          <img src={produto.imagem} alt={produto.nome} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-slate-100 to-emerald-50 text-sm font-semibold text-graphite">
            Sem imagem
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="badge gap-1">
            <Tag size={14} />
            {produto.categoria}
          </span>
          <span className="text-sm font-black text-lagoon">{formatCurrency(produto.preco)}</span>
        </div>
        <h2 className="text-lg font-black text-ink">{produto.nome}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{produto.descricaoCurta}</p>

        <div className="mt-auto flex gap-2 pt-5">
          <Link href={`/produtos/${produto.id}`} className="btn-secondary flex-1 px-3 py-2">
            Detalhes
          </Link>
          {whatsapp ? (
            <a href={whatsapp} target="_blank" className="btn-primary px-3 py-2" title="Chamar no WhatsApp">
              <MessageCircle size={17} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
