import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import { GlassObject } from "@/components/ui/GlassDecor";

const ICONS = [
  "M4 5h16v11H4z M8 20h8 M12 16v4",
  "M3 4h18v4H3z M3 12h8v8H3z M14 12h7v8h-7z",
  "M4 19V5 M4 19h16 M8 15l4-5 3 3 5-6",
  "M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12L4 7.5",
];

export default function ValueProps() {
  const t = useTranslations("home");
  const items = t.raw("valueProps") as { title: string; text: string }[];

  return (
    /* The top padding is the whole hero → feature gap (40px mobile, 48px
       tablet, 64px desktop) and its gradient starts on the exact colour the
       hero ends with, so the two sections read as one continuous surface. */
    <div className="bg-hero-band relative overflow-hidden pt-10 pb-8 sm:pt-12 sm:pb-10 lg:pt-16 lg:pb-12">
      <GlassObject asset="ring" className="-top-24 -left-24 hidden w-36 rotate-12 opacity-50 lg:block" float />
      <GlassObject asset="sphere" className="-right-16 -bottom-20 hidden w-28 opacity-60 xl:block" float />
      <Container className="relative">
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.07} className="min-w-0">
              {/* Icon stacks above the copy at narrow widths, sits inline once
                  there is room for a comfortable line length. */}
              <div className="glass-card glass-card-hover flex h-full flex-col items-start gap-2.5 rounded-2xl p-3.5 sm:flex-row sm:gap-3.5 sm:p-5 lg:flex-col lg:gap-2.5 xl:flex-row xl:gap-3.5">
                <span className="inline-grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary/15 to-lavender/30 text-primary sm:h-10 sm:w-10 sm:rounded-xl">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={ICONS[index % ICONS.length]} />
                  </svg>
                </span>
                <div className="min-w-0">
                  <h2 className="text-[13px] leading-snug font-extrabold text-ink sm:text-sm">{item.title}</h2>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-muted sm:text-sm">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
