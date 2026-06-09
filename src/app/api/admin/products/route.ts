import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { errorResponse } from "@/utils/responses";
import { saveImageFromForm, UploadError } from "@/utils/upload";
import { parseProductForm } from "@/utils/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const admin = await getAdminSession(request);
  if (!admin) {
    return errorResponse("Acesso nao autorizado.", 401);
  }

  const produtos = await prisma.produto.findMany({
    orderBy: { criadoEm: "desc" }
  });

  return NextResponse.json({ produtos });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminSession(request);
  if (!admin) {
    return errorResponse("Acesso nao autorizado.", 401);
  }

  const formData = await request.formData();
  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return errorResponse("Revise os dados do produto.", 422, parsed.error.flatten());
  }

  try {
    const imagem = await saveImageFromForm(formData);
    const produto = await prisma.produto.create({
      data: {
        ...parsed.data,
        imagem
      }
    });

    return NextResponse.json({ produto }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) {
      return errorResponse(error.message, 422);
    }

    throw error;
  }
}
