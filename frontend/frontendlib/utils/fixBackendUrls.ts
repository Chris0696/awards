/* export function fixBackendUrl(url?: string | null): string | null {
  if (!url) return null;

  if (process.env.NODE_ENV === "development") {
    return url.replace("http://backend:8000", "http://localhost:8000");
  }

  let fixedUrl = url.replace("http://backend:8000", "https://api.monsite.com");

 
  fixedUrl = fixedUrl.replace(/^http:\/\//, "https://");

  
  return fixedUrl;
}
 */

export function fixBackendUrl(url?: string | null): string | null {
  if (!url) return null;

  const isProd = process.env.NODE_ENV === "production";
  const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_URL;
  let fixedUrl = url.replace("http://backend:8000", mediaBaseUrl || "");
  if (isProd && fixedUrl.startsWith("http://")) {
    fixedUrl = fixedUrl.replace("http://", "https://");
  }

  return fixedUrl;
}
