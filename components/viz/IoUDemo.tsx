"use client";

import { useEffect, useRef, useState } from "react";
import { COLORS, VizFrame } from "./common";

export function IoUDemo({
  width = 720,
  height = 460,
}: {
  width?: number;
  height?: number;
}) {
  const W = width;
  const H = height;
  const [a, setA] = useState({ x: 120, y: 130, w: 240, h: 200 });
  const [b, setB] = useState({ x: 280, y: 200, w: 240, h: 200 });
  const [drag, setDrag] = useState<"a" | "b" | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  const inter = {
    x1: Math.max(a.x, b.x),
    y1: Math.max(a.y, b.y),
    x2: Math.min(a.x + a.w, b.x + b.w),
    y2: Math.min(a.y + a.h, b.y + b.h),
  };
  const interW = Math.max(0, inter.x2 - inter.x1);
  const interH = Math.max(0, inter.y2 - inter.y1);
  const interA = interW * interH;
  const unionA = a.w * a.h + b.w * b.h - interA;
  const iou = unionA > 0 ? interA / unionA : 0;

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!drag) return;
      const dx = e.movementX;
      const dy = e.movementY;
      const set = drag === "a" ? setA : setB;
      set((box) => ({
        ...box,
        x: Math.max(0, Math.min(W - box.w, box.x + dx)),
        y: Math.max(0, Math.min(H - box.h, box.y + dy)),
      }));
    }
    function onUp() {
      setDrag(null);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag, W, H]);

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={W} height={H} caption="drag the boxes — IoU updates live">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-full w-full select-none"
        >
          {/* Intersection */}
          {interW > 0 && interH > 0 ? (
            <rect
              x={inter.x1}
              y={inter.y1}
              width={interW}
              height={interH}
              fill={COLORS.honey}
              fillOpacity={0.35}
            />
          ) : null}
          {/* A */}
          <rect
            x={a.x}
            y={a.y}
            width={a.w}
            height={a.h}
            fill={COLORS.accent}
            fillOpacity={0.1}
            stroke={COLORS.accent}
            strokeWidth={1.75}
            style={{ cursor: drag === "a" ? "grabbing" : "grab" }}
            onPointerDown={(e) => {
              offset.current = { x: e.clientX, y: e.clientY };
              setDrag("a");
            }}
          />
          <text x={a.x + 6} y={a.y + 16} fontSize={12} fill={COLORS.accent} fontFamily="JetBrains Mono, monospace">
            ground truth
          </text>
          {/* B */}
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill={COLORS.honey}
            fillOpacity={0.1}
            stroke={COLORS.honey}
            strokeWidth={1.75}
            style={{ cursor: drag === "b" ? "grabbing" : "grab" }}
            onPointerDown={(e) => {
              offset.current = { x: e.clientX, y: e.clientY };
              setDrag("b");
            }}
          />
          <text x={b.x + 6} y={b.y + 16} fontSize={12} fill={COLORS.honey} fontFamily="JetBrains Mono, monospace">
            prediction
          </text>
        </svg>
      </VizFrame>
      <div className="mt-4 grid w-full max-w-[640px] grid-cols-3 gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <div>
          intersect = <span className="text-ink">{interA.toFixed(0)}</span>
        </div>
        <div>
          union = <span className="text-ink">{unionA.toFixed(0)}</span>
        </div>
        <div>
          IoU = <span className="text-ink">{iou.toFixed(3)}</span>
        </div>
        <div className="col-span-3 mt-1 h-1.5 rounded-full bg-stroke">
          <div
            className="h-full rounded-full bg-ink transition-all"
            style={{ width: `${iou * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
