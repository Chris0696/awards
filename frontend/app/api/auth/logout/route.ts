import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const refresh = (await cookies()).get("refresh_token")?.value;
  const access = (await cookies()).get("access_token")?.value;

  if (!refresh) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.API_URL}auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
      },
      body: JSON.stringify({ refresh }),
    });

    const data = await response.json();

    const res = NextResponse.json(data, { status: response.status });
    res.cookies.set("access_token", "", { maxAge: 0, path: "/" });
    res.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
