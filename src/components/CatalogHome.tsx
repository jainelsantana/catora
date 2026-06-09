"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Loader2, Search, SlidersHorizontal } from "lucide-react";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductCard } from "@/components/ProductCard";
import { apiFetch } from "@/services/api";
import type { Banner, Produto } from "@/types/catalogo";

type ProductsResponse = {
  produtos: Produto[];
  categorias: string[];
};

export function CatalogHome() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [sort, setSort] = useState("recentes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ banner: Banner }>("/api/banner")
      .then((data) => setBanner(data.banner))
      .catch(() => setError("Nao foi possivel carregar o banner."));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoria) params.set("categoria", categoria);
      if (sort) params.set("sort", sort);

      setLoading(true);
      apiFetch<ProductsResponse>(`/api/products?${params.toString()}`, {
        signal: controller.signal
      })
        .then((data) => {
          setProdutos(data.produtos);
          setCategorias(data.categorias);
          setError("");
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setError("Nao foi possivel carregar os produtos.");
          }
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [search, categoria, sort]);

  const hasFilters = useMemo(() => Boolean(search || categoria || sort !== "recentes"), [search, categoria, sort]);

  return (
    <>
      <HeroBanner banner={banner} />

      <main id="produtos" className="container-page py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="badge mb-3 gap-2">
              <SlidersHorizontal size={14} />
              Catalogo online
            </span>
            <h2 className="text-3xl font-black text-ink">Produtos em destaque</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Busque por nome, filtre por categoria e abra os detalhes para conversar sobre o item.
            </p>
          </div>
          {hasFilters ? (
            <button
              className="btn-secondary w-fit px-3 py-2"
              onClick={() => {
                setSearch("");
                setCategoria("");
                setSort("recentes");
              }}
            >
              Limpar filtros
            </button>
          ) : null}
        </div>

        <div className="panel mb-8 grid gap-3 p-4 md:grid-cols-[1.4fr_0.9fr_0.9fr]">
          <label className="relative block">
            <span className="sr-only">Buscar produto</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="form-input pl-11"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome ou descricao"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Filtrar categoria</span>
            <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select className="form-input pl-11" value={categoria} onChange={(event) => setCategoria(event.target.value)}>
              <option value="">Todas as categorias</option>
              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <select className="form-input" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenacao">
            <option value="recentes">Mais recentes</option>
            <option value="nome">Nome A-Z</option>
            <option value="preco-asc">Menor preco</option>
            <option value="preco-desc">Maior preco</option>
          </select>
        </div>

        {error ? <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}

        {loading ? (
          <div className="grid min-h-[260px] place-items-center rounded-lg border border-dashed border-line bg-white">
            <div className="flex items-center gap-3 text-sm font-semibold text-graphite">
              <Loader2 className="animate-spin" size={20} />
              Carregando produtos
            </div>
          </div>
        ) : produtos.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {produtos.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        ) : (
          <div className="grid min-h-[260px] place-items-center rounded-lg border border-dashed border-line bg-white px-6 text-center">
            <div>
              <h3 className="text-xl font-black text-ink">Nenhum produto encontrado</h3>
              <p className="mt-2 text-sm text-slate-600">Tente alterar a busca ou remover os filtros ativos.</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
