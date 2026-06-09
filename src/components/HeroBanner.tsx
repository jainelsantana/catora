import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Banner } from "@/types/catalogo";
import { getImageUrl } from "@/utils/image-url";

type HeroBannerProps = {
  banner: Banner | null;
};

export function HeroBanner({ banner }: HeroBannerProps) {
  const image = getImageUrl(banner?.imagem) || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85";
  const href = banner?.linkBotao ?? "#produtos";

  return (
    <section className="container-page pt-6">
      <div className="relative min-h-[410px] overflow-hidden rounded-lg bg-ink">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/58 to-ink/16" />
        <div className="relative flex min-h-[410px] max-w-3xl flex-col justify-center px-6 py-12 text-white sm:px-10 lg:px-14">
          <span className="mb-4 w-fit rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-bold uppercase">
            CatalogoOra
          </span>
          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            {banner?.titulo ?? "Novidades selecionadas para sua vitrine"}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/86 sm:text-lg">
            {banner?.subtitulo ?? "Explore produtos com curadoria e encontre exatamente o que combina com voce."}
          </p>
          <Link href={href} className="mt-8 w-fit rounded-lg bg-white px-5 py-3 text-sm font-black text-ink transition hover:bg-emerald-50">
            <span className="inline-flex items-center gap-2">
              {banner?.textoBotao ?? "Ver produtos"}
              <ArrowRight size={18} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
