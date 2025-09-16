import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const access = (await cookies()).get("access_token");

  const res = await fetch(`${process.env.API_URL}admin/owners/`, {
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

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const access = (await cookies()).get("access_token")?.value;
  if (!access) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const res = await fetch(
      `${process.env.API_URL}admin/owners/${body.id}/delete/`,
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
      { success: true, message: "Utilisateur supprimé avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
