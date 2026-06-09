import { NextResponse } from "next/server";
import { errorResponse } from "@/utils/responses";
import { prisma } from "@/utils/prisma";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const produto = await prisma.produto.findFirst({
    where: {
      id: params.id,
      ativo: true
    }
  });

  if (!produto) {
    return errorResponse("Produto nao encontrado.", 404);
  }

  return NextResponse.json({ produto });
}
