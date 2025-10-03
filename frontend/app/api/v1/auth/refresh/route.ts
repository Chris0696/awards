import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const backendRes = await fetch(`${process.env.API_URL}auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!backendRes.ok) {
      return NextResponse.json({ error: "Invalid refresh" }, { status: 401 });
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
  } catch (err) {
    console.error("Refresh handler failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
