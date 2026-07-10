"use client";

import { useState } from "react";
import { COLORS, VizFrame } from "./common";

type Box = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  conf: number;
  cluster: 0 | 1;
};

const RAW: Box[] = [
  { id: "a1", x: 80, y: 80, w: 220, h: 180, conf: 0.92, cluster: 0 },
  { id: "a2", x: 90, y: 90, w: 220, h: 180, conf: 0.81, cluster: 0 },
  { id: "a3", x: 70, y: 70, w: 230, h: 200, conf: 0.78, cluster: 0 },
  { id: "a4", x: 100, y: 100, w: 200, h: 170, conf: 0.74, cluster: 0 },
  { id: "b1", x: 380, y: 200, w: 180, h: 160, conf: 0.88, cluster: 1 },
  { id: "b2", x: 390, y: 215, w: 170, h: 150, conf: 0.79, cluster: 1 },
  { id: "b3", x: 370, y: 195, w: 190, h: 165, conf: 0.7, cluster: 1 },
];

function iou(a: Box, b: Box) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = a.w * a.h + b.w * b.h - inter;
  return union ? inter / union : 0;
}

function nmsSteps(boxes: Box[], thr: number) {
  const order = [...boxes].sort((a, b) => b.conf - a.conf);
  const kept: Box[] = [];
  const suppressed = new Set<string>();
  const steps: { kept: string; suppressed: string[] }[] = [];

  while (order.length) {
    const top = order.shift()!;
    kept.push(top);
    const removed: string[] = [];
    for (let i = order.length - 1; i >= 0; i--) {
      if (iou(top, order[i]) > thr) {
        removed.push(order[i].id);
        suppressed.add(order[i].id);
        order.splice(i, 1);
      }
    }
    steps.push({ kept: top.id, suppressed: removed });
  }
  return { kept, suppressed, steps };
}

export function NMSDemo({
  width = 720,
  height = 460,
}: {
  width?: number;
  height?: number;
}) {
  const [thr, setThr] = useState(0.5);
  const [stepIdx, setStepIdx] = useState(0);
  const { kept, suppressed, steps } = nmsSteps(RAW, thr);
  const keptIds = new Set(kept.map((b) => b.id));
  const current = steps[Math.min(stepIdx, steps.length - 1)];

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height} fit="fill" caption="greedy NMS: sort by score · keep top · suppress IoU overlap">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {RAW.map((b) => {
            const isKept = keptIds.has(b.id);
            const isCurrentKept = current?.kept === b.id;
            const isCurrentSuppressed = current?.suppressed.includes(b.id);
            const color = b.cluster === 0 ? COLORS.accent : COLORS.honey;
            return (
              <g key={b.id}>
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  fill={color}
                  fillOpacity={isKept ? 0.14 : 0.04}
                  stroke={color}
                  strokeWidth={isCurrentKept ? 3 : isKept ? 2 : 1}
                  strokeDasharray={isKept ? undefined : "4 3"}
                  opacity={isCurrentSuppressed ? 0.35 : isKept ? 1 : 0.35}
                />
                <text
                  x={b.x + 6}
                  y={b.y - 6}
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  fill={isKept ? COLORS.ink : COLORS.muted}
                >
                  {b.conf.toFixed(2)}
                </text>
              </g>
            );
          })}
          <text x={16} y={height - 16} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
            step {stepIdx + 1}/{steps.length}: keep {current?.kept} · suppress {current?.suppressed.length} box(es)
          </text>
        </svg>
      </VizFrame>
      <div className="mt-3 w-full max-w-[520px] space-y-2 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-muted">IoU τ</span>
          <input
            type="range"
            min={0.1}
            max={0.95}
            step={0.01}
            value={thr}
            onChange={(e) => {
              setThr(parseFloat(e.target.value));
              setStepIdx(0);
            }}
            className="flex-1 accent-ink"
          />
          <span>{thr.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted">step</span>
          <input
            type="range"
            min={0}
            max={Math.max(0, steps.length - 1)}
            step={1}
            value={stepIdx}
            onChange={(e) => setStepIdx(parseInt(e.target.value, 10))}
            className="flex-1 accent-ink"
          />
        </div>
        <div className="text-muted">{kept.length} of {RAW.length} kept after full NMS</div>
      </div>
    </div>
  );
}
