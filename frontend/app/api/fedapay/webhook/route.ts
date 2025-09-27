import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    if (event.object === "transaction") {
      const context = event.entity.custom_metadata?.context; //would be project-awards
      /*  const payload = {
        payment_reference: event.entity.reference,
        payment_status: event.entity.status,
        project_id: event.entity.custom_metadata.projectId,
        vote_count: event.entity.custom_metadata.voteCount,
        voter_name: event.entity.customer.firstname,
        voter_email: event.entity.customer.email,
        phone: "0161117500",
        payment_method: "mtn",
        //phone: event.entity.payment_method?.number,
        external_transaction_id: event.entity.transaction_key
          ? event.entity.transaction_key
          : "",
      }; */
      console.log(event, "payload tests context");
      const formData = new FormData();

      /*  if (context && context === "project-awards") {
        try {
          const response = await fetch(
            `${process.env.API_URL}votes/create-and-pay/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const contentType = response.headers.get("content-type");
          const data = contentType?.includes("application/json")
            ? await response.json()
            : await response.text();

          if (!response.ok) {
            console.error(" Backend rejected:", response.status, data);
          } else {
            console.log(" Backend success:", data);
          }
        } catch (error: any) {
          console.error(" Backend fetch failed:", error);
        }
      } */
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
