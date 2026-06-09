import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "CatalogoOra",
  description: "Catalogo online moderno para produtos, vitrines e administradores."
};

const themeScript = `
  try {
    const theme = localStorage.getItem("catalogoora-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = theme ? theme === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldUseDark);
    document.documentElement.style.colorScheme = shouldUseDark ? "dark" : "light";
  } catch (_) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
