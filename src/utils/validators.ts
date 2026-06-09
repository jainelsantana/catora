import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um email valido."),
  senha: z.string().min(6, "Informe sua senha.")
});

const productSchema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto.").max(120),
  descricaoCurta: z.string().trim().min(8, "Descreva o produto em poucas palavras.").max(220),
  descricaoCompleta: z.string().trim().min(20, "A descricao completa precisa de mais detalhes.").max(3000),
  preco: z.number().min(0, "O preco nao pode ser negativo.").nullable(),
  categoria: z.string().trim().min(2, "Informe uma categoria.").max(80),
  ativo: z.boolean()
});

const bannerSchema = z.object({
  titulo: z.string().trim().min(4, "Informe um titulo para o banner.").max(120),
  subtitulo: z.string().trim().min(12, "Informe um subtitulo para o banner.").max(280),
  textoBotao: z.string().trim().min(2, "Informe o texto do botao.").max(40),
  linkBotao: z
    .string()
    .trim()
    .min(1, "Informe o link do botao.")
    .max(220)
    .refine(
      (value) => value.startsWith("/") || value.startsWith("#") || /^https?:\/\//.test(value),
      "Use um link relativo, ancora ou URL http(s)."
    )
});

export type ProductInput = z.infer<typeof productSchema>;
export type BannerInput = z.infer<typeof bannerSchema>;

function getText(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function getPrice(formData: FormData) {
  const raw = getText(formData, "preco").replace(",", ".");
  if (!raw) {
    return null;
  }

  const value = Number(raw);
  return Number.isFinite(value) ? value : Number.NaN;
}

function getBoolean(formData: FormData, field: string) {
  const raw = formData.get(field);
  return raw === "true" || raw === "on" || raw === "1";
}

export function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    nome: getText(formData, "nome"),
    descricaoCurta: getText(formData, "descricaoCurta"),
    descricaoCompleta: getText(formData, "descricaoCompleta"),
    preco: getPrice(formData),
    categoria: getText(formData, "categoria"),
    ativo: getBoolean(formData, "ativo")
  });
}

export function parseBannerForm(formData: FormData) {
  return bannerSchema.safeParse({
    titulo: getText(formData, "titulo"),
    subtitulo: getText(formData, "subtitulo"),
    textoBotao: getText(formData, "textoBotao"),
    linkBotao: getText(formData, "linkBotao")
  });
}
