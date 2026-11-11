type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

/** Parses the plain-text article format used by the CMS. */
function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flush = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
    if (list.length > 0) {
      blocks.push({ type: "list", items: list });
      list = [];
    }
  };

  for (const rawLine of content.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "heading", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("- ")) {
      if (paragraph.length > 0) {
        blocks.push({ type: "paragraph", text: paragraph.join(" ") });
        paragraph = [];
      }
      list.push(line.slice(2).trim());
      continue;
    }
    if (list.length > 0) {
      blocks.push({ type: "list", items: list });
      list = [];
    }
    paragraph.push(line);
  }
  flush();
  return blocks;
}

export default function ArticleBody({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2 key={index} className="pt-4 font-editorial text-2xl leading-tight tracking-tight text-ink sm:text-3xl">
              {block.text}
            </h2>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={index} className="space-y-2 pl-5 text-[15px] leading-relaxed text-ink/80">
              {block.items.map((item) => (
                <li key={item} className="list-disc marker:text-primary">
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="text-[15px] leading-relaxed text-ink/80 sm:text-base">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
