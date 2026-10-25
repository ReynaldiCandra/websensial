import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/data/products";
import { getCategory } from "@/lib/data/categories";
import { formatPrice } from "@/components/ui/format";
import { InlineArrow } from "@/components/ui/Button";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const locale = useLocale() as "id" | "en";
  const category = getCategory(product.category);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="portfolio-card group flex h-full flex-col overflow-hidden rounded-[0.3rem] border-0 bg-transparent transition-colors"
    >
      <div className="portfolio-collection-preview relative aspect-[16/10] overflow-hidden rounded-[0.3rem] bg-[#e4e3df]">
        <Image
          src={product.previews[0]}
          alt={`${product.name[locale]} — ${t("previewAlt")}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="portfolio-preview-motion object-cover object-top shadow-[0_8px_24px_-16px_rgba(20,24,24,0.35)]"
        />
        {product.featured ? (
          <span className="absolute top-3 left-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-semibold text-ink">
            ★ {tc("featured")}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-base font-semibold tracking-tight text-ink group-hover:text-muted sm:text-lg">
            {product.name[locale]}
          </h3>
          {category ? <span className="ml-auto text-right text-[9px] text-muted sm:text-[10px]">{category.name[locale]}</span> : null}
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{product.summary[locale]}</p>

        <div className="mt-3 flex items-center justify-between border-y border-line py-2 text-[10px]">
          <span className="font-medium text-ink">{tc("viewDetails")} <InlineArrow className="inline h-3 w-3" /></span>
          <span className="text-muted">{product.format.toUpperCase()}</span>
        </div>
        <details className="group/details">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-[10px] text-muted [&::-webkit-details-marker]:hidden">
            {t("cardFrom")} · {formatPrice(product.price, product.currency, locale)}
            <span className="text-sm leading-none transition-transform group-open/details:rotate-45">+</span>
          </summary>
          <p className="border-t border-line py-2 text-[10px] text-muted">{product.summary[locale]}</p>
        </details>
      </div>
    </Link>
  );
}
