"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COLORS, VizFrame } from "./common";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Three side-by-side panels: dropout (random neurons grayed each "step"),
 * weight decay (weights shrinking over time), early stopping (val curve
 * crossing train curve).
 */
export function RegularizationViz({
  width = 980,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const panelW = (width - 50) / 3;
  const panelH = height - 30;
  return (
    <VizFrame width={width} height={height} caption="three classical regularisers">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <g transform="translate(15, 20)">
          <DropoutPanel w={panelW} h={panelH} />
        </g>
        <g transform={`translate(${15 + panelW + 10}, 20)`}>
          <WeightDecayPanel w={panelW} h={panelH} />
        </g>
        <g transform={`translate(${15 + (panelW + 10) * 2}, 20)`}>
          <EarlyStopPanel w={panelW} h={panelH} />
        </g>
      </svg>
    </VizFrame>
  );
}

function PanelFrame({
  w,
  h,
  title,
  children,
}: {
  w: number;
  h: number;
  title: string;
  children: React.ReactNode;
}) {
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
        {title}
      </text>
      {children}
    </g>
  );
}

function DropoutPanel({ w, h }: { w: number; h: number }) {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), 700);
    return () => clearInterval(id);
  }, [reduce]);

  const layers = [4, 5, 5, 3];
  const padX = 30;
  const padY = 50;
  const colW = (w - padX * 2) / (layers.length - 1);

  // Pseudo-random mask seeded by tick
  function masked(li: number, ni: number) {
    if (li === 0 || li === layers.length - 1) return false; // keep input/output
    const x = Math.sin(tick * 17 + li * 23 + ni * 7) * 10000;
    return x - Math.floor(x) < 0.4;
  }

  const positions = layers.map((n, li) =>
    Array.from({ length: n }, (_, ni) => {
      const ySpan = h - padY - 40;
      const step = ySpan / (n + 1);
      return { x: padX + li * colW, y: padY + step * (ni + 1) };
    }),
  );

  return (
    <PanelFrame w={w} h={h} title="Dropout">
      {/* Edges */}
      {layers.slice(0, -1).map((_, li) =>
        positions[li].flatMap((a, i) =>
          positions[li + 1].map((b, j) => {
            const dropA = masked(li, i);
            const dropB = masked(li + 1, j);
            return (
              <line
                key={`e-${li}-${i}-${j}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={COLORS.ink}
                strokeOpacity={dropA || dropB ? 0.05 : 0.2}
              />
            );
          }),
        ),
      )}
      {/* Nodes */}
      {positions.flatMap((col, li) =>
        col.map((p, ni) => {
          const dropped = masked(li, ni);
          return (
            <circle
              key={`n-${li}-${ni}`}
              cx={p.x}
              cy={p.y}
              r={8}
              fill={dropped ? COLORS.bone : COLORS.surface}
              stroke={dropped ? COLORS.stroke : COLORS.ink}
              strokeWidth={1.2}
              strokeDasharray={dropped ? "2 2" : undefined}
            />
          );
        }),
      )}
      <text
        x={w / 2}
        y={h - 14}
        textAnchor="middle"
        fontSize={11}
        fill={COLORS.muted}
      >
        zero a random fraction each forward pass
      </text>
    </PanelFrame>
  );
}

function WeightDecayPanel({ w, h }: { w: number; h: number }) {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduce) {
      setTick(40);
      return;
    }
    const id = setInterval(() => setTick((t) => Math.min(80, t + 1)), 80);
    return () => clearInterval(id);
  }, [reduce]);

  const padX = 26;
  const padY = 50;
  const cols = 6;
  const rows = 5;
  const cellW = (w - padX * 2) / cols;
  const cellH = (h - padY - 40) / rows;
  const decay = Math.max(0.18, 1 - tick / 60);

  return (
    <PanelFrame w={w} h={h} title="Weight decay">
      {Array.from({ length: rows * cols }, (_, k) => {
        const r = Math.floor(k / cols);
        const c = k % cols;
        const seed = Math.sin(r * 13 + c * 5) * 0.5 + 0.5;
        const v = seed * decay;
        return (
          <rect
            key={k}
            x={padX + c * cellW + 2}
            y={padY + r * cellH + 2}
            width={cellW - 4}
            height={cellH - 4}
            fill={v > 0.5 ? COLORS.accent : COLORS.honey}
            fillOpacity={Math.abs(v - 0.5) * 1.2 + 0.1}
          />
        );
      })}
      <text
        x={w / 2}
        y={h - 14}
        textAnchor="middle"
        fontSize={11}
        fill={COLORS.muted}
      >
        L = L₀ + λ‖W‖² → weights shrink toward zero
      </text>
    </PanelFrame>
  );
}

function EarlyStopPanel({ w, h }: { w: number; h: number }) {
  const padX = 30;
  const padY = 50;
  const innerW = w - padX * 2;
  const innerH = h - padY - 40;
  const N = 80;
  const sx = (i: number) => padX + (i / (N - 1)) * innerW;
  const sy = (v: number) => padY + (1 - v) * innerH;

  const train = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    return Math.max(0.05, 0.9 * Math.exp(-t * 3.6));
  });
  const val = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const baseline = 0.95 * Math.exp(-t * 2.6);
    const overfit = 0.55 * Math.max(0, t - 0.45) ** 1.8;
    return Math.min(1, Math.max(0.1, baseline + overfit));
  });
  const stopIdx = val.indexOf(Math.min(...val));

  return (
    <PanelFrame w={w} h={h} title="Early stopping">
      {/* Axes */}
      <line x1={padX} x2={padX + innerW} y1={padY + innerH} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.3} />
      <line x1={padX} x2={padX} y1={padY} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.3} />
      <motion.path
        d={`M ${train.map((v, i) => `${sx(i)},${sy(v)}`).join(" L ")}`}
        fill="none"
        stroke={COLORS.accent}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.0 }}
      />
      <motion.path
        d={`M ${val.map((v, i) => `${sx(i)},${sy(v)}`).join(" L ")}`}
        fill="none"
        stroke={COLORS.honey}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.0, delay: 0.2 }}
      />
      {/* Stop marker */}
      <motion.line
        x1={sx(stopIdx)}
        x2={sx(stopIdx)}
        y1={padY}
        y2={padY + innerH}
        stroke={COLORS.ink}
        strokeOpacity={0.5}
        strokeDasharray="3 4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      />
      <motion.text
        x={sx(stopIdx) + 6}
        y={padY + 14}
        fontSize={10}
        fontFamily="JetBrains Mono, monospace"
        fill={COLORS.ink}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        stop
      </motion.text>
      {/* Legend */}
      <g transform={`translate(${padX + 8}, ${padY + 8})`}>
        <line x1={0} x2={16} y1={0} y2={0} stroke={COLORS.accent} strokeWidth={1.5} />
        <text x={20} y={4} fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
          train
        </text>
        <line x1={0} x2={16} y1={14} y2={14} stroke={COLORS.honey} strokeWidth={1.5} />
        <text x={20} y={18} fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
          val
        </text>
      </g>
      <text
        x={w / 2}
        y={h - 14}
        textAnchor="middle"
        fontSize={11}
        fill={COLORS.muted}
      >
        stop when validation loss starts climbing
      </text>
    </PanelFrame>
  );
}
