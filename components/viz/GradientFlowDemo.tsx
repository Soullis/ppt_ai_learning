"use client";

import { useState } from "react";
import { COLORS, FadeIn, VizFrame } from "./common";

const LAYERS = ["input", "h₁", "h₂", "h₃", "output"];

export function GradientFlowDemo() {
  const [mode, setMode] = useState<"healthy" | "vanish" | "explode">("healthy");
  const scales =
    mode === "healthy"
      ? [1, 0.9, 0.85, 0.8, 0.75]
      : mode === "vanish"
        ? [1, 0.4, 0.15, 0.05, 0.01]
        : [1, 1.8, 3.2, 5.5, 9];

  return (
    <VizFrame caption="gradient magnitude as it flows backward through layers">
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <div className="flex gap-2">
          {(["healthy", "vanish", "explode"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="rounded border px-2 py-1 font-mono text-[9px] uppercase"
              style={{
                borderColor: mode === m ? COLORS.accent : COLORS.stroke,
                color: mode === m ? COLORS.accent : COLORS.muted,
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <FadeIn key={mode}>
          <div className="flex items-end gap-3">
            {LAYERS.map((name, i) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 rounded-t transition-all"
                  style={{
                    height: `${20 + scales[i] * 28}px`,
                    backgroundColor: COLORS.accent,
                    opacity: 0.3 + scales[i] * 0.15,
                  }}
                />
                <span className="font-mono text-[9px] text-muted">{name}</span>
                <span className="font-mono text-[8px] tabular-nums text-muted">
                  {scales[i].toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
        <p className="max-w-sm text-center text-[11px] text-muted">
          Sigmoid saturation causes vanishing gradients; skip connections and ReLU help; poor init can
          explode.
        </p>
      </div>
    </VizFrame>
  );
}
