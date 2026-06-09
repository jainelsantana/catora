import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { errorResponse } from "@/utils/responses";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = await getAdminSession(request);
  if (!admin) {
    return errorResponse("Acesso nao autorizado.", 401);
  }

  const [totalProdutos, produtosAtivos, produtosInativos, categorias, recentes] = await Promise.all([
    prisma.produto.count(),
    prisma.produto.count({ where: { ativo: true } }),
    prisma.produto.count({ where: { ativo: false } }),
    prisma.produto.findMany({
      distinct: ["categoria"],
      select: { categoria: true },
      orderBy: { categoria: "asc" }
    }),
    prisma.produto.findMany({
      take: 4,
      orderBy: { criadoEm: "desc" },
      select: {
        id: true,
        nome: true,
        categoria: true,
        ativo: true,
        criadoEm: true
      }
    })
  ]);

  return NextResponse.json({
    resumo: {
      totalProdutos,
      produtosAtivos,
      produtosInativos,
      categorias: categorias.length
    },
    recentes
  });
}
