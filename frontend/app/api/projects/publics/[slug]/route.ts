import { NextResponse } from "next/server";

export async function GET({ params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const response = await fetch(
      `${process.env.API_URL}public/projects/${slug}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
