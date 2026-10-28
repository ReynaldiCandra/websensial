"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ProductGallery({ previews, productName }: { previews: string[]; productName: string }) {
  const t = useTranslations("product");
  const [activeIndex, setActiveIndex] = useState(0);
  const current = previews[activeIndex] ?? previews[0];
  const showSlide = (index: number) => setActiveIndex((index + previews.length) % previews.length);

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
        {previews.length > 1 ? <>
          <button type="button" onClick={() => showSlide(activeIndex - 1)} aria-label={t("previousPreview")} className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/90 text-xl text-ink shadow-sm">‹</button>
          <button type="button" onClick={() => showSlide(activeIndex + 1)} aria-label={t("nextPreview")} className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/90 text-xl text-ink shadow-sm">›</button>
        </> : null}
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
            onClick={() => showSlide(index)}
            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
              index === activeIndex ? "border-primary" : "border-line hover:border-primary/40"
            }`}
          >
            <Image src={preview} alt={`${t("previewLabel")} ${index + 1}`} fill sizes="96px" className="object-cover object-top" />
          </button>
        ))}
      </div>
      <span className="sr-only">{t("previewSlide", { current: activeIndex + 1, total: previews.length })}</span>
    </div>
  );
}
