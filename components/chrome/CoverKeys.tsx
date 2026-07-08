"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useKey } from "@/lib/hooks/useKey";
import { chapterHref, parseLessonPath } from "@/lib/slide-filter";

export function CoverKeys({
  firstSlug,
  lessonPath,
}: {
  firstSlug: string;
  lessonPath?: "full" | "lesson";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = lessonPath ?? parseLessonPath(searchParams.get("path"));

  useKey(["ArrowDown", "ArrowRight", " ", "Enter", "PageDown"], (e) => {
    e.preventDefault();
    router.push(chapterHref(firstSlug, path));
  });

  return null;
}
