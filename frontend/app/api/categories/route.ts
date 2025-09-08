import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.API_URL}categories/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const access = (await cookies()).get("access_token");

  try {
    const body = await req.json();
    const res = await fetch(`${process.env.API_URL}admin/categories/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access?.value}`,
      },
      body: JSON.stringify(body),
    });
    let contentType = res.headers.get("content-type");
    let data: any;
    if (contentType && contentType.includes("application/json")) {
      data = res.json();
    } else {
      data = res.text();
    }

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
