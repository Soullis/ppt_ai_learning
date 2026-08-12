"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/** Self-supervised pretext task: mask a patch, predict its pixels. */
export function MaskedPatch({
  width = 640,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const N = 8;
  const cellW = 26;
  const padX = 22;
  const padY = 30;
  const ax = padX;
  const ay = padY;
  const bx = padX + N * cellW + 80;
  const by = padY;

  const masked = (i: number, j: number) => i >= 2 && i <= 4 && j >= 3 && j <= 5;

  return (
    <VizFrame width={width} height={height} caption="self-supervised pretext: mask, then predict">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <text
          x={ax}
          y={ay - 10}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          masked input
        </text>
        <text
          x={bx}
          y={by - 10}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          model reconstruction
        </text>
        {Array.from({ length: N * N }, (_, k) => {
          const i = Math.floor(k / N);
          const j = k % N;
          const v = (Math.sin(j * 0.6) + Math.cos(i * 0.7)) * 0.5 + 0.5;
          const isMask = masked(i, j);
          return (
            <g key={k}>
              {/* Left: masked input */}
              <rect
                x={ax + j * cellW}
                y={ay + i * cellW}
                width={cellW - 1}
                height={cellW - 1}
                fill={isMask ? COLORS.ink : COLORS.ink}
                fillOpacity={isMask ? 1 : 0.05 + v * 0.7}
                stroke={isMask ? COLORS.honey : COLORS.stroke}
                strokeWidth={isMask ? 1.4 : 0.5}
              />
              {/* Right: reconstruction with predicted patch fades in */}
              <motion.rect
                x={bx + j * cellW}
                y={by + i * cellW}
                width={cellW - 1}
                height={cellW - 1}
                fill={COLORS.ink}
                stroke={COLORS.stroke}
                strokeWidth={0.5}
                initial={{ fillOpacity: isMask ? 0 : 0.05 + v * 0.7 }}
                animate={{ fillOpacity: 0.05 + v * 0.7 }}
                transition={{ duration: 0.6, delay: isMask ? 0.6 + (i + j) * 0.05 : 0 }}
              />
            </g>
          );
        })}
        {/* Arrow */}
        <line
          x1={ax + N * cellW + 14}
          x2={bx - 14}
          y1={ay + (N * cellW) / 2}
          y2={by + (N * cellW) / 2}
          stroke={COLORS.muted}
          strokeOpacity={0.5}
        />
        <polygon
          points={`${bx - 18},${by + (N * cellW) / 2 - 4} ${bx - 12},${by + (N * cellW) / 2} ${bx - 18},${by + (N * cellW) / 2 + 4}`}
          fill={COLORS.muted}
          fillOpacity={0.6}
        />
        <text
          x={(ax + bx + N * cellW) / 2}
          y={ay + (N * cellW) / 2 - 8}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
        >
          encoder + decoder
        </text>
        <text
          x={padX}
          y={padY + N * cellW + 30}
          fontSize={11}
          fill={COLORS.muted}
        >
          loss = ‖predicted_patch − true_patch‖² · no human labels needed
        </text>
      </svg>
    </VizFrame>
  );
}
