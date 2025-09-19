import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, description } = body;

    const response = await fetch(`${process.env.FEDAPAY_API_URL}/collects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
        callback_url: "https://ton-site.com/api/fedapay/webhook",
        return_url: "https://ton-site.com/success",
        cancel_url: "https://ton-site.com/cancel",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ checkout_url: data.checkout_url });
  } catch (error) {
    console.error("FedaPay Collect Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
