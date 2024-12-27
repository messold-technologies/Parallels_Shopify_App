import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { payload} = await authenticate.webhook(request);
    // Extract data
    const ordersRedacted = payload.orders_to_redact;
    const customerEmail = payload.customer.email;

    console.log(
      `Customer with email ${customerEmail} has redacted data for orders: ${ordersRedacted.join(", ")}`
    );

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(error.message, { status: 401 });
  }
}