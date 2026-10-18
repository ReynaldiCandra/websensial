"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import RichText from "@/components/ui/RichText";
import { siteConfig } from "@/lib/data/site";

type FieldErrors = { name?: string; email?: string; message?: string };

const TOPIC_KEYS = ["templateQuestion", "serviceInquiry", "partnership", "other"] as const;

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale() as "id" | "en";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<(typeof TOPIC_KEYS)[number]>("templateQuestion");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [mailDraft, setMailDraft] = useState<string | null>(null);

  function validate(): boolean {
    const nextErrors: FieldErrors = {};
    if (name.trim().length < 2) nextErrors.name = t("errors.nameRequired");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) nextErrors.email = t("errors.emailInvalid");
    if (message.trim().length < 10) nextErrors.message = t("errors.messageTooShort");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    // No email backend is configured yet: @see siteConfig. Compose an
    // honest mailto draft instead of pretending a delivery occurred.
    const subject = `[Websensial] ${t(`topics.${topic}`)} — ${name.trim()}`;
    const body = `${message.trim()}\n\n—\n${name.trim()}\n${email.trim()}`;
    const mailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setMailDraft(mailto);
  }

  if (mailDraft) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <h3 className="text-lg font-extrabold text-ink">{t("successTitle")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t("successText")}</p>
        <a
          href={mailDraft}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-strong"
        >
          {t("openMailApp")} ↗
        </a>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          <RichText text={t("integrationNote")} strongClassName="font-semibold text-ink" />
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <div>
        <label htmlFor="name" className="text-sm font-bold text-ink">
          {t("name")} <span className="text-primary">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder={t("namePlaceholder")}
          className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-400"
        />
        {errors.name ? (
          <p id="name-error" className="mt-1 text-xs font-semibold text-red-600">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-bold text-ink">
          {t("email")} <span className="text-primary">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder={t("emailPlaceholder")}
          className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-400"
        />
        {errors.email ? (
          <p id="email-error" className="mt-1 text-xs font-semibold text-red-600">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="topic" className="text-sm font-bold text-ink">
          {t("topic")}
        </label>
        <select
          id="topic"
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as (typeof TOPIC_KEYS)[number])}
          className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary"
        >
          {TOPIC_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(`topics.${key}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-bold text-ink">
          {t("message")} <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder={t("messagePlaceholder")}
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-400"
        />
        {errors.message ? (
          <p id="message-error" className="mt-1 text-xs font-semibold text-red-600">
            {errors.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
      >
        {t("submit")}
      </button>

      <p className="text-xs leading-relaxed text-muted">
        <RichText text={t("integrationNote")} strongClassName="font-semibold text-ink" />
      </p>
      <span className="sr-only">
        {locale === "en" ? "Powered by your own email app until a backend is configured." : "Kirim memakai aplikasi email Anda sampai backend tersedia."}
      </span>
    </form>
  );
}
