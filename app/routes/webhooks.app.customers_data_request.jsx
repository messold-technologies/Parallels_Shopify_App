export const action = async ({ request }) => {
  try {
    // Log request headers and body
    console.log("Request headers:", Object.fromEntries(request.headers.entries()));
    const body = await request.text();
    console.log("Request body:", body);

    const { payload, admin } = await authenticate.webhook(request);

    if (!admin) {
      console.error("Admin validation failed.");
      throw new Error("Unauthorized");
    }

    // Extract data
    const ordersRequested = payload.orders_requested;
    const customerEmail = payload.customer.email;

    console.log(
      `Customer with email ${customerEmail} has requested data for orders: ${ordersRequested.join(", ")}`
    );

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(error.message || "Unauthorized", { status: 401 });
  }
};
