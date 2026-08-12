"use client";

import { AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Slide } from "./Slide";
import { ProgressDots } from "../chrome/ProgressDots";
import { SlideChrome } from "../chrome/SlideChrome";
import { useKey } from "@/lib/hooks/useKey";
import type { Chapter } from "./types";
import { chapterHref, filterChapter, parseLessonPath } from "@/lib/slide-filter";
import { pad } from "@/lib/utils";

export function SlideRunner({
  chapter,
  totalChapters,
  prevSlug,
  nextSlug,
}: {
  chapter: Chapter;
  totalChapters: number;
  prevSlug?: string;
  nextSlug?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = parseLessonPath(searchParams.get("path"));
  const filtered = useMemo(() => filterChapter(chapter, path), [chapter, path]);
  const [index, setIndex] = useState(0);
  const total = filtered.slides.length;

  useEffect(() => {
    setIndex(0);
  }, [chapter.slug, path]);

  const goNextChapter = useCallback(() => {
    if (nextSlug) router.push(chapterHref(nextSlug, path));
  }, [router, nextSlug, path]);

  const goPrevChapter = useCallback(() => {
    if (prevSlug) {
      router.push(chapterHref(prevSlug, path));
    }
  }, [router, prevSlug, path]);

  useKey(["ArrowRight", " "], (e) => {
    e.preventDefault();
    if (index < total - 1) {
      setIndex(index + 1);
    } else {
      goNextChapter();
    }
  });

  useKey("ArrowLeft", (e) => {
    e.preventDefault();
    if (index > 0) {
      setIndex((i) => i - 1);
    } else if (prevSlug) {
      router.push(chapterHref(prevSlug, path));
    }
  });

  useKey(["ArrowUp", "PageUp"], (e) => {
    e.preventDefault();
    goPrevChapter();
  });

  useKey(["ArrowDown", "PageDown"], (e) => {
    e.preventDefault();
    goNextChapter();
  });

  if (total === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-bone text-muted">
        No slides in this chapter for the current path.
      </div>
    );
  }

  const slide = filtered.slides[index];

  return (
    <div className="flex h-screen w-full flex-col bg-bone">
      <SlideChrome
        chapterNumber={chapter.number}
        chapterTitle={chapter.title}
        slideIndex={index + 1}
        slideTotal={total}
        totalChapters={totalChapters}
        prevSlug={prevSlug}
        nextSlug={nextSlug}
        lessonPath={path}
        slideTier={slide.tier}
      />
      <main className="flex min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <Slide key={slide.id} slide={slide} />
        </AnimatePresence>
      </main>
      <footer className="flex shrink-0 items-center justify-between border-t border-stroke px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <span>
          {pad(chapter.number)} · {chapter.title}
        </span>
        <ProgressDots index={index} total={total} onSelect={setIndex} />
        <span>
          {pad(index + 1)} / {pad(total)}
        </span>
      </footer>
    </div>
  );
}
