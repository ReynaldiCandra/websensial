import { defineRouting } from "next-intl/routing";

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always", // SEO-safe: /id and /en are always explicit
});

export const localeNames: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};
