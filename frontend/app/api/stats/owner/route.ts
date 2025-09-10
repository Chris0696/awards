import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const access = (await cookies()).get("access_token")?.value;
  if (!access) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const res = await fetch(`${process.env.API_URL}dashboard/owner/`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
