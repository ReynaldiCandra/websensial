"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PortfolioPreviewGallery({ slides, projectName, category }: { slides: string[]; projectName: string; category: string }) {
  const t = useTranslations("portfolio");
  const [activeIndex, setActiveIndex] = useState(0);
  const showSlide = (index: number) => setActiveIndex((index + slides.length) % slides.length);
  if (slides.length === 0) return null;

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[0.3rem] bg-[#e4e3df] p-3 sm:p-5">
      <div className="portfolio-preview-motion absolute inset-3 overflow-hidden bg-white shadow-[0_8px_24px_-16px_rgba(20,24,24,0.35)] sm:inset-5">
        {slides.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`${projectName} — ${category} · ${t("previewSlide", { current: index + 1, total: slides.length })}`}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 44vw"
            className={`object-cover object-top transition-opacity duration-300 ${index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"}`}
            loading={index === 0 ? "eager" : "lazy"}
            aria-hidden={index !== activeIndex}
            priority={index === 0}
          />
        ))}
      </div>
      {slides.length > 1 ? (
        <>
          <button type="button" onClick={() => showSlide(activeIndex - 1)} aria-label={t("previousPreview")} className="absolute left-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/90 text-lg text-ink shadow-sm transition hover:bg-white sm:left-2">‹</button>
          <button type="button" onClick={() => showSlide(activeIndex + 1)} aria-label={t("nextPreview")} className="absolute right-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/90 text-lg text-ink shadow-sm transition hover:bg-white sm:right-2">›</button>
          <div className="absolute right-5 bottom-5 z-10 flex items-center gap-1.5 rounded-full bg-ink/75 px-2.5 py-1.5 sm:right-7 sm:bottom-7" aria-label={t("previewSlide", { current: activeIndex + 1, total: slides.length })}>
            {slides.map((_, index) => (
              <button key={index} type="button" onClick={() => showSlide(index)} aria-label={t("previewSlide", { current: index + 1, total: slides.length })} aria-current={index === activeIndex ? "true" : undefined} className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/60 hover:bg-white"}`} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
