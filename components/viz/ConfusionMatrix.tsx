"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

const LABELS = ["gate", "drone", "post", "background"];

const MATRIX: number[][] = [
  [212, 3, 1, 18],
  [2, 87, 0, 7],
  [4, 1, 64, 12],
  [9, 4, 6, 0],
];

export function ConfusionMatrix({
  width = 640,
  height = 480,
}: {
  width?: number;
  height?: number;
}) {
  const N = LABELS.length;
  const cell = 64;
  const offsetX = (width - cell * N) / 2 + 20;
  const offsetY = 70;
  const max = Math.max(...MATRIX.flat());

  // Region label positions
  const tlBox = { x: offsetX, y: offsetY, w: cell * (N - 1), h: cell * (N - 1) };
  const fpRow = { x: offsetX, y: offsetY + (N - 1) * cell, w: cell * (N - 1), h: cell };
  const fnCol = { x: offsetX + (N - 1) * cell, y: offsetY, w: cell, h: cell * (N - 1) };

  return (
    <VizFrame
      width={width}
      height={height}
      caption="rows = ground truth, columns = prediction · diagonal good, off-diagonal bad"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Region highlights */}
        <motion.rect
          x={tlBox.x - 4}
          y={tlBox.y - 4}
          width={tlBox.w + 8}
          height={tlBox.h + 8}
          fill="none"
          stroke={COLORS.green}
          strokeWidth={1.4}
          strokeDasharray="4 4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.5 }}
        />
        <motion.rect
          x={fpRow.x - 4}
          y={fpRow.y - 2}
          width={fpRow.w + 8}
          height={fpRow.h + 4}
          fill="none"
          stroke={COLORS.honey}
          strokeWidth={1.4}
          strokeDasharray="4 4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.7 }}
        />
        <motion.rect
          x={fnCol.x - 2}
          y={fnCol.y - 4}
          width={fnCol.w + 4}
          height={fnCol.h + 8}
          fill="none"
          stroke={COLORS.red}
          strokeWidth={1.4}
          strokeDasharray="4 4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.9 }}
        />

        {/* Column labels */}
        {LABELS.map((l, j) => (
          <text
            key={`col-${l}`}
            x={offsetX + j * cell + cell / 2}
            y={offsetY - 16}
            textAnchor="middle"
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            {l}
          </text>
        ))}
        <text
          x={offsetX + (cell * N) / 2}
          y={offsetY - 38}
          textAnchor="middle"
          fontSize={10}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.16em" }}
        >
          predicted
        </text>
        {/* Row labels */}
        {LABELS.map((l, i) => (
          <text
            key={`row-${l}`}
            x={offsetX - 10}
            y={offsetY + i * cell + cell / 2 + 4}
            textAnchor="end"
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            {l}
          </text>
        ))}
        <text
          x={offsetX - 50}
          y={offsetY + (cell * N) / 2}
          textAnchor="middle"
          fontSize={10}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.16em" }}
          transform={`rotate(-90, ${offsetX - 50}, ${offsetY + (cell * N) / 2})`}
        >
          ground truth
        </text>

        {/* Cells */}
        {MATRIX.flatMap((row, i) =>
          row.map((v, j) => {
            const t = v / max;
            return (
              <motion.g
                key={`${i}-${j}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: (i * N + j) * 0.04 }}
              >
                <rect
                  x={offsetX + j * cell}
                  y={offsetY + i * cell}
                  width={cell}
                  height={cell}
                  fill={i === j ? COLORS.accent : COLORS.honey}
                  fillOpacity={t * 0.85}
                  stroke={COLORS.surface}
                />
                <text
                  x={offsetX + j * cell + cell / 2}
                  y={offsetY + i * cell + cell / 2 + 5}
                  textAnchor="middle"
                  fontSize={13}
                  fontFamily="JetBrains Mono, monospace"
                  fill={t > 0.4 ? COLORS.surface : COLORS.ink}
                >
                  {v}
                </text>
              </motion.g>
            );
          }),
        )}

        {/* Region annotations */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 2.1 }}
        >
          <text
            x={offsetX + cell * N + 16}
            y={offsetY + cell / 2 + 5}
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.red}
          >
            ← false negatives (missed)
          </text>
          <text
            x={offsetX + cell * N + 16}
            y={offsetY + cell * N - cell / 2 + 5}
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.honey}
          >
            ← false positives (hallucinated)
          </text>
          <text
            x={offsetX + 12}
            y={offsetY - 56}
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.green}
          >
            true positives along the diagonal
          </text>
        </motion.g>
      </svg>
    </VizFrame>
  );
}
