import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { resolveUploadPath } from "@/utils/upload";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

export async function GET(_request: Request, { params }: { params: { filename: string } }) {
  const filename = path.basename(decodeURIComponent(params.filename));
  const extension = path.extname(filename).toLowerCase();
  const contentType = contentTypes[extension];

  if (!contentType) {
    return NextResponse.json({ error: "Tipo de imagem invalido." }, { status: 400 });
  }

  const filePath = await resolveUploadPath(filename);
  if (!filePath) {
    return NextResponse.json({ error: "Imagem nao encontrada." }, { status: 404 });
  }

  const file = await readFile(filePath);

  return new NextResponse(file, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
