// lib/apiClient.ts
let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const headers: HeadersInit = {
    ...(init.headers || {}),
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  };

  let res = await fetch(`${process.env.API_URL}${input}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    // tente un refresh
    const refreshed = await refreshToken();
    if (!refreshed) {
      window.location.href = "/login";
      return res;
    }
    // retry
    res = await fetch(`${process.env.API_URL}${input}`, {
      ...init,
      headers: { ...headers, Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });
  }

  return res;
}

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch("/auth/refresh", { method: "POST" });
    if (!res.ok) return false;
    const data = await res.json();
    setAccessToken(data.access);
    return true;
  } catch {
    return false;
  }
}
