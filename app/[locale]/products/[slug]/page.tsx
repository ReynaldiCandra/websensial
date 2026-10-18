import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import ProductGallery from "@/components/products/ProductGallery";
import DemoPurchaseActions from "@/components/products/DemoPurchaseActions";
import ProductCard from "@/components/products/ProductCard";
import { formatPrice, formatValue } from "@/components/ui/format";
import { getCategory } from "@/lib/data/categories";
import { getProductBySlug, getPublishedProducts, getRelatedProducts } from "@/lib/data/products";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return getPublishedProducts().map((product) => ({ slug: product.slug }));
}

async function resolveProduct(params: Props["params"]) {
  const { locale, slug } = await params;
  return {
    locale: locale === "en" ? ("en" as const) : ("id" as const),
    product: getProductBySlug(slug),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, product } = await resolveProduct(params);
  if (!product) {
    return { title: "404" };
  }
  return {
    title: product.name[locale],
    description: product.summary[locale],
    alternates: {
      canonical: `/${locale}/products/${product.slug}`,
      languages: { id: `/id/products/${product.slug}`, en: `/en/products/${product.slug}` },
    },
    openGraph: {
      title: product.name[locale],
      description: product.summary[locale],
      images: [{ url: product.previews[0] }],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, product } = await resolveProduct(params);
  if (!product) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("product");
  const tp = await getTranslations("common");
  const category = getCategory(product.category);
  const related = getRelatedProducts(product);

  return (
    <Container className="pt-10 pb-24">
      <nav aria-label={t("backToCatalog")} className="mb-6 text-sm">
        <Link href="/products" className="font-semibold text-muted hover:text-primary">
          ← {t("backToCatalog")}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <ProductGallery previews={product.previews} productName={product.name[locale]} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {category ? (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {category.name[locale]}
              </span>
            ) : null}
            <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-muted">
              {t("formatLabel")}: {formatValue(product)}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">{product.name[locale]}</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{product.summary[locale]}</p>

          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-ink">
              {formatPrice(product.price, product.currency, locale)}
            </span>
            <span className="text-xs text-muted">· {tp("oneTime")}</span>
          </div>

          <div className="mt-6">
            <DemoPurchaseActions demoUrl={product.liveDemoUrl} purchaseUrl={product.purchaseUrl} />
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-3 text-sm">
            <DetailRow label={t("techLabel")} values={product.tech[locale]} />
            <DetailRow label={t("compatibilityLabel")} values={product.compatibility[locale]} />
          </dl>

          <div className="mt-6 rounded-2xl border border-line bg-white p-5">
            <h2 className="text-sm font-extrabold text-ink">{t("licenseLabel")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{product.license[locale]}</p>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <section aria-labelledby="full-desc">
          <h2 id="full-desc" className="text-xl font-extrabold text-ink">
            {t("descriptionLabel")}
          </h2>
          <p className="mt-3 leading-relaxed text-ink/80">{product.description[locale]}</p>
        </section>

        <aside className="space-y-6">
          <section aria-labelledby="features" className="rounded-2xl border border-line bg-white p-5">
            <h2 id="features" className="text-sm font-extrabold text-ink">
              {t("featuresLabel")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink/80">
              {product.features[locale].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="files" className="rounded-2xl border border-line bg-white p-5">
            <h2 id="files" className="text-sm font-extrabold text-ink">
              {t("includedFilesLabel")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink/80">
              {product.includedFiles[locale].map((file) => (
                <li key={file} className="flex items-start gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                  {file}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="install" className="rounded-2xl border border-line bg-white p-5">
            <h2 id="install" className="text-sm font-extrabold text-ink">
              {t("installLabel")}
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink/80">
              {product.installRequirements[locale].map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="related" className="mt-16">
          <h2 id="related" className="text-xl font-extrabold text-ink">
            {t("relatedLabel")}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((candidate) => (
              <ProductCard key={candidate.id} product={candidate} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}

function DetailRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-3">
      <dt className="text-xs font-bold tracking-wider text-muted uppercase">{label}</dt>
      <dd className="mt-1 text-ink/90">{values.join(" · ")}</dd>
    </div>
  );
}
