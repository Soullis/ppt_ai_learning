"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { COLORS, VizFrame } from "./common";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function generate() {
  const r = rng(11);
  const pts: { x: number; y: number; c: 0 | 1 | 2 }[] = [];
  const centers: [number, number, 0 | 1 | 2][] = [
    [0.25, 0.3, 0],
    [0.75, 0.35, 1],
    [0.5, 0.78, 2],
  ];
  for (const [cx, cy, cls] of centers) {
    for (let i = 0; i < 16; i++) {
      pts.push({
        x: cx + (r() - 0.5) * 0.32,
        y: cy + (r() - 0.5) * 0.32,
        c: cls,
      });
    }
  }
  return pts;
}

const POINTS = generate();
const PALETTE = [COLORS.accent, COLORS.honey, COLORS.green];

export function KnnQuery({
  width = 720,
  height = 440,
}: {
  width?: number;
  height?: number;
}) {
  const [k, setK] = useState(5);
  const [query, setQuery] = useState({ x: 0.5, y: 0.5 });

  const padX = 40;
  const padY = 30;
  const sx = (x: number) => padX + x * (width - padX * 2);
  const sy = (y: number) => height - padY - y * (height - padY * 2);

  // Distances
  const sorted = POINTS
    .map((p) => ({ ...p, d: Math.hypot(p.x - query.x, p.y - query.y) }))
    .sort((a, b) => a.d - b.d);
  const neighbours = sorted.slice(0, k);
  const radius = neighbours[neighbours.length - 1]?.d ?? 0;

  // Vote
  const votes = [0, 0, 0];
  neighbours.forEach((n) => votes[n.c]++);
  const winner = votes.indexOf(Math.max(...votes)) as 0 | 1 | 2;

  // Convert radius to screen coordinates correctly: radius is in unit space,
  // multiply by the same scale factor as sx/sy axes (they are equal).
  const radiusPx = radius * (width - padX * 2);

  function move(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const sxRatio = width / rect.width;
    const syRatio = height / rect.height;
    const xPx = px * sxRatio;
    const yPx = py * syRatio;
    const x = (xPx - padX) / (width - padX * 2);
    const y = 1 - (yPx - padY) / (height - padY * 2);
    setQuery({
      x: Math.max(0.05, Math.min(0.95, x)),
      y: Math.max(0.05, Math.min(0.95, y)),
    });
  }

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height} caption="move the cursor; the k closest points vote">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full cursor-crosshair"
          onMouseMove={move}
        >
          <rect width={width} height={height} fill={COLORS.surface} />
          {/* k circle */}
          <motion.circle
            cx={sx(query.x)}
            cy={sy(query.y)}
            r={radiusPx}
            fill={PALETTE[winner]}
            fillOpacity={0.08}
            stroke={PALETTE[winner]}
            strokeWidth={1.3}
            strokeDasharray="3 4"
            animate={{ cx: sx(query.x), cy: sy(query.y), r: radiusPx }}
            transition={{ duration: 0.2 }}
          />
          {POINTS.map((p, i) => {
            const isN = neighbours.find((n) => n.x === p.x && n.y === p.y);
            return (
              <circle
                key={i}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r={3.5}
                fill={PALETTE[p.c]}
                stroke={isN ? COLORS.ink : "none"}
                strokeWidth={1.5}
              />
            );
          })}
          {/* Lines to neighbours */}
          {neighbours.map((n, i) => (
            <line
              key={i}
              x1={sx(query.x)}
              y1={sy(query.y)}
              x2={sx(n.x)}
              y2={sy(n.y)}
              stroke={COLORS.ink}
              strokeOpacity={0.3}
            />
          ))}
          {/* Query */}
          <circle
            cx={sx(query.x)}
            cy={sy(query.y)}
            r={5}
            fill={COLORS.ink}
            stroke={COLORS.surface}
            strokeWidth={2}
          />
        </svg>
      </VizFrame>
      <div className="mt-3 flex w-full max-w-[480px] items-center gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <label className="flex flex-1 flex-col">
          k = {k}
          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={k}
            onChange={(e) => setK(parseInt(e.target.value, 10))}
            className="mt-1 w-full accent-ink"
          />
        </label>
        <span className="text-ink">
          vote → {votes.join(" / ")} · winner = class {winner}
        </span>
      </div>
    </div>
  );
}
