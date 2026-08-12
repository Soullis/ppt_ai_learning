"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { COLORS, VizFrame } from "./common";
import { SceneSVG, SCENE_OBJECTS } from "./Scene";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296 - 0.5;
  };
}

export function SlicingDemo({
  width = 920,
  height = 460,
}: {
  width?: number;
  height?: number;
}) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(2);
  const W = width;
  const H = height;
  const cols = 3;
  const rows = 2;
  const cellW = W / cols;
  const cellH = H / rows;

  const slices: { x: number; y: number; r: number; c: number }[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      slices.push({ x: c * cellW, y: r * cellH, r, c });

  // Pre-compute per-tile detections deterministically.
  const perTile = useMemo(() => {
    const r = rng(7);
    const dets: { x: number; y: number; w: number; h: number; key: string }[] = [];
    SCENE_OBJECTS.forEach((o) => {
      const ox = o.x * W;
      const oy = o.y * H;
      const ow = o.w * W;
      const oh = o.h * H;
      slices.forEach((s) => {
        const sx = s.x;
        const sy = s.y;
        const ex = sx + cellW;
        const ey = sy + cellH;
        const ix = Math.max(sx, ox);
        const iy = Math.max(sy, oy);
        const ix2 = Math.min(ex, ox + ow);
        const iy2 = Math.min(ey, oy + oh);
        if (ix2 - ix > 14 && iy2 - iy > 14) {
          // small jitter (≤ 4 px) so the per-tile box looks like a real prediction
          const jx = ix + r() * 6;
          const jy = iy + r() * 6;
          const jx2 = ix2 + r() * 6;
          const jy2 = iy2 + r() * 6;
          dets.push({
            x: jx,
            y: jy,
            w: Math.max(8, jx2 - jx),
            h: Math.max(8, jy2 - jy),
            key: `${o.id}-${s.r}-${s.c}`,
          });
        }
      });
    });
    return dets;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, H, cellW, cellH]);

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={W} height={H} caption="slicing inference — tile, predict, merge">
        <div className="relative h-full w-full">
          <SceneSVG width={W} height={H} />
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {step >= 1
              ? slices.map((s, i) => (
                  <motion.rect
                    key={`tile-${i}`}
                    x={s.x}
                    y={s.y}
                    width={cellW}
                    height={cellH}
                    fill="none"
                    stroke={COLORS.accent}
                    strokeOpacity={0.7}
                    strokeWidth={1.2}
                    strokeDasharray="4 4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  />
                ))
              : null}
            {step === 2
              ? perTile.map((d, i) => (
                  <motion.g
                    key={d.key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <rect
                      x={d.x}
                      y={d.y}
                      width={d.w}
                      height={d.h}
                      fill={COLORS.honey}
                      fillOpacity={0.1}
                      stroke={COLORS.honey}
                      strokeWidth={1.6}
                    />
                    <rect
                      x={d.x}
                      y={d.y - 14}
                      width={36}
                      height={14}
                      fill={COLORS.honey}
                    />
                    <text
                      x={d.x + 4}
                      y={d.y - 3}
                      fontSize={10}
                      fontFamily="JetBrains Mono, monospace"
                      fill={COLORS.surface}
                    >
                      tile
                    </text>
                  </motion.g>
                ))
              : null}
            {step === 3
              ? SCENE_OBJECTS.map((o) => {
                  const x = o.x * W;
                  const y = o.y * H;
                  const w = o.w * W;
                  const h = o.h * H;
                  return (
                    <motion.rect
                      key={`merged-${o.id}`}
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill="none"
                      stroke={COLORS.ink}
                      strokeWidth={2.4}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  );
                })
              : null}
          </svg>
        </div>
      </VizFrame>
      <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
        {[
          { n: 0, label: "01 image" },
          { n: 1, label: "02 tile" },
          { n: 2, label: "03 detect per tile" },
          { n: 3, label: "04 merge (NMS · WBF)" },
        ].map((s) => (
          <button
            key={s.n}
            type="button"
            onClick={() => setStep(s.n as 0 | 1 | 2 | 3)}
            data-active={step === s.n}
            className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink data-[active=true]:border-ink data-[active=true]:text-ink"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
