"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/** Single neuron with explicit x_i, w_i, b, Σ, σ, y. */
export function PerceptronDiagram({
  width = 880,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const inputs = [
    { label: "x₁", w: "w₁" },
    { label: "x₂", w: "w₂" },
    { label: "x₃", w: "w₃" },
  ];
  const padX = 80;
  const inputX = padX + 40;
  const sumX = width / 2 - 40;
  const actX = width / 2 + 80;
  const outX = width - padX - 40;
  const cy = height / 2;
  const inputYs = inputs.map((_, i) => cy - 80 + i * 80);

  return (
    <VizFrame width={width} height={height} caption="one neuron · y = σ(Σ wᵢ xᵢ + b)">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Input nodes */}
        {inputs.map((inp, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <circle
              cx={inputX}
              cy={inputYs[i]}
              r={20}
              fill={COLORS.surface}
              stroke={COLORS.ink}
              strokeWidth={1.5}
            />
            <text
              x={inputX}
              y={inputYs[i] + 5}
              textAnchor="middle"
              fontSize={14}
              fill={COLORS.ink}
              fontFamily="JetBrains Mono, monospace"
            >
              {inp.label}
            </text>
          </motion.g>
        ))}
        {/* Edges with weight labels */}
        {inputs.map((inp, i) => (
          <motion.g
            key={`e-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
          >
            <line
              x1={inputX + 20}
              y1={inputYs[i]}
              x2={sumX - 24}
              y2={cy}
              stroke={COLORS.accent}
              strokeWidth={1.4}
            />
            <text
              x={(inputX + sumX) / 2 - 8}
              y={(inputYs[i] + cy) / 2 - 6}
              fontSize={12}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.accent}
            >
              {inp.w}
            </text>
          </motion.g>
        ))}
        {/* Bias */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <circle cx={inputX} cy={cy + 130} r={18} fill={COLORS.bone} stroke={COLORS.muted} strokeWidth={1.2} strokeDasharray="3 3" />
          <text x={inputX} y={cy + 135} textAnchor="middle" fontSize={13} fill={COLORS.muted} fontFamily="JetBrains Mono, monospace">
            1
          </text>
          <line
            x1={inputX + 18}
            y1={cy + 130}
            x2={sumX - 24}
            y2={cy + 4}
            stroke={COLORS.muted}
            strokeWidth={1.2}
            strokeDasharray="3 3"
          />
          <text
            x={(inputX + sumX) / 2 - 6}
            y={cy + 96}
            fontSize={12}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            b
          </text>
        </motion.g>
        {/* Σ node */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.95 }}
        >
          <circle cx={sumX} cy={cy} r={26} fill={COLORS.surface} stroke={COLORS.ink} strokeWidth={1.5} />
          <text x={sumX} y={cy + 6} textAnchor="middle" fontSize={20} fill={COLORS.ink}>
            Σ
          </text>
          <text
            x={sumX}
            y={cy + 50}
            textAnchor="middle"
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            z = Σ wᵢ xᵢ + b
          </text>
        </motion.g>
        {/* Connection sum -> activation */}
        <motion.line
          x1={sumX + 26}
          y1={cy}
          x2={actX - 26}
          y2={cy}
          stroke={COLORS.ink}
          strokeOpacity={0.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        />
        <text
          x={(sumX + actX) / 2}
          y={cy - 8}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
        >
          z
        </text>
        {/* Activation node σ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <circle cx={actX} cy={cy} r={26} fill={COLORS.surface} stroke={COLORS.ink} strokeWidth={1.5} />
          <text x={actX} y={cy + 6} textAnchor="middle" fontSize={18} fill={COLORS.ink}>
            σ
          </text>
          <text
            x={actX}
            y={cy + 50}
            textAnchor="middle"
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            activation
          </text>
        </motion.g>
        {/* Output */}
        <motion.line
          x1={actX + 26}
          y1={cy}
          x2={outX - 24}
          y2={cy}
          stroke={COLORS.ink}
          strokeOpacity={0.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
        />
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.5 }}
        >
          <circle cx={outX} cy={cy} r={22} fill={COLORS.honey} fillOpacity={0.18} stroke={COLORS.honey} strokeWidth={1.5} />
          <text x={outX} y={cy + 5} textAnchor="middle" fontSize={16} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
            y
          </text>
          <text x={outX} y={cy + 50} textAnchor="middle" fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
            output
          </text>
        </motion.g>
        {/* Top label of inputs */}
        <text
          x={inputX}
          y={inputYs[0] - 36}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          inputs
        </text>
      </svg>
    </VizFrame>
  );
}
