"use client";

import { useEffect, useState } from "react";
import { COLORS, VizFrame } from "./common";

type Box = { id: string; x: number; y: number; w: number; h: number };

const TRUTHS: Box[] = [
  { id: "t1", x: 90, y: 90, w: 140, h: 120 },
  { id: "t2", x: 340, y: 70, w: 130, h: 130 },
  { id: "t3", x: 120, y: 280, w: 150, h: 110 },
  { id: "t4", x: 400, y: 260, w: 140, h: 130 },
];

// Deliberately unbalanced start: two predictions crowd t1 (only the
// better one can win it), one sits on t2 cleanly, and one drifts in
// open space with no ground truth nearby — so TP, FP and FN are all
// visible before anyone drags anything.
const INITIAL_PREDICTIONS: Box[] = [
  { id: "p1", x: 100, y: 100, w: 130, h: 110 },
  { id: "p2", x: 150, y: 130, w: 130, h: 110 },
  { id: "p3", x: 350, y: 80, w: 120, h: 120 },
  { id: "p4", x: 540, y: 340, w: 110, h: 90 },
];

function iou(a: Box, b: Box) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const interW = Math.max(0, x2 - x1);
  const interH = Math.max(0, y2 - y1);
  const inter = interW * interH;
  const union = a.w * a.h + b.w * b.h - inter;
  return union > 0 ? inter / union : 0;
}

export function PrecisionRecallSandbox({
  width = 720,
  height = 460,
}: {
  width?: number;
  height?: number;
}) {
  const W = width;
  const H = height;
  const [predictions, setPredictions] = useState(INITIAL_PREDICTIONS);
  const [threshold, setThreshold] = useState(0.5);
  const [dragId, setDragId] = useState<string | null>(null);

  // Greedy matching: highest-IoU pairs above threshold win first, each
  // truth and each prediction can only be claimed once.
  const pairs = predictions
    .flatMap((p) => TRUTHS.map((t) => ({ p: p.id, t: t.id, v: iou(p, t) })))
    .filter((pair) => pair.v >= threshold)
    .sort((a, b) => b.v - a.v);

  const matchedPreds = new Set<string>();
  const matchedTruths = new Set<string>();
  for (const pair of pairs) {
    if (matchedPreds.has(pair.p) || matchedTruths.has(pair.t)) continue;
    matchedPreds.add(pair.p);
    matchedTruths.add(pair.t);
  }

  const tp = matchedPreds.size;
  const fp = predictions.length - tp;
  const fn = TRUTHS.length - matchedTruths.size;

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragId) return;
      const dx = e.movementX;
      const dy = e.movementY;
      setPredictions((boxes) =>
        boxes.map((box) =>
          box.id === dragId
            ? {
                ...box,
                x: Math.max(0, Math.min(W - box.w, box.x + dx)),
                y: Math.max(0, Math.min(H - box.h, box.y + dy)),
              }
            : box,
        ),
      );
    }
    function onUp() {
      setDragId(null);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragId, W, H]);

  const GREEN = "rgba(84,196,120,1)";
  const RED = "rgba(224,90,90,1)";

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={W} height={H} caption="arraste as previsões — precision, recall e F1 atualizam ao vivo">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full select-none">
          {/* Ground truth — fixed */}
          {TRUTHS.map((t) => {
            const found = matchedTruths.has(t.id);
            return (
              <g key={t.id}>
                <rect
                  x={t.x}
                  y={t.y}
                  width={t.w}
                  height={t.h}
                  fill="none"
                  stroke={found ? COLORS.accent : RED}
                  strokeWidth={1.75}
                  strokeDasharray={found ? undefined : "5 4"}
                />
                <text
                  x={t.x + 6}
                  y={t.y + 16}
                  fontSize={11}
                  fill={found ? COLORS.accent : RED}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {found ? "ground truth" : "não detectado (FN)"}
                </text>
              </g>
            );
          })}

          {/* Predictions — draggable */}
          {predictions.map((p) => {
            const isTP = matchedPreds.has(p.id);
            const color = isTP ? GREEN : RED;
            return (
              <g key={p.id}>
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  fill={color}
                  fillOpacity={0.14}
                  stroke={color}
                  strokeWidth={1.75}
                  style={{ cursor: dragId === p.id ? "grabbing" : "grab" }}
                  onPointerDown={() => setDragId(p.id)}
                />
                <text
                  x={p.x + 6}
                  y={p.y + p.h - 8}
                  fontSize={11}
                  fill={color}
                  fontFamily="JetBrains Mono, monospace"
                  style={{ pointerEvents: "none" }}
                >
                  {isTP ? "TP" : "FP"}
                </text>
              </g>
            );
          })}
        </svg>
      </VizFrame>

      <div className="mt-4 flex w-full max-w-[420px] flex-col items-center gap-1.5">
        <input
          type="range"
          min={0.1}
          max={0.9}
          step={0.05}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-[rgb(232,181,60)]"
        />
        <div className="flex w-full justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
          <span>limiar de IoU frouxo</span>
          <span>IoU ≥ {threshold.toFixed(2)}</span>
          <span>limiar rígido</span>
        </div>
      </div>

      <div className="mt-5 grid w-full max-w-[640px] grid-cols-3 gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <div>
          TP = <span style={{ color: GREEN }}>{tp}</span>
        </div>
        <div>
          FP = <span style={{ color: RED }}>{fp}</span>
        </div>
        <div>
          FN = <span style={{ color: RED }}>{fn}</span>
        </div>
      </div>

      <div className="mt-4 flex w-full max-w-[640px] flex-col gap-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <MetricBar label="precision" value={precision} />
        <MetricBar label="recall" value={recall} />
        <MetricBar label="F1-score" value={f1} accent />
      </div>
    </div>
  );
}

function MetricBar({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0">{label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-stroke">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${value * 100}%`,
            background: accent ? "rgb(232,181,60)" : COLORS.ink,
          }}
        />
      </div>
      <span className="w-10 text-right text-ink">{value.toFixed(2)}</span>
    </div>
  );
}