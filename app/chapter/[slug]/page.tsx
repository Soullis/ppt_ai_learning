import { Suspense } from "react";
import { notFound } from "next/navigation";
import { chapters, getChapter, getNeighbors } from "@/content/chapters";
import { SlideRunner } from "@/components/slide/SlideRunner";

export function generateStaticParams() {
  const params = chapters.map((c) => ({ slug: c.slug }));
  return params;
}

function ChapterRunner({ slug }: { slug: string }) {
  const chapter = getChapter(slug);
  if (!chapter) return notFound();
  const { prev, next } = getNeighbors(slug);
  return (
    <SlideRunner
      chapter={chapter}
      totalChapters={chapters.length}
      prevSlug={prev?.slug}
      nextSlug={next?.slug}
    />
  );
}

export default function ChapterPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Suspense fallback={<div className="h-screen bg-bone" />}>
      <ChapterRunner slug={params.slug} />
    </Suspense>
  );
}
