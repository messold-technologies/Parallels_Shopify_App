// import { redirect } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
// import { PLAN_FREE, PLAN_GROWTH, PLAN_STARTUP } from "./app.pricing";
// import { updateSubscriptionStatus } from "../subscription.server";

// export const loader = async ({ request }) => {
//   const { billing } = await authenticate.admin(request);

//   const billingCheck = await billing.require({
//     plans: [PLAN_FREE, PLAN_STARTUP, PLAN_GROWTH],
//     onFailure: () => {
//       return { plan: { name: "Free" } };
//     },
//   });

//   const subscription = billingCheck.appSubscriptions[0];

//   if (!subscription) {
//     return redirect("/app/pricing");
//   }

//   // Cancel the subscription
//   const cancelledSubscription = await billing.cancel({
//     subscriptionId: subscription.id,
//     isTest: true,
//     prorate: true,
//   });

//   if (cancelledSubscription) {
//     try {
//       await updateSubscriptionStatus(
//         subscription.id, // Or use an identifier relevant to your database
//       );
//     } catch (error) {
//       console.error("Failed to update plan status in the database:", error);
//     }
//   }

//   // Redirect to the pricing page
//   return redirect("/app/pricing");
// };
