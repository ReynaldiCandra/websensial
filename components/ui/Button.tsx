import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-60";
const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-strong",
  secondary: "border border-line bg-white text-ink hover:border-primary/40 hover:bg-soft",
  ghost: "text-primary hover:bg-primary/5",
};
const sizes: Record<Size, string> = {
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-[15px]",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
  disabled = false,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Opens the destination in a new tab (for configured external URLs). */
  external?: boolean;
  className?: string;
  /** Renders a non-interactive, labeled disabled button (honest unavailable state). */
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (disabled) {
    return (
      <button type="button" disabled aria-disabled="true" aria-label={ariaLabel} className={classes}>
        {children}
      </button>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={classes}>
      {children}
    </Link>
  );
}

export function InlineArrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
