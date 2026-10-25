"use client";

import { useLayoutEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/Button";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/products", key: "products" },
  { href: "/contact", key: "about" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("ws-theme");
      document.documentElement.dataset.theme =
        savedTheme === "light" || savedTheme === "dark"
          ? savedTheme
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  }, []);

  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem("ws-theme", nextTheme);
    } catch {
      // Keep the selected theme for the current page even if storage is unavailable.
    }
  }

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 lg:px-8">
      <div className="glass flex w-full items-center justify-between gap-3 rounded-full px-4 py-2 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center" aria-label="WEBSENSIAL — Home">
          <Logo className="h-auto w-[128px] sm:w-[190px]" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  active ? "text-ink underline decoration-ink/40 underline-offset-4" : "text-muted hover:text-ink"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <ButtonLink href="/contact" size="md" className="rounded-full bg-ink px-5 py-2.5 text-xs text-white hover:bg-ink/85">
              {t("bookCall")}
            </ButtonLink>
          </div>
          <span className="hidden text-[11px] text-muted sm:block">{t("language")}</span>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t("themeToggle")}
            title={t("themeToggle")}
            aria-describedby="theme-toggle-help"
            className="theme-toggle grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-[var(--ws-surface)] text-ink transition-colors hover:bg-soft"
          >
            <svg viewBox="0 0 24 24" className="theme-icon-moon h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" /></svg>
            <svg viewBox="0 0 24 24" className="theme-icon-sun hidden h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
          </button>
          <span id="theme-toggle-help" className="sr-only">{t("themeToggle")}</span>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-[var(--ws-surface)] text-ink md:hidden"
          >
            <span className="sr-only">{open ? t("closeMenu") : t("openMenu")}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>
              ) : (
                <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="glass mt-2 w-full rounded-3xl p-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active ? "bg-ink text-white" : "text-ink hover:bg-black/5"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-xl bg-ink px-4 py-3 text-center text-sm font-bold text-white hover:bg-ink/85"
          >
            {tc("viewCatalog")}
          </Link>
        </div>
      )}
    </header>
  );
}
