"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { Kbd } from "../ui/Kbd";
import { pad } from "@/lib/utils";

export function SlideChrome({
  chapterNumber,
  chapterTitle,
  slideIndex,
  slideTotal,
  totalChapters,
  prevSlug,
  nextSlug,
}: {
  chapterNumber: number;
  chapterTitle: string;
  slideIndex: number;
  slideTotal: number;
  totalChapters: number;
  prevSlug?: string;
  nextSlug?: string;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-stroke px-6 py-3">
      <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        <Link
          href="/"
          aria-label="Cover"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-stroke text-muted transition hover:border-ink hover:text-ink"
        >
          <Home size={13} strokeWidth={1.5} />
        </Link>
        <span>
          ch {pad(chapterNumber)} / {pad(totalChapters)}
        </span>
        <span className="text-ink">{chapterTitle}</span>
      </div>

      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <span>
          slide {pad(slideIndex)} / {pad(slideTotal)}
        </span>
        <span className="hidden items-center gap-1 md:inline-flex" title="slides">
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
        </span>
        <span className="hidden items-center gap-1 md:inline-flex" title="chapters">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
        </span>
        <div className="flex items-center gap-1">
          {prevSlug ? (
            <Link
              href={`/chapter/${prevSlug}`}
              aria-label="Previous chapter"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-stroke text-muted transition hover:border-ink hover:text-ink"
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
            </Link>
          ) : null}
          {nextSlug ? (
            <Link
              href={`/chapter/${nextSlug}`}
              aria-label="Next chapter"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-stroke text-muted transition hover:border-ink hover:text-ink"
            >
              <ArrowRight size={13} strokeWidth={1.5} />
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
