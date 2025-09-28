import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSession, getTokens } from "./services/session";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const tokens = await getTokens();
  const session = await createSession();
  const role = session?.user_type;

  const access = tokens.access;

  if (!access) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    (role === "commercial" && pathname === "/admin/projects") ||
    (role === "commercial" && pathname === "/admin/users") ||
    (role === "commercial" && pathname === "/admin/team") ||
    (role === "commercial" && pathname === "/admin/statistics") ||
    (role === "commercial" && pathname === "/admin/categories") ||
    (role === "commercial" && pathname === "/admin/membership")
  ) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (
    (role === "owner" && pathname === "/admin/users") ||
    (role === "owner" && pathname === "/admin/team") ||
    (role === "owner" && pathname === "/admin/categories") ||
    (role === "owner" && pathname === "/admin/membership")
  ) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
