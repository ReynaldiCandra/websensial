import Script from "next/script";
import AnalyticsRouteTracker from "./AnalyticsRouteTracker";
import type { TrackingSettings } from "@/lib/data/tracking";

/**
 * Loads only the tags the admin actually configured. Values are validated
 * before they reach the CMS, and JSON.stringify keeps them safely quoted in
 * the inline bootstrap scripts.
 */
export default function TrackingScripts({ tracking }: { tracking: TrackingSettings }) {
  const { gaMeasurementId, googleAdsId, metaPixelId } = tracking;
  const gtagId = gaMeasurementId ?? googleAdsId;

  return (
    <>
      {gtagId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtagId)}`}
            strategy="afterInteractive"
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: [
                "window.dataLayer=window.dataLayer||[];",
                "function gtag(){window.dataLayer.push(arguments);}",
                "gtag('js',new Date());",
                ...(gaMeasurementId ? [`gtag('config',${JSON.stringify(gaMeasurementId)});`] : []),
                ...(googleAdsId ? [`gtag('config',${JSON.stringify(googleAdsId)});`] : []),
              ].join(""),
            }}
          />
        </>
      ) : null}

      {metaPixelId ? (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: [
                "!function(f,b,e,v,n,t,s){",
                "if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};",
                "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];",
                "t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)",
                "}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');",
                `fbq('init',${JSON.stringify(metaPixelId)});`,
                "fbq('track','PageView');",
              ].join(""),
            }}
          />
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element -- Meta's noscript pixel must stay a raw 1x1 image */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${encodeURIComponent(metaPixelId)}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      ) : null}

      {gaMeasurementId || googleAdsId || metaPixelId ? (
        <AnalyticsRouteTracker
          gaMeasurementId={gaMeasurementId}
          googleAdsId={googleAdsId}
          metaPixelId={metaPixelId}
        />
      ) : null}
    </>
  );
}
