"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const themeKey = "catalogoora-theme";

function getInitialDarkMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getInitialDarkMode());
  }, []);

  function toggleTheme() {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.style.colorScheme = nextDark ? "dark" : "light";
    window.localStorage.setItem(themeKey, nextDark ? "dark" : "light");
    setIsDark(nextDark);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-ink transition hover:border-lagoon hover:text-lagoon dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo noturno"}
      title={isDark ? "Modo claro" : "Modo noturno"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
