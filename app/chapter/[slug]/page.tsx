import { notFound } from "next/navigation";
import { chapters, getChapter, getNeighbors } from "@/content/chapters";
import { SlideRunner } from "@/components/slide/SlideRunner";

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export default function ChapterPage({
  params,
}: {
  params: { slug: string };
}) {
  const chapter = getChapter(params.slug);
  if (!chapter) return notFound();
  const { prev, next } = getNeighbors(params.slug);
  return (
    <SlideRunner
      chapter={chapter}
      totalChapters={chapters.length}
      prevSlug={prev?.slug}
      nextSlug={next?.slug}
    />
  );
}
