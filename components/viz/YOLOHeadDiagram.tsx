"use client";

import { COLORS, VizFrame } from "./common";

const HEADS = [
  { name: "P3", stride: 8, y: 280, cells: 80, objects: "small" },
  { name: "P4", stride: 16, y: 200, cells: 40, objects: "medium" },
  { name: "P5", stride: 32, y: 120, cells: 20, objects: "large" },
];

export function YOLOHeadDiagram({
  width = 620,
  height = 480,
}: {
  width?: number;
  height?: number;
}) {
  const bx = 40;
  const by = 60;
  const bw = 120;
  const bh = 320;

  return (
    <VizFrame
      width={width}
      height={height}
      fit="fill"
      caption="640×640 input · backbone downsamples · FPN neck · detection heads at P3/P4/P5"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <rect x={bx} y={by} width={bw} height={bh} rx={6} fill={COLORS.surface} stroke={COLORS.ink} strokeWidth={1.5} />
        <text x={bx + bw / 2} y={by + 24} textAnchor="middle" fontSize={12} fill={COLORS.ink}>
          input
        </text>
        <text x={bx + bw / 2} y={by + 42} textAnchor="middle" fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
          640×640
        </text>

        <rect x={bx + 160} y={by + 40} width={100} height={240} rx={6} fill={COLORS.surface} stroke={COLORS.accent} strokeWidth={1.5} />
        <text x={bx + 210} y={by + 64} textAnchor="middle" fontSize={11} fill={COLORS.accent}>
          backbone
        </text>
        <text x={bx + 210} y={by + 82} textAnchor="middle" fontSize={9} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
          conv blocks
        </text>

        <rect x={bx + 300} y={by + 80} width={90} height={180} rx={6} fill={COLORS.bone} stroke={COLORS.stroke} />
        <text x={bx + 345} y={by + 104} textAnchor="middle" fontSize={10} fill={COLORS.muted}>
          FPN neck
        </text>

        {HEADS.map((h, i) => {
          const hx = bx + 420;
          const hw = 140;
          const hh = 56;
          return (
            <g key={h.name}>
              <path
                d={`M ${bx + 390} ${by + 120 + i * 70} H ${hx}`}
                stroke={COLORS.muted}
                strokeWidth={1.2}
                markerEnd="url(#yolo-arrow)"
              />
              <rect x={hx} y={h.y} width={hw} height={hh} rx={6} fill={COLORS.surface} stroke={COLORS.honey} strokeWidth={1.5} />
              <text x={hx + 12} y={h.y + 22} fontSize={13} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
                {h.name}
              </text>
              <text x={hx + 12} y={h.y + 40} fontSize={10} fill={COLORS.muted}>
                stride {h.stride} · {h.cells}×{h.cells} grid
              </text>
              <text x={hx + 12} y={h.y + 52} fontSize={9} fill={COLORS.muted}>
                {h.objects} objects
              </text>
            </g>
          );
        })}

        <text x={width / 2} y={height - 24} textAnchor="middle" fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
          each cell predicts box + class (+ mask coeffs in YOLO-seg)
        </text>

        <defs>
          <marker id="yolo-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.muted} />
          </marker>
        </defs>
      </svg>
    </VizFrame>
  );
}
