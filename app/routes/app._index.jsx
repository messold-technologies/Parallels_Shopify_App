import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  Box,
  BlockStack,
  InlineStack,
  InlineGrid,
  List,
  Frame
} from "@shopify/polaris";
import { 
  LineChart,
  PieChart,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { authenticate, syncWithExternalApp } from "../shopify.server";
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";

// Loader function that syncs with external app but doesn't redirect directly
export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  
  // Call the syncWithExternalApp function with the session
  console.log("Syncing with external app...");
  const syncResponse = await syncWithExternalApp(session);
  console.log("Sync response:", syncResponse);
 
  // Instead of redirecting, return the data needed for client-side redirect
  if (syncResponse && syncResponse.success && syncResponse.userId && syncResponse.token) {
    return json({
      redirectUrl: `${process.env.EXTERNAL_DASHBOARD_URL}/callback${syncResponse.userId}/${syncResponse.token}`,
      shouldRedirect: true
    });
  } else {
    console.log("Not redirecting, sync response invalid or incomplete");
    return json({
      shouldRedirect: false
    });
  }
}

// Main Index component
export default function Index() {
  const { redirectUrl, shouldRedirect } = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);
  
  // Helper function to safely redirect from embedded app
  function redirectToExternalUrl(url) {
    // Implementation #1: Using Shopify App Bridge 2.0
    if (window.shopify && window.shopify.redirectOutside) {
      window.shopify.redirectOutside(url);
      return;
    }
    
    // Implementation #2: Using createApp from @shopify/app-bridge
    if (window.shopify && window.shopify.config) {
      try {
        const AppBridge = window.shopify.AppBridge;
        const redirect = AppBridge.actions.Redirect.create(window.shopify.config);
        redirect.dispatch(AppBridge.actions.Redirect.Action.REMOTE, url);
        return;
      } catch (e) {
        console.error("App Bridge redirect error:", e);
      }
    }
    
    // Implementation #3: Using legacy APP_BRIDGE_URL approach
    try {
      if (window.top === window.self) {
        // If we're not in an iframe, we can navigate directly
        window.location.href = url;
      } else {
        // For embedded apps in an iframe
        window.parent.postMessage(
          { 
            type: "shopify:app:navigate:external", 
            payload: { url } 
          }, 
          "https://admin.shopify.com"
        );
      }
    } catch (e) {
      console.error("External navigation error:", e);
      // Last resort - try simple redirect and it might work in some cases
      window.location.assign(url);
    }
  }
  
  // Handle external app redirection
  useEffect(() => {
    if (shouldRedirect && redirectUrl) {
      redirectToExternalUrl(redirectUrl);
    }
  }, [shouldRedirect, redirectUrl]);

  const handleStartFree = () => {
    setIsLoading(true);
    // Your registration logic here
    setTimeout(() => {
      if (redirectUrl) {
        redirectToExternalUrl(redirectUrl);
      }
      setIsLoading(false);
    }, 1000);
  };

  // Rest of your component remains largely the same
  return (
    <Frame>
      <Page fullWidth>
        {/* Hero Section with Inline Registration Form */}
        <Box paddingBlockEnd="400">
          <Card>
            <Box padding="800" background="bg-surface-secondary">
              <Layout>
                <Layout.Section>
                  <BlockStack gap="400">
                    <InlineStack gap="200" align="center">
                      <img 
                        src="/messold-icon.png" 
                        alt="Parallels logo" 
                        width={30} 
                        height={30} 
                      />
                      <Text variant="headingXl" as="h1">
                        Parallels
                      </Text>
                    </InlineStack>
                    <Text variant="headingLg" as="h3">
                      Your Marketing Analytics Command Center
                    </Text>
                    <Text as="p" variant="bodyLg">
                      Connect your Shopify store with Facebook Ads, Google Ads, and GA4 to get powerful 
                      insights all in one place. Make data-driven decisions that boost your ROI.
                    </Text>
                    
                    {/* Inline Registration Form */}
                    <Card>
                      <Box padding="400">
                        <BlockStack gap="400">
                          <Text variant="headingSm" as="h3">
                            Get Started with Parallels
                          </Text>
                          <BlockStack gap="400">
                            <InlineStack gap="300">
                              <Button 
                                variant="primary"
                                loading={isLoading}
                                onClick={handleStartFree}
                              >
                                Start Free
                              </Button>
                              <Button variant="plain" url="/app/pricing">
                                View Plans
                              </Button>
                            </InlineStack>
                          </BlockStack>
                        </BlockStack>
                      </Box>
                    </Card>
                  </BlockStack>
                </Layout.Section>
              </Layout>
            </Box>
          </Card>
        </Box>

        {/* Features Section and other components remain unchanged */}
        {/* ... */}
      </Page>
    </Frame>
  );
}