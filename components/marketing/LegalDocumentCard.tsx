import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Only rendered when a PDF has actually been uploaded and saved. A missing
 * document stays hidden instead of advertising a broken download.
 */
export default function LegalDocumentCard({ termsUrl }: { termsUrl: string | null }) {
  const t = useTranslations("legal");
  if (!termsUrl) return null;

  return (
    <section aria-labelledby="legal-document-title" className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-[#6328f5]/[0.08] via-white to-[#4f6bff]/[0.08] p-6 shadow-[0_28px_70px_-55px_rgba(99,40,245,0.65)] sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#6328f5]/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-primary/15 bg-white/85 text-[10px] font-bold tracking-[0.12em] text-primary shadow-sm">
            PDF
          </span>
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 id="legal-document-title" className="mt-2 font-editorial text-3xl tracking-tight text-ink">
              {t("title")}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{t("description")}</p>
          </div>
        </div>
        <div className="shrink-0 sm:text-right">
          <ButtonLink href={termsUrl} external size="lg">
            {t("open")} ↗
          </ButtonLink>
          <p className="mt-2 max-w-xs text-[11px] leading-relaxed text-muted">{t("note")}</p>
        </div>
      </div>
    </section>
  );
}
