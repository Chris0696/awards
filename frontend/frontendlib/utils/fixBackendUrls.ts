export function fixBackendUrl(url?: string | null): null | string {
  /*  if (!url) return "";

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
      .replace("http://backend:8000", baseUrl)
      .replace("https://backend:8000", baseUrl);
  }

  if (url.startsWith("backend")) {
    return `${baseUrl}${url.replace(/^backend/, "")}`;
  }
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  }
  return url; */
  if (!url) return null;

  // En dev (Docker), remplacer "backend:8000" par "localhost:8000"
  if (process.env.NODE_ENV === "development") {
    return url.replace("http://backend:8000", "http://localhost:8000");
  }

  // En prod, forcer le domaine officiel si besoin
  return url.replace("http://backend:8000", "https://api.monsite.com");
}
