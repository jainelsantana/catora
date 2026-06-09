import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { errorResponse } from "@/utils/responses";
import { removeLocalUpload, saveImageFromForm, UploadError } from "@/utils/upload";
import { parseProductForm } from "@/utils/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminSession(request);
  if (!admin) {
    return errorResponse("Acesso nao autorizado.", 401);
  }

  const produto = await prisma.produto.findUnique({
    where: { id: params.id }
  });

  if (!produto) {
    return errorResponse("Produto nao encontrado.", 404);
  }

  return NextResponse.json({ produto });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminSession(request);
  if (!admin) {
    return errorResponse("Acesso nao autorizado.", 401);
  }

  const existing = await prisma.produto.findUnique({
    where: { id: params.id }
  });

  if (!existing) {
    return errorResponse("Produto nao encontrado.", 404);
  }

  const formData = await request.formData();
  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return errorResponse("Revise os dados do produto.", 422, parsed.error.flatten());
  }

  try {
    const novaImagem = await saveImageFromForm(formData);
    const produto = await prisma.produto.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        ...(novaImagem ? { imagem: novaImagem } : {})
      }
    });

    if (novaImagem) {
      await removeLocalUpload(existing.imagem);
    }

    return NextResponse.json({ produto });
  } catch (error) {
    if (error instanceof UploadError) {
      return errorResponse(error.message, 422);
    }

    throw error;
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminSession(request);
  if (!admin) {
    return errorResponse("Acesso nao autorizado.", 401);
  }

  const produto = await prisma.produto.findUnique({
    where: { id: params.id }
  });

  if (!produto) {
    return errorResponse("Produto nao encontrado.", 404);
  }

  await prisma.produto.delete({
    where: { id: params.id }
  });
  await removeLocalUpload(produto.imagem);

  return NextResponse.json({ ok: true });
}
