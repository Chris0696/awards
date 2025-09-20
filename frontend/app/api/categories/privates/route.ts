import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
  return NextResponse.json(data.data, { status: res.status });
}

export async function PATCH(req: NextRequest) {
  const access = (await cookies()).get("access_token")?.value;
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.API_URL}admin/categories/${body.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ category_name: body.category_name }),
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

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const access = (await cookies()).get("access_token")?.value;
  if (!access) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const res = await fetch(
      `${process.env.API_URL}admin/categories/${body.category_id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    let data: any;
    try {
      data = await res.json();
    } catch {
      data = await res.text();
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: data || "Erreur lors de la suppression" },
        { status: res.status }
      );
    }

    return NextResponse.json(
      { success: true, message: "Catégorie supprimée avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
