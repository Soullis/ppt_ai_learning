"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { COLORS, VizFrame } from "./common";

const FRAMES = [
  { t: 0.0, label: "t=0.0s" },
  { t: 0.33, label: "t=0.33s" },
  { t: 0.67, label: "t=0.67s" },
  { t: 1.0, label: "t=1.0s" },
  { t: 1.33, label: "t=1.33s" },
  { t: 1.67, label: "t=1.67s" },
];

export function VideoClipViz() {
  const reduced = useReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 900);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <VizFrame fit="fill" caption="clip shape (T, H, W, C) — subsample frames · Black Bee runs per-frame detection">
      <div className="flex h-full flex-col items-center justify-center gap-3 p-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {FRAMES.map((f, i) => (
            <div key={f.t} className="flex flex-col items-center gap-0.5">
              <div
                className="flex h-14 w-[4.5rem] items-center justify-center rounded border font-mono text-[8px] transition"
                style={{
                  borderColor: i === frame ? COLORS.accent : COLORS.stroke,
                  backgroundColor: i === frame ? `${COLORS.accent}12` : COLORS.bone,
                  borderWidth: i === frame ? 2 : 1,
                  opacity: i <= frame ? 1 : 0.45,
                }}
              >
                frame {i}
              </div>
              <span className="font-mono text-[7px] text-muted">{f.label}</span>
            </div>
          ))}
        </div>
        <div className="rounded border border-stroke bg-surface px-3 py-2 text-center font-mono text-[9px]">
          <div>
            tensor <span className="text-accent">(T, H, W, C)</span> = ({FRAMES.length}, 640, 640, 3)
          </div>
          <div className="mt-1 text-muted">subsample every k frames · normalise per channel</div>
        </div>
      </div>
    </VizFrame>
  );
}
