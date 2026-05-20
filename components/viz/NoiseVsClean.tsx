"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COLORS, VizFrame } from "./common";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296 - 0.5;
  };
}

function genPoints(N: number, slope: number, intercept: number, noise: number, seed: number) {
  const r = rng(seed);
  return Array.from({ length: N }, () => {
    const x = (r() + 0.5) * 9 + 0.5;
    const y = slope * x + intercept + r() * noise;
    return { x, y };
  });
}

function fitLine(pts: { x: number; y: number }[]) {
  const n = pts.length;
  const sx = pts.reduce((a, p) => a + p.x, 0) / n;
  const sy = pts.reduce((a, p) => a + p.y, 0) / n;
  const sxx = pts.reduce((a, p) => a + (p.x - sx) ** 2, 0);
  const sxy = pts.reduce((a, p) => a + (p.x - sx) * (p.y - sy), 0);
  const w = sxy / sxx;
  return { w, b: sy - w * sx };
}

function Panel({
  title,
  noise,
  width,
  height,
  seed,
  truth,
}: {
  title: string;
  noise: number;
  width: number;
  height: number;
  seed: number;
  truth: { w: number; b: number };
}) {
  const padX = 36;
  const padY = 30;
  const xMin = 0;
  const xMax = 10;
  const yMin = 0;
  const yMax = 9;
  const sx = (x: number) => padX + ((x - xMin) / (xMax - xMin)) * (width - padX * 2);
  const sy = (y: number) =>
    height - padY - ((y - yMin) / (yMax - yMin)) * (height - padY * 2);

  const [seedTick, setSeedTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeedTick((t) => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  const pts = genPoints(40, truth.w, truth.b, noise, seed + seedTick * 1000);
  const fit = fitLine(pts);

  return (
    <g>
      {/* Frame */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={COLORS.surface}
        stroke={COLORS.stroke}
      />
      <text
        x={padX}
        y={padY - 10}
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fill={COLORS.muted}
        style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
      >
        {title}
      </text>
      {/* Axes */}
      <line
        x1={padX}
        x2={width - padX}
        y1={height - padY}
        y2={height - padY}
        stroke={COLORS.ink}
        strokeOpacity={0.3}
      />
      <line
        x1={padX}
        x2={padX}
        y1={padY}
        y2={height - padY}
        stroke={COLORS.ink}
        strokeOpacity={0.3}
      />
      {/* Truth line */}
      <line
        x1={sx(xMin)}
        y1={sy(truth.w * xMin + truth.b)}
        x2={sx(xMax)}
        y2={sy(truth.w * xMax + truth.b)}
        stroke={COLORS.muted}
        strokeOpacity={0.7}
        strokeDasharray="3 4"
        strokeWidth={1}
      />
      {/* Points */}
      {pts.map((p, i) => (
        <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={3} fill={COLORS.ink} />
      ))}
      {/* Fit line */}
      <motion.line
        animate={{
          x1: sx(xMin),
          y1: sy(fit.w * xMin + fit.b),
          x2: sx(xMax),
          y2: sy(fit.w * xMax + fit.b),
        }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        stroke={COLORS.accent}
        strokeWidth={1.75}
      />
      {/* Stats */}
      <text
        x={width - padX}
        y={padY - 10}
        textAnchor="end"
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fill={COLORS.muted}
      >
        ŵ {fit.w.toFixed(2)} · b̂ {fit.b.toFixed(2)}
      </text>
    </g>
  );
}

export function NoiseVsClean({
  width = 880,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const panelW = (width - 30) / 2;
  const panelH = height - 30;
  const truth = { w: 0.6, b: 1.2 };

  return (
    <VizFrame width={width} height={height} caption="same model, same truth — noise alone moves the fit">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <g transform="translate(10, 20)">
          <Panel title="Clean labels" noise={0.4} seed={3} width={panelW} height={panelH} truth={truth} />
        </g>
        <g transform={`translate(${panelW + 20}, 20)`}>
          <Panel title="Noisy labels" noise={2.6} seed={11} width={panelW} height={panelH} truth={truth} />
        </g>
      </svg>
    </VizFrame>
  );
}
