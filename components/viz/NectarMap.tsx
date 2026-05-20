"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

type Node = { x: number; y: number; w: number; h: number; label: string; sub?: string; tone?: "ink" | "accent" | "honey" };
type Edge = { from: string; to: string };

const NODES: Record<string, Node> = {
  detector: { x: 80, y: 60, w: 160, h: 64, label: "Detector", sub: "factory + facade", tone: "ink" },
  base: { x: 380, y: 60, w: 200, h: 64, label: "BaseDetectionModel", sub: "abstract", tone: "ink" },
  ult: { x: 680, y: 30, w: 160, h: 56, label: "UltralyticsModel", sub: "YOLOv8/10/11", tone: "accent" },
  trf: { x: 680, y: 110, w: 160, h: 56, label: "TransformersModel", sub: "DETR · CondDETR", tone: "accent" },
  rfdetr: { x: 680, y: 190, w: 160, h: 56, label: "RFDETRModel", sub: "RF-DETR", tone: "accent" },
  slicing: { x: 380, y: 200, w: 200, h: 56, label: "SlicingInference", sub: "NMS · WBF · NMM", tone: "honey" },
  ode: { x: 380, y: 290, w: 200, h: 56, label: "ObjectDetectionEvaluator", sub: "mAP · PR · CM", tone: "honey" },
  result: { x: 80, y: 200, w: 160, h: 56, label: "DetectionResult", sub: "Detection list", tone: "ink" },
  cli: { x: 80, y: 290, w: 160, h: 56, label: "nectar-ai CLI", sub: "train · predict · eval", tone: "honey" },
};

const EDGES: Edge[] = [
  { from: "detector", to: "base" },
  { from: "base", to: "ult" },
  { from: "base", to: "trf" },
  { from: "base", to: "rfdetr" },
  { from: "base", to: "slicing" },
  { from: "base", to: "ode" },
  { from: "detector", to: "result" },
  { from: "cli", to: "detector" },
];

export function NectarMap({
  width = 940,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const colorOf = (tone: Node["tone"]) =>
    tone === "accent" ? COLORS.accent : tone === "honey" ? COLORS.honey : COLORS.ink;

  return (
    <VizFrame width={width} height={height} caption="nectar.ai.detection · simplified class map">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {EDGES.map((e, i) => {
          const a = NODES[e.from];
          const b = NODES[e.to];
          const ax = a.x + a.w;
          const ay = a.y + a.h / 2;
          const bx = b.x;
          const by = b.y + b.h / 2;
          // Curved bezier
          const mx = (ax + bx) / 2;
          return (
            <motion.path
              key={`${e.from}-${e.to}`}
              d={`M ${ax},${ay} C ${mx},${ay} ${mx},${by} ${bx},${by}`}
              fill="none"
              stroke={COLORS.ink}
              strokeOpacity={0.35}
              strokeWidth={1.2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }}
            />
          );
        })}
        {Object.entries(NODES).map(([key, n], i) => (
          <motion.g
            key={key}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={n.h}
              rx={6}
              fill={COLORS.surface}
              stroke={colorOf(n.tone)}
              strokeWidth={1.5}
            />
            <text
              x={n.x + 12}
              y={n.y + 24}
              fontSize={13}
              fill={COLORS.ink}
              fontFamily="JetBrains Mono, monospace"
            >
              {n.label}
            </text>
            {n.sub ? (
              <text
                x={n.x + 12}
                y={n.y + 42}
                fontSize={11}
                fill={COLORS.muted}
              >
                {n.sub}
              </text>
            ) : null}
          </motion.g>
        ))}
      </svg>
    </VizFrame>
  );
}
