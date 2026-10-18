"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { categories, type CategoryId } from "@/lib/data/categories";
import { getPublishedProducts } from "@/lib/data/products";
import ProductCard from "./ProductCard";
import Reveal from "@/components/motion/Reveal";

const FORMAT_OPTIONS = ["all", "nextjs", "html", "figma"] as const;
type FormatFilter = (typeof FORMAT_OPTIONS)[number];

export default function ProductsBrowser() {
  const t = useTranslations("products");
  const locale = useLocale() as "id" | "en";
  const searchParams = useSearchParams();

  // Category comes from the URL so header/footer links can deep-link into a
  // filtered catalog; search text and format are local state.
  const selectedCategory = (searchParams.get("category") ?? "all") as CategoryId | "all";
  const [query, setQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all");

  const products = useMemo(() => getPublishedProducts(), []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name[locale].toLowerCase().includes(normalizedQuery) ||
        product.summary[locale].toLowerCase().includes(normalizedQuery) ||
        product.tech[locale].some((tech) => tech.toLowerCase().includes(normalizedQuery)) ||
        product.features[locale].some((feature) => feature.toLowerCase().includes(normalizedQuery));
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesFormat = formatFilter === "all" || product.format === formatFilter;
      return matchesQuery && matchesCategory && matchesFormat;
    });
  }, [products, query, selectedCategory, formatFilter, locale]);

  const hasActiveFilters =
    selectedCategory !== "all" || formatFilter !== "all" || query.trim().length > 0;

  function clearFilters() {
    setQuery("");
    setFormatFilter("all");
  }

  return (
    <div>
      <div className="glass flex flex-col gap-3 rounded-2xl p-3 sm:rounded-full sm:flex-row sm:items-center sm:px-4">
        <div className="relative flex-1">
          <label htmlFor="product-search" className="sr-only">
            {t("searchLabel")}
          </label>
          <svg
            viewBox="0 0 24 24"
            className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full rounded-xl border border-line bg-white pr-4 pl-10 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-primary/40 sm:rounded-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <CategoryChip href="/products" active={selectedCategory === "all"}>
            {t("filterAll")}
          </CategoryChip>
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              href={`/products?category=${category.id}`}
              active={selectedCategory === category.id}
            >
              {category.name[locale]}
            </CategoryChip>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold tracking-wider text-muted uppercase">{t("format.label")}</span>
        {FORMAT_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFormatFilter(option)}
            aria-pressed={formatFilter === option}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              formatFilter === option ? "bg-primary text-white" : "bg-soft text-muted hover:text-primary"
            }`}
          >
            {t(`format.${option}`)}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-semibold text-muted" aria-live="polite">
        {t("results", { count: filtered.length })}
        {hasActiveFilters ? (
          <>
            {" · "}
            <button type="button" onClick={clearFilters} className="text-primary underline underline-offset-2">
              {t("clearFilters")}
            </button>
          </>
        ) : null}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-soft px-6 py-16 text-center">
          <p className="text-lg font-extrabold text-ink">{t("emptyTitle")}</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{t("emptyText")}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index * 0.05, 0.3)}>
              <ProductCard product={product} priority={index < 3} />
            </Reveal>
          ))}
        </div>
      )}

      <p className="mt-12 rounded-xl bg-lavender/10 px-4 py-3 text-center text-xs font-medium text-ink/80">
        {t("demoNotice")}
      </p>
    </div>
  );
}

function CategoryChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
        active ? "bg-primary text-white" : "bg-white text-muted ring-1 ring-line hover:text-primary"
      }`}
    >
      {children}
    </Link>
  );
}
