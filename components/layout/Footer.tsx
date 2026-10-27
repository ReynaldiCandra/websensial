import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getWebContent } from "@/lib/admin/site-content";
import { getWhatsAppUrl } from "@/lib/data/site";
import Logo from "./Logo";

/** Evaluated once per process — stable for prerendered output. */
const currentYear = new Date().getFullYear();

export default async function Footer() {
  const [t, tn, content] = await Promise.all([getTranslations("footer"), getTranslations("nav"), getWebContent()]);
  const year = currentYear;
  const whatsappUrl = getWhatsAppUrl(content.contact.whatsapp, "Hello Websensial, I would like to discuss a project.");

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
    <footer className="relative isolate overflow-hidden border-t border-line bg-[var(--ws-bg-soft)]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#6328f5]/[0.10] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 left-[38%] h-72 w-72 rounded-full bg-[#4f6bff]/[0.07] blur-3xl" />
      <div className="relative grid w-full gap-10 px-4 py-12 sm:grid-cols-2 sm:px-7 sm:py-14 lg:grid-cols-4 lg:px-10 xl:px-14">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="inline-flex rounded-xl border border-[#6328f5]/15 bg-gradient-to-br from-[#6328f5]/[0.06] to-[#4f6bff]/[0.08] p-2.5">
            <Logo className="h-auto w-[180px]" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t("tagline")}</p>
        </div>

        <nav aria-label={t("colProducts")}>
          <h2 className="text-xs font-bold tracking-widest text-primary uppercase">{t("colProducts")}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {productLinks.map((link) => (
              <li key={link.query}>
                <Link className="text-muted transition-colors hover:text-primary" href={`${link.href}${link.query}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("colCompany")}>
          <h2 className="text-xs font-bold tracking-widest text-primary uppercase">{t("colCompany")}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link className="text-muted transition-colors hover:text-primary" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-bold tracking-widest text-primary uppercase">{t("colContact")}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a className="text-muted transition-colors hover:text-primary" href={`mailto:${content.contact.email}`}>
                {content.contact.email}
              </a>
            </li>
            {whatsappUrl ? <li><a className="text-muted transition-colors hover:text-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp · {content.contact.whatsapp}</a></li> : null}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-line bg-[var(--ws-bg)]/70">
        <div className="flex w-full flex-col gap-2 px-4 py-4 text-[10px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-10 xl:px-14">
          <p>© {year} Websensial. {t("rights")}</p>
          <p>{t("demoNotice")}</p>
        </div>
      </div>
    </footer>
  );
}
