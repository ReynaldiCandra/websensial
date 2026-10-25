import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/data/site";
import Logo from "./Logo";

/** Evaluated once per process — stable for prerendered output. */
const currentYear = new Date().getFullYear();

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const year = currentYear;

  const productLinks = [
    { href: "/products" as const, query: "?category=landing-pages", label: "Landing Pages" },
    { href: "/products" as const, query: "?category=business-websites", label: "Business Websites" },
    { href: "/products" as const, query: "?category=portfolio", label: "Portfolio Templates" },
  ];
  const companyLinks = [
    { href: "/services" as const, label: tn("services") },
    { href: "/portfolio" as const, label: tn("portfolio") },
    { href: "/contact" as const, label: tn("contact") },
  ];

  return (
    <footer className="border-t border-line bg-[var(--ws-bg)]">
      <div className="grid w-full gap-8 px-4 py-10 sm:grid-cols-2 sm:px-7 lg:grid-cols-4 lg:px-10 xl:px-14">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center">
            <Logo className="h-auto w-[140px]" />
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{t("tagline")}</p>
        </div>

        <nav aria-label={t("colProducts")}>
          <h2 className="text-xs font-bold tracking-widest text-muted uppercase">{t("colProducts")}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {productLinks.map((link) => (
              <li key={link.query}>
                <Link className="text-ink/80 hover:text-primary" href={`${link.href}${link.query}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("colCompany")}>
          <h2 className="text-xs font-bold tracking-widest text-muted uppercase">{t("colCompany")}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link className="text-ink/80 hover:text-primary" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-bold tracking-widest text-muted uppercase">{t("colContact")}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a className="text-ink/80 hover:text-primary" href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="flex w-full flex-col gap-2 px-4 py-4 text-[10px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-10 xl:px-14">
          <p>© {year} Websensial. {t("rights")}</p>
          <p>{t("demoNotice")}</p>
        </div>
      </div>
    </footer>
  );
}
