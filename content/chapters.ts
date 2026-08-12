import type { Chapter, CoursePart } from "@/components/slide/types";
import { PART_TITLES } from "@/components/slide/types";
import { ch00 } from "./slides/ch00-blackbee";
import { ch01 } from "./slides/ch01-intro-ai";
import { ch02 } from "./slides/ch02-viscomp";
import { ch03 } from "./slides/ch03-proj-ia";
import { at1 } from "./slides/at1";
import { at2 } from "./slides/at2";
import { ref } from "./slides/references";
import { coreSlideCount } from "@/lib/slide-filter";

export const chapters: Chapter[] = [
  ch00,
  ch01,
  ch02,
  ch03,
  at1,
  at2,
  ref,
];

export function getChapter(slug: string) {
  return chapters.find((c) => c.slug === slug);
}

export function getNeighbors(slug: string) {
  const i = chapters.findIndex((c) => c.slug === slug);
  return {
    prev: i > 0 ? chapters[i - 1] : undefined,
    next: i < chapters.length - 1 ? chapters[i + 1] : undefined,
  };
}

export function getParts(): CoursePart[] {
  const partNumbers = [...new Set(chapters.map((c) => c.part))].sort((a, b) => a - b);
  return partNumbers.map((n) => ({
    number: n,
    title: PART_TITLES[n] ?? `Part ${n}`,
    chapters: chapters.filter((c) => c.part === n),
  }));
}

export function chapterStats(chapter: Chapter) {
  return {
    total: chapter.slides.length,
    core: coreSlideCount(chapter),
  };
}
