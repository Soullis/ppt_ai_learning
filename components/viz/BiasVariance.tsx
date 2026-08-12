"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function genWave() {
  const r = rng(7);
  const N = 30;
  return Array.from({ length: N }, (_, i) => {
    const x = i / (N - 1);
    const y = Math.sin(x * Math.PI * 2) * 0.7 + 1.5 + (r() - 0.5) * 0.4;
    return { x, y };
  });
}

function plot(label: string, fit: (x: number) => number, points: { x: number; y: number }[]) {
  const W = 280;
  const H = 220;
  const padX = 18;
  const padY = 16;
  const sx = (x: number) => padX + x * (W - padX * 2);
  const sy = (y: number) => H - padY - (y / 3) * (H - padY * 2);
  const pts = Array.from({ length: 80 }, (_, i) => i / 79);

  return (
    <g>
      <rect width={W} height={H} fill="none" stroke={COLORS.stroke} />
      <text
        x={padX}
        y={padY - 4}
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fill={COLORS.muted}
        style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
      >
        {label}
      </text>
      {points.map((p, i) => (
        <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={2.5} fill={COLORS.ink} />
      ))}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
        d={`M ${pts.map((x) => `${sx(x)},${sy(fit(x))}`).join(" L ")}`}
        fill="none"
        stroke={COLORS.accent}
        strokeWidth={1.5}
      />
    </g>
  );
}

export function BiasVariance({ width = 880, height = 280 }: { width?: number; height?: number }) {
  const points = genWave();
  const W = 280;
  const padX = 30;
  const gap = (width - padX * 2 - W * 3) / 2;

  const linear = (x: number) => 1.4 + 0.05 * x;
  const cubic = (x: number) => Math.sin(x * Math.PI * 2) * 0.7 + 1.5;
  const wiggly = (x: number) => {
    let acc = 0;
    points.forEach((p) => {
      const d = Math.abs(p.x - x);
      const w = Math.exp(-d * d * 220);
      acc += w * p.y;
    });
    const norm = points.reduce((a, p) => a + Math.exp(-((p.x - x) ** 2) * 220), 0);
    return acc / norm;
  };
  const labels = ["Underfit", "Good fit", "Overfit"];
  const fits = [linear, cubic, wiggly];

  return (
    <VizFrame width={width} height={height}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {fits.map((f, i) => (
          <g key={labels[i]} transform={`translate(${padX + i * (W + gap)}, 30)`}>
            {plot(labels[i], f, points)}
          </g>
        ))}
      </svg>
    </VizFrame>
  );
}
