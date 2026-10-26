import "server-only";
import { createClient } from "@supabase/supabase-js";
import { portfolioProjects, type PortfolioProject } from "@/lib/data/portfolio";
import { products, type Product } from "@/lib/data/products";

export type WebContent = {
  portfolio: PortfolioProject[];
  products: Product[];
};

const fallbackContent: WebContent = { portfolio: portfolioProjects, products };
const CONTENT_KEY = "site-v1";

function getCmsClient() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isCmsConfigured() {
  return Boolean(getCmsClient());
}

export function getBundledWebContent(): WebContent {
  return {
    portfolio: structuredClone(fallbackContent.portfolio),
    products: structuredClone(fallbackContent.products),
  };
}

export async function getWebContent(): Promise<WebContent> {
  const client = getCmsClient();
  if (!client) return fallbackContent;

  try {
    const { data, error } = await client
      .from("websensial_content")
      .select("content")
      .eq("content_key", CONTENT_KEY)
      .maybeSingle();
    if (error) throw error;
    if (!data?.content || typeof data.content !== "object") return fallbackContent;
    const content = data.content as Partial<WebContent>;
    return {
      portfolio: Array.isArray(content.portfolio) ? content.portfolio : fallbackContent.portfolio,
      products: Array.isArray(content.products) ? content.products : fallbackContent.products,
    };
  } catch (error) {
    console.error("Failed to load CMS content; serving bundled content instead.", error);
    return fallbackContent;
  }
}

export async function saveWebContent(content: WebContent) {
  const client = getCmsClient();
  if (!client) throw new Error("CMS belum dikonfigurasi.");

  const { error } = await client.from("websensial_content").upsert({
    content_key: CONTENT_KEY,
    content,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export function getCmsAdminClient() {
  return getCmsClient();
}
