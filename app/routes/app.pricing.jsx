import { useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Text, BlockStack, Box, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  
  if (!session) {
    return { error: "Authentication failed" };
  }
  
  // Get the shop (store) handle from the session
  const { shop } = session;
  const storeHandle = shop.replace(".myshopify.com", "");
  
  // Return these values to use in the component
  return { 
    storeHandle,
    appHandle: process.env.APP_NAME || "your-app-handle" // Set your actual app handle in env variables
  };
}

export default function PricingRedirectPage() {
  const { storeHandle, appHandle, error } = useLoaderData();

  useEffect(() => {
    if (storeHandle && appHandle) {
      const billingUrl = `https://admin.shopify.com/store/${storeHandle}/charges/${appHandle}/pricing_plans`;
      window.top.location.href = billingUrl;
    }
  }, [storeHandle, appHandle]);
  
  return (
    <Page>
      <BlockStack gap="400">
        <Layout.Section>
          {error ? (
            <Banner status="critical">{error}</Banner>
          ) : (
            <Box padding="400">
              <Text variant="bodyLg" as="p" alignment="center">
                Redirecting to subscription management...
              </Text>
            </Box>
          )}
        </Layout.Section>
      </BlockStack>
    </Page>
  );
}