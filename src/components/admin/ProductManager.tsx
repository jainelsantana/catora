"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Edit3, ImagePlus, Loader2, PlusCircle, Save, Trash2, X } from "lucide-react";
import { apiFetch } from "@/services/api";
import type { Produto } from "@/types/catalogo";
import { formatCurrency } from "@/utils/format";
import { getImageUrl } from "@/utils/image-url";

type ProductFormState = {
  nome: string;
  descricaoCurta: string;
  descricaoCompleta: string;
  preco: string;
  categoria: string;
  ativo: boolean;
};

const emptyForm: ProductFormState = {
  nome: "",
  descricaoCurta: "",
  descricaoCompleta: "",
  preco: "",
  categoria: "",
  ativo: true
};

function formFromProduct(produto: Produto): ProductFormState {
  return {
    nome: produto.nome,
    descricaoCurta: produto.descricaoCurta,
    descricaoCompleta: produto.descricaoCompleta,
    preco: produto.preco === null ? "" : String(produto.preco),
    categoria: produto.categoria,
    ativo: produto.ativo
  };
}

function appendProductFields(formData: FormData, form: ProductFormState) {
  formData.set("nome", form.nome);
  formData.set("descricaoCurta", form.descricaoCurta);
  formData.set("descricaoCompleta", form.descricaoCompleta);
  formData.set("preco", form.preco);
  formData.set("categoria", form.categoria);
  formData.set("ativo", String(form.ativo));
}

export function ProductManager() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const categorias = useMemo(() => Array.from(new Set(produtos.map((produto) => produto.categoria))).sort(), [produtos]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await apiFetch<{ produtos: Produto[] }>("/api/admin/products");
      setProdutos(data.produtos);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }

  function setField(field: keyof ProductFormState, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function onImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImage(file);

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(file ? URL.createObjectURL(file) : "");
  }

  function startEdit(produto: Produto) {
    setEditing(produto);
    setForm(formFromProduct(produto));
    setImage(null);
    setImagePreview("");
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setImage(null);
    setImagePreview("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    appendProductFields(formData, form);
    if (image) {
      formData.set("imagem", image);
    }

    try {
      await apiFetch(editing ? `/api/admin/products/${editing.id}` : "/api/admin/products", {
        method: editing ? "PATCH" : "POST",
        body: formData
      });
      setMessage(editing ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel salvar o produto.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(produto: Produto) {
    const formData = new FormData();
    appendProductFields(formData, {
      ...formFromProduct(produto),
      ativo: !produto.ativo
    });

    try {
      await apiFetch(`/api/admin/products/${produto.id}`, {
        method: "PATCH",
        body: formData
      });
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel alterar o status.");
    }
  }

  async function removeProduct(produto: Produto) {
    const confirmed = window.confirm(`Excluir "${produto.nome}"? Esta acao nao pode ser desfeita.`);
    if (!confirmed) return;

    try {
      await apiFetch(`/api/admin/products/${produto.id}`, { method: "DELETE" });
      if (editing?.id === produto.id) {
        resetForm();
      }
      await loadProducts();
      setMessage("Produto excluido.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel excluir o produto.");
    }
  }

  const preview = imagePreview || getImageUrl(editing?.imagem) || "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-lagoon">Produtos</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Gerenciar catalogo</h1>
          <p className="mt-2 text-sm text-slate-600">Cadastre, edite, remova e altere a visibilidade dos produtos.</p>
        </div>
        <button className="btn-secondary w-fit" onClick={resetForm}>
          <PlusCircle size={18} />
          Novo cadastro
        </button>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="panel p-5" onSubmit={handleSubmit}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-ink">{editing ? "Editar produto" : "Cadastrar produto"}</h2>
              <p className="text-sm text-slate-500">{editing ? editing.nome : "Preencha os dados para publicar no catalogo."}</p>
            </div>
            {editing ? (
              <button type="button" className="grid h-10 w-10 place-items-center rounded-lg border border-line text-graphite hover:text-coral" onClick={resetForm} title="Cancelar edicao">
                <X size={18} />
              </button>
            ) : null}
          </div>

          <div className="grid gap-4">
            <label className="space-y-2">
              <span className="form-label">Nome do produto</span>
              <input className="form-input" value={form.nome} onChange={(event) => setField("nome", event.target.value)} required />
            </label>

            <label className="space-y-2">
              <span className="form-label">Descricao curta</span>
              <textarea className="form-input min-h-24 resize-y" value={form.descricaoCurta} onChange={(event) => setField("descricaoCurta", event.target.value)} required />
            </label>

            <label className="space-y-2">
              <span className="form-label">Descricao completa</span>
              <textarea className="form-input min-h-36 resize-y" value={form.descricaoCompleta} onChange={(event) => setField("descricaoCompleta", event.target.value)} required />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="form-label">Preco opcional</span>
                <input className="form-input" type="number" min="0" step="0.01" value={form.preco} onChange={(event) => setField("preco", event.target.value)} placeholder="0,00" />
              </label>

              <label className="space-y-2">
                <span className="form-label">Categoria</span>
                <input className="form-input" value={form.categoria} onChange={(event) => setField("categoria", event.target.value)} list="categorias" required />
                <datalist id="categorias">
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria} />
                  ))}
                </datalist>
              </label>
            </div>

            <label className="space-y-2">
              <span className="form-label">Imagem</span>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-slate-50 px-4 py-5 text-sm font-bold text-graphite transition hover:border-lagoon hover:text-lagoon">
                <ImagePlus size={18} />
                Selecionar JPG, PNG ou WebP
                <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={onImageChange} />
              </label>
              <p className="form-help">Limite de 5MB por imagem.</p>
            </label>

            {preview ? <img src={preview} alt="Previa do produto" className="h-44 w-full rounded-lg object-cover" /> : null}

            <label className="flex items-center justify-between gap-4 rounded-lg border border-line bg-white px-4 py-3">
              <span>
                <span className="block text-sm font-bold text-ink">Produto ativo</span>
                <span className="block text-xs text-slate-500">Produtos inativos nao aparecem na vitrine publica.</span>
              </span>
              <input className="h-5 w-5 accent-lagoon" type="checkbox" checked={form.ativo} onChange={(event) => setField("ativo", event.target.checked)} />
            </label>
          </div>

          {error ? <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}
          {message ? <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div> : null}

          <button className="btn-primary mt-5 w-full" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? "Salvando..." : editing ? "Salvar alteracoes" : "Cadastrar produto"}
          </button>
        </form>

        <section className="panel overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-xl font-black text-ink">Produtos cadastrados</h2>
            <p className="text-sm text-slate-500">{produtos.length} produto(s) no banco de dados.</p>
          </div>

          {loading ? (
            <div className="grid min-h-[360px] place-items-center text-sm font-semibold text-graphite">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Carregando produtos
              </span>
            </div>
          ) : produtos.length > 0 ? (
            <div className="divide-y divide-line">
              {produtos.map((produto) => (
                <article key={produto.id} className="grid gap-4 p-4 sm:grid-cols-[112px_1fr]">
                  <div className="h-28 overflow-hidden rounded-lg bg-slate-100">
                    {getImageUrl(produto.imagem) ? <img src={getImageUrl(produto.imagem)} alt={produto.nome} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-ink">{produto.nome}</h3>
                        <p className="mt-1 text-sm text-slate-500">{produto.categoria} - {formatCurrency(produto.preco)}</p>
                      </div>
                      <span className={`badge ${produto.ativo ? "text-lagoon" : "text-coral"}`}>{produto.ativo ? "Ativo" : "Inativo"}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{produto.descricaoCurta}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="btn-secondary px-3 py-2" onClick={() => startEdit(produto)}>
                        <Edit3 size={16} />
                        Editar
                      </button>
                      <button className="btn-secondary px-3 py-2" onClick={() => toggleActive(produto)}>
                        <CheckCircle2 size={16} />
                        {produto.ativo ? "Desativar" : "Ativar"}
                      </button>
                      <button className="btn-danger px-3 py-2" onClick={() => removeProduct(produto)}>
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid min-h-[360px] place-items-center px-6 text-center text-sm text-slate-500">
              Nenhum produto cadastrado ainda.
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
