"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { COLORS, VizFrame } from "./common";

const ORIGINAL = [
  { name: "gate", n: 1820 },
  { name: "drone", n: 320 },
  { name: "post", n: 110 },
  { name: "obstacle", n: 480 },
  { name: "marker", n: 60 },
];

function balanced(arr: typeof ORIGINAL) {
  const max = Math.max(...arr.map((a) => a.n));
  return arr.map((a) => ({
    ...a,
    n: Math.round(a.n + (max - a.n) * 0.7),
  }));
}

const PADDING_X = 80;
const PADDING_Y = 40;

export function ClassHist({
  width = 720,
  height = 360,
}: {
  width?: number;
  height?: number;
}) {
  const [bal, setBal] = useState(false);
  const data = bal ? balanced(ORIGINAL) : ORIGINAL;
  const max = Math.max(...data.map((d) => d.n));
  const innerW = width - PADDING_X * 2;
  const innerH = height - PADDING_Y * 2;
  const stepW = innerW / data.length;
  const baseY = height - PADDING_Y;

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame
        width={width}
        height={height}
        caption={bal ? "after balancing — augment rare classes" : "original distribution — long tail"}
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {/* baseline */}
          <line
            x1={PADDING_X}
            x2={width - PADDING_X}
            y1={baseY}
            y2={baseY}
            stroke={COLORS.ink}
            strokeOpacity={0.4}
          />
          {data.map((d, i) => {
            const h = (d.n / max) * innerH;
            const isRare = i === 4 || i === 2;
            const cx = PADDING_X + i * stepW + stepW / 2;
            const barX = cx - 24;
            const barY = baseY - h;
            return (
              <g key={d.name}>
                <motion.rect
                  initial={{ y: baseY, height: 0, opacity: 0 }}
                  animate={{ y: barY, height: h, opacity: 1 }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.08,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                  x={barX}
                  width={48}
                  fill={isRare ? COLORS.honey : COLORS.accent}
                  fillOpacity={0.5}
                  stroke={isRare ? COLORS.honey : COLORS.accent}
                />
                <motion.text
                  x={cx}
                  y={baseY + 18}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  fill={COLORS.muted}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {d.name}
                </motion.text>
                <motion.text
                  x={cx}
                  y={barY - 6}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  fill={COLORS.ink}
                  initial={{ opacity: 0, y: barY }}
                  animate={{ opacity: 1, y: barY - 6 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                >
                  {d.n}
                </motion.text>
              </g>
            );
          })}
        </svg>
      </VizFrame>
      <button
        type="button"
        onClick={() => setBal((b) => !b)}
        className="mt-3 rounded-md border border-stroke bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition hover:border-ink hover:text-ink"
      >
        {bal ? "show original" : "apply prioritize_rare_classes"}
      </button>
    </div>
  );
}
