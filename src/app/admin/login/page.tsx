"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn, Mail } from "lucide-react";
import { apiFetch } from "@/services/api";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, senha })
      });
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-cloud dark:bg-slate-950 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="fixed right-4 top-4 z-20">
        <ThemeToggle />
      </div>
      <section className="hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-white text-sm font-black text-ink">CO</span>
          <div>
            <p className="text-xl font-black">CatalogoOra</p>
            <p className="text-sm text-white/64">Administracao do catalogo</p>
          </div>
        </div>
        <div className="max-w-xl">
          <p className="text-sm font-black uppercase text-emerald-200">Painel seguro</p>
          <h1 className="mt-4 text-5xl font-black leading-tight">Gerencie produtos, imagens e banner em poucos cliques.</h1>
          <p className="mt-5 text-lg leading-8 text-white/72">
            A area administrativa foi desenhada para manter a vitrine atualizada sem complicacao.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-ink text-sm font-black text-white">CO</span>
            <h1 className="mt-4 text-3xl font-black text-ink dark:text-white">CatalogoOra Admin</h1>
          </div>

          <form className="panel p-6" onSubmit={handleSubmit} autoComplete="off">
            <div>
              <p className="text-sm font-black uppercase text-lagoon">Login administrativo</p>
              <h2 className="mt-2 text-2xl font-black text-ink dark:text-white">Acesse o painel</h2>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="form-label">Email</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    className="form-input pl-11"
                    type="email"
                    name="catalogoora_login_email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Digite seu email"
                    autoComplete="off"
                    spellCheck={false}
                    required
                  />
                </span>
              </label>

              <label className="block space-y-2">
                <span className="form-label">Senha</span>
                <span className="relative block">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    className="form-input pl-11"
                    type="password"
                    name="catalogoora_login_secret"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="Digite sua senha"
                    autoComplete="new-password"
                    required
                  />
                </span>
              </label>
            </div>

            {error ? <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}

            <button className="btn-primary mt-6 w-full" disabled={loading}>
              <LogIn size={18} />
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
