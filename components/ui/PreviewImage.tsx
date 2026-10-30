"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type PreviewImageProps = Omit<ImageProps, "src" | "alt" | "onError"> & {
  src: string;
  alt: string;
  /** Shown visibly and to assistive tech when the file cannot be loaded. */
  fallbackLabel: string;
  /** Keeps tiny thumbnails from overflowing with fallback text. */
  hideFallbackText?: boolean;
};

/**
 * next/image with an honest "preview unavailable" state. Uploaded media can be
 * missing from storage or fail optimization; a broken image icon tells the
 * visitor nothing, so the block keeps the card layout and states the problem.
 */
export default function PreviewImage({ src, alt, fallbackLabel, hideFallbackText = false, className, ...props }: PreviewImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div role="img" aria-label={fallbackLabel} className="absolute inset-0 grid place-items-center bg-[#e4e3df] px-4 text-center">
        <span className="flex flex-col items-center gap-2 text-muted">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="m3 16 5-5 4 4 3-3 6 6" />
            <circle cx="9" cy="9" r="1.5" />
          </svg>
          {hideFallbackText ? null : <span className="text-[10px] font-medium tracking-[0.12em] uppercase">{fallbackLabel}</span>}
        </span>
      </div>
    );
  }

  return <Image src={src} alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
