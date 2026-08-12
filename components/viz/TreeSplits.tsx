"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/**
 * Two side-by-side panels:
 *   left  — 2D scatter with axis-aligned splits drawn as lines
 *   right — the resulting binary tree, in the same colour
 */
export function TreeSplits({
  width = 880,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  // Synthetic 2D scatter
  function rng(seed: number) {
    let s = seed;
    return () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
  }
  const r = rng(7);
  const points: { x: number; y: number; c: 0 | 1 }[] = [];
  for (let i = 0; i < 70; i++) {
    const x = r();
    const y = r();
    let c: 0 | 1 = 0;
    if (x > 0.55) c = y > 0.4 ? 1 : 0;
    else c = y > 0.7 ? 1 : 0;
    if (Math.random() < 0.05) c = (1 - c) as 0 | 1;
    points.push({ x, y, c });
  }

  const lW = (width - 30) / 2;
  const lH = height - 30;
  const padX = 40;
  const padY = 30;
  const sx = (x: number) => padX + x * (lW - padX * 2);
  const sy = (y: number) => lH - padY - y * (lH - padY * 2);

  const splits = [
    { axis: "x" as const, value: 0.55, depth: 0 },
    { axis: "y" as const, value: 0.7, depth: 1, region: { xMin: 0, xMax: 0.55 } },
    { axis: "y" as const, value: 0.4, depth: 1, region: { xMin: 0.55, xMax: 1 } },
  ];

  return (
    <VizFrame width={width} height={height} caption="recursive axis-aligned splits → binary tree">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Left — scatter + splits */}
        <g transform="translate(10, 20)">
          <rect width={lW} height={lH} fill={COLORS.surface} stroke={COLORS.stroke} />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r={3}
              fill={p.c === 0 ? COLORS.accent : COLORS.honey}
              fillOpacity={0.85}
            />
          ))}
          {splits.map((s, i) => {
            if (s.axis === "x") {
              return (
                <motion.line
                  key={i}
                  x1={sx(s.value)}
                  x2={sx(s.value)}
                  y1={sy(0)}
                  y2={sy(1)}
                  stroke={COLORS.ink}
                  strokeWidth={1.4}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6 }}
                />
              );
            }
            const region = s.region!;
            return (
              <motion.line
                key={i}
                x1={sx(region.xMin)}
                x2={sx(region.xMax)}
                y1={sy(s.value)}
                y2={sy(s.value)}
                stroke={COLORS.ink}
                strokeOpacity={0.7}
                strokeDasharray="3 3"
                strokeWidth={1.2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
              />
            );
          })}
          <text
            x={padX}
            y={padY - 10}
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
            style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
          >
            features
          </text>
        </g>
        {/* Right — tree diagram */}
        <g transform={`translate(${lW + 20}, 20)`}>
          <rect width={lW} height={lH} fill={COLORS.surface} stroke={COLORS.stroke} />
          {/* root */}
          <Node x={lW / 2} y={50} label="x > 0.55 ?" />
          {/* left child */}
          <Edge x1={lW / 2} y1={64} x2={lW * 0.28} y2={130} />
          <Node x={lW * 0.28} y={140} label="y > 0.7 ?" />
          {/* right child */}
          <Edge x1={lW / 2} y1={64} x2={lW * 0.72} y2={130} />
          <Node x={lW * 0.72} y={140} label="y > 0.4 ?" />
          {/* leaves */}
          {[
            { x: lW * 0.16, y: 230, c: 0 },
            { x: lW * 0.4, y: 230, c: 1 },
            { x: lW * 0.6, y: 230, c: 0 },
            { x: lW * 0.84, y: 230, c: 1 },
          ].map((l, i) => (
            <g key={i}>
              <Edge
                x1={i < 2 ? lW * 0.28 : lW * 0.72}
                y1={154}
                x2={l.x}
                y2={220}
              />
              <Leaf x={l.x} y={l.y} cls={l.c as 0 | 1} />
            </g>
          ))}
          <text
            x={lW / 2}
            y={lH - 14}
            textAnchor="middle"
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            split that maximises purity (entropy / Gini)
          </text>
        </g>
      </svg>
    </VizFrame>
  );
}

function Node({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect
        x={x - 60}
        y={y - 14}
        width={120}
        height={28}
        rx={4}
        fill={COLORS.surface}
        stroke={COLORS.ink}
        strokeOpacity={0.6}
      />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={12} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
        {label}
      </text>
    </g>
  );
}

function Leaf({ x, y, cls }: { x: number; y: number; cls: 0 | 1 }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={14}
        fill={cls === 0 ? COLORS.accent : COLORS.honey}
        fillOpacity={0.85}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fill={COLORS.surface}
      >
        {cls}
      </text>
    </g>
  );
}

function Edge({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.muted} strokeOpacity={0.6} />;
}
