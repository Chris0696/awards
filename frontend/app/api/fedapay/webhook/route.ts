import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    if (event.object === "transaction") {
      const context = event.entity.custom_metadata.context; //would be project-awards
      const payload = {
        payment_reference: event.entity.reference,
        payment_status: event.entity.status,
        project_id: event.entity.custom_metadata.projectId,
        vote_count: event.entity.custom_metadata.voteCount,
        voter_name: event.entity.customer.firstname,
        email: event.entity.customer.email,
        country_code: "+229",
        phone: "0161117500",
        //phone: event.entity.payment_method?.number,
        external_transaction_id: event.entity.transaction_key,
      };
      if (context === "") {
        try {
          const response = await fetch(
            `${process.env.API_URL}votes/create-and-pay/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
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
            return NextResponse.json(
              { error: data },
              { status: response.status }
            );
          }

          return NextResponse.json(data, { status: 201 });
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
