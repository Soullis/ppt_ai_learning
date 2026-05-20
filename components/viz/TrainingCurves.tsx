"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { COLORS, VizFrame } from "./common";

type Curve = {
  name: string;
  color: string;
  values: number[];
  yMax?: number;
  axis: "left" | "right";
};

function expDecay(N = 100, target = 0.05, jitter = 0.02) {
  const out: number[] = [];
  let v = 0.9;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    v = target + (0.9 - target) * Math.exp(-t * 4) + (Math.random() - 0.5) * jitter;
    out.push(Math.max(0, v));
  }
  return out;
}

function ascend(N = 100, target = 0.78, jitter = 0.02) {
  const out: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const v = target * (1 - Math.exp(-t * 3.6)) + (Math.random() - 0.5) * jitter;
    out.push(Math.max(0, Math.min(1, v)));
  }
  return out;
}

const CURVES: Curve[] = [
  { name: "train loss", color: COLORS.accent, values: expDecay(80, 0.06), axis: "left", yMax: 1 },
  { name: "val loss", color: COLORS.honey, values: expDecay(80, 0.12, 0.03), axis: "left", yMax: 1 },
  { name: "mAP@50", color: COLORS.green, values: ascend(80, 0.81), axis: "right", yMax: 1 },
  { name: "mAP@50:95", color: COLORS.red, values: ascend(80, 0.55, 0.025), axis: "right", yMax: 1 },
];

export function TrainingCurves({
  width = 880,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 60;
  const padY = 40;
  const N = CURVES[0].values.length;

  const sx = (i: number) => padX + (i / (N - 1)) * (width - padX * 2);
  const sy = (v: number, max = 1) =>
    height - padY - (v / max) * (height - padY * 2);

  const paths = useMemo(
    () =>
      CURVES.map((c) => ({
        ...c,
        d: `M ${c.values
          .map((v, i) => `${sx(i)},${sy(v, c.yMax ?? 1)}`)
          .join(" L ")}`,
      })),
    [],
  );

  return (
    <VizFrame width={width} height={height} caption="training curves · synthetic indicative">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Axes */}
        <line x1={padX} x2={width - padX} y1={height - padY} y2={height - padY} stroke={COLORS.ink} strokeOpacity={0.4} />
        <line x1={padX} x2={padX} y1={padY} y2={height - padY} stroke={COLORS.ink} strokeOpacity={0.4} />
        <line x1={width - padX} x2={width - padX} y1={padY} y2={height - padY} stroke={COLORS.ink} strokeOpacity={0.4} />
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line x1={padX} x2={width - padX} y1={sy(g)} y2={sy(g)} stroke={COLORS.stroke} />
            <text x={padX - 8} y={sy(g) + 4} textAnchor="end" fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              {g.toFixed(2)}
            </text>
          </g>
        ))}
        <text
          x={(padX + (width - padX)) / 2}
          y={height - padY + 26}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
        >
          epoch
        </text>
        {paths.map((p, i) => (
          <motion.path
            key={p.name}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={1.6}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: i * 0.2 }}
          />
        ))}
        {/* Legend */}
        <g transform={`translate(${width - 200}, ${padY + 6})`}>
          {paths.map((c, i) => (
            <g key={c.name} transform={`translate(0, ${i * 18})`}>
              <line x1={0} x2={20} y1={6} y2={6} stroke={c.color} strokeWidth={1.6} />
              <text x={28} y={9} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
                {c.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </VizFrame>
  );
}
