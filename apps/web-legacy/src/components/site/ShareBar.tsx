"use client";

import { useCallback, useState } from "react";

type Props = {
  url: string;
  title: string;
};

export default function ShareBar({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }, [url]);

  const canWebShare = typeof navigator !== "undefined" && "share" in navigator;

  const shareNative = async () => {
    try {
      await navigator.share({ url, title });
    } catch {}
  };

  const wapp = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
  const x = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(title)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2">
      {canWebShare && (
        <button
          onClick={shareNative}
          className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
        >
          Compartilhar…
        </button>
      )}
      <a
        href={wapp}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
      >
        WhatsApp
      </a>
      <a
        href={x}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
      >
        X / Twitter
      </a>
      <a
        href={li}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
      >
        LinkedIn
      </a>
      <button
        onClick={onCopy}
        className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
      >
        {copied ? "Copiado!" : "Copiar link"}
      </button>
    </div>
  );
}
