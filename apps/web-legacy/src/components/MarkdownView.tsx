// apps/web/src/components/MarkdownView.tsx
"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolink from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";

function slugifyId(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acento
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Lê h2/h3 de markdown (##) **ou** HTML (<h2>)
function buildToc(src: string) {
  if (!src) return [];
  const mdHeads: { depth: 2 | 3; text: string; id: string }[] = [];

  // 1) markdown
  const lines = src.split("\n");
  for (const line of lines) {
    const m = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!m) continue;
    const depth = m[1].length as 2 | 3;
    const text = m[2].trim();
    mdHeads.push({ depth, text, id: slugifyId(text) });
  }
  if (mdHeads.length) return mdHeads;

  // 2) html (ingênuo, mas funciona bem)
  const htmlHeads: { depth: 2 | 3; text: string; id: string }[] = [];
  const re = /<h(2|3)([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(src)) !== null) {
    const depth = Number(match[1]) as 2 | 3;
    const inner = match[3]
      .replace(/<[^>]+>/g, "") // tira tags
      .replace(/\s+/g, " ")
      .trim();
    if (!inner) continue;
    htmlHeads.push({ depth, text: inner, id: slugifyId(inner) });
  }
  return htmlHeads;
}

export function MarkdownView({
  markdown,
  showToc = false,
}: {
  markdown: string;
  showToc?: boolean;
}) {
  const toc = useMemo(
    () => (showToc ? buildToc(markdown) : []),
    [markdown, showToc]
  );

  return (
    <div className="markdown-body">
      {showToc && toc.length > 1 && (
        <nav className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 text-sm">
          <div className="mb-2 font-medium text-neutral-800">Neste artigo</div>
          <ul className="space-y-1">
            {toc.map((h) => (
              <li key={h.id} className={h.depth === 3 ? "ml-4" : ""}>
                <a
                  href={`#${h.id}`}
                  className="text-neutral-600 hover:text-emerald-700"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeAutolink, { behavior: "wrap" }],
          rehypePrism,
        ]}
        components={{
          img: (props) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={props.alt ?? ""}
              {...props}
              className={`mt-6 w-full rounded-2xl object-contain ${
                props.className ?? ""
              }`}
            />
          ),
          a: (props) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {markdown || ""}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownView;
