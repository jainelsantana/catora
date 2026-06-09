import { randomUUID } from "crypto";
import { access, mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const configuredUploadDir = process.env.UPLOAD_DIR ?? "storage/uploads";
export const uploadDir = path.isAbsolute(configuredUploadDir)
  ? configuredUploadDir
  : path.join(process.cwd(), configuredUploadDir);
export const legacyPublicUploadDir = path.join(process.cwd(), "public", "uploads");
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

  return `/api/uploads/${filename}`;
}

export async function removeLocalUpload(image?: string | null) {
  const filename = getUploadFilename(image);
  if (!filename) {
    return;
  }

  try {
    await unlink(path.join(uploadDir, filename));
  } catch {
    // The database should remain authoritative even if an old file is already gone.
  }
}

export function getUploadFilename(image?: string | null) {
  if (!image) {
    return null;
  }

  if (image.startsWith("/api/uploads/")) {
    return path.basename(image.replace("/api/uploads/", ""));
  }

  if (image.startsWith("/uploads/")) {
    return path.basename(image.replace("/uploads/", ""));
  }

  return null;
}

export async function resolveUploadPath(filename: string) {
  const safeFilename = path.basename(filename);
  const candidates = [
    path.join(uploadDir, safeFilename),
    path.join(legacyPublicUploadDir, safeFilename)
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next known upload location.
    }
  }

  return null;
}
