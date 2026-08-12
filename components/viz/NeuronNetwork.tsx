"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COLORS, VizFrame } from "./common";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

function rng(seed = 12) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296 - 0.5;
  };
}

export function NeuronNetwork({
  layers = [3, 5, 4, 2],
  width = 720,
  height = 460,
  pulse = true,
}: {
  layers?: number[];
  width?: number;
  height?: number;
  pulse?: boolean;
}) {
  const padX = 70;
  const padY = 50;
  const colW = (width - padX * 2) / (layers.length - 1);

  const positions = layers.map((n, li) =>
    Array.from({ length: n }, (_, ni) => {
      const x = padX + li * colW;
      const ySpan = height - padY * 2;
      const step = ySpan / (n + 1);
      const y = padY + step * (ni + 1);
      return { x, y };
    }),
  );

  // Random weights, stable per layout
  const r = rng(7);
  const weights: number[][][] = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const W: number[][] = [];
    for (let i = 0; i < layers[li]; i++) {
      const row: number[] = [];
      for (let j = 0; j < layers[li + 1]; j++) row.push(r());
      W.push(row);
    }
    weights.push(W);
  }

  const [activeLayer, setActiveLayer] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!pulse || reduce) return;
    const id = setInterval(
      () => setActiveLayer((a) => (a + 1) % (layers.length - 1)),
      900,
    );
    return () => clearInterval(id);
  }, [layers.length, pulse, reduce]);

  return (
    <VizFrame width={width} height={height} caption="multi-layer perceptron — weights animate as edge thickness">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Edges */}
        {weights.map((W, li) =>
          W.map((row, i) =>
            row.map((w, j) => {
              const a = positions[li][i];
              const b = positions[li + 1][j];
              const isActive = li === activeLayer;
              return (
                <motion.line
                  key={`e-${li}-${i}-${j}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={w >= 0 ? COLORS.accent : COLORS.honey}
                  strokeOpacity={isActive ? 0.85 : 0.18}
                  strokeWidth={Math.abs(w) * 3 + 0.5}
                  initial={false}
                  animate={{ strokeOpacity: isActive ? 0.85 : 0.18 }}
                />
              );
            }),
          ),
        )}
        {/* Nodes */}
        {positions.map((col, li) => (
          <g key={`n-${li}`}>
            {col.map((p, ni) => (
              <g key={`n-${li}-${ni}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={11}
                  fill={COLORS.surface}
                  stroke={COLORS.ink}
                  strokeOpacity={0.45}
                  strokeWidth={1.2}
                />
              </g>
            ))}
            <text
              x={col[0].x}
              y={padY - 22}
              textAnchor="middle"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.muted}
              style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
            >
              {li === 0
                ? "input"
                : li === layers.length - 1
                  ? "output"
                  : `hidden ${li}`}
            </text>
          </g>
        ))}
      </svg>
    </VizFrame>
  );
}
