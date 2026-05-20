"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

function nms(boxes: Box[], thr: number) {
  const order = [...boxes].sort((a, b) => b.conf - a.conf);
  const keep: Box[] = [];
  while (order.length) {
    const top = order.shift()!;
    keep.push(top);
    for (let i = order.length - 1; i >= 0; i--) {
      if (iou(top, order[i]) > thr) order.splice(i, 1);
    }
  }
  return keep;
}

export function NMSDemo({
  width = 720,
  height = 460,
}: {
  width?: number;
  height?: number;
}) {
  const [thr, setThr] = useState(0.5);
  const kept = nms(RAW, thr);
  const keptIds = new Set(kept.map((b) => b.id));

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height} caption="non-maximum suppression — IoU > threshold are dropped">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {RAW.map((b) => {
            const isKept = keptIds.has(b.id);
            const color = b.cluster === 0 ? COLORS.accent : COLORS.honey;
            return (
              <motion.g
                key={b.id}
                animate={{ opacity: isKept ? 1 : 0.18 }}
                transition={{ duration: 0.3 }}
              >
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  fill={color}
                  fillOpacity={isKept ? 0.12 : 0.04}
                  stroke={color}
                  strokeWidth={isKept ? 2 : 1}
                  strokeDasharray={isKept ? undefined : "3 3"}
                />
                <rect
                  x={b.x}
                  y={b.y - 18}
                  width={56}
                  height={18}
                  fill={isKept ? color : COLORS.muted}
                />
                <text
                  x={b.x + 6}
                  y={b.y - 5}
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  fill={COLORS.surface}
                >
                  {b.conf.toFixed(2)}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </VizFrame>
      <div className="mt-4 w-full max-w-[480px] font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        IoU threshold = {thr.toFixed(2)}
        <input
          type="range"
          min={0.1}
          max={0.95}
          step={0.01}
          value={thr}
          onChange={(e) => setThr(parseFloat(e.target.value))}
          className="mt-1 w-full accent-ink"
        />
        <div className="mt-2 text-ink">{kept.length} of {RAW.length} kept</div>
      </div>
    </div>
  );
}
