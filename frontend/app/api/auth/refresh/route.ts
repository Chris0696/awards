import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const refresh = cookies().get("refresh_token")?.value;

  if (!refresh) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const res = await fetch(`${process.env.API_URL}auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Mettre à jour le cookie access_token
    const response = NextResponse.json({ access: data.access });
    response.cookies.set("access_token", data.access, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 });
  }
}
