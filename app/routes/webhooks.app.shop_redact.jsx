import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { payload, admin } = await authenticate.webhook(request);

    if(!admin){
      throw new Response();
    }

    // Extract data
    const shopid = payload.shop_id;
    const shopdomain = payload.shop_domain;

    console.log(
      `This shop ${shopdomain} with ${shopid} is redacted`
    );

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(error.message, { status: 401 });
  }
}