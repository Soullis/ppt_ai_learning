"use client";

import { useState } from "react";
import { COLORS, FadeIn, VizFrame } from "./common";

const SAMPLE = { r: 0.82, g: 0.45, b: 0.12 };

export function RGBChannels() {
  const [channel, setChannel] = useState<"all" | "r" | "g" | "b">("all");

  const channels = [
    { id: "r" as const, label: "R", value: SAMPLE.r, color: "#B23A48" },
    { id: "g" as const, label: "G", value: SAMPLE.g, color: "#2E7D5C" },
    { id: "b" as const, label: "B", value: SAMPLE.b, color: "#0A66C2" },
  ];

  const displayColor =
    channel === "all"
      ? `rgb(${Math.round(SAMPLE.r * 255)}, ${Math.round(SAMPLE.g * 255)}, ${Math.round(SAMPLE.b * 255)})`
      : channels.find((c) => c.id === channel)!.color;

  return (
    <VizFrame caption="one pixel, three channel values — stacked into a 3-channel tensor">
      <div className="flex h-full flex-col items-center justify-center gap-5 p-4">
        <div className="flex gap-2">
          {(["all", "r", "g", "b"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              className="rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition"
              style={{
                borderColor: channel === c ? COLORS.ink : COLORS.stroke,
                backgroundColor: channel === c ? COLORS.bone : COLORS.surface,
                color: channel === c ? COLORS.ink : COLORS.muted,
              }}
            >
              {c === "all" ? "RGB" : c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          <FadeIn>
            <div
              className="h-24 w-24 rounded-md border border-stroke shadow-sm"
              style={{ backgroundColor: displayColor }}
            />
          </FadeIn>

          <div className="flex flex-col gap-3">
            {channels.map((ch) => (
              <div
                key={ch.id}
                className="flex items-center gap-3 font-mono text-[12px]"
                style={{ opacity: channel === "all" || channel === ch.id ? 1 : 0.25 }}
              >
                <span className="w-4" style={{ color: ch.color }}>
                  {ch.label}
                </span>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-stroke">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${ch.value * 100}%`, backgroundColor: ch.color }}
                  />
                </div>
                <span className="tabular-nums text-muted">{ch.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="max-w-md text-center text-[12px] leading-relaxed text-muted">
          Convolution applies the same kernel independently on each channel, then sums. A batch of images is shaped{" "}
          <span className="font-mono">(N, C, H, W)</span> in PyTorch.
        </p>
      </div>
    </VizFrame>
  );
}
