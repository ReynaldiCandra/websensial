export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  action,
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  as?: "h2" | "h3";
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`mb-7 flex flex-col gap-3 ${
        align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between sm:text-left"
      }`}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-xl"}>
        <Tag className="font-editorial text-3xl leading-[0.98] tracking-[-0.035em] text-ink sm:text-4xl">{title}</Tag>
        {subtitle ? <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
