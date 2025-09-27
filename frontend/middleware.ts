import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokens } from "./services/session";

export async function middleware(req: NextRequest) {
  //const access = req.cookies.get("access_token")?.value;
  const tokens = await getTokens();
  const access = tokens.access;

  if (!access) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
