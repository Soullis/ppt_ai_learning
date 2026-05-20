"use client";

import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Slide } from "./Slide";
import { ProgressDots } from "../chrome/ProgressDots";
import { SlideChrome } from "../chrome/SlideChrome";
import { useKey } from "@/lib/hooks/useKey";
import type { Chapter } from "./types";
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
  const [index, setIndex] = useState(0);
  const total = chapter.slides.length;

  const goNextChapter = useCallback(() => {
    if (nextSlug) router.push(`/chapter/${nextSlug}`);
  }, [router, nextSlug]);
  const goPrevChapter = useCallback(() => {
    if (prevSlug) router.push(`/chapter/${prevSlug}`);
  }, [router, prevSlug]);

  // Right / Space: advance slide; if at the last slide, roll into next chapter.
  useKey(["ArrowRight", " "], (e) => {
    e.preventDefault();
    if (index < total - 1) {
      setIndex(index + 1);
    } else {
      goNextChapter();
    }
  });
  // Left: step back through slides; do not auto-jump to the previous chapter.
  useKey("ArrowLeft", (e) => {
    e.preventDefault();
    setIndex((i) => Math.max(0, i - 1));
  });
  // Up / PageUp: previous chapter.
  useKey(["ArrowUp", "PageUp"], (e) => {
    e.preventDefault();
    goPrevChapter();
  });
  // Down / PageDown: next chapter.
  useKey(["ArrowDown", "PageDown"], (e) => {
    e.preventDefault();
    goNextChapter();
  });

  const slide = chapter.slides[index];

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
