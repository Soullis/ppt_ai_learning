"use client";

import { COLORS, FadeIn, VizFrame } from "./common";

const EVENTS = [
  { year: 2014, name: "R-CNN", detail: "region proposals + CNN classifier" },
  { year: 2015, name: "Fast R-CNN", detail: "shared backbone features" },
  { year: 2016, name: "Faster R-CNN", detail: "learned RPN" },
  { year: 2016, name: "YOLO", detail: "single pass grid prediction", emphasis: true },
  { year: 2017, name: "RetinaNet", detail: "focal loss for class imbalance" },
  { year: 2020, name: "DETR", detail: "set prediction + transformer", emphasis: true },
  { year: 2023, name: "RT-DETR", detail: "real time hybrid encoder" },
  { year: 2024, name: "RF-DETR", detail: "DINOv2 backbone", emphasis: true },
];

export function DetectionTimeline() {
  return (
    <VizFrame caption="object detection families — accuracy vs latency tradeoffs evolved with architecture">
      <div className="flex h-full flex-col justify-center overflow-x-auto px-4 py-6">
        <div className="relative min-w-[640px]">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-stroke" />
          <div className="flex justify-between gap-2">
            {EVENTS.map((e) => (
              <FadeIn key={e.name} className="relative flex flex-1 flex-col items-center">
                <div
                  className="z-10 mb-2 h-2.5 w-2.5 rounded-full border-2 border-surface"
                  style={{ backgroundColor: e.emphasis ? COLORS.accent : COLORS.muted }}
                />
                <div className="font-mono text-[9px] tabular-nums text-muted">{e.year}</div>
                <div
                  className="mt-1 text-center font-serif text-[11px] leading-tight"
                  style={{ color: e.emphasis ? COLORS.ink : COLORS.muted }}
                >
                  {e.name}
                </div>
                <div className="mt-0.5 max-w-[72px] text-center text-[8px] leading-snug text-muted">
                  {e.detail}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </VizFrame>
  );
}
