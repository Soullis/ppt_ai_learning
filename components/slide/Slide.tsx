"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Slide as SlideType } from "./types";

const variants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function Slide({ slide }: { slide: SlideType }) {
  const isTitle = slide.layout === "title";
  const isScrollable = slide.layout === "scrollProse" || slide.layout === "scrollSplit";

  return (
    <motion.section
      key={slide.id}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn(
        "mx-auto flex h-full w-full max-w-[1440px] flex-col px-6 pb-14 pt-8 md:px-8 md:pb-16 md:pt-10",
        isScrollable && "min-h-0",
      )}
    >
      {slide.eyebrow ? (
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:mb-6">
          {slide.eyebrow}
        </div>
      ) : null}
      <h2
        className={cn(
          "mb-6 font-serif font-medium tracking-tight-2 text-ink md:mb-8",
          isTitle ? "text-4xl md:text-6xl" : "text-2xl md:text-4xl",
        )}
      >
        {slide.title}
      </h2>

      <div
        className={cn(
          "grid min-h-0 flex-1 gap-6 md:gap-10",
        (slide.layout === "split" || slide.layout === "scrollSplit") && "grid-cols-1 md:grid-cols-2",
        slide.layout === "compare" && "grid-cols-1 md:grid-cols-2",
          slide.layout === "wideViz" && "grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.85fr)]",
          (slide.layout === "fullViz" || slide.layout === "prose" || slide.layout === "scrollProse" || slide.layout === "title") &&
            "grid-cols-1",
        )}
      >
        {slide.layout === "fullViz" ? (
          <div className="flex min-h-0 items-stretch justify-center">{slide.viz}</div>
        ) : slide.layout === "title" ? (
          <div className="max-w-prose text-lg leading-relaxed text-muted">{slide.content}</div>
        ) : slide.layout === "wideViz" ? (
          <>
            <div className="max-w-prose text-[15px] leading-relaxed text-ink/85">{slide.content}</div>
            <div className="flex min-h-0 items-stretch justify-center">{slide.viz}</div>
          </>
        ) : slide.layout === "split" || slide.layout === "compare" || slide.layout === "scrollSplit" ? (
          <>
            <div
              className={cn(
                "max-w-prose text-[15px] leading-relaxed text-ink/85",
                isScrollable && "min-h-0 overflow-y-auto pr-2",
              )}
            >
              {slide.content}
            </div>
            <div className="flex min-h-0 items-stretch justify-center">{slide.viz}</div>
          </>
        ) : (
          <div
            className={cn(
              "max-w-none text-[15px] leading-relaxed text-ink/85",
              slide.layout === "scrollProse" && "min-h-0 overflow-y-auto pr-2",
              slide.layout === "prose" && "max-w-prose",
            )}
          >
            {slide.content}
          </div>
        )}
      </div>
    </motion.section>
  );
}
