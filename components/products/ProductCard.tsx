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
      className="glass-card glass-card-hover group flex h-full flex-col overflow-hidden rounded-3xl p-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-soft ring-1 ring-white/80">
        <Image
          src={product.previews[0]}
          alt={`${product.name[locale]} — ${t("previewAlt")}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {product.featured ? (
          <span className="glass absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-primary">
            ★ {tc("featured")}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted">
          {category ? <span className="rounded-full bg-primary/5 px-2.5 py-1 text-primary">{category.name[locale]}</span> : null}
          <span className="ml-auto text-[11px] font-medium tracking-wide uppercase">{product.currency}</span>
        </div>

        <h3 className="mt-3 text-base font-extrabold text-ink group-hover:text-primary">
          {product.name[locale]}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{product.summary[locale]}</p>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="text-[11px] font-semibold text-muted uppercase">{t("cardFrom")}</p>
            <p className="text-lg font-extrabold text-ink">
              {formatPrice(product.price, product.currency, locale)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
            {tc("viewDetails")}
            <InlineArrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
