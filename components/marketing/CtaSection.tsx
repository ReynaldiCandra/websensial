import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { GlassObject, SectionBackground } from "@/components/ui/GlassDecor";

export default function CtaSection() {
  const t = useTranslations("home.cta");

  return (
    <Container className="relative py-20">
      <Reveal>
        <div className="relative rounded-[2.15rem] bg-gradient-to-br from-white via-lavender/50 to-blue/25 p-[1.5px] shadow-[0_36px_90px_-46px_rgba(87,65,190,0.6)]">
          <div className="glass-card relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-12 sm:py-14">
            <SectionBackground imageClassName="opacity-90" />

            <GlassObject
              asset="cube"
              className="-top-6 right-[24%] hidden w-24 rotate-12 opacity-80 sm:block"
              float
            />
            <GlassObject asset="sphere" className="-bottom-12 -left-8 hidden w-32 opacity-75 sm:block" float />
            <GlassObject
              asset="ring"
              className="-right-10 -bottom-16 hidden w-52 rotate-6 opacity-70 lg:block"
              float
            />
            <GlassObject asset="diamond" className="top-8 right-[6%] hidden w-14 -rotate-12 opacity-70 xl:block" />

            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-xl font-extrabold tracking-tight text-ink text-balance sm:text-3xl">
                  {t("title")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">{t("text")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <ButtonLink href="/contact" size="lg" className="shadow-[0_10px_30px_-8px_rgba(99,40,245,0.55)]">
                  {t("secondary")}
                </ButtonLink>
                <ButtonLink href="/products" size="lg" variant="secondary">
                  {t("primary")}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
