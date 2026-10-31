import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import RichText from "@/components/ui/RichText";

/**
 * Live-preview and enquiry actions for a portfolio project. Concept projects
 * have no demo URL, so the button stays disabled and the panel says so instead
 * of linking somewhere invented.
 */
export default function PortfolioActions({ demoUrl, whatsappUrl }: { demoUrl: string | null; whatsappUrl: string | null }) {
  const t = useTranslations("portfolio");

  return (
    <section aria-label={t("actionsLabel")} className="rounded-2xl border border-line bg-soft p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        {demoUrl ? (
          <ButtonLink href={demoUrl} external variant="secondary" size="lg" className="flex-1">
            {t("livePreview")} ↗
          </ButtonLink>
        ) : (
          <ButtonLink href="#!" disabled variant="secondary" size="lg" className="flex-1" ariaLabel={t("demoUnavailable")}>
            {t("livePreview")}
          </ButtonLink>
        )}
        {whatsappUrl ? (
          <ButtonLink href={whatsappUrl} external size="lg" className="flex-1">
            {t("chatOnWhatsApp")} ↗
          </ButtonLink>
        ) : (
          <ButtonLink href="/contact" variant="secondary" size="lg" className="flex-1">
            {t("contactUs")}
          </ButtonLink>
        )}
      </div>

      {demoUrl ? null : (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          <RichText text={t("demoNotConfiguredBody")} strongClassName="font-semibold text-ink" />
        </p>
      )}
    </section>
  );
}
