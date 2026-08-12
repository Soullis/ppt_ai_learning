"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

export function AttentionMatrix({
  tokens = ["the", "drone", "sees", "a", "gate"],
  width = 720,
  height = 460,
}: {
  tokens?: string[];
  width?: number;
  height?: number;
}) {
  const N = tokens.length;
  // Synthetic attention weights (softmax-like) — emphasise diagonal + selected pairs
  const raw: number[][] = [];
  for (let i = 0; i < N; i++) {
    const row: number[] = [];
    for (let j = 0; j < N; j++) {
      const diag = Math.exp(-Math.abs(i - j) * 1.3);
      const pair =
        (i === 1 && j === 4) || (i === 4 && j === 1) ? 1.6 : 0;
      row.push(diag + pair + Math.random() * 0.05);
    }
    raw.push(row);
  }
  const A = raw.map((row) => {
    const m = Math.max(...row);
    const exp = row.map((v) => Math.exp(v - m));
    const s = exp.reduce((a, b) => a + b, 0);
    return exp.map((v) => v / s);
  });

  const cell = 50;
  const grid = N * cell;
  const offsetX = (width - grid) / 2;
  const offsetY = (height - grid) / 2 + 20;

  return (
    <VizFrame width={width} height={height} caption="softmax(QKᵀ / √d) — query rows attend to key columns">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {tokens.map((t, j) => (
          <text
            key={`k-${t}`}
            x={offsetX + j * cell + cell / 2}
            y={offsetY - 10}
            textAnchor="middle"
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            {t}
          </text>
        ))}
        {tokens.map((t, i) => (
          <text
            key={`q-${t}`}
            x={offsetX - 12}
            y={offsetY + i * cell + cell / 2 + 4}
            textAnchor="end"
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            {t}
          </text>
        ))}
        {A.map((row, i) =>
          row.map((v, j) => (
            <motion.rect
              key={`c-${i}-${j}`}
              x={offsetX + j * cell}
              y={offsetY + i * cell}
              width={cell}
              height={cell}
              fill={COLORS.accent}
              fillOpacity={v * 0.95}
              stroke={COLORS.surface}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: (i * N + j) * 0.02 }}
            />
          )),
        )}
        {/* Numeric labels */}
        {A.map((row, i) =>
          row.map((v, j) => (
            <text
              key={`n-${i}-${j}`}
              x={offsetX + j * cell + cell / 2}
              y={offsetY + i * cell + cell / 2 + 4}
              textAnchor="middle"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              fill={v > 0.4 ? COLORS.surface : COLORS.ink}
            >
              {v.toFixed(2)}
            </text>
          )),
        )}
      </svg>
    </VizFrame>
  );
}
