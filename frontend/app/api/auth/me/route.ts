import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  full_name: string;
  email: string;
  username: string;
  user_type: string;
}

export async function GET() {
  const access = (await cookies()).get("access_token")?.value;

  if (!access) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwtDecode<JwtPayload>(access);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    return NextResponse.json({
      user_id: decoded.user_id,
      email: decoded.email,
      full_name: decoded.full_name,
      username: decoded.username,
      user_type: decoded.user_type,
    });
  } catch (err) {
    console.error("JWT decode error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
}
