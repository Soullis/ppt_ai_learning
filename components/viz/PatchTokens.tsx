"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/**
 * Image -> grid of patches -> sequence of tokens. Bridges the "what is a token
 * for an image?" question that arises when introducing attention on vision.
 */
export function PatchTokens({
  width = 920,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const N = 4;
  const imgSize = 200;
  const patchPx = imgSize / N;
  const padY = 40;

  const imgX = 30;
  const tokensY = padY + imgSize + 60;
  const tokenW = (width - 60 - 30) / (N * N);

  return (
    <VizFrame width={width} height={height} caption="vision transformer · image → patches → token sequence">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Left label */}
        <text
          x={imgX}
          y={padY - 14}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          image (H × W × C)
        </text>
        {/* Image with grid */}
        {Array.from({ length: N * N }, (_, k) => {
          const r = Math.floor(k / N);
          const c = k % N;
          return (
            <rect
              key={k}
              x={imgX + c * patchPx}
              y={padY + r * patchPx}
              width={patchPx}
              height={patchPx}
              fill={COLORS.ink}
              fillOpacity={0.05 + (((r + c) * 13) % 7) / 14}
              stroke={COLORS.honey}
              strokeWidth={1}
            />
          );
        })}

        {/* Arrow */}
        <motion.line
          x1={imgX + imgSize + 20}
          x2={imgX + imgSize + 80}
          y1={padY + imgSize / 2}
          y2={padY + imgSize / 2}
          stroke={COLORS.muted}
          strokeOpacity={0.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6 }}
        />
        <polygon
          points={`${imgX + imgSize + 78},${padY + imgSize / 2 - 4} ${imgX + imgSize + 86},${padY + imgSize / 2} ${imgX + imgSize + 78},${padY + imgSize / 2 + 4}`}
          fill={COLORS.muted}
        />
        <text
          x={imgX + imgSize + 50}
          y={padY + imgSize / 2 - 10}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
        >
          flatten
        </text>

        {/* Right column: patch embeddings */}
        <text
          x={imgX + imgSize + 100}
          y={padY - 14}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          patch embeddings (T × d)
        </text>
        {Array.from({ length: N * N }, (_, k) => (
          <motion.rect
            key={`tok-${k}`}
            x={imgX + imgSize + 100 + k * 16}
            y={padY}
            width={14}
            height={imgSize}
            fill={COLORS.accent}
            fillOpacity={0.15 + ((k * 17) % 7) / 14}
            stroke={COLORS.accent}
            strokeWidth={0.5}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 + k * 0.04 }}
          />
        ))}

        {/* Sequence below */}
        <text
          x={30}
          y={tokensY - 14}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          token sequence fed to attention — each token attends to every other
        </text>
        {Array.from({ length: N * N }, (_, k) => (
          <motion.g
            key={`s-${k}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 + k * 0.04 }}
          >
            <rect
              x={30 + k * (tokenW + 4)}
              y={tokensY}
              width={tokenW}
              height={36}
              rx={4}
              fill={COLORS.honey}
              fillOpacity={0.18}
              stroke={COLORS.honey}
            />
            <text
              x={30 + k * (tokenW + 4) + tokenW / 2}
              y={tokensY + 22}
              textAnchor="middle"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.ink}
            >
              t{k + 1}
            </text>
          </motion.g>
        ))}
      </svg>
    </VizFrame>
  );
}
