"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/**
 * Four small panels showing canonical training-curve patterns:
 *   1. healthy fit
 *   2. overfit
 *   3. underfit
 *   4. data leakage / unstable val
 */
function curve(N: number, fn: (t: number) => number) {
  return Array.from({ length: N }, (_, i) => fn(i / (N - 1)));
}

function CurvePanel({
  title,
  diagnosis,
  trainFn,
  valFn,
  width,
  height,
}: {
  title: string;
  diagnosis: string;
  trainFn: (t: number) => number;
  valFn: (t: number) => number;
  width: number;
  height: number;
}) {
  const padX = 26;
  const padY = 50;
  const innerW = width - padX * 2;
  const innerH = height - padY - 50;
  const N = 80;
  const sx = (i: number) => padX + (i / (N - 1)) * innerW;
  const sy = (v: number) => padY + (1 - v) * innerH;
  const train = curve(N, trainFn);
  const val = curve(N, valFn);

  return (
    <g>
      <rect width={width} height={height} fill={COLORS.surface} stroke={COLORS.stroke} />
      <text
        x={14}
        y={20}
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fill={COLORS.muted}
        style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
      >
        {title}
      </text>
      <line x1={padX} x2={padX + innerW} y1={padY + innerH} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.3} />
      <line x1={padX} x2={padX} y1={padY} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.3} />
      <motion.path
        d={`M ${train.map((v, i) => `${sx(i)},${sy(v)}`).join(" L ")}`}
        fill="none"
        stroke={COLORS.accent}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.0 }}
      />
      <motion.path
        d={`M ${val.map((v, i) => `${sx(i)},${sy(v)}`).join(" L ")}`}
        fill="none"
        stroke={COLORS.honey}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.0, delay: 0.2 }}
      />
      {/* Legend */}
      <g transform={`translate(${padX + 8}, ${padY + 6})`}>
        <line x1={0} x2={14} y1={0} y2={0} stroke={COLORS.accent} strokeWidth={1.5} />
        <text x={18} y={4} fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>train</text>
        <line x1={0} x2={14} y1={12} y2={12} stroke={COLORS.honey} strokeWidth={1.5} />
        <text x={18} y={16} fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>val</text>
      </g>
      <text x={14} y={height - 14} fontSize={11} fill={COLORS.ink}>
        {diagnosis}
      </text>
    </g>
  );
}

export function FailureModes({
  width = 980,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const cols = 4;
  const padX = 14;
  const gap = 12;
  const cellW = (width - padX * 2 - gap * (cols - 1)) / cols;
  const cellH = height - 30;

  const panels = [
    {
      title: "Healthy",
      diagnosis: "train and val both fall, gap small.",
      trainFn: (t: number) => Math.max(0.07, 0.9 * Math.exp(-t * 3.6)),
      valFn: (t: number) => Math.max(0.12, 0.95 * Math.exp(-t * 3.0) + 0.04),
    },
    {
      title: "Overfit",
      diagnosis: "val curls back up — regularise, more data.",
      trainFn: (t: number) => Math.max(0.04, 0.9 * Math.exp(-t * 3.8)),
      valFn: (t: number) =>
        Math.max(0.18, 0.95 * Math.exp(-t * 2.5) + 0.55 * Math.max(0, t - 0.45) ** 1.7),
    },
    {
      title: "Underfit",
      diagnosis: "both stuck high — bigger model or longer schedule.",
      trainFn: () => 0.55,
      valFn: () => 0.6,
    },
    {
      title: "Leakage / unstable",
      diagnosis: "val unrealistically low or wild — check splits.",
      trainFn: (t: number) => 0.2 + 0.5 * Math.exp(-t * 4),
      valFn: (t: number) =>
        0.05 + 0.05 * Math.sin(t * 14) + 0.03 * Math.sin(t * 31),
    },
  ];

  return (
    <VizFrame width={width} height={height} caption="canonical loss curves and what they mean">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {panels.map((p, i) => (
          <g key={p.title} transform={`translate(${padX + i * (cellW + gap)}, 20)`}>
            <CurvePanel {...p} width={cellW} height={cellH} />
          </g>
        ))}
      </svg>
    </VizFrame>
  );
}
