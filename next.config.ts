import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isProduction = process.env.NODE_ENV === "production";

// 'unsafe-inline' is required by the theme bootstrap, JSON-LD blocks, and the
// tracking initializers. Everything else is locked to our origin and the three
// configured ad/analytics providers.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://*.googleadservices.com https://*.doubleclick.net https://connect.facebook.net https://*.facebook.net https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://*.supabase.co https://*.facebook.com https://*.facebook.net https://*.google-analytics.com https://*.googletagmanager.com https://www.google.com https://www.google.co.id https://*.googleadservices.com https://*.doubleclick.net https://pagead2.googlesyndication.com https://vercel.live https://*.vercel.live",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.facebook.com https://*.facebook.net https://www.google.com https://www.google.co.id https://*.googleadservices.com https://*.doubleclick.net https://vercel.live wss://ws.vercel.live https://*.vercel.live",
  "frame-src 'self' https://vercel.live",
  "media-src 'self'",
  "worker-src 'self' blob:",
].join("; ");

const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Vercel already sends HSTS; only add it for a self-hosted deployment.
  ...(process.env.VERCEL ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
  ...(isProduction ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }] : []),
];

const adminHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  ...(isProduction ? [{ key: "Content-Security-Policy", value: "frame-ancestors 'none'" }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/(.*)", headers: baseSecurityHeaders },
      { source: "/admin", headers: adminHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
    ];
  },
  // Admin uploads live in Supabase Storage, so next/image must be allowed to
  // optimize that host. The project host comes from SUPABASE_URL, which is not
  // guaranteed to exist while this config loads (e.g. runtime-only env vars),
  // hence the wildcard host restricted to our public media bucket path.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/websensial-media/**",
      },
    ],
  },
  // cacheComponents/partialPrefetching disabled: their strict prerender rules
  // conflict with the prerendered locale 404 catch-all; revisit on upgrade.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
