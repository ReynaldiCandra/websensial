import type { Product } from "@/lib/data/products";
import { siteConfig } from "@/lib/data/site";

/** Catalog currency per site language: Indonesian pages quote IDR, English USD. */
export function priceCurrencyFor(locale: string): Product["currency"] {
  return locale === "en" ? "USD" : "IDR";
}

/** True when the shown price was converted from the product's own currency. */
export function isPriceConverted(currency: Product["currency"], locale: string): boolean {
  return currency !== priceCurrencyFor(locale);
}

/** Converts between catalog currencies using the indicative site rate. */
export function convertPrice(price: number, from: Product["currency"], to: Product["currency"]): number {
  if (from === to) return price;
  const rate = siteConfig.currency.idrPerUsd;
  return from === "IDR" ? Math.max(1, Math.round(price / rate)) : Math.round(price * rate);
}

/**
 * Price for the visitor's language. Whole units only, and a converted amount is
 * prefixed with "≈" so the estimate is never mistaken for a quoted price.
 */
export function displayPrice(price: number, currency: Product["currency"], locale: string): string {
  const target = priceCurrencyFor(locale);
  const amount = convertPrice(price, currency, target);
  const text = new Intl.NumberFormat(target === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: target,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return target === currency ? text : `≈ ${text}`;
}

/** Lowercase technical label shown on cards/detail pages. */
export function formatValue(product: Product): string {
  switch (product.format) {
    case "nextjs":
      return "Next.js";
    case "html":
      return "HTML / CSS / JS";
    case "figma":
      return "Figma";
  }
}
