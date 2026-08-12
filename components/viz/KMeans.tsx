"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COLORS, VizFrame } from "./common";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Pt = { x: number; y: number };

const X_MIN = 0.5;
const X_MAX = 9.5;
const Y_MIN = 0.5;
const Y_MAX = 7.5;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Well-separated cluster centres — pick K from a fixed pool placed at the
// corners and middles of the plot area so the groups stay visually distinct.
const CENTRE_POOL: Pt[] = [
  { x: 1.8, y: 1.6 },
  { x: 8.2, y: 1.6 },
  { x: 8.4, y: 6.3 },
  { x: 1.6, y: 6.2 },
  { x: 5.0, y: 4.0 },
];

function genPoints(K: number, perCluster: number) {
  const r = rng(11);
  const centres = CENTRE_POOL.slice(0, K);
  const pts: Pt[] = [];
  centres.forEach((c) => {
    for (let i = 0; i < perCluster; i++) {
      pts.push({
        x: c.x + (r() - 0.5) * 1.6,
        y: c.y + (r() - 0.5) * 1.6,
      });
    }
  });
  return pts;
}

// Random initial centroids spread across the *full* plot — not just where the
// data lives — so the first few iterations clearly show centroids moving.
function genInitial(K: number, seed: number): Pt[] {
  const r = rng(seed);
  return Array.from({ length: K }, () => ({
    x: X_MIN + r() * (X_MAX - X_MIN),
    y: Y_MIN + r() * (Y_MAX - Y_MIN),
  }));
}

function assignStep(points: Pt[], centroids: Pt[]): number[] {
  return points.map((p) =>
    centroids.reduce(
      (best, c, k) => {
        const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
        return d < best.d ? { d, k } : best;
      },
      { d: Infinity, k: 0 },
    ).k,
  );
}

function updateStep(points: Pt[], assign: number[], K: number, prev: Pt[]): Pt[] {
  return Array.from({ length: K }, (_, k) => {
    const cls = points.filter((_, i) => assign[i] === k);
    if (!cls.length) return prev[k];
    return {
      x: cls.reduce((a, p) => a + p.x, 0) / cls.length,
      y: cls.reduce((a, p) => a + p.y, 0) / cls.length,
    };
  });
}

function inertia(points: Pt[], assign: number[], centroids: Pt[]): number {
  return points.reduce((acc, p, i) => {
    const c = centroids[assign[i]];
    return acc + (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
  }, 0);
}

const PALETTE = [COLORS.accent, COLORS.honey, COLORS.green, COLORS.red, "#7E57C2"];

type Phase = "assign" | "update";

export function KMeans({
  width = 720,
  height = 500,
  K = 4,
}: {
  width?: number;
  height?: number;
  K?: number;
}) {
  const padX = 50;
  const padY = 50;
  const points = useMemo(() => genPoints(K, 28), [K]);
  // Bumped on every Reset; drives a fresh random centroid initialisation.
  const [seedTick, setSeedTick] = useState(0);
  const initial = useMemo(
    () => genInitial(K, 1 + seedTick * 7919),
    [K, seedTick],
  );

  const [centroids, setCentroids] = useState<Pt[]>(initial);
  const [iter, setIter] = useState(0);
  const [phase, setPhase] = useState<Phase>("assign");
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();

  // Whenever the seed bumps, reset state to the new initial centroids.
  useEffect(() => {
    setCentroids(initial);
    setIter(0);
    setPhase("assign");
    setPlaying(false);
  }, [initial]);

  const sx = useCallback(
    (x: number) => padX + (x / 10) * (width - padX * 2),
    [width],
  );
  const sy = useCallback(
    (y: number) => height - padY - (y / 8) * (height - padY * 2),
    [height],
  );

  const assign = useMemo(
    () => assignStep(points, centroids),
    [points, centroids],
  );
  const J = useMemo(
    () => inertia(points, assign, centroids),
    [points, assign, centroids],
  );

  // Run the next half-step. assign → update → next iter.
  const advance = useCallback(() => {
    if (phase === "assign") {
      setPhase("update");
    } else {
      const next = updateStep(points, assign, K, centroids);
      const moved = next.some(
        (c, k) =>
          Math.abs(c.x - centroids[k].x) > 1e-4 ||
          Math.abs(c.y - centroids[k].y) > 1e-4,
      );
      setCentroids(next);
      setIter((i) => i + 1);
      setPhase("assign");
      if (!moved) setPlaying(false);
    }
  }, [phase, points, assign, K, centroids]);

  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  useEffect(() => {
    if (!playing || reduce) return;
    const id = setInterval(() => advanceRef.current(), 900);
    return () => clearInterval(id);
  }, [playing, reduce]);

  // Reset draws a *new* random initial centroid placement each time.
  const reset = () => setSeedTick((t) => t + 1);

  // For the assign phase, draw a thin line from each point to its winning
  // centroid. This is the "compute distance, pick the smallest" step made
  // visible.
  const showLinks = phase === "assign";

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame
        width={width}
        height={height}
        caption={
          phase === "assign"
            ? "step 1 — assign each point to the nearest centroid"
            : "step 2 — move each centroid to the mean of its cluster"
        }
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {/* Faint outline at the initial centroid spot — anchors the eye. */}
          {initial.map((c, k) => (
            <circle
              key={`init-${k}`}
              cx={sx(c.x)}
              cy={sy(c.y)}
              r={10}
              fill="none"
              stroke={PALETTE[k % PALETTE.length]}
              strokeOpacity={0.35}
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          ))}

          {showLinks
            ? points.map((p, i) => {
                const c = centroids[assign[i]];
                return (
                  <line
                    key={`l-${i}`}
                    x1={sx(p.x)}
                    y1={sy(p.y)}
                    x2={sx(c.x)}
                    y2={sy(c.y)}
                    stroke={PALETTE[assign[i] % PALETTE.length]}
                    strokeOpacity={0.18}
                    strokeWidth={1}
                  />
                );
              })
            : null}

          {points.map((p, i) => (
            <circle
              key={`p-${i}`}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r={3}
              fill={PALETTE[assign[i] % PALETTE.length]}
              fillOpacity={0.85}
            />
          ))}

          {centroids.map((c, k) => (
            <motion.g
              key={`c-${k}`}
              animate={{ cx: sx(c.x), cy: sy(c.y) }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <motion.circle
                animate={{ cx: sx(c.x), cy: sy(c.y) }}
                transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                r={10}
                fill={PALETTE[k % PALETTE.length]}
                stroke={COLORS.ink}
                strokeWidth={1.5}
              />
              <motion.text
                animate={{ x: sx(c.x), y: sy(c.y) + 4 }}
                transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                textAnchor="middle"
                fontSize={11}
                fill={COLORS.surface}
                fontFamily="JetBrains Mono, monospace"
              >
                μ{k + 1}
              </motion.text>
            </motion.g>
          ))}

          {/* Step badge top-left of plot area */}
          <g transform={`translate(${padX}, ${padY - 22})`}>
            <text
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              fill={phase === "assign" ? COLORS.accent : COLORS.honey}
              style={{ textTransform: "uppercase", letterSpacing: "0.16em" }}
            >
              {phase === "assign"
                ? `iter ${iter} · assignment`
                : `iter ${iter} · update`}
            </text>
          </g>
        </svg>
      </VizFrame>

      <div className="mt-4 flex w-full max-w-[640px] flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={advance}
            className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink"
          >
            Step
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink"
          >
            Reset
          </button>
        </div>
        <div className="text-muted">
          iter <span className="text-ink">{String(iter).padStart(2, "0")}</span>{" "}
          · J ={" "}
          <span className="text-ink">{J.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
