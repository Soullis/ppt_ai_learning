import type { Chapter, Slide, SlideTier } from "@/components/slide/types";

export type LessonPath = "full" | "lesson";

export function slideTier(slide: Slide): SlideTier {
  return slide.tier ?? "core";
}

export function filterSlides(slides: Slide[], path: LessonPath): Slide[] {
  if (path === "full") return slides;
  return slides.filter((s) => slideTier(s) === "core");
}

export function filterChapter(chapter: Chapter, path: LessonPath): Chapter {
  const slides = filterSlides(chapter.slides, path);
  return { ...chapter, slides };
}

export function coreSlideCount(chapter: Chapter): number {
  return chapter.slides.filter((s) => slideTier(s) === "core").length;
}

export function parseLessonPath(value: string | null | undefined): LessonPath {
  return value === "lesson" ? "lesson" : "full";
}

export function chapterHref(slug: string, path: LessonPath): string {
  return path === "lesson" ? `/chapter/${slug}?path=lesson` : `/chapter/${slug}`;
}
