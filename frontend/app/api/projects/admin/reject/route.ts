import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const access = (await cookies()).get("access_token")?.value;
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.API_URL}admin/projects/${body.project_id}/reject_project/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ admin_comment: body.admin_comment }),
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
