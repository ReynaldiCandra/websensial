"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const ariaLabel = locale === "en" ? localeNames.en : localeNames.id;
  const alternativeName = locale === "en" ? "Display in Indonesian" : "Display in English";

  function switchTo(next: string) {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
    router.refresh();
  }

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="lang-switch">
        {ariaLabel}
      </label>
      <select
        id="lang-switch"
        value={locale}
        onChange={(e) => switchTo(e.target.value)}
        title={alternativeName}
        className="h-10 cursor-pointer appearance-none rounded-xl border border-line bg-white pl-3 pr-8 text-sm font-semibold text-ink transition-colors hover:bg-soft"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {l === "id" ? "ID" : "EN"}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" />
      </svg>
    </div>
  );
}
