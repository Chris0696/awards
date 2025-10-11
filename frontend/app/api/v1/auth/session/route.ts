import { createSession } from "@/services/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const accessToken = req.cookies.get("access_token")?.value;

  if (accessToken) {
    return NextResponse.json({ access: accessToken });
  }
  if (refreshToken) {
    const backendRes = await fetch(`${process.env.API_URL}auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!backendRes.ok) {
      let errorData;
      try {
        errorData = await backendRes.json();
      } catch {
        errorData = { error: "Unknown error from backend" };
      }

      return NextResponse.json(
        { error: errorData.error || "Invalid refresh" },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    const { access, refresh } = data;

    const res = NextResponse.json({ access });
    res.cookies.set("access_token", access, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 15,
    });
    res.cookies.set("refresh_token", refresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 50,
    });

    return res;
  }

  return NextResponse.json({ error: "No session" }, { status: 401 });
}
