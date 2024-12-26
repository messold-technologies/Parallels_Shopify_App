import { upsertShop } from "../shopify.server";
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
  Banner
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { BarChart3, Layers, Rocket, Zap } from 'lucide-react';

export const loader = async ({ request }) => {

  const { session } = await authenticate.admin(request);
  await upsertShop(session);
  console.log("Shop upserted successfully!");
  return null;
};


export default function Index() {

  return (
    <Page fullWidth>
      {/* Hero Section */}
      <Box paddingBlockEnd="400">
        <Card>
          <Box padding="800" background="bg-surface-secondary">
            <Layout>
              <Layout.Section >
                <BlockStack gap="400" >
                  <InlineStack gap="200" align="center" >
                    <Layers size={32} className="text-purple-600" />
                    <Text variant="headingXl" as="h1">
                      Parallels
                    </Text>
                  </InlineStack>
                  <Text variant="headingLg" as="h2">
                    Your All-in-One Marketing Analytics Solution
                  </Text>
                  <Text as="p" variant="bodyLg">
                    Unify your Shopify store data with Facebook, Google Ads, and GA4 insights
                    in one powerful dashboard. Make smarter decisions, faster.
                  </Text>
                  <Banner status="info">
                    <Text as="p">
                      Start with our free plan and upgrade anytime to unlock premium features!
                    </Text>
                  </Banner>
                  <InlineStack gap="300">
                    <Button variant="primary" size="large" url="https://parallels.messold.com" 
                    onClick={() => window.open("https://parallels.messold.com", "_blank", "noopener,noreferrer")}>
                      Get started Free
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


      <Layout>
        <Layout.Section>
          <Card>
            <Box paddingBlock={400}>
              <Text variant="headingLg" as="h5">
                Why Choose Parallels?
              </Text>
            </Box>
            <InlineGrid gap="400" columns={{ xs: 1, sm: 2, md: 3 }} >
              <Card background="bg-surface-secondary" roundedAbove="md">
                <div className="flex flex-col gap-2 items-center">
                  <Zap size={24} className="text-purple-600" />
                  <Text variant="headingSm" as="h3" alignment="center">
                    Seamless Integration
                  </Text>
                  <Text as="p" variant="bodyMd" alignment="center">
                    Connect your Shopify store in minutes, no coding required.
                  </Text>
                </div>
              </Card>
              <Card background="bg-surface-secondary">
                <div className="flex flex-col gap-2 items-center">
                  <BarChart3 size={24} className="text-purple-600 items-center" />
                  <Text variant="headingSm" as="h3" alignment="center">
                    Unified Analytics
                  </Text>
                  <Text as="p" variant="bodyMd" alignment="center">
                    All your marketing data in one beautiful dashboard.
                  </Text>
                </div>
              </Card>
              <Card background="bg-surface-secondary">
                <div className="flex flex-col gap-2 items-center">
                  <Rocket size={24} className="text-purple-600" />
                  <Text variant="headingSm" as="h3" alignment="center">
                    Growth Tools
                  </Text>
                  <Text as="p" variant="bodyMd" alignment="center">
                    AI-powered insights to accelerate your business growth.
                  </Text>
                </div>
              </Card>
            </InlineGrid>
          </Card>

        </Layout.Section>

        {/* CTA Section */}
        <Layout.Section>
          <Box paddingBlockEnd={400}>
            <Card>
              <Box padding="600" background="bg-surface-secondary">
                <BlockStack gap="400" align="center">
                  <Badge status="success">Limited Time Offer</Badge>
                  <Text variant="headingLg" as="h2" alignment="center">
                    Start Your Free 15-Day Trial
                  </Text>
                  <Text as="p" variant="bodyMd" alignment="center">
                    Experience the full power of Parallels with all premium features included.
                    No credit card required.
                  </Text>
                  <Button size="large" variant="primary">
                    Get Started Now
                  </Button>
                </BlockStack>
              </Box>
            </Card>
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
