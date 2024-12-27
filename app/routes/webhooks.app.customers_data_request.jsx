import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
 // Pass the cloned request to authenticate.webhook
    const { payload } = await authenticate.webhook(request);

    // Extract data from payload
    const ordersRequested = payload.orders_requested || [];
    const customerEmail = payload.customer?.email || "Unknown";

    console.log(
      `Customer with email ${customerEmail} has requested data for orders: ${ordersRequested.join(", ")}`
    );

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(error.message || "Unauthorized", { status: 401 });
  }
};
