import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  BillingInterval
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

console.log("🚀 ENV CHECK");
console.log("SHOPIFY_API_KEY:", process.env.SHOPIFY_API_KEY);
console.log("SHOPIFY_API_SECRET:", process.env.SHOPIFY_API_SECRET);
console.log("SCOPES:", process.env.SCOPES);
console.log("SHOPIFY_APP_URL:", process.env.SHOPIFY_APP_URL);

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October24,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  isEmbeddedApp: true, 
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  hooks: {
    afterAuth: async ({ session, request, admin, redirect }) => {
      console.log("afterAuth hook triggered");
      
      shopify.registerWebhooks({ session });
      
      console.log("Upserting shop...");
      await upsertShop(session);
      
      // Sync with external app and get user info
      console.log("Syncing with external app...");
      const syncResponse = await syncWithExternalApp(session);
      
      if (syncResponse && syncResponse.userId && syncResponse.token) {

        return redirect(`/redirect?userId=${syncResponse.userId}&token=${syncResponse.token}`);

      }

      return;
    },
  },
  billing: {
    FREE: {
      amount: 0.0,
      currencyCode: "USD",
      interval: BillingInterval.Every30Days,
      test: process.env.NODE_ENV !== "production",
    },
    STARTUP: {
      amount: 10.0,
      currencyCode: "USD",
      interval: BillingInterval.Every30Days,
      test: process.env.NODE_ENV !== "production",
    },
    GROWTH: {
      amount: 50.0,
      currencyCode: "USD",
      interval: BillingInterval.Every30Days,
      test: process.env.NODE_ENV !== "production",
    },
  },
});

export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

// Save shop data to Prisma database
export async function upsertShop(session) {
  const shopDomain = session.shop; 
  const accessToken = session.accessToken;

  try {
    const existingShop = await prisma.shop.findUnique({
      where: { shopDomain },
    });

    if (existingShop) {
      return await prisma.shop.update({
        where: { shopDomain },
        data: { 
          accessToken,
          updatedAt: new Date(),
        },
      });
    } else {
      return await prisma.shop.create({
        data: {
          shopDomain,
          accessToken,
          planName: "FREE", 
        },
      });
    }
  } catch (error) {
    console.error("Error upserting shop data:", error);
    throw error;
  }
}

export async function syncWithExternalApp(session) {
  try {
    const shopDomain = session.shop;
    const accessToken = session.accessToken;
    const shopName = shopDomain.split('.')[0];

    console.log("Preparing to sync with external app");
    let userData = null;
    
    try {
      const shopData = await getShopOwnerInfo(session);
      if (shopData?.shop) {
        userData = {
          name: shopData.shop.name || shopName,
          email: shopData.shop.email
        };
        console.log("Retrieved shop owner data:", userData);
      }
    } catch (shopDataError) {
      console.error("Failed to get shop owner info:", shopDataError);
    }
    
    const payload = {
      shopName,
      shopifyDomain: shopDomain,
      shopifyAccessToken: accessToken,
    };

    if (userData) {
      if (userData.name) payload.ownerName = userData.name;
      if (userData.email) payload.ownerEmail = userData.email;
    }

    const response = await axios.post(
      `${process.env.EXTERNAL_API_URL}/app/sync-shopify-store`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.EXTERNAL_APP_API_KEY}`
        },
        timeout: 10000 // Add timeout for the request
      }
    );

    console.log("External app sync response status:", response.status);
    return response.data;
  } catch (error) {
    console.error("Failed to sync with external app:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    } else if (error.request) {
      console.error("No response received, request was:", error.request.method, error.request.path);
    }
    return { 
      error: error.message || "Failed to sync with external app",
      success: false
    };
  }
}

async function getShopOwnerInfo(session) {
  try {
    // Use the admin graphql client
    const response = await shopify.api.admin.graphql({
      session,
      data: `{
        shop {
          name
          email
          myshopifyDomain
        }
      }`
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching shop information:", error);
    return null;
  }
}

export default shopify;