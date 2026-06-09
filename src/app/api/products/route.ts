import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const categoria = searchParams.get("categoria")?.trim();
  const sort = searchParams.get("sort") ?? "recentes";

  const orderBy =
    sort === "nome"
      ? [{ nome: "asc" as const }]
      : sort === "preco-asc"
        ? [{ preco: "asc" as const }, { nome: "asc" as const }]
        : sort === "preco-desc"
          ? [{ preco: "desc" as const }, { nome: "asc" as const }]
          : [{ criadoEm: "desc" as const }];

  const where = {
    ativo: true,
    ...(categoria ? { categoria } : {}),
    ...(search
      ? {
          OR: [
            { nome: { contains: search } },
            { descricaoCurta: { contains: search } },
            { categoria: { contains: search } }
          ]
        }
      : {})
  };

  const [produtos, categoriasRaw] = await Promise.all([
    prisma.produto.findMany({
      where,
      orderBy
    }),
    prisma.produto.findMany({
      where: { ativo: true },
      distinct: ["categoria"],
      select: { categoria: true },
      orderBy: { categoria: "asc" }
    })
  ]);

  return NextResponse.json({
    produtos,
    categorias: categoriasRaw.map((item) => item.categoria)
  });
}
