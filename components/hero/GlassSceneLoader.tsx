"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";

// Three.js is loaded only in the browser, after the page is interactive.
const GlassScene = dynamic(() => import("./GlassScene"), { ssr: false, loading: () => null });

const noopSubscribe = () => () => {};

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Renders the R3F glass layer when WebGL is available; otherwise shows
 * `fallback` (static CSS objects) so the hero never depends on WebGL.
 * Server render uses the fallback, so no WebGL code runs during SSR.
 */
export default function GlassSceneLoader({ fallback }: { fallback: ReactNode }) {
  const webgl = useSyncExternalStore(noopSubscribe, supportsWebGL, () => false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );

  if (!webgl) return <>{fallback}</>;

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <GlassScene reduced={reduced} />
    </div>
  );
}
