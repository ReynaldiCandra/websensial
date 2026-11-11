"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * The initial page view is sent by the injected gtag config / Meta Pixel init.
 * After that, client-side navigations need their own event because the App
 * Router does not reload the document.
 */
export default function AnalyticsRouteTracker({
  gaMeasurementId,
  googleAdsId,
  metaPixelId,
}: {
  gaMeasurementId: string | null;
  googleAdsId: string | null;
  metaPixelId: string | null;
}) {
  const pathname = usePathname();
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const pageLocation = `${window.location.origin}${window.location.pathname}${window.location.search}`;

    if (gaMeasurementId && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_location: pageLocation,
        page_path: window.location.pathname,
      });
    }
    if (googleAdsId && typeof window.gtag === "function") {
      window.gtag("config", googleAdsId, { page_path: window.location.pathname });
    }
    if (metaPixelId && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname, gaMeasurementId, googleAdsId, metaPixelId]);

  return null;
}
