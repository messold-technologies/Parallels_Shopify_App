import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { updateSubscription } from "../subscription.server";

export async function loader({ request }) {
  try {
    const auth = await authenticate.admin(request);
    
    if (!auth?.session) {
      throw new Error("No session found");
    }

    const { billing, session } = auth;
    
    if (!billing) {
      console.error("Billing object not available");
      return redirect("/app/pricing?status=error&message=billing_not_available");
    }

    const url = new URL(request.url);
    const chargeId = url.searchParams.get("charge_id");

    if (!chargeId) {
      console.error("No charge_id found in URL");
      return redirect("/app/pricing?status=error&message=missing_charge_id");
    }

    const subscriptionStatus = await billing.check({
      subscriptionId: chargeId,
      isTest: true,
    });

    if (!subscriptionStatus?.appSubscriptions?.length) {
      throw new Error("Invalid subscription response");
    }

    const { appSubscriptions } = subscriptionStatus;
    console.log(appSubscriptions)
    const planName = appSubscriptions[0].name;

    if (!planName) {
      throw new Error("Could not determine plan name");
    }

    const subscriptionDetails = {
      id: appSubscriptions[0].id,
      planName,
      currentPeriodEnd: new Date(),
    };

    const result = await updateSubscription({
      session,
      subscriptionDetails,
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    return redirect("/app/pricing?status=success");
  } catch (error) {
    console.error("Subscription callback error:", {
      message: error.message,
      stack: error.stack,
      url: request.url,
    });

    // For other errors, redirect to pricing with error message
    return redirect(`/app/pricing?status=error&message=${encodeURIComponent(error.message)}`);
  }
}