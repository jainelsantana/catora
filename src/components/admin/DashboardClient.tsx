"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Boxes, CheckCircle2, Clock, Image as ImageIcon, PlusCircle, Tags, XCircle } from "lucide-react";
import { apiFetch } from "@/services/api";
import { formatDate } from "@/utils/format";

type DashboardData = {
  resumo: {
    totalProdutos: number;
    produtosAtivos: number;
    produtosInativos: number;
    categorias: number;
  };
  recentes: Array<{
    id: string;
    nome: string;
    categoria: string;
    ativo: boolean;
    criadoEm: string;
  }>;
};

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<DashboardData>("/api/admin/dashboard")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>;
  }

  if (!data) {
    return <div className="panel px-5 py-4 text-sm font-semibold text-graphite">Carregando dashboard</div>;
  }

  const stats = [
    { label: "Produtos", value: data.resumo.totalProdutos, icon: Boxes, color: "text-marine" },
    { label: "Ativos", value: data.resumo.produtosAtivos, icon: CheckCircle2, color: "text-lagoon" },
    { label: "Inativos", value: data.resumo.produtosInativos, icon: XCircle, color: "text-coral" },
    { label: "Categorias", value: data.resumo.categorias, icon: Tags, color: "text-ember" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-lagoon">Visao geral</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Acompanhe o catalogo e acesse as principais acoes administrativas.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/produtos" className="btn-primary">
            <PlusCircle size={18} />
            Novo produto
          </Link>
          <Link href="/admin/banner" className="btn-secondary">
            <ImageIcon size={18} />
            Editar banner
          </Link>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="panel p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">{item.label}</p>
                <Icon className={item.color} size={22} />
              </div>
              <p className="mt-4 text-4xl font-black text-ink">{item.value}</p>
            </div>
          );
        })}
      </section>

      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-ink">Produtos recentes</h2>
            <p className="text-sm text-slate-500">Ultimos itens cadastrados no catalogo.</p>
          </div>
          <Link href="/admin/produtos" className="hidden items-center gap-1 text-sm font-black text-lagoon hover:text-ink sm:flex">
            Gerenciar <ArrowRight size={16} />
          </Link>
        </div>
        <div className="divide-y divide-line">
          {data.recentes.length > 0 ? (
            data.recentes.map((produto) => (
              <div key={produto.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-bold text-ink">{produto.nome}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={14} />
                    {produto.categoria} - {formatDate(produto.criadoEm)}
                  </p>
                </div>
                <span className={`badge ${produto.ativo ? "text-lagoon" : "text-coral"}`}>{produto.ativo ? "Ativo" : "Inativo"}</span>
              </div>
            ))
          ) : (
            <div className="px-5 py-8 text-sm text-slate-500">Nenhum produto cadastrado ainda.</div>
          )}
        </div>
      </section>
    </div>
  );
}
