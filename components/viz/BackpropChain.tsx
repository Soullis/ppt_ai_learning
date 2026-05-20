"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/**
 * Tiny network y = σ(w₂ · σ(w₁ x + b₁) + b₂) with chain-rule terms drawn
 * underneath each connection.
 */
export function BackpropChain({
  width = 920,
  height = 360,
}: {
  width?: number;
  height?: number;
}) {
  const cy = 110;
  const stages = [
    { x: 60, label: "x", note: "input" },
    { x: 220, label: "z₁ = w₁x + b₁", note: "linear" },
    { x: 410, label: "h = σ(z₁)", note: "activation" },
    { x: 600, label: "z₂ = w₂h + b₂", note: "linear" },
    { x: 790, label: "ŷ = σ(z₂)", note: "activation" },
    { x: 880, label: "L(ŷ, y)", note: "loss" },
  ];

  return (
    <VizFrame width={width} height={height} caption="forward (top) and backward (bottom): each step multiplies one local derivative">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Forward arrows */}
        {stages.map((s, i) => (
          <g key={`fwd-${i}`}>
            <motion.rect
              x={s.x - 50}
              y={cy - 22}
              width={100}
              height={44}
              rx={6}
              fill={COLORS.surface}
              stroke={COLORS.ink}
              strokeOpacity={0.4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            />
            <text
              x={s.x}
              y={cy - 4}
              textAnchor="middle"
              fontSize={12}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.ink}
            >
              {s.label}
            </text>
            <text
              x={s.x}
              y={cy + 14}
              textAnchor="middle"
              fontSize={10}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.muted}
              style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
            >
              {s.note}
            </text>
            {i < stages.length - 1 ? (
              <motion.line
                x1={s.x + 50}
                x2={stages[i + 1].x - 50}
                y1={cy}
                y2={cy}
                stroke={COLORS.accent}
                strokeOpacity={0.7}
                strokeWidth={1.4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              />
            ) : null}
          </g>
        ))}

        <text
          x={40}
          y={cy - 50}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.accent}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          forward
        </text>

        {/* Backward gradient flow */}
        <text
          x={40}
          y={cy + 88}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.honey}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          backward
        </text>

        {/* Chain-rule label per arrow */}
        {[
          { from: 5, to: 4, label: "∂L/∂ŷ" },
          { from: 4, to: 3, label: "∂ŷ/∂z₂ = σ′(z₂)" },
          { from: 3, to: 2, label: "∂z₂/∂h = w₂" },
          { from: 2, to: 1, label: "∂h/∂z₁ = σ′(z₁)" },
          { from: 1, to: 0, label: "∂z₁/∂x = w₁" },
        ].map((edge, i) => {
          const a = stages[edge.from];
          const b = stages[edge.to];
          const x1 = a.x - 50;
          const x2 = b.x + 50;
          const y = cy + 70;
          return (
            <motion.g
              key={`bw-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.15 }}
            >
              <line
                x1={x1}
                x2={x2}
                y1={y}
                y2={y}
                stroke={COLORS.honey}
                strokeOpacity={0.85}
                strokeWidth={1.4}
              />
              <polygon
                points={`${x2},${y} ${x2 + 8},${y - 4} ${x2 + 8},${y + 4}`}
                fill={COLORS.honey}
              />
              <text
                x={(x1 + x2) / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.honey}
              >
                {edge.label}
              </text>
            </motion.g>
          );
        })}

        {/* Final derivatives */}
        <text
          x={width / 2}
          y={height - 30}
          textAnchor="middle"
          fontSize={12}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.ink}
        >
          ∂L/∂w₂ = (∂L/∂ŷ)(∂ŷ/∂z₂) · h
          &nbsp;&nbsp;&nbsp;&nbsp;
          ∂L/∂w₁ = (∂L/∂ŷ)(∂ŷ/∂z₂)(w₂)(σ′(z₁)) · x
        </text>
      </svg>
    </VizFrame>
  );
}
