"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COLORS } from "./common";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Sample = {
  src: string;
  alt: string;
  // First entry is the predicted label (highest confidence). Probabilities
  // must sum to (approximately) 1.
  probs: { label: string; p: number }[];
};

const SAMPLES: Sample[] = [
  {
    src: "/team/01.jpg",
    alt: "team member 1",
    probs: [
      { label: "que mulher maravilhosa (UAU)", p: 0.94 },
      { label: "readstone", p: 0.030 },
      { label: "modelo de comercial de shampoo", p: 0.012 },
      { label: "sereia", p: 0.011 },
      { label: "engenheira da computação", p: 0.007 },
    ],
  },
  {
    src: "/team/02.jpg",
    alt: "team member 2",
    probs: [
      { label: "frutinha++", p: 0.91 },
      { label: "morango maduro", p: 0.040 },
      { label: "compota artesanal", p: 0.025 },
      { label: "smoothie de açaí", p: 0.015 },
      { label: "fruta exótica", p: 0.010 },
    ],
  },
  {
    src: "/team/03.jpg",
    alt: "team member 3",
    probs: [
      { label: "homens extremamente atraentes", p: 0.96 },
      { label: "testosterona", p: 0.018 },
      { label: "hardware", p: 0.012 },
      { label: "modelos", p: 0.006 },
      { label: "gambiarra", p: 0.004 },
    ],
  },
  {
    src: "/team/04.jpg",
    alt: "team member 4",
    probs: [
      { label: "Jorge", p: 0.97 },
      { label: "homem em flagrante", p: 0.015 },
      { label: "professor disfarçado", p: 0.008 },
      { label: "George Clooney brasileiro", p: 0.005 },
      { label: "vendedor de seguros", p: 0.002 },
    ],
  },
  {
    src: "/team/05.jpg",
    alt: "team member 5",
    probs: [
      { label: "boiadeira", p: 0.62 },
      { label: "princesa da roça", p: 0.31 },
      { label: "agro pop", p: 0.040 },
      { label: "festa junina", p: 0.020 },
      { label: "cowgirl", p: 0.010 },
    ],
  },
];

export function ClassificationDemo({
  intervalMs = 5500,
  maxImageHeight = 360,
}: {
  intervalMs?: number;
  maxImageHeight?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % SAMPLES.length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [paused, reduce, intervalMs]);

  const sample = SAMPLES[idx];

  return (
    <figure className="mx-auto flex w-full max-w-[920px] flex-col items-center">
      <div className="w-full overflow-hidden rounded-md border border-stroke bg-surface">
        <div className="grid grid-cols-5 items-center gap-5 p-5">
          {/* Image — left 2 cols, fixed max-height to keep portrait and
              landscape photos at the same vertical footprint. */}
          <div className="col-span-2 flex items-center justify-center">
            <motion.img
              key={sample.src}
              src={sample.src}
              alt={sample.alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-md border border-stroke object-contain"
              style={{ maxHeight: maxImageHeight, maxWidth: "100%" }}
            />
          </div>

          {/* Probability list — right 3 cols, auto-sized */}
          <div className="col-span-3 flex flex-col gap-2.5">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              predicted distribution
            </div>
            {sample.probs.map((row, i) => {
              const isTop = i === 0;
              const pct = row.p * 100;
              return (
                <div key={`${idx}-${i}`} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      className={
                        "truncate text-[13px] " +
                        (isTop ? "text-ink" : "text-muted")
                      }
                    >
                      {row.label}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-ink">
                      {pct < 10 ? pct.toFixed(1) : pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-stroke">
                    <motion.div
                      key={`${idx}-${i}-bar`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.7,
                        delay: 0.15 + i * 0.05,
                        ease: [0.22, 0.61, 0.36, 1],
                      }}
                      className="h-full"
                      style={{
                        background: isTop ? COLORS.accent : COLORS.honey,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        softmax over a class vocabulary — argmax wins
      </figcaption>

      {/* Thumbnail strip + pause */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          {SAMPLES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Sample ${i + 1}`}
              onClick={() => setIdx(i)}
              data-active={i === idx}
              className="h-1.5 w-1.5 rounded-full bg-stroke transition-all hover:bg-muted data-[active=true]:w-6 data-[active=true]:bg-ink"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="rounded-md border border-stroke bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition hover:border-ink hover:text-ink"
        >
          {paused ? "play" : "pause"}
        </button>
      </div>
    </figure>
  );
}
