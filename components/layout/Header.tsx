"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/Button";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/products", key: "products" },
  { href: "/services", key: "services" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-4 py-2.5 sm:px-5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="WEBSENSIAL — Home">
          <Logo className="h-8 w-8" />
          <span className="text-sm font-extrabold tracking-[0.18em] text-ink">WEBSENSIAL</span>
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
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted hover:bg-primary/5 hover:text-ink"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <ButtonLink href="/contact" size="md" className="shadow-[0_8px_20px_-8px_rgba(99,40,245,0.6)]">
              {tc("consultFree")}
            </ButtonLink>
          </div>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink md:hidden"
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
        <div id="mobile-nav" className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-ink hover:bg-primary/5"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-white hover:bg-primary-strong"
          >
            {tc("viewCatalog")}
          </Link>
        </div>
      )}
    </header>
  );
}
