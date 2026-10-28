import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import RichText from "@/components/ui/RichText";

export default function DemoPurchaseActions({
  demoUrl,
  purchaseUrl,
  whatsappUrl,
}: {
  demoUrl: string | null;
  purchaseUrl: string | null;
  whatsappUrl: string | null;
}) {
  const tc = useTranslations("common");
  const allConfigured = Boolean(demoUrl) && Boolean(purchaseUrl);

  return (
    <section aria-label="actions" className="rounded-2xl border border-line bg-soft p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        {demoUrl ? (
          <ButtonLink href={demoUrl} external variant="secondary" size="lg" className="flex-1">
            {tc("livePreview")} ↗
          </ButtonLink>
        ) : (
          <ButtonLink href="#!" disabled variant="secondary" size="lg" className="flex-1" ariaLabel={tc("notConfiguredTitle.demo")}>
            {tc("livePreview")}
          </ButtonLink>
        )}
        {purchaseUrl ? (
          <ButtonLink href={purchaseUrl} external size="lg" className="flex-1">
            {tc("buy")}
          </ButtonLink>
        ) : whatsappUrl ? (
          <ButtonLink href={whatsappUrl} external size="lg" className="flex-1">
            {tc("contactOnWhatsApp")}
          </ButtonLink>
        ) : (
          <ButtonLink href="/contact" variant="secondary" size="lg" className="flex-1">
            {tc("contactToBuy")}
          </ButtonLink>
        )}
      </div>

      {!allConfigured ? (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          <RichText
            text={tc("notConfiguredBody", {
              kind: [tc("livePreview"), tc("buy")].filter((_, index) => (index === 0 ? !demoUrl : !purchaseUrl && !whatsappUrl)).join(" / "),
            })}
            strongClassName="font-semibold text-ink"
          />
        </p>
      ) : null}
    </section>
  );
}
