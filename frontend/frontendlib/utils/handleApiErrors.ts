import { NextResponse } from "next/server";

export async function handleApiError(res: Response) {
  const contentType = res.headers.get("content-type");
  let rawData: any;

  if (contentType && contentType.includes("application/json")) {
    rawData = await res.json();
  } else {
    rawData = await res.text();
  }
  let error: any;

  if (rawData?.error || rawData?.errors) {
    error = rawData.error || rawData.errors;
  } else if (typeof rawData === "string") {
    error = { non_field_errors: [rawData] };
  } else {
    error = { non_field_errors: ["Erreur inconnue côté serveur"] };
  }

  return NextResponse.json({ error }, { status: res.status });
}
