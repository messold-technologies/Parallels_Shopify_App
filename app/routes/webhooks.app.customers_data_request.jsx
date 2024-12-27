import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    // Clone the request body to avoid consuming it multiple times
    const clonedRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: await request.text(),
    });

    // Pass the cloned request to authenticate.webhook
    const { payload, admin } = await authenticate.webhook(clonedRequest);

    if (!admin) {
      console.error("Admin validation failed.");
      throw new Error("Unauthorized");
    }

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
