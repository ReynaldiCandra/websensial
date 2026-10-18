import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

// Static delivery lets Next emit a real 404 status for unknown URLs.
export const dynamic = "force-static";

/**
 * Catch-all for unknown locale routes: renders the localized 404 view with a
 * true 404 status.
 */
export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
