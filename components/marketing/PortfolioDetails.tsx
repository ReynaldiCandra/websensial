"use client";

import { useState } from "react";

export type PortfolioDetailSection = {
  id: string;
  label: string;
  body?: string;
  items?: string[];
  note?: string;
};

/**
 * FAQ-style disclosure for the long project notes. Each section keeps its own
 * panel so the page stays short on phones, and only the first one starts open.
 */
export default function PortfolioDetails({ sections, title, eyebrow }: { sections: PortfolioDetailSection[]; title: string; eyebrow: string }) {
  const [openId, setOpenId] = useState<string | null>(sections[0]?.id ?? null);
  if (sections.length === 0) return null;

  return (
    <section aria-labelledby="project-details" className="mt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="project-details" className="mt-2 font-editorial text-3xl tracking-tight text-ink">
            {title}
          </h2>
        </div>
        <span aria-hidden="true" className="hidden h-px flex-1 bg-line sm:block" />
      </div>

      <div className="mt-5 space-y-2.5">
        {sections.map((section, index) => {
          const isOpen = openId === section.id;
          const triggerId = `portfolio-detail-trigger-${section.id}`;
          const panelId = `portfolio-detail-panel-${section.id}`;
          return (
            <article key={section.id} className={`portfolio-accordion${isOpen ? " is-open" : ""}`}>
              <h3>
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : section.id)}
                  className="portfolio-accordion-trigger"
                >
                  <span className="portfolio-accordion-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-left">{section.label}</span>
                  <span className="portfolio-accordion-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!isOpen}
                className="portfolio-accordion-panel"
              >
                <div>
                  <div className="portfolio-accordion-body">
                    {section.body ? (
                      <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{section.body}</p>
                    ) : null}
                    {section.items?.length ? (
                      <ul className={`space-y-2.5 text-sm text-ink/80${section.body ? " mt-3" : ""}`}>
                        {section.items.map((item, itemIndex) => (
                          <li key={`${section.id}-${itemIndex}`} className="flex items-start gap-2.5">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {section.note ? (
                      <p className="mt-3 border-l-2 border-primary/25 pl-3 text-xs leading-relaxed text-muted">{section.note}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
