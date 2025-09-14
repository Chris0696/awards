export function fixBackendUrl(url?: string | null): null | string {
  if (!url) return null;
  if (process.env.NODE_ENV === "development") {
    return url.replace("http://backend:8000", "http://localhost:8000");
  }

  return url.replace("http://backend:8000", "https://api.monsite.com");
}
