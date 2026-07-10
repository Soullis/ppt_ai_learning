"use client";

import { useState } from "react";
import { COLORS, VizFrame } from "./common";

type Pred = { id: string; x: number; y: number; w: number; h: number; score: number; iou: number };

const GT = { x: 110, y: 36, w: 190, h: 150 };
const PREDS: Pred[] = [
  { id: "p1", x: 120, y: 46, w: 180, h: 140, score: 0.91, iou: 0.82 },
  { id: "p2", x: 340, y: 48, w: 130, h: 110, score: 0.78, iou: 0.04 },
  { id: "p3", x: 36, y: 210, w: 95, h: 72, score: 0.65, iou: 0.0 },
];

const TAU = 0.5;
const LEGEND_H = 98;

function classify(p: Pred): "TP" | "FP" {
  return p.iou >= TAU ? "TP" : "FP";
}

export function TPFPFNDemo({
  width = 560,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  const [selected, setSelected] = useState<string | null>("p1");
  const matchedPred = PREDS.find((p) => classify(p) === "TP");
  const fn = matchedPred ? 0 : 1;
  const diagramH = height - LEGEND_H;

  return (
    <VizFrame
      width={width}
      height={height}
      fit="fill"
      caption={`match pred to GT when IoU ≥ ${TAU} · unmatched GT = FN · unmatched pred = FP`}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <rect x={0} y={0} width={width} height={diagramH} fill={COLORS.bone} />
        <line x1={0} y1={diagramH} x2={width} y2={diagramH} stroke={COLORS.stroke} strokeWidth={1} />

        <rect
          x={GT.x}
          y={GT.y}
          width={GT.w}
          height={GT.h}
          fill="none"
          stroke={COLORS.green}
          strokeWidth={2.5}
          strokeDasharray="6 4"
        />
        <text x={GT.x} y={GT.y - 8} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.green}>
          ground truth · gate
        </text>

        {PREDS.map((p) => {
          const kind = classify(p);
          const color = kind === "TP" ? COLORS.accent : COLORS.red;
          const active = selected === p.id;
          return (
            <g key={p.id} style={{ cursor: "pointer" }} onClick={() => setSelected(p.id)}>
              <rect
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                fill={color}
                fillOpacity={active ? 0.25 : 0.12}
                stroke={color}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <text
                x={p.x + 4}
                y={p.y + 14}
                fontSize={10}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.ink}
              >
                {kind} · IoU {p.iou.toFixed(2)} · {p.score.toFixed(2)}
              </text>
            </g>
          );
        })}

        <g transform={`translate(16, ${diagramH + 14})`}>
          <text fontSize={11} fill={COLORS.ink}>
            TP = prediction matched to GT (IoU ≥ {TAU})
          </text>
          <text y={16} fontSize={11} fill={COLORS.ink}>
            FP = prediction with no matching GT
          </text>
          <text y={32} fontSize={11} fill={COLORS.ink}>
            FN = GT with no matching prediction ({fn} here)
          </text>
          <text y={50} fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
            P = TP/(TP+FP) · R = TP/(TP+FN)
          </text>
        </g>
      </svg>
    </VizFrame>
  );
}
