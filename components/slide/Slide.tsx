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
  return (
    <motion.section
      key={slide.id}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="mx-auto flex h-full w-full max-w-[1280px] flex-col px-8 pb-16 pt-10"
    >
      {slide.eyebrow ? (
        <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {slide.eyebrow}
        </div>
      ) : null}
      <h2
        className={cn(
          "mb-8 font-serif font-medium tracking-tight-2 text-ink",
          slide.layout === "title" ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl",
        )}
      >
        {slide.title}
      </h2>

      <div
        className={cn(
          "grid flex-1 gap-10",
          slide.layout === "split" && "grid-cols-1 md:grid-cols-2",
          slide.layout === "compare" && "grid-cols-1 md:grid-cols-2",
          slide.layout === "fullViz" && "grid-cols-1",
          slide.layout === "prose" && "grid-cols-1",
          slide.layout === "title" && "grid-cols-1",
        )}
      >
        {slide.layout === "fullViz" ? (
          <div className="flex min-h-0 items-center justify-center">{slide.viz}</div>
        ) : slide.layout === "title" ? (
          <div className="max-w-prose text-lg leading-relaxed text-muted">
            {slide.content}
          </div>
        ) : slide.layout === "split" || slide.layout === "compare" ? (
          <>
            <div className="max-w-prose text-[15px] leading-relaxed text-ink/85">
              {slide.content}
            </div>
            <div className="flex min-h-0 items-center justify-center">
              {slide.viz}
            </div>
          </>
        ) : (
          <div className="max-w-prose text-[15px] leading-relaxed text-ink/85">
            {slide.content}
          </div>
        )}
      </div>
    </motion.section>
  );
}
