import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  user_id: number;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  exp?: number;
  [key: string]: any;
}

export async function GET() {
  const access = await cookies().get("access_token")?.value;

  if (!access) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwtDecode<JwtPayload>(access);

    // Vérifier expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    return NextResponse.json({
      user_id: decoded.user_id,
      email: decoded.email,
      is_staff: decoded.is_staff ?? false,
      is_superuser: decoded.is_superuser ?? false,
    });
  } catch (err) {
    console.error("JWT decode error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
}
