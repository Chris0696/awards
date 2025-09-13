import { useAuthStore } from "@/stores/useAuthStore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const access = (await cookies()).get("access_token")?.value;
  const userId = req.nextUrl.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id manquant" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}auth/globalprofile/${userId}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const access = (await cookies()).get("access_token")?.value;
  try {
    const formData = await req.formData();
    const body: any = {};
    formData.forEach((value, key) => {
      body[key] = value;
    });

    const response = await fetch(
      `${process.env.API_URL}auth/globalprofile/${body.user_id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${access}`,
        },
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
