import { siteConfig } from "./site";
import { LocalizedText } from "./i18n-types";

export type CategoryId = "landing-pages" | "business-websites" | "portfolio" | "ecommerce";

export type CategoryIcon = "rocket" | "building" | "person" | "cart";

export type Category = {
  id: CategoryId;
  name: LocalizedText;
  description: LocalizedText;
  icon: CategoryIcon;
};

export const categories: Category[] = [
  {
    id: "landing-pages",
    name: { id: "Landing Page", en: "Landing Pages" },
    description: {
      id: "Satu halaman yang fokus pada satu tujuan: mengubah pengunjung menjadi leads.",
      en: "One page focused on a single goal: turning visitors into leads.",
    },
    icon: "rocket",
  },
  {
    id: "business-websites",
    name: { id: "Website Bisnis", en: "Business Websites" },
    description: {
      id: "Situs perusahaan yang rapi dan kredibel untuk membangun kepercayaan.",
      en: "Clean, credible company sites that build trust.",
    },
    icon: "building",
  },
  {
    id: "portfolio",
    name: { id: "Portofolio", en: "Portfolio" },
    description: {
      id: "Panggung untuk menampilkan karya dan keahlian dengan elegan.",
      en: "An elegant stage to showcase work and expertise.",
    },
    icon: "person",
  },
  {
    id: "ecommerce",
    name: { id: "E-commerce", en: "E-commerce" },
    description: {
      id: "Storefront dan halaman produk yang dirancang untuk konversi.",
      en: "Storefronts and product pages designed for conversion.",
    },
    icon: "cart",
  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

export const site = siteConfig;
