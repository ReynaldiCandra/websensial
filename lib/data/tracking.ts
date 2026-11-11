export type VerificationTag = { name: string; content: string };

/**
 * Third-party tracking and domain-verification settings. IDs are nullable so
 * the admin can show an honest "not configured" state. Nothing is injected
 * when a value is empty.
 */
export type TrackingSettings = {
  /** Meta (Facebook) Pixel ID, digits only. */
  metaPixelId: string | null;
  /** GA4 measurement ID, e.g. G-XXXXXXXXXX. */
  gaMeasurementId: string | null;
  /** Google Ads tag ID, e.g. AW-XXXXXXXXXX. */
  googleAdsId: string | null;
  /** Content for <meta name="google-site-verification">. */
  googleSiteVerification: string | null;
  /** Content for <meta name="facebook-domain-verification">. */
  metaDomainVerification: string | null;
  /** Content for <meta name="msvalidate.01"> (Bing). */
  bingSiteVerification: string | null;
  /** Extra domain-verification meta tags, e.g. p:domain_verify. */
  additionalVerifications: VerificationTag[];
};

export const defaultTracking: TrackingSettings = {
  metaPixelId: null,
  gaMeasurementId: null,
  googleAdsId: null,
  googleSiteVerification: null,
  metaDomainVerification: null,
  bingSiteVerification: null,
  additionalVerifications: [],
};

const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const optional = (value: unknown) => {
  const text = clean(value);
  return text.length > 0 ? text : null;
};
const isPrintable = (value: string) => /^[\x20-\x7E]{1,500}$/.test(value);
const verificationFields = ["googleSiteVerification", "metaDomainVerification", "bingSiteVerification"] as const;

/** Stored CMS copies can predate this feature or a field; fill in empty defaults. */
export function normalizeTracking(value: unknown): TrackingSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) return structuredClone(defaultTracking);
  const source = value as Record<string, unknown>;

  return {
    metaPixelId: optional(source.metaPixelId),
    gaMeasurementId: optional(source.gaMeasurementId),
    googleAdsId: optional(source.googleAdsId),
    googleSiteVerification: optional(source.googleSiteVerification),
    metaDomainVerification: optional(source.metaDomainVerification),
    bingSiteVerification: optional(source.bingSiteVerification),
    additionalVerifications: Array.isArray(source.additionalVerifications)
      ? source.additionalVerifications
        .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object" && !Array.isArray(entry))
        .map((entry) => ({ name: clean(entry.name), content: clean(entry.content) }))
        .filter((entry) => entry.name.length > 0 && entry.content.length > 0)
        .slice(0, 10)
      : [],
  };
}

export function validateTracking(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Pengaturan pelacakan tidak valid.";
  const source = value as Record<string, unknown>;

  for (const field of ["metaPixelId", "gaMeasurementId", "googleAdsId", ...verificationFields] as const) {
    const entry = source[field];
    if (entry === null || entry === undefined) continue;
    if (typeof entry !== "string" || !isPrintable(entry)) return `Nilai ${field} tidak valid.`;
    const text = entry.trim();
    if (!text) continue;
    if (field === "metaPixelId" && !/^\d{10,20}$/.test(text)) return "Meta Pixel ID harus berupa 15–16 digit angka.";
    if (field === "gaMeasurementId" && !/^G-[A-Z0-9]{4,20}$/i.test(text)) return "Measurement ID Google Analytics harus berformat G-XXXXXXXXXX.";
    if (field === "googleAdsId" && !/^AW-\d{6,15}$/i.test(text)) return "Google Ads ID harus berformat AW-XXXXXXXXXX.";
    if ((field === "googleSiteVerification" || field === "metaDomainVerification" || field === "bingSiteVerification")
      && !/^[A-Za-z0-9_.-]{6,300}$/.test(text)) return `Kode verifikasi ${field} tidak valid.`;
  }

  if (!Array.isArray(source.additionalVerifications) || source.additionalVerifications.length > 10) {
    return "Daftar verifikasi tambahan tidak valid.";
  }
  for (const entry of source.additionalVerifications) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return "Verifikasi tambahan tidak valid.";
    const name = (entry as Record<string, unknown>).name;
    const content = (entry as Record<string, unknown>).content;
    if (typeof name !== "string" || !/^[A-Za-z0-9_.:-]{2,100}$/.test(name.trim())) {
      return "Nama meta verifikasi tambahan tidak valid (contoh: p:domain_verify).";
    }
    if (typeof content !== "string" || !isPrintable(content.trim())) {
      return "Isi meta verifikasi tambahan tidak valid.";
    }
  }

  return null;
}

export function hasTrackingScripts(tracking: TrackingSettings) {
  return Boolean(tracking.metaPixelId || tracking.gaMeasurementId || tracking.googleAdsId);
}

export function hasVerificationTags(tracking: TrackingSettings) {
  return Boolean(
    tracking.googleSiteVerification
    || tracking.metaDomainVerification
    || tracking.bingSiteVerification
    || tracking.additionalVerifications.length > 0,
  );
}
