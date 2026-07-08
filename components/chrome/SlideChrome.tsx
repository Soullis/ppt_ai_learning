"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { Kbd } from "../ui/Kbd";
import { pad } from "@/lib/utils";
import type { LessonPath } from "@/lib/slide-filter";
import type { SlideTier } from "@/components/slide/types";
import { chapterHref } from "@/lib/slide-filter";

export function SlideChrome({
  chapterNumber,
  chapterTitle,
  slideIndex,
  slideTotal,
  totalChapters,
  prevSlug,
  nextSlug,
  lessonPath = "full",
  slideTier,
}: {
  chapterNumber: number;
  chapterTitle: string;
  slideIndex: number;
  slideTotal: number;
  totalChapters: number;
  prevSlug?: string;
  nextSlug?: string;
  lessonPath?: LessonPath;
  slideTier?: SlideTier;
}) {
  const tierLabel =
    slideTier === "reference" ? "reference" : slideTier === "deep" ? "deep dive" : null;

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-stroke px-6 py-3">
      <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        <Link
          href={lessonPath === "lesson" ? "/?path=lesson" : "/"}
          aria-label="Cover"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-stroke text-muted transition hover:border-ink hover:text-ink"
        >
          <Home size={13} strokeWidth={1.5} />
        </Link>
        <span>
          ch {pad(chapterNumber)} / {pad(totalChapters)}
        </span>
        <span className="text-ink">{chapterTitle}</span>
        {lessonPath === "lesson" ? (
          <span className="rounded border border-honey/40 px-1.5 py-0.5 text-[9px] text-honey">lesson</span>
        ) : null}
        {tierLabel ? (
          <span className="rounded border border-stroke px-1.5 py-0.5 text-[9px]">{tierLabel}</span>
        ) : null}
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
              href={chapterHref(prevSlug, lessonPath)}
              aria-label="Previous chapter"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-stroke text-muted transition hover:border-ink hover:text-ink"
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
            </Link>
          ) : null}
          {nextSlug ? (
            <Link
              href={chapterHref(nextSlug, lessonPath)}
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
