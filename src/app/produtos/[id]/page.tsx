import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Tag } from "lucide-react";
import { Header } from "@/components/Header";
import { prisma } from "@/utils/prisma";
import { formatCurrency } from "@/utils/format";
import { getImageUrl } from "@/utils/image-url";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const produto = await prisma.produto.findFirst({
    where: {
      id: params.id,
      ativo: true
    }
  });

  if (!produto) {
    notFound();
  }

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const imageUrl = getImageUrl(produto.imagem);
  const whatsapp = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Ola! Tenho interesse no produto ${produto.nome}.`)}`
    : null;

  return (
    <>
      <Header />
      <main className="container-page py-8">
        <Link href="/#produtos" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-graphite transition hover:text-lagoon dark:text-slate-200 dark:hover:text-emerald-300">
          <ArrowLeft size={18} />
          Voltar para produtos
        </Link>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            {imageUrl ? (
              <img src={imageUrl} alt={produto.nome} className="aspect-[4/3] h-full w-full object-cover" />
            ) : (
              <div className="grid aspect-[4/3] place-items-center bg-slate-100 text-sm font-semibold text-graphite dark:bg-slate-800 dark:text-slate-300">Sem imagem</div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="badge mb-4 w-fit gap-2">
              <Tag size={15} />
              {produto.categoria}
            </span>
            <h1 className="text-4xl font-black leading-tight text-ink dark:text-white">{produto.nome}</h1>
            <p className="mt-4 text-lg font-black text-lagoon">{formatCurrency(produto.preco)}</p>
            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">{produto.descricaoCompleta}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {whatsapp ? (
                <a href={whatsapp} target="_blank" className="btn-primary">
                  <MessageCircle size={18} />
                  Falar sobre este produto
                </a>
              ) : null}
              <Link href="/#produtos" className="btn-secondary">
                Ver mais produtos
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
