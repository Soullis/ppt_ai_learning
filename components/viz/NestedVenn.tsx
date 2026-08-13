"use client";
import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

const RINGS = [
  {
    label: "Inteligência Artificial",
    short: "IA",
    r: 200,
    sub: "Busca · planejamento · raciocínio · conhecimento",
    examples: "sistemas especialistas · A* · lógica simbólica",
  },
  {
    label: "Machine Learning",
    short: "ML",
    r: 140,
    sub: "Programas que aprendem regras a partir de dados",
    examples: "regressão · árvores · SVM · k-means",
  },
  {
    label: "Deep Learning",
    short: "DL",
    r: 80,
    sub: "Redes neurais de muitas camadas",
    examples: "CNN · transformer · YOLO · DETR",
  },
];

export function NestedVenn({
  width = 760,
  height = 480,
}: {
  width?: number;
  height?: number;
}) {
  const cx = width / 2;
  const cy = height / 2 + 18;
  return (
    <VizFrame width={width} height={height} caption="IA ⊃ ML ⊃ DL">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Concentric rings */}
        {RINGS.map((ring, i) => (
          <motion.circle
            key={ring.label}
            cx={cx}
            cy={cy}
            r={ring.r}
            fill={COLORS.surface}
            stroke={COLORS.ink}
            strokeOpacity={0.18 + i * 0.18}
            strokeWidth={1.25}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: i * 0.18 }}
          />
        ))}
        {/* Labels inside each ring at the top */}
        {RINGS.map((ring, i) => {
          const y = cy - ring.r + 22;
          const fontSize = i === 0 ? 14 : i === 1 ? 13 : 12;
          return (
            <motion.text
              key={`l-${ring.label}`}
              x={cx}
              y={y}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize={fontSize}
              fill={COLORS.ink}
              fillOpacity={0.85}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.18 }}
              style={{ textTransform: "uppercase", letterSpacing: "0.16em" }}
            >
              {ring.short} · {ring.label}
            </motion.text>
          );
        })}
        {/* Inner-most short examples list, stacked at the centre */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.95 }}
        >
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fontSize={11}
            fill={COLORS.muted}
            fontFamily="JetBrains Mono, monospace"
          >
            CNN · Transformer
          </text>
          <text
            x={cx}
            y={cy + 22}
            textAnchor="middle"
            fontSize={11}
            fill={COLORS.muted}
            fontFamily="JetBrains Mono, monospace"
          >
            YOLO · DETR
          </text>
        </motion.g>
      </svg>
    </VizFrame>
  );
}