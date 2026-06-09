export function getImageUrl(image?: string | null) {
  if (!image) {
    return "";
  }

  if (image.startsWith("/uploads/")) {
    const filename = image.split("/").pop();
    return filename ? `/api/uploads/${encodeURIComponent(filename)}` : "";
  }

  return image;
}
