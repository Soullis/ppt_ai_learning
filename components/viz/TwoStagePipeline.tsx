"use client";

import { COLORS, VizFrame } from "./common";

const STEPS = [
  { label: "input image", w: 72, color: COLORS.muted },
  { label: "backbone", w: 64, color: COLORS.accent },
  { label: "RPN proposals", w: 80, color: COLORS.honey },
  { label: "RoI pool", w: 64, color: COLORS.accent },
  { label: "classify + refine", w: 88, color: COLORS.green },
  { label: "boxes", w: 72, color: COLORS.ink },
];

export function TwoStagePipeline({
  width = 640,
  height = 320,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 20;
  const gap = 12;
  const totalW = STEPS.reduce((s, st) => s + st.w, 0) + gap * (STEPS.length - 1);
  let x = padX + (width - totalW - padX * 2) / 2;
  const cy = height / 2 - 20;

  return (
    <VizFrame
      width={width}
      height={height}
      fit="fill"
      caption="Faster R-CNN: shared backbone · learned region proposals · per-region head"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {STEPS.map((s, i) => {
          const bx = x;
          x += s.w + gap;
          return (
            <g key={s.label}>
              {i > 0 && (
                <line
                  x1={bx - gap}
                  y1={cy + 28}
                  x2={bx}
                  y2={cy + 28}
                  stroke={COLORS.muted}
                  strokeWidth={1.2}
                  markerEnd="url(#ts-arrow)"
                />
              )}
              <rect
                x={bx}
                y={cy}
                width={s.w}
                height={56}
                rx={6}
                fill={COLORS.surface}
                stroke={s.color}
                strokeWidth={1.5}
              />
              <text
                x={bx + s.w / 2}
                y={cy + 32}
                textAnchor="middle"
                fontSize={10}
                fill={COLORS.ink}
              >
                {s.label}
              </text>
            </g>
          );
        })}
        <text x={width / 2} y={height - 36} textAnchor="middle" fontSize={11} fill={COLORS.muted}>
          stage 1: where to look · stage 2: what is it and exact box
        </text>
        <defs>
          <marker id="ts-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.muted} />
          </marker>
        </defs>
      </svg>
    </VizFrame>
  );
}
