"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ExternalLink, ImagePlus, Loader2, Save } from "lucide-react";
import { apiFetch } from "@/services/api";
import type { Banner } from "@/types/catalogo";

type BannerFormState = {
  titulo: string;
  subtitulo: string;
  textoBotao: string;
  linkBotao: string;
};

export function BannerManager() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [form, setForm] = useState<BannerFormState>({
    titulo: "",
    subtitulo: "",
    textoBotao: "",
    linkBotao: ""
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ banner: Banner }>("/api/admin/banner")
      .then((data) => {
        setBanner(data.banner);
        setForm({
          titulo: data.banner.titulo,
          subtitulo: data.banner.subtitulo,
          textoBotao: data.banner.textoBotao,
          linkBotao: data.banner.linkBotao
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function setField(field: keyof BannerFormState, value: string) {
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.set("titulo", form.titulo);
    formData.set("subtitulo", form.subtitulo);
    formData.set("textoBotao", form.textoBotao);
    formData.set("linkBotao", form.linkBotao);
    if (image) {
      formData.set("imagem", image);
    }

    try {
      const data = await apiFetch<{ banner: Banner }>("/api/admin/banner", {
        method: "PATCH",
        body: formData
      });
      setBanner(data.banner);
      setImage(null);
      setImagePreview("");
      setMessage("Banner atualizado com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel salvar o banner.");
    } finally {
      setSaving(false);
    }
  }

  const previewImage = imagePreview || banner?.imagem || "";

  if (loading) {
    return <div className="panel px-5 py-4 text-sm font-semibold text-graphite">Carregando banner</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-black uppercase text-lagoon">Banner principal</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Editar chamada da vitrine</h1>
        <p className="mt-2 text-sm text-slate-600">Atualize imagem, titulo, subtitulo e destino do botao exibido na pagina inicial.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <form className="panel p-5" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <label className="space-y-2">
              <span className="form-label">Titulo</span>
              <input className="form-input" value={form.titulo} onChange={(event) => setField("titulo", event.target.value)} required />
            </label>

            <label className="space-y-2">
              <span className="form-label">Subtitulo</span>
              <textarea className="form-input min-h-28 resize-y" value={form.subtitulo} onChange={(event) => setField("subtitulo", event.target.value)} required />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="form-label">Texto do botao</span>
                <input className="form-input" value={form.textoBotao} onChange={(event) => setField("textoBotao", event.target.value)} required />
              </label>

              <label className="space-y-2">
                <span className="form-label">Link do botao</span>
                <input className="form-input" value={form.linkBotao} onChange={(event) => setField("linkBotao", event.target.value)} placeholder="#produtos" required />
              </label>
            </div>

            <label className="space-y-2">
              <span className="form-label">Imagem do banner</span>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-slate-50 px-4 py-5 text-sm font-bold text-graphite transition hover:border-lagoon hover:text-lagoon">
                <ImagePlus size={18} />
                Selecionar JPG, PNG ou WebP
                <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={onImageChange} />
              </label>
              <p className="form-help">A imagem ideal tem proporcao horizontal, com ate 5MB.</p>
            </label>
          </div>

          {error ? <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}
          {message ? <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div> : null}

          <button className="btn-primary mt-5 w-full" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? "Salvando..." : "Salvar banner"}
          </button>
        </form>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-ink">Pre-visualizacao</h2>
            <a href={form.linkBotao || "#"} target={form.linkBotao.startsWith("http") ? "_blank" : undefined} className="btn-secondary px-3 py-2">
              <ExternalLink size={16} />
              Testar link
            </a>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-ink shadow-soft">
            {previewImage ? <img src={previewImage} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
            <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/58 to-ink/18" />
            <div className="relative flex min-h-[420px] max-w-2xl flex-col justify-center px-6 py-10 text-white sm:px-10">
              <span className="mb-4 w-fit rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-bold uppercase">CatalogoOra</span>
              <h3 className="text-4xl font-black leading-tight">{form.titulo || "Titulo do banner"}</h3>
              <p className="mt-5 text-base leading-7 text-white/82">{form.subtitulo || "Subtitulo exibido na pagina inicial."}</p>
              <span className="mt-8 w-fit rounded-lg bg-white px-5 py-3 text-sm font-black text-ink">{form.textoBotao || "Ver produtos"}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
