import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { AppProvider } from "@shopify/polaris";
import { AppProvider as ShopifyAppProvider } from "@shopify/shopify-app-remix/react";
import { json } from "@remix-run/node";
import stylesheet from "./tailwind.css?url";

export const links = () => [
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "preload",
    href: "https://cdn.shopify.com/shopifycloud/app-bridge.js",
    as: "script",
  },
];

export async function loader() {
  return json({
    apiKey: process.env.SHOPIFY_API_KEY || "",
    appBridgeConfig: {
      apiKey: process.env.SHOPIFY_API_KEY || "",
      host: new URL(process.env.SHOPIFY_APP_URL || "").host,
      forceRedirect: true,
    },
  });
}

export default function App() {
  const { apiKey, appBridgeConfig } = useLoaderData();

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />/
       
        <meta
          httpEquiv="Content-Security-Policy"
          content="frame-ancestors https://*.myshopify.com https://*.shopify.com https://*.shopifycloud.com;"
        />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
      </head>
      <body>
        <ShopifyAppProvider isEmbeddedApp apiKey={apiKey} config={appBridgeConfig}>
            <AppProvider i18n={{}}>
              <Outlet />
            </AppProvider>
        </ShopifyAppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
