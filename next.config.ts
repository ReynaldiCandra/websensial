import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
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
