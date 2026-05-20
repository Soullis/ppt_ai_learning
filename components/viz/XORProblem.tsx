"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COLORS, VizFrame } from "./common";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Two side-by-side panels showing why a single perceptron cannot learn XOR
 * and how a two-layer network solves it.
 */
const POINTS: { x: 0 | 1; y: 0 | 1; xor: 0 | 1 }[] = [
  { x: 0, y: 0, xor: 0 },
  { x: 0, y: 1, xor: 1 },
  { x: 1, y: 0, xor: 1 },
  { x: 1, y: 1, xor: 0 },
];

export function XORProblem({
  width = 980,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  const panelW = (width - 40) / 2;
  const panelH = height - 30;

  return (
    <VizFrame
      width={width}
      height={height}
      caption="why we needed more than one neuron — and what fixed it"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <g transform="translate(15, 15)">
          <SinglePerceptronPanel w={panelW} h={panelH} />
        </g>
        <g transform={`translate(${15 + panelW + 10}, 15)`}>
          <TwoLayerPanel w={panelW} h={panelH} />
        </g>
      </svg>
    </VizFrame>
  );
}

function SinglePerceptronPanel({ w, h }: { w: number; h: number }) {
  const reduce = useReducedMotion();
  // Cycle three failed candidate lines
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setAngle((a) => (a + 1) % 3), 1400);
    return () => clearInterval(id);
  }, [reduce]);

  const padX = 60;
  const padY = 60;
  const innerW = w - padX * 2;
  const innerH = h - padY - 60;
  const sx = (x: number) => padX + x * innerW;
  const sy = (y: number) => padY + (1 - y) * innerH;

  // Three candidate decision lines, none separates XOR.
  const lines = [
    { p1: [-0.1, 0.5], p2: [1.1, 0.5] },
    { p1: [0.5, -0.1], p2: [0.5, 1.1] },
    { p1: [-0.1, 1.1], p2: [1.1, -0.1] },
  ];
  const line = lines[angle];

  return (
    <g>
      <rect width={w} height={h} fill={COLORS.surface} stroke={COLORS.stroke} />
      <text
        x={14}
        y={20}
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fill={COLORS.muted}
        style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
      >
        single perceptron · linear boundary
      </text>

      {/* Axes */}
      <line x1={padX} x2={padX + innerW} y1={padY + innerH} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.3} />
      <line x1={padX} x2={padX} y1={padY} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.3} />
      <text x={padX - 8} y={sy(0) + 4} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted} textAnchor="end">0</text>
      <text x={padX - 8} y={sy(1) + 4} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted} textAnchor="end">1</text>
      <text x={sx(0)} y={sy(0) + 18} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted} textAnchor="middle">0</text>
      <text x={sx(1)} y={sy(0) + 18} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted} textAnchor="middle">1</text>

      {/* Animated candidate line */}
      <motion.line
        x1={sx(line.p1[0])}
        y1={sy(line.p1[1])}
        x2={sx(line.p2[0])}
        y2={sy(line.p2[1])}
        stroke={COLORS.red}
        strokeWidth={1.6}
        strokeDasharray="5 5"
        animate={{
          x1: sx(line.p1[0]),
          y1: sy(line.p1[1]),
          x2: sx(line.p2[0]),
          y2: sy(line.p2[1]),
        }}
        transition={{ duration: 0.6 }}
      />

      {/* The four XOR points */}
      {POINTS.map((p, i) => (
        <g key={i}>
          <circle
            cx={sx(p.x)}
            cy={sy(p.y)}
            r={9}
            fill={p.xor === 0 ? COLORS.accent : COLORS.honey}
            stroke={COLORS.ink}
            strokeWidth={1}
          />
          <text
            x={sx(p.x)}
            y={sy(p.y) + 4}
            textAnchor="middle"
            fontSize={11}
            fill={COLORS.surface}
            fontFamily="JetBrains Mono, monospace"
          >
            {p.xor}
          </text>
        </g>
      ))}

      <text
        x={w / 2}
        y={h - 36}
        textAnchor="middle"
        fontSize={11}
        fill={COLORS.red}
        fontFamily="JetBrains Mono, monospace"
      >
        no straight line separates the yellows from the blues
      </text>
      <text
        x={w / 2}
        y={h - 18}
        textAnchor="middle"
        fontSize={11}
        fill={COLORS.muted}
      >
        Minsky &amp; Papert, Perceptrons (1969)
      </text>
    </g>
  );
}

function TwoLayerPanel({ w, h }: { w: number; h: number }) {
  const padX = 60;
  const padY = 60;
  const innerW = w - padX * 2;
  const innerH = h - padY - 60;
  const sx = (x: number) => padX + x * innerW;
  const sy = (y: number) => padY + (1 - y) * innerH;

  // Two oblique decision regions intersecting → an X-shape
  return (
    <g>
      <rect width={w} height={h} fill={COLORS.surface} stroke={COLORS.stroke} />
      <text
        x={14}
        y={20}
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fill={COLORS.muted}
        style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
      >
        two-layer network · non-linear boundary
      </text>

      {/* Decision shading: highlight regions where XOR = 1 */}
      {[
        // top-left and bottom-right diamonds (yellow regions)
        `M ${sx(0)},${sy(0.55)} L ${sx(0.45)},${sy(1)} L ${sx(0)},${sy(1)} Z`,
        `M ${sx(0.55)},${sy(0)} L ${sx(1)},${sy(0)} L ${sx(1)},${sy(0.45)} Z`,
      ].map((d, i) => (
        <motion.path
          key={`r-${i}`}
          d={d}
          fill={COLORS.honey}
          fillOpacity={0.25}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      ))}

      {/* Two hidden-unit boundaries */}
      <motion.line
        x1={sx(0)}
        y1={sy(0.55)}
        x2={sx(0.55)}
        y2={sy(0)}
        stroke={COLORS.ink}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7 }}
      />
      <motion.line
        x1={sx(0.45)}
        y1={sy(1)}
        x2={sx(1)}
        y2={sy(0.45)}
        stroke={COLORS.ink}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      />

      {/* Axes */}
      <line x1={padX} x2={padX + innerW} y1={padY + innerH} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.3} />
      <line x1={padX} x2={padX} y1={padY} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.3} />
      <text x={padX - 8} y={sy(0) + 4} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted} textAnchor="end">0</text>
      <text x={padX - 8} y={sy(1) + 4} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted} textAnchor="end">1</text>
      <text x={sx(0)} y={sy(0) + 18} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted} textAnchor="middle">0</text>
      <text x={sx(1)} y={sy(0) + 18} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted} textAnchor="middle">1</text>

      {/* Points */}
      {POINTS.map((p, i) => (
        <g key={i}>
          <circle
            cx={sx(p.x)}
            cy={sy(p.y)}
            r={9}
            fill={p.xor === 0 ? COLORS.accent : COLORS.honey}
            stroke={COLORS.ink}
            strokeWidth={1}
          />
          <text
            x={sx(p.x)}
            y={sy(p.y) + 4}
            textAnchor="middle"
            fontSize={11}
            fill={COLORS.surface}
            fontFamily="JetBrains Mono, monospace"
          >
            {p.xor}
          </text>
        </g>
      ))}

      <text
        x={w / 2}
        y={h - 36}
        textAnchor="middle"
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fill={COLORS.green}
      >
        two hidden units carve two half-planes; their XOR is the answer
      </text>
      <text
        x={w / 2}
        y={h - 18}
        textAnchor="middle"
        fontSize={11}
        fill={COLORS.muted}
      >
        a minimal &quot;deep&quot; network: input → 2 hidden → output
      </text>
    </g>
  );
}
