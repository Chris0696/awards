import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function GET() {
  const access = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}admin/users/commercial/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data.data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const access = (await cookies()).get("access_token")?.value;

  try {
    const body = await req.json();
    const res = await fetch(`${process.env.API_URL}admin/users/commercial/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
