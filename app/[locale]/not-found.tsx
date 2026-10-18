import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <Container className="grid place-items-center py-32 text-center">
      <p className="text-7xl font-extrabold text-primary/20" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink">{t("title")}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{t("text")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/" size="lg">
          {t("backHome")}
        </ButtonLink>
        <ButtonLink href="/products" variant="secondary" size="lg">
          {t("backCatalog")}
        </ButtonLink>
      </div>
    </Container>
  );
}

