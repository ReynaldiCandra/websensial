import type { Product } from "@/lib/data/products";

const localeByCurrency: Record<Product["currency"], string> = {
  IDR: "id-ID",
  USD: "en-US",
};

/** Formats an integer price in its currency (e.g. Rp 490.000). */
export function formatPrice(price: number, currency: Product["currency"], locale?: string): string {
  return new Intl.NumberFormat(locale ?? localeByCurrency[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(price);
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
