"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Boxes, Image as ImageIcon, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/services/api";
import type { AdminUser } from "@/types/catalogo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Boxes },
  { href: "/admin/banner", label: "Banner", icon: ImageIcon }
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setChecking(false);
      return;
    }

    apiFetch<{ admin: AdminUser }>("/api/auth/me")
      .then((data) => setAdmin(data.admin))
      .catch(() => router.replace("/admin/login"))
      .finally(() => setChecking(false));
  }, [isLogin, router]);

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  if (isLogin) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <main className="grid min-h-screen place-items-center bg-cloud">
        <div className="panel px-6 py-5 text-sm font-semibold text-graphite">Validando sessao administrativa</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-cloud">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-line bg-white lg:block">
        <div className="flex h-20 items-center gap-3 px-6">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-sm font-black text-white">CO</span>
          <div>
            <p className="text-lg font-black text-ink">CatalogoOra</p>
            <p className="text-xs font-semibold text-slate-500">Painel administrativo</p>
          </div>
        </div>

        <nav className="space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${
                  active ? "bg-ink text-white" : "text-graphite hover:bg-slate-100 hover:text-ink"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-line bg-white/92 backdrop-blur">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-lagoon" size={22} />
              <div>
                <p className="text-sm font-black text-ink">{admin?.nome ?? "Admin"}</p>
                <p className="text-xs text-slate-500">{admin?.email}</p>
              </div>
            </div>

            <nav className="flex items-center gap-2 lg:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`grid h-10 w-10 place-items-center rounded-lg border text-sm transition ${
                      active ? "border-ink bg-ink text-white" : "border-line bg-white text-graphite"
                    }`}
                    title={item.label}
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/" className="btn-secondary px-3 py-2">
                Ver site
              </Link>
              <button className="btn-secondary px-3 py-2" onClick={logout} title="Sair">
                <LogOut size={17} />
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
