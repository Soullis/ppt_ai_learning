"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

type Model = {
  name: string;
  latency: number; // ms, T4 TensorRT FP16 (or paper-reported V100 where noted)
  map: number; // COCO val2017 mAP@50:95
  family: "yolo" | "detr" | "rfdetr";
};

// Public reference numbers — see citations below the chart.
//   Ultralytics docs   https://docs.ultralytics.com/models/
//   DETR paper         https://arxiv.org/abs/2005.12872
//   RT-DETR paper      https://arxiv.org/abs/2304.08069
//   RF-DETR blog       https://blog.roboflow.com/rf-detr/
const MODELS: Model[] = [
  { name: "YOLOv8n", latency: 1.5, map: 37.3, family: "yolo" },
  { name: "YOLOv8s", latency: 2.7, map: 44.9, family: "yolo" },
  { name: "YOLOv8m", latency: 5.1, map: 50.2, family: "yolo" },
  { name: "YOLOv8l", latency: 8.7, map: 52.9, family: "yolo" },
  { name: "YOLO11n", latency: 1.5, map: 39.5, family: "yolo" },
  { name: "YOLO11s", latency: 2.5, map: 47.0, family: "yolo" },
  { name: "YOLO11m", latency: 4.7, map: 51.5, family: "yolo" },
  { name: "DETR-R50",  latency: 28.0, map: 42.0, family: "detr" },
  { name: "DETR-R101", latency: 36.0, map: 43.5, family: "detr" },
  { name: "RT-DETR-R18",  latency: 4.6, map: 46.5, family: "detr" },
  { name: "RT-DETR-R50",  latency: 9.3, map: 53.1, family: "detr" },
  { name: "RT-DETR-R101", latency: 13.5, map: 54.3, family: "detr" },
  { name: "RF-DETR-N", latency: 2.3, map: 48.4, family: "rfdetr" },
  { name: "RF-DETR-S", latency: 3.5, map: 53.0, family: "rfdetr" },
  { name: "RF-DETR-B", latency: 6.0, map: 55.0, family: "rfdetr" },
];

const FAMILY_COLOR: Record<Model["family"], string> = {
  yolo: COLORS.accent,
  detr: COLORS.green,
  rfdetr: COLORS.honey,
};

export function LatencyMap({
  width = 740,
  height = 460,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 60;
  const padY = 50;
  const xMax = 40;
  const yMin = 30;
  const yMax = 60;
  const sx = (x: number) => padX + (x / xMax) * (width - padX * 2);
  const sy = (y: number) =>
    height - padY - ((y - yMin) / (yMax - yMin)) * (height - padY * 2);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <VizFrame
      width={width}
      height={height}
      caption="COCO val2017 — public reported numbers, T4 TensorRT FP16 (DETR family on V100, FP32)"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <line x1={padX} x2={width - padX} y1={height - padY} y2={height - padY} stroke={COLORS.ink} strokeOpacity={0.4} />
        <line x1={padX} x2={padX} y1={padY} y2={height - padY} stroke={COLORS.ink} strokeOpacity={0.4} />
        <text
          x={(padX + (width - padX)) / 2}
          y={height - padY + 30}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
        >
          inference latency (ms)
        </text>
        <text
          x={padX - 14}
          y={(padY + (height - padY)) / 2}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          textAnchor="middle"
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
          transform={`rotate(-90, ${padX - 14}, ${(padY + (height - padY)) / 2})`}
        >
          mAP@50:95
        </text>
        {[5, 10, 15, 20, 25, 30, 35].map((g) => (
          <g key={g}>
            <line x1={sx(g)} x2={sx(g)} y1={padY} y2={height - padY} stroke={COLORS.stroke} />
            <text x={sx(g)} y={height - padY + 14} textAnchor="middle" fontSize={10} fill={COLORS.muted} fontFamily="JetBrains Mono, monospace">
              {g}
            </text>
          </g>
        ))}
        {[35, 40, 45, 50, 55].map((g) => (
          <g key={g}>
            <line x1={padX} x2={width - padX} y1={sy(g)} y2={sy(g)} stroke={COLORS.stroke} />
            <text x={padX - 4} y={sy(g) + 4} textAnchor="end" fontSize={10} fill={COLORS.muted} fontFamily="JetBrains Mono, monospace">
              {g}
            </text>
          </g>
        ))}
        {MODELS.map((m, i) => (
          <motion.g
            key={m.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            onMouseEnter={() => setHover(m.name)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={sx(m.latency)}
              cy={sy(m.map)}
              r={hover === m.name ? 7 : 5}
              fill={FAMILY_COLOR[m.family]}
              stroke={COLORS.ink}
              strokeWidth={hover === m.name ? 1.5 : 0.6}
            />
            <text
              x={sx(m.latency) + 9}
              y={sy(m.map) + 4}
              fontSize={10.5}
              fontFamily="JetBrains Mono, monospace"
              fill={hover === m.name ? COLORS.ink : COLORS.muted}
            >
              {m.name}
            </text>
          </motion.g>
        ))}
        <g transform={`translate(${width - 200}, ${padY + 6})`}>
          {(["yolo", "detr", "rfdetr"] as const).map((fam, i) => (
            <g key={fam} transform={`translate(0, ${i * 20})`}>
              <circle cx={6} cy={6} r={5} fill={FAMILY_COLOR[fam]} />
              <text x={20} y={10} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
                {fam}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </VizFrame>
  );
}
