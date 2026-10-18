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
      className={`mb-10 flex flex-col gap-3 ${
        align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between sm:text-left"
      }`}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-xl"}>
        <Tag className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</Tag>
        {subtitle ? <p className="mt-2 text-[15px] leading-relaxed text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
