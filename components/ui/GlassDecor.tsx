import Image from "next/image";

/**
 * Decorative 3D glass objects from the visual asset pack.
 * Always non-interactive and layered behind content: callers position them
 * with `className` and must keep them clear of headline/CTA areas.
 */
export type GlassAsset = "cube" | "sphere" | "diamond" | "ring" | "pedestal" | "panel";

const ASSETS: Record<GlassAsset, { src: string; width: number; height: number }> = {
  cube: { src: "/3d/cube-glass.svg", width: 240, height: 240 },
  sphere: { src: "/3d/sphere-glass.svg", width: 240, height: 240 },
  diamond: { src: "/3d/diamond-glass.svg", width: 240, height: 240 },
  ring: { src: "/3d/ring-glass.svg", width: 240, height: 240 },
  pedestal: { src: "/3d/glass-pedestal.svg", width: 420, height: 180 },
  panel: { src: "/3d/floating-panel.svg", width: 360, height: 220 },
};

/** Every object gets its own cycle so the scene never pulses in lockstep. */
const FLOAT_TIMING: Record<GlassAsset, { duration: number; delay: number }> = {
  cube: { duration: 9, delay: 0 },
  sphere: { duration: 12, delay: 0.9 },
  diamond: { duration: 10.5, delay: 1.7 },
  ring: { duration: 14, delay: 0.4 },
  pedestal: { duration: 16, delay: 1.2 },
  panel: { duration: 13, delay: 2.1 },
};

export function GlassObject({
  asset,
  className = "",
  float = false,
}: {
  asset: GlassAsset;
  className?: string;
  float?: boolean;
}) {
  const { src, width, height } = ASSETS[asset];
  const timing = FLOAT_TIMING[asset];

  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      unoptimized
      style={
        float
          ? { animationDuration: `${timing.duration}s`, animationDelay: `${timing.delay}s` }
          : undefined
      }
      className={`pointer-events-none absolute select-none ${float ? "float-slow" : ""} ${className}`}
    />
  );
}

/**
 * Soft lavender-glass backdrop using the pack's background SVG.
 * Place as the first child of a `relative overflow-hidden` section.
 */
export function SectionBackground({ imageClassName = "opacity-60" }: { imageClassName?: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src="/backgrounds/lavender-glass-background.svg"
        alt=""
        fill
        unoptimized
        sizes="100vw"
        className={`object-cover object-top ${imageClassName}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/55" />
    </div>
  );
}
