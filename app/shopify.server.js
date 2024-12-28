import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  BillingInterval
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

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
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });
    },
  },
  billing: {
    FREE: {
      amount: 0.0,
      currencyCode: "USD",
      interval:BillingInterval.Every30Days,
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


export async function upsertShop(session) {
  const shopDomain = session.shop; 
  const accessToken = session.accessToken;

  const existingShop = await prisma.shop.findUnique({
    where: { shopDomain },
  });

  if (existingShop) {
    await prisma.shop.update({
      where: { shopDomain },
      data: { accessToken },
    });
  } else {
    await prisma.shop.create({
      data: {
        shopDomain,
        accessToken,
        planName: "Free", 
      },
    });
  }
}
