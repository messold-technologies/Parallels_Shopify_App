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
import { json, redirect } from "@remix-run/node";
import { useState } from "react";

// Loader function with your sync and redirect logic
export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  
  // Call the syncWithExternalApp function with the session
  console.log("Syncing with external app...");
  const syncResponse = await syncWithExternalApp(session);
  console.log("Sync response:", syncResponse);
 
  if (syncResponse && syncResponse.success && syncResponse.userId && syncResponse.token) {
    console.log("Redirecting to dashboard...");
   
    const dashboardUrl = `${process.env.EXTERNAL_DASHBOARD_URL}?app_token=${syncResponse.token}&userId=${syncResponse.userId}`;
    console.log("Dashboard URL:", dashboardUrl);
   
    // Direct redirect works fine in non-embedded apps
    return redirect(dashboardUrl);
  } else {
    console.log("Not redirecting, sync response invalid or incomplete");
    return redirect("/app");
  }
}

// Main Index component
export default function Index() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartFree = () => {
    setIsLoading(true);
    // Add your registration logic here
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

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
                      {/* Use appropriate path for image or implement with an SVG component */}
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

        {/* Features Section */}
        <Layout>
          <Layout.Section>
            <Card>
              <Box padding="600">
                <BlockStack gap="400">
                  <Text variant="headingLg" as="h2" alignment="center">
                    Everything You Need to Scale Your Marketing
                  </Text>
                  
                  <InlineGrid gap="400" columns={{ xs: 1, sm: 2, md: 3 }}>
                    <Card background="bg-surface-secondary">
                      <Box padding="400">
                        <BlockStack gap="300" alignment="center">
                          <LineChart size={24} color="#9333ea" />
                          <Text variant="headingSm" as="h3">
                            Unified Dashboard
                          </Text>
                          <Text as="p" variant="bodyMd" alignment="center">
                            View all your marketing metrics in one place. Track ROAS, CPC, and conversion rates across platforms.
                          </Text>
                        </BlockStack>
                      </Box>
                    </Card>

                    <Card background="bg-surface-secondary">
                      <Box padding="400">
                        <BlockStack gap="300" alignment="center">
                          <PieChart size={24} color="#2563eb" />
                          <Text variant="headingSm" as="h3">
                            Attribution Analysis
                          </Text>
                          <Text as="p" variant="bodyMd" alignment="center">
                            Understand which channels drive the most value with multi-touch attribution modeling.
                          </Text>
                        </BlockStack>
                      </Box>
                    </Card>

                    <Card background="bg-surface-secondary">
                      <Box padding="400">
                        <BlockStack gap="300" alignment="center">
                          <TrendingUp size={24} color="#22c55e" />
                          <Text variant="headingSm" as="h3">
                            Performance Insights
                          </Text>
                          <Text as="p" variant="bodyMd" alignment="center">
                            Get AI-powered recommendations to optimize your ad spend and improve performance.
                          </Text>
                        </BlockStack>
                      </Box>
                    </Card>
                  </InlineGrid>
                </BlockStack>
              </Box>
            </Card>
          </Layout.Section>

          {/* Integration Section */}
          <Layout.Section>
            <Card>
              <Box padding="600">
                <BlockStack gap="600">
                  <Text variant="headingLg" as="h2" alignment="center">
                    Connect Once, Get Insights Forever
                  </Text>
                  
                  <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
                    <Card background="bg-surface-secondary">
                      <Box padding="400">
                        <BlockStack gap="400">
                          <Text variant="headingSm" as="h3">
                            Easy Integration
                          </Text>
                          <List type="bullet">
                            <List.Item>One-click Shopify store connection</List.Item>
                            <List.Item>Simple OAuth for Facebook & Google Ads</List.Item>
                            <List.Item>Guided GA4 setup process</List.Item>
                            <List.Item>Automatic data synchronization</List.Item>
                          </List>
                        </BlockStack>
                      </Box>
                    </Card>

                    <Card background="bg-surface-secondary">
                      <Box padding="400">
                        <BlockStack gap="400">
                          <Text variant="headingSm" as="h3">
                            Real-time Analytics
                          </Text>
                          <List type="bullet">
                            <List.Item>Live performance metrics</List.Item>
                            <List.Item>Cross-platform ROAS tracking</List.Item>
                            <List.Item>Customer journey visualization</List.Item>
                            <List.Item>Automated reporting</List.Item>
                          </List>
                        </BlockStack>
                      </Box>
                    </Card>
                  </InlineGrid>
                </BlockStack>
              </Box>
            </Card>
          </Layout.Section>

          {/* CTA Section */}
          <Layout.Section>
            <Box paddingBlockEnd="400">
              <Card>
                <Box padding="600" background="bg-surface-secondary">
                  <BlockStack gap="400" alignment="center">
                    <DollarSign size={32} color="#22c55e" />
                    <Text variant="headingLg" as="h2" alignment="center">
                      Start Free, Scale As You Grow
                    </Text>
                    <Text as="p" variant="bodyMd" alignment="center">
                      Begin with our feature-rich free plan. Upgrade anytime to unlock advanced analytics, 
                      custom reporting, and AI-powered insights.
                    </Text>
                    <InlineStack gap="300" align="center">
                      <Button 
                        size="large" 
                        variant="primary" 
                        onClick={handleStartFree}>
                        Start Free Now
                      </Button>
                      <Button variant="plain" size="large" url="/app/pricing">
                        Compare Plans
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </Box>
              </Card>
            </Box>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}