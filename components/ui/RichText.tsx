import type { ReactNode } from "react";

/** Renders a message string, turning **bold** segments into <strong>. */
export default function RichText({ text, strongClassName }: { text: string; strongClassName?: string }) {
  const nodes: ReactNode[] = [];
  const parts = text.split("**");
  parts.forEach((part, index) => {
    if (index % 2 === 1 && part.length > 0) {
      nodes.push(
        <strong key={index} className={strongClassName ?? "text-ink"}>
          {part}
        </strong>,
      );
    } else if (part.length > 0) {
      nodes.push(<span key={index}>{part}</span>);
    }
  });
  return <>{nodes}</>;
}
