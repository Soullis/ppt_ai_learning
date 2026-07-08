"use client";

import { useState } from "react";
import { COLORS, FadeIn, VizFrame } from "./common";

export function BatchSizeDemo() {
  const [batch, setBatch] = useState<"full" | "mini">("mini");
  const n = batch === "full" ? 32 : 4;

  return (
    <VizFrame caption="stochastic gradient descent averages gradients over a mini-batch">
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setBatch("full")}
            className="rounded border px-3 py-1 font-mono text-[10px] uppercase"
            style={{
              borderColor: batch === "full" ? COLORS.accent : COLORS.stroke,
              color: batch === "full" ? COLORS.accent : COLORS.muted,
            }}
          >
            full batch (N=32)
          </button>
          <button
            type="button"
            onClick={() => setBatch("mini")}
            className="rounded border px-3 py-1 font-mono text-[10px] uppercase"
            style={{
              borderColor: batch === "mini" ? COLORS.accent : COLORS.stroke,
              color: batch === "mini" ? COLORS.accent : COLORS.muted,
            }}
          >
            mini-batch (4)
          </button>
        </div>
        <FadeIn key={batch}>
          <div className="flex flex-wrap justify-center gap-1.5" style={{ maxWidth: 200 }}>
            {Array.from({ length: n }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-sm border border-stroke"
                style={{ backgroundColor: `rgba(10,102,194,${0.2 + (i % 5) * 0.12})` }}
              />
            ))}
          </div>
          <p className="mt-4 max-w-xs text-center text-[12px] text-muted">
            {batch === "full"
              ? "Exact gradient of full loss — expensive per step, smooth updates."
              : "Noisy gradient estimate — cheaper, often generalises better; defines SGD."}
          </p>
        </FadeIn>
      </div>
    </VizFrame>
  );
}
