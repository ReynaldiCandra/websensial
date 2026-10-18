import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ButtonLink, InlineArrow } from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";

/**
 * Hero visual = art-directed composition from the visual asset pack
 * (`public/hero/hero-dashboard-composition.png`, converted to WebP).
 * The artwork already contains the dashboard, floating panels, glass objects
 * and the phone mockup as one coherent scene, so nothing overlaps the text,
 * CTAs or each other. Copy and CTAs stay real HTML on top of the page.
 */
const SCENE_BLUR =
  "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAwCdASoUAAsAPu1iqU2ppaOiMAgBMB2JYwAAXKOqCju7PHkfy/AAAP7tSMBwozlTYzznsQsXmt63NATLDG7K+kT4BnLdpakh3INIAAA=";

export default function Hero() {
  const t = useTranslations("home.hero");
  const tc = useTranslations("common");

  return (
    <section className="bg-mesh relative overflow-x-clip pt-8 pb-0 sm:pt-10 lg:pt-14">
      {/* Ambient lavender light behind the scene so the artwork blends into the page */}
      <div
        aria-hidden="true"
        className="glow-drift pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] bg-[radial-gradient(60%_70%_at_70%_45%,rgba(165,139,255,0.28),transparent_72%)] lg:block"
      />

      <div className="relative mx-auto grid max-w-[1360px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-6">
        <Reveal className="relative z-20 max-w-[34rem]">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            {t("badge")}
          </span>

          <h1 className="mt-5 text-[2.15rem] leading-[1.08] font-extrabold tracking-tight text-balance text-ink sm:text-[2.85rem] lg:text-[2.9rem] xl:text-[3.05rem]">
            {t("titleLine1")}{" "}
            <span className="bg-gradient-to-r from-primary via-[#7c5cff] to-blue bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>{" "}
            {t("titleLine2")}
          </h1>

          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted sm:text-base">{t("subtitle")}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink
              href="/products"
              size="lg"
              className="bg-gradient-to-r from-primary to-blue shadow-[0_12px_32px_-8px_rgba(99,40,245,0.55)] hover:from-primary-strong hover:to-primary"
            >
              {t("primaryCta")}
              <InlineArrow />
            </ButtonLink>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm font-bold text-ink hover:text-primary"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-primary shadow-[0_6px_20px_-6px_rgba(87,65,190,0.35)] transition-transform group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5v15l12-7.5z" />
                </svg>
              </span>
              <span className="text-left leading-tight">
                {t("secondaryCta")}
                <span className="mt-0.5 block text-xs font-medium text-muted">{t("secondaryNote")}</span>
              </span>
            </Link>
          </div>
        </Reveal>

        <Reveal
          delay={0.12}
          className="relative z-0 w-full lg:-mr-6 lg:w-[calc(100%+1.5rem)] xl:-mr-12 xl:w-[calc(100%+3rem)]"
        >
          <span className="glass absolute -top-3 right-2 z-20 hidden items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold text-primary sm:inline-flex lg:right-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            {t("sceneBadge")}
          </span>

          {/* The whole artwork drifts as one scene; nothing inside it moves on its own. */}
          <div className="hero-scene-float">
            <Image
              src="/hero/hero-dashboard-composition.webp"
              alt={tc("heroDecorationAriaLabel")}
              width={1600}
              height={900}
              priority
              quality={88}
              placeholder="blur"
              blurDataURL={SCENE_BLUR}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 96vw, 60vw"
              className="hero-scene-mask h-auto w-full select-none"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
