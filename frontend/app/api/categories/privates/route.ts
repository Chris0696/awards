import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const access = (await cookies()).get("access_token");

  const res = await fetch(`${process.env.API_URL}admin/categories/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access?.value}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
