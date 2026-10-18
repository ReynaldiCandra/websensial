"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function ProductGallery({ previews, productName }: { previews: string[]; productName: string }) {
  const t = useTranslations("product");
  const locale = useLocale() as "id" | "en";
  const [activeIndex, setActiveIndex] = useState(0);
  const current = previews[activeIndex] ?? previews[0];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-soft">
        <Image
          src={current}
          alt={t("previewLabel")}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-top"
        />
      </div>

      <div
        className="mt-3 flex gap-3 overflow-x-auto pb-1"
        role="tablist"
        aria-label={`${t("previewLabel")} — ${productName}`}
      >
        {previews.map((preview, index) => (
          <button
            key={preview}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
              index === activeIndex ? "border-primary" : "border-line hover:border-primary/40"
            }`}
          >
            <Image src={preview} alt={`${t("previewLabel")} ${index + 1}`} fill sizes="96px" className="object-cover object-top" />
          </button>
        ))}
      </div>
      <span className="sr-only">{locale === "en" ? "Gallery controls" : "Kontrol galeri"}</span>
    </div>
  );
}
