import type { Chapter } from "@/components/slide/types";
import { ch01 } from "./slides/ch01-what-is-ai";
import { ch02 } from "./slides/ch02-data";
import { ch03 } from "./slides/ch03-paradigms";
import { ch04 } from "./slides/ch04-classical-ml";
import { ch05 } from "./slides/ch05-deep-learning";
import { ch06 } from "./slides/ch06-blocks";
import { ch07 } from "./slides/ch07-cv-tasks";
import { ch08 } from "./slides/ch08-detection";
import { ch09 } from "./slides/ch09-lifecycle";
import { ch10 } from "./slides/ch10-deployment";
import { ch11 } from "./slides/ch11-nectar";
import { ch12 } from "./slides/ch12-closing";

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
