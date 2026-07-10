import type { Chapter, CoursePart } from "@/components/slide/types";
import { PART_TITLES } from "@/components/slide/types";
import { ch01 } from "./slides/ch01-what-is-ai";
import { ch02 } from "./slides/ch02-data";
import { ch03 } from "./slides/ch03-paradigms";
import { ch04 } from "./slides/ch04-classical-ml";
import { ch05 } from "./slides/ch05-deep-learning";
import { ch06 } from "./slides/ch06-network-architectures";
import { ch07 } from "./slides/ch07-convolutional-networks";
import { ch08 } from "./slides/ch08-frameworks";
import { ch09 } from "./slides/ch09-cv-tasks";
import { ch10 } from "./slides/ch10-classification";
import { ch11 } from "./slides/ch11-detection";
import { ch12 } from "./slides/ch12-segmentation";
import { ch13 } from "./slides/ch13-lifecycle";
import { ch14 } from "./slides/ch14-deployment";
import { ch15 } from "./slides/ch15-nectar";
import { ch16 } from "./slides/ch16-references";
import { coreSlideCount } from "@/lib/slide-filter";

export const chapters: Chapter[] = [
  ch01,
  ch02,
  ch03,
  ch04,
  ch05,
  ch06,
  ch07,
  ch08,
  ch09,
  ch10,
  ch11,
  ch12,
  ch13,
  ch14,
  ch15,
  ch16,
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
