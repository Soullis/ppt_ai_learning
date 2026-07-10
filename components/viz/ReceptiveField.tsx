"use client";

import { useState } from "react";
import { COLORS, VizFrame } from "./common";

/** Example stack with precomputed receptive fields (standard RF recurrence). */
const LAYERS = [
  { id: "input", label: "input", rf: 1, note: "one pixel" },
  { id: "conv1", label: "conv 3×3", rf: 3, note: "sees 3×3 patch" },
  { id: "conv2", label: "conv 3×3", rf: 5, note: "combines 3×3 conv outputs" },
  { id: "pool", label: "pool 2×2 s=2", rf: 6, note: "stride doubles reach" },
  { id: "conv3", label: "conv 3×3", rf: 10, note: "each input step spans 2 px" },
] as const;

export function ReceptiveField({
  width = 560,
  height = 480,
}: {
  width?: number;
  height?: number;
}) {
  const [layerIdx, setLayerIdx] = useState(LAYERS.length - 1);
  const layer = LAYERS[layerIdx];
  const grid = 12;
  const cell = 28;
  const center = 5;
  const half = Math.floor(layer.rf / 2);
  const gridPx = grid * cell;
  const stackX = 24;
  const gridX = 200;
  const gridY = 56;

  return (
    <VizFrame
      width={width}
      height={height}
      fit="fill"
      caption="click a layer — yellow box shows which input pixels influence one output neuron there"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Layer stack */}
        <text
          x={stackX}
          y={36}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
        >
          network depth →
        </text>

        {LAYERS.map((l, i) => {
          const y = gridY + i * 52;
          const active = i === layerIdx;
          return (
            <g key={l.id} transform={`translate(${stackX}, ${y})`} style={{ cursor: "pointer" }} onClick={() => setLayerIdx(i)}>
              <rect
                width={160}
                height={42}
                rx={6}
                fill={active ? "rgba(10,102,194,0.1)" : COLORS.surface}
                stroke={active ? COLORS.accent : COLORS.stroke}
                strokeWidth={active ? 1.5 : 1}
              />
              <text x={12} y={18} fontSize={12} fill={active ? COLORS.accent : COLORS.ink}>
                {l.label}
              </text>
              <text x={12} y={34} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
                RF = {l.rf}×{l.rf} px
              </text>
            </g>
          );
        })}

        {/* Arrow from stack to input */}
        <path
          d={`M ${stackX + 170} ${gridY + layerIdx * 52 + 21} H ${gridX - 12}`}
          stroke={COLORS.honey}
          strokeWidth={1.5}
          strokeDasharray="5 4"
          markerEnd="url(#rf-arrow)"
        />

        {/* Input grid */}
        <text
          x={gridX + gridPx / 2}
          y={36}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
        >
          original input image
        </text>

        <g transform={`translate(${gridX}, ${gridY})`}>
          {Array.from({ length: grid }).map((_, i) =>
            Array.from({ length: grid }).map((__, j) => {
              const inRf = Math.abs(i - center) <= half && Math.abs(j - center) <= half;
              return (
                <rect
                  key={`${i}-${j}`}
                  x={j * cell}
                  y={i * cell}
                  width={cell - 2}
                  height={cell - 2}
                  rx={2}
                  fill={inRf ? "rgba(10,102,194,0.35)" : COLORS.bone}
                  stroke={COLORS.stroke}
                  strokeWidth={0.6}
                />
              );
            }),
          )}

          <rect
            x={(center - half) * cell - 2}
            y={(center - half) * cell - 2}
            width={layer.rf * cell + 2}
            height={layer.rf * cell + 2}
            rx={3}
            fill="none"
            stroke={COLORS.honey}
            strokeWidth={2.5}
          />

          <circle
            cx={center * cell + cell / 2 - 1}
            cy={center * cell + cell / 2 - 1}
            r={5}
            fill={COLORS.honey}
          />
        </g>

        {/* Annotation */}
        <text x={gridX} y={gridY + gridPx + 28} fontSize={13} fill={COLORS.ink}>
          One neuron at <tspan fontFamily="JetBrains Mono, monospace">{layer.label}</tspan>
        </text>
        <text x={gridX} y={gridY + gridPx + 48} fontSize={12} fill={COLORS.muted}>
          {layer.note} · depends on {layer.rf}×{layer.rf} = {layer.rf * layer.rf} input pixels
        </text>

        <defs>
          <marker id="rf-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.honey} />
          </marker>
        </defs>
      </svg>
    </VizFrame>
  );
}
