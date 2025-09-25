import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const access = (await cookies()).get("access_token")?.value;
  try {
    const formData = await req.formData();

    const response = await fetch(
      `${process.env.API_URL}auth/register-with-payment/`,
      {
        method: "POST",

        body: formData,
      }
    );

    const contentType = response.headers.get("content-type");

    let data: any;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
