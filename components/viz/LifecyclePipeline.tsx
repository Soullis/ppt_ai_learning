"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

const STEPS = [
  { label: "Collect", detail: "flights · video" },
  { label: "Annotate", detail: "Roboflow" },
  { label: "Convert", detail: "COCO ↔ YOLO" },
  { label: "Stratify", detail: "train/val/test" },
  { label: "Augment", detail: "albumentations" },
  { label: "Balance", detail: "rare classes" },
  { label: "Train", detail: "Adam · TensorBoard" },
  { label: "Evaluate", detail: "mAP · PR · CM" },
  { label: "Deploy", detail: "ONNX · Jetson" },
];

export function LifecyclePipeline({
  width = 940,
  height = 200,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 30;
  const cellW = (width - padX * 2) / STEPS.length;
  const cy = height / 2;

  return (
    <VizFrame width={width} height={height}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {STEPS.map((s, i) => {
          const x = padX + i * cellW + cellW / 2;
          return (
            <motion.g
              key={s.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <circle cx={x} cy={cy} r={6} fill={COLORS.honey} stroke={COLORS.surface} strokeWidth={2} />
              <text
                x={x}
                y={cy - 18}
                textAnchor="middle"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.muted}
                style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </text>
              <text x={x} y={cy + 26} textAnchor="middle" fontSize={13} fill={COLORS.ink}>
                {s.label}
              </text>
              <text x={x} y={cy + 42} textAnchor="middle" fontSize={11} fill={COLORS.muted}>
                {s.detail}
              </text>
              {i < STEPS.length - 1 ? (
                <motion.line
                  x1={x + 8}
                  x2={x + cellW - 8}
                  y1={cy}
                  y2={cy}
                  stroke={COLORS.ink}
                  strokeOpacity={0.4}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                />
              ) : null}
            </motion.g>
          );
        })}
      </svg>
    </VizFrame>
  );
}
