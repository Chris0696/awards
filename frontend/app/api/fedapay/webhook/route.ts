import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    if (event.object === "transaction") {
      const payload = {
        reference: event.entity.reference,
        status: event.entity.status,
        context: event.entity.custom_metadata.context, //would be project-awards
        projectId: event.entity.custom_metadata.projectId,
        voteCount: event.entity.custom_metadata.voteCount,
        fullname: event.entity.customer.firstname,
        email: event.entity.customer.email,
        phoneNumber: event.entity.payment_method?.number,
        transactionKey: event.entity.transaction_key,
      };

      // TODO: marquer la commande comme payée dans ta DB
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
