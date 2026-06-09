import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const maxSize = 5 * 1024 * 1024;
const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

export class UploadError extends Error {}

export async function saveImageFromForm(formData: FormData, fieldName = "imagem") {
  const file = formData.get(fieldName);

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  const extension = allowedTypes[file.type];
  if (!extension) {
    throw new UploadError("Envie uma imagem JPG, PNG ou WebP.");
  }

  if (file.size > maxSize) {
    throw new UploadError("A imagem deve ter no maximo 5MB.");
  }

  await mkdir(uploadDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);

  return `/uploads/${filename}`;
}

export async function removeLocalUpload(image?: string | null) {
  if (!image || !image.startsWith("/uploads/")) {
    return;
  }

  const filename = path.basename(image);
  try {
    await unlink(path.join(uploadDir, filename));
  } catch {
    // The database should remain authoritative even if an old file is already gone.
  }
}
