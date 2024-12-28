
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
  Badge,
  List,
  Icon
} from "@shopify/polaris";
import { 
  BarChart3, 
  Layers, 
  Rocket, 
  Zap,
  Facebook,
  LineChart,
  PieChart,
  Store,
  BarChart,
  Target,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default function Index() {
  return (
    <Page fullWidth>
      {/* Hero Section */}
      <Box paddingBlockEnd="400">
        <Card>
          <Box padding="800" background="bg-surface-secondary">
            <Layout>
              <Layout.Section>
                <BlockStack gap="400">
                  <InlineStack gap="200" align="center">
                    <img src="./messold-icon.png" alt="logo" width={"30px"} height={"10px"} />
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
                  <InlineStack gap="300">
                  <Button variant="primary" size="large"  
                    onClick={() => window.open("https://parallels.messold.com", "_blank", "noopener,noreferrer")}>
                      Start Free
                    </Button>
                    <Button variant="plain" size="large" url="/app/pricing">
                      View Plans
                    </Button>
                  </InlineStack>
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
                      <div className="flex flex-col items-center gap-2.5">
                        <LineChart size={24} className="text-purple-600" />
                        <Text variant="headingSm" as="h3">
                          Unified Dashboard
                        </Text>
                        <Text as="p" variant="bodyMd" alignment="center">
                          View all your marketing metrics in one place. Track ROAS, CPC, and conversion rates across platforms.
                        </Text>
                      </div>
                    </Box>
                  </Card>

                  <Card background="bg-surface-secondary">
                    <Box padding="400">
                      <div className="flex flex-col items-center gap-2.5">
                        <PieChart size={24} className="text-blue-600" />
                        <Text variant="headingSm" as="h3">
                          Attribution Analysis
                        </Text>
                        <Text as="p" variant="bodyMd" alignment="center">
                          Understand which channels drive the most value with multi-touch attribution modeling.
                        </Text>
                      </div>
                    </Box>
                  </Card>

                  <Card background="bg-surface-secondary">
                    <Box padding="400">
                      <div className="flex flex-col items-center gap-2.5">
                        <TrendingUp size={24} className="text-green-500" />
                        <Text variant="headingSm" as="h3">
                          Performance Insights
                        </Text>
                        <Text as="p" variant="bodyMd" alignment="center">
                          Get AI-powered recommendations to optimize your ad spend and improve performance.
                        </Text>
                      </div>
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
                <div className="flex flex-col items-center gap-3">
                  <DollarSign size={32} className="text-green-500" />
                  <Text variant="headingLg" as="h2" alignment="center">
                    Start Free, Scale As You Grow
                  </Text>
                  <Text as="p" variant="bodyMd" alignment="center">
                    Begin with our feature-rich free plan. Upgrade anytime to unlock advanced analytics, 
                    custom reporting, and AI-powered insights.
                  </Text>
                  <InlineStack gap="300" align="center">
                    <Button size="large" variant="primary" onClick={() => window.open("https://parallels.messold.com", "_blank", "noopener,noreferrer")}>
                      Start Free Now
                    </Button>
                    <Button variant="plain" size="large">
                      Compare Plans
                    </Button>
                  </InlineStack>
                </div>
              </Box>
            </Card>
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
}