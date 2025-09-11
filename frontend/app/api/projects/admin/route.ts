import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const access = (await cookies()).get("access_token")?.value;

  if (!access) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.API_URL}admin/projects/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const access = (await cookies()).get("access_token")?.value;
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.API_URL}admin/projects/${body.project_id}/update/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(body),
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
