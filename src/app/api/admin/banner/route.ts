import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/utils/auth";
import { defaultBannerData } from "@/utils/defaults";
import { prisma } from "@/utils/prisma";
import { errorResponse } from "@/utils/responses";
import { removeLocalUpload, saveImageFromForm, UploadError } from "@/utils/upload";
import { parseBannerForm } from "@/utils/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getOrCreateBanner() {
  const existing = await prisma.banner.findFirst({
    orderBy: { atualizadoEm: "desc" }
  });

  if (existing) {
    return existing;
  }

  return prisma.banner.create({
    data: defaultBannerData
  });
}

export async function GET(request: NextRequest) {
  const admin = await getAdminSession(request);
  if (!admin) {
    return errorResponse("Acesso nao autorizado.", 401);
  }

  const banner = await getOrCreateBanner();
  return NextResponse.json({ banner });
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminSession(request);
  if (!admin) {
    return errorResponse("Acesso nao autorizado.", 401);
  }

  const current = await getOrCreateBanner();
  const formData = await request.formData();
  const parsed = parseBannerForm(formData);

  if (!parsed.success) {
    return errorResponse("Revise os dados do banner.", 422, parsed.error.flatten());
  }

  try {
    const novaImagem = await saveImageFromForm(formData);
    const banner = await prisma.banner.update({
      where: { id: current.id },
      data: {
        ...parsed.data,
        ...(novaImagem ? { imagem: novaImagem } : {})
      }
    });

    if (novaImagem) {
      await removeLocalUpload(current.imagem);
    }

    return NextResponse.json({ banner });
  } catch (error) {
    if (error instanceof UploadError) {
      return errorResponse(error.message, 422);
    }

    throw error;
  }
}
