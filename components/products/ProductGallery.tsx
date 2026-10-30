"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PreviewImage from "@/components/ui/PreviewImage";

export default function ProductGallery({ previews, productName }: { previews: string[]; productName: string }) {
  const t = useTranslations("product");
  const [activeIndex, setActiveIndex] = useState(0);
  // Landing pages are one long page, so the frame follows each slide's real
  // aspect ratio instead of cropping it into a 16:10 box. Ratios are kept per
  // slide so returning to a slide does not flash the default frame.
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const current = previews[activeIndex] ?? previews[0];
  const ratio = current ? ratios[current] ?? null : null;

  if (!current) return null;
  const showSlide = (index: number) => setActiveIndex((index + previews.length) % previews.length);
  const isTall = ratio !== null && ratio < 1.15;

  return (
    <div>
      <div className="relative">
        <div className={`rounded-2xl border border-line bg-soft ${isTall ? "overflow-y-auto overscroll-contain" : "overflow-hidden"}`} style={isTall ? { maxHeight: "80vh" } : undefined}>
          <div className="relative w-full" style={{ aspectRatio: ratio ? `${ratio}` : "16 / 10" }}>
            <PreviewImage
              key={current}
              src={current}
              alt={t("previewLabel")}
              fallbackLabel={t("imageUnavailable")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain"
              onLoad={(event) => {
                const image = event.currentTarget;
                if (image.naturalWidth <= 0 || image.naturalHeight <= 0) return;
                const next = image.naturalWidth / image.naturalHeight;
                setRatios((values) => (values[current] === next ? values : { ...values, [current]: next }));
              }}
            />
          </div>
        </div>
        {previews.length > 1 ? <>
          <button type="button" onClick={() => showSlide(activeIndex - 1)} aria-label={t("previousPreview")} className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/90 text-xl text-ink shadow-sm">‹</button>
          <button type="button" onClick={() => showSlide(activeIndex + 1)} aria-label={t("nextPreview")} className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/90 text-xl text-ink shadow-sm">›</button>
        </> : null}
      </div>
      {isTall ? (
        <p className="mt-2 text-xs leading-relaxed text-muted">
          {t("previewScrollHint")}{" "}
          <a href={current} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">
            {t("openFullPreview")}
          </a>
        </p>
      ) : null}

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
            <PreviewImage src={preview} alt={`${t("previewLabel")} ${index + 1}`} fallbackLabel={t("imageUnavailable")} hideFallbackText fill sizes="96px" className="object-cover object-top" />
          </button>
        ))}
      </div>
      <span className="sr-only">{t("previewSlide", { current: activeIndex + 1, total: previews.length })}</span>
    </div>
  );
}
