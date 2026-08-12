"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

// Simple Hungarian-like view: predictions on the left, ground-truth on the right,
// with a learned 1-to-1 matching. Unmatched predictions go to "no object".
const MATCHES: { p: number; g: number | "none" }[] = [
  { p: 0, g: 1 },
  { p: 1, g: 0 },
  { p: 2, g: "none" },
  { p: 3, g: 2 },
  { p: 4, g: "none" },
];

const PRED_LABELS = ["q1", "q2", "q3", "q4", "q5"];
const GT_LABELS = ["gate", "drone", "post"];

export function BipartiteMatching({
  width = 720,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  const W = width;
  const H = height;
  const lx = 180;
  const rx = W - 180;
  const padY = 60;
  const sl = (i: number, n: number) => padY + (i + 0.5) * ((H - padY * 2) / n);

  return (
    <VizFrame width={W} height={H} caption="DETR / RF-DETR — set-based prediction with bipartite matching">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
        <text
          x={lx}
          y={padY - 24}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
        >
          predictions
        </text>
        <text
          x={rx}
          y={padY - 24}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
        >
          ground truth
        </text>
        <text
          x={rx + 90}
          y={H - padY + 26}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
        >
          ∅ no object
        </text>
        {/* Predictions */}
        {PRED_LABELS.map((p, i) => (
          <g key={`p-${i}`}>
            <circle cx={lx} cy={sl(i, PRED_LABELS.length)} r={18} fill={COLORS.surface} stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={lx} y={sl(i, PRED_LABELS.length) + 4} textAnchor="middle" fontSize={12} fill={COLORS.ink} fontFamily="JetBrains Mono, monospace">
              {p}
            </text>
          </g>
        ))}
        {/* Ground truth */}
        {GT_LABELS.map((g, i) => (
          <g key={`g-${i}`}>
            <circle cx={rx} cy={sl(i, GT_LABELS.length)} r={18} fill={COLORS.surface} stroke={COLORS.honey} strokeWidth={1.5} />
            <text x={rx} y={sl(i, GT_LABELS.length) + 4} textAnchor="middle" fontSize={12} fill={COLORS.ink}>
              {g}
            </text>
          </g>
        ))}
        {/* No object pseudo-node */}
        <g>
          <circle cx={rx + 90} cy={H - padY + 4} r={14} fill={COLORS.bone} stroke={COLORS.muted} strokeWidth={1.2} strokeDasharray="3 3" />
          <text x={rx + 90} y={H - padY + 9} textAnchor="middle" fontSize={12} fill={COLORS.muted}>
            ∅
          </text>
        </g>

        {/* Matches */}
        {MATCHES.map((m, i) => {
          const py = sl(m.p, PRED_LABELS.length);
          const gy = m.g === "none" ? H - padY + 4 : sl(m.g, GT_LABELS.length);
          const gx = m.g === "none" ? rx + 90 : rx;
          const isMiss = m.g === "none";
          return (
            <motion.line
              key={i}
              x1={lx + 18}
              y1={py}
              x2={gx - 18}
              y2={gy}
              stroke={isMiss ? COLORS.muted : COLORS.ink}
              strokeOpacity={isMiss ? 0.4 : 0.7}
              strokeDasharray={isMiss ? "3 3" : undefined}
              strokeWidth={1.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
            />
          );
        })}
      </svg>
    </VizFrame>
  );
}
