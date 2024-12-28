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

    try {
      const subscriptionStatus = await billing.check({
        subscriptionId: chargeId,
        isTest: true,
      });

      if (!subscriptionStatus?.appSubscriptions?.[0]) {
        throw new Error("Invalid subscription response");
      }

      const subscription = subscriptionStatus.appSubscriptions[0];
      console.log("Subscription details:", subscription);

      const subscriptionDetails = {
        id: subscription.id,
        planName: subscription.name,
        currentPeriodEnd: subscription.currentPeriodEnd || new Date(),
      };

      const result = await updateSubscription({
        session,
        subscriptionDetails,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to update subscription");
      }

      return redirect("/app/pricing?status=success");
    } catch (error) {
      console.error("Subscription validation error:", error);
      return redirect(`/app/pricing?status=error&message=${encodeURIComponent(error.message)}`);
    }
  } catch (error) {
    console.error("Subscription callback error:", {
      message: error.message,
      stack: error.stack,
      url: request.url,
    });

    return redirect(`/app/pricing?status=error&message=${encodeURIComponent(error.message)}`);
  }
}