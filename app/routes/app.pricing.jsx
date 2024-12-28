import { useLoaderData, useSubmit } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { Page, Layout, Text, BlockStack, Box, CalloutCard, Button, List } from "@shopify/polaris";
import { Check, Sparkles } from "lucide-react";
import { authenticate } from "../shopify.server";
import { updateSubscription } from "../subscription.server";


export const PLAN_FREE = "FREE";
export const PLAN_STARTUP = "STARTUP";
export const PLAN_GROWTH = "GROWTH";


const pricingPlans = [
  {
    id: "FREE",
    title: "Free Plan",
    price: "Free",
    description: "Perfect for getting started with analytics",
    features: [
      "Basic Analytics Dashboard",
      "Shopify Integration",
      "Daily Data Updates",
      "Basic Reports",
      "Email Support",
    ],
  },
  {
    id: "STARTUP",
    title: "Startup Plan",
    price: "$10",
    description: "Ideal for growing businesses",
    features: [
      "Everything in Free Plan",
      "Real-time Analytics",
      "Custom Dashboards",
      "Advanced Reports",
      "Priority Email Support",
    ],
    isPopular: true,
  },
  {
    id: "GROWTH",
    title: "Growth Plan",
    price: "$50",
    description: "For businesses ready to scale",
    features: [
      "Everything in Startup Plan",
      "AI-Powered Insights",
      "White-label Reports",
      "Custom Integrations",
      "Team Collaboration",
    ],
  },
];

// Loader to fetch the current subscription plan
export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const chargeId = url.searchParams.get("charge_id");

    // Get authentication context
    const authResponse = await authenticate.admin(request);
    
    if (!authResponse?.session) {
      throw new Error("Authentication failed - no session available");
    }

    const { billing, session } = authResponse;

    // Handle callback flow if charge_id is present
    if (chargeId) {
      try {
        const subscriptionStatus = await billing.check({
          subscriptionId: chargeId,
          isTest: true,
        });

        if (subscriptionStatus?.appSubscriptions?.[0]) {
          const subscription = subscriptionStatus.appSubscriptions[0];
          
          await updateSubscription({
            session,
            subscriptionDetails: {
              id: subscription.id,
              planName: subscription.name,
              currentPeriodEnd: subscription.currentPeriodEnd || new Date(),
            },
          });

          // Instead of redirecting, return success state
          return {
            billing,
            plan: subscription,
            status: "success",
            error: null,
          };
        }
      } catch (error) {
        console.error("Subscription validation error:", error);
        return {
          billing: null,
          plan: { name: PLAN_FREE, status: "ACTIVE" },
          error: error.message,
          status: "error",
        };
      }
    }

    // Regular pricing page flow
    if (!billing) {
      console.error("Billing object not available");
      return {
        billing: null,
        plan: { name: PLAN_FREE, status: "ACTIVE" },
        error: "Billing authentication failed",
        status: "error",
      };
    }

    const billingCheck = await billing.require({
      plans: [PLAN_FREE, PLAN_STARTUP, PLAN_GROWTH],
      isTest: true,
      onFailure: async () => {
        return { plan: { name: PLAN_FREE, status: "ACTIVE" } };
      },
    });

    const subscription = billingCheck?.appSubscriptions?.[0];

    return {
      billing,
      plan: subscription || { name: PLAN_FREE, status: "ACTIVE" },
      status: status || "active",
      error: null,
    };

  } catch (error) {
    console.error("Pricing page error:", error);
    


    return {
      billing: null,
      plan: { name: PLAN_FREE, status: "ACTIVE" },
      error: error.message || "An unknown error occurred",
      status: "error",
    };
  }
}

export async function action({ request }) {
    const { billing, session } = await authenticate.admin(request);
    
    if (!session) {
      throw new Error("No session available");
    }

    let { shop } = session;
    let myShop = shop.replace(".myshopify.com", "");
    const formData = await request.formData();
    const planId = formData.get("planId");

    if (!billing) {
      throw new Error("Billing not available");
    }

    const response = await billing.request({
      plan: planId,
      isTest: true,
      // Update returnUrl to point to the same route
      returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/pricing`,
    });

    return redirect(response.confirmationUrl);
}

// Pricing Page Component
export default function PricingPage() {
  const { plan } = useLoaderData();
  const submit = useSubmit();

  // Handle subscription button click
  const handleSubscribe = async (planId) => {
    if (planId === plan?.name) return; // If already on the selected plan, do nothing

    const formData = new FormData();
    formData.append("planId", planId);

    const result = await submit(formData, { method: "POST" });
    if (result?.redirectUrl) {
      window.parent.location.href = result.redirectUrl;
    }
  };

  return (
    <Page fullWidth>
      <BlockStack gap="400">
        <Box padding={200}>
          <BlockStack gap="400" align="center">
            <Text variant="headingXl" as="h1" alignment="center">
              Simple, Transparent Pricing
            </Text>
          </BlockStack>
        </Box>

        <Layout>
          <Layout.Section>
            <CalloutCard
              title="Your Current Plan"
              illustration="https://cdn.shopify.com/s/files/1/0583/6465/7734/files/tag.png?v=1705280535"
              primaryAction={{
                content: plan.name === "GROWTH" ? 'Manage Plan' : 'Upgrade Plan',
                url: plan.name === "GROWTH" ? '/app/pricing' : '/app/pricing',
              }}
              secondaryAction={plan.name !== "FREE" ? {
                content: 'Cancel Plan',
                url: '/app/cancel',
              } : undefined}
            >
              <Text as="p">
                {plan.name === "GROWTH" 
                  ? "You're currently on the Growth plan. All features are unlocked."
                  : `You're currently on the ${plan.name} plan. Upgrade to unlock more features.`}
              </Text>
            </CalloutCard>
          </Layout.Section>

          {/* Pricing Cards */}
          <Layout.Section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map(({ id, title, price, description, features, isPopular }) => {
                const isActive = plan?.name === id;
                const isFreePlan = price === "Free";

                return (
                  <div
                    key={id}
                    className={`transform transition-transform duration-200 hover:scale-105 border rounded-lg shadow-lg ${isActive ? "border-green-500" : "border-gray-200"}`}
                  >
                    {/* Card Header */}
                    <div
                      className={`p-6 rounded-t-lg ${isActive ? "bg-green-50" : isPopular ? "bg-purple-50" : "bg-gray-50"}`}
                    >
                      <div className="flex flex-row justify-between">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        {isPopular && (
                          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                            <Sparkles size={14} />
                            Most Popular
                          </div>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-4xl font-bold">{price}</span>
                        {price !== "Free" && <span className="text-sm text-gray-500">/month</span>}
                      </div>
                      <p className="text-gray-600 mt-2">{description}</p>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 bg-white rounded-b-lg">
                      <ul className="space-y-3">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check size={16} className={`${isActive ? "text-green-600" : "text-purple-600"}`} />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        className={`w-full mt-6 py-2 rounded-lg font-medium ${isActive
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : isPopular
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        onClick={() => handleSubscribe(id)}
                      >
                        {isActive
                          ? 'Current Plan'
                          : isFreePlan
                            ? 'Get Started Free'
                            : `Upgrade to ${title}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Layout.Section>
        </Layout>

        {/* FAQ Section */}
        <Box padding="400">
          <BlockStack gap="400" align="center">
            <Text variant="headingLg" as="h2" alignment="center">
              Have Questions?
            </Text>
            <Text variant="bodyMd" as="p" alignment="center">
              Contact our support team at team@messold.com
            </Text>
          </BlockStack>
        </Box>
      </BlockStack>
    </Page>
  );
}