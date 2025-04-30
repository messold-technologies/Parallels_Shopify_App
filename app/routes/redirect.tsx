import { useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import type { ClientApplication } from "@shopify/app-bridge";

export default function RedirectPage() {
    const app = useAppBridge() as unknown as ClientApplication;

  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  useEffect(() => {
    if (app && userId && token) {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.REMOTE,
        `https://parallels.messold.com/callback/${userId}/${token}`
      );
    }
  }, [app, userId, token]);

  return <p>Redirecting you to the dashboard...</p>;
}
