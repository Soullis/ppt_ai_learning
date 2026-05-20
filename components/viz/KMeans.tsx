"use client";

import { useMemo, useState } from "react";
import { COLORS, VizFrame } from "./common";

function rng(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function gen(K = 3, perCluster = 25) {
  const r = rng(11);
  const centers = Array.from({ length: K }, () => [r() * 8 + 1, r() * 6 + 1] as [number, number]);
  const pts: { x: number; y: number; trueK: number }[] = [];
  centers.forEach((c, k) => {
    for (let i = 0; i < perCluster; i++) {
      pts.push({
        x: c[0] + (r() - 0.5) * 1.4,
        y: c[1] + (r() - 0.5) * 1.4,
        trueK: k,
      });
    }
  });
  return { points: pts, centers };
}

function step(
  points: { x: number; y: number }[],
  centroids: [number, number][],
) {
  const assign = points.map((p) =>
    centroids.reduce((best, c, k) => {
      const d = (p.x - c[0]) ** 2 + (p.y - c[1]) ** 2;
      return d < best.d ? { d, k } : best;
    }, { d: Infinity, k: 0 }).k,
  );
  const next: [number, number][] = centroids.map((_, k) => {
    const cls = points.filter((_, i) => assign[i] === k);
    if (!cls.length) return centroids[k];
    const mx = cls.reduce((a, p) => a + p.x, 0) / cls.length;
    const my = cls.reduce((a, p) => a + p.y, 0) / cls.length;
    return [mx, my];
  });
  return { assign, next };
}

const PALETTE = [COLORS.accent, COLORS.honey, COLORS.green, COLORS.red];

export function KMeans({
  width = 720,
  height = 460,
  K = 3,
}: {
  width?: number;
  height?: number;
  K?: number;
}) {
  const padX = 50;
  const padY = 40;
  const { points } = useMemo(() => gen(K, 25), [K]);
  const initial: [number, number][] = useMemo(() => {
    const r = rng(99);
    return Array.from({ length: K }, () => [r() * 8 + 1, r() * 6 + 1] as [number, number]);
  }, [K]);
  const [centroids, setCentroids] = useState<[number, number][]>(initial);
  const [iter, setIter] = useState(0);

  const sx = (x: number) => padX + (x / 10) * (width - padX * 2);
  const sy = (y: number) => height - padY - (y / 8) * (height - padY * 2);

  const { assign } = step(points, centroids);

  const advance = () => {
    const { next } = step(points, centroids);
    setCentroids(next);
    setIter((i) => i + 1);
  };
  const reset = () => {
    setCentroids(initial);
    setIter(0);
  };

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height}>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {points.map((p, i) => (
            <circle
              key={i}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r={3}
              fill={PALETTE[assign[i] % PALETTE.length]}
              fillOpacity={0.6}
            />
          ))}
          {centroids.map((c, k) => (
            <g key={k}>
              <circle
                cx={sx(c[0])}
                cy={sy(c[1])}
                r={9}
                fill={PALETTE[k % PALETTE.length]}
                stroke={COLORS.ink}
                strokeWidth={1.5}
              />
              <text
                x={sx(c[0])}
                y={sy(c[1]) + 4}
                textAnchor="middle"
                fontSize={11}
                fill={COLORS.surface}
                fontFamily="JetBrains Mono, monospace"
              >
                {k + 1}
              </text>
            </g>
          ))}
        </svg>
      </VizFrame>
      <div className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <button
          type="button"
          onClick={advance}
          className="rounded-md border border-stroke bg-surface px-3 py-1.5 transition hover:border-ink hover:text-ink"
        >
          Step
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-stroke bg-surface px-3 py-1.5 transition hover:border-ink hover:text-ink"
        >
          Reset
        </button>
        <span>iter = {String(iter).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
