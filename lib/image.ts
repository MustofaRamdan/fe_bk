export function getImageUrl(path?: string | null, baseUrl?: string): string {
  if (!path) return "/no-image.png";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const api = baseUrl || process.env.NEXT_PUBLIC_API_URL || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${api}${cleanPath}`;
}
