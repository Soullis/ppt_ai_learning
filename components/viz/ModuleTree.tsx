"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

export type TreeNode = { name: string; children?: TreeNode[]; note?: string };

const TREE: TreeNode = {
  name: "nectar/ai/",
  children: [
    {
      name: "detection/",
      note: "Detector · YOLO · DETR · RF-DETR",
      children: [
        { name: "detector.py", note: "factory" },
        { name: "core/", note: "BaseDetectionModel · types · configs" },
        { name: "models/", note: "ultralytics · transformers · rfdetr" },
        { name: "training/", note: "framework configs" },
        { name: "evaluation/", note: "mAP · PR · CM" },
        { name: "slicing/", note: "tile + merge" },
        { name: "postprocess/", note: "NMS · Soft-NMS · WBF · NMM" },
        { name: "datasets/", note: "format · subset · stratify · augment" },
      ],
    },
    {
      name: "segmentation/",
      note: "Segmentor · seg variants",
      children: [
        { name: "core/", note: "BaseSegmentationModel · types" },
        { name: "models/", note: "ultralytics-seg · rfdetr-seg" },
        { name: "evaluation/", note: "box + mask mAP" },
      ],
    },
    { name: "cli/", note: "nectar-ai detect | segment" },
    { name: "paths.py", note: "data + outputs dirs" },
  ],
};

function flatten(node: TreeNode, depth = 0, lines: { name: string; note?: string; depth: number }[] = []) {
  lines.push({ name: node.name, note: node.note, depth });
  node.children?.forEach((c) => flatten(c, depth + 1, lines));
  return lines;
}

export function ModuleTree({
  width = 720,
  height = 480,
}: {
  width?: number;
  height?: number;
}) {
  const lines = flatten(TREE);
  const lineH = 26;
  const offsetX = 30;
  const offsetY = 20;

  return (
    <VizFrame width={width} height={height} caption="nectar/nectar/ai/ — module map">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {lines.map((l, i) => (
          <motion.g
            key={`${l.name}-${i}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <text
              x={offsetX + l.depth * 22}
              y={offsetY + i * lineH + 14}
              fontSize={13}
              fontFamily="JetBrains Mono, monospace"
              fill={l.depth === 0 ? COLORS.ink : COLORS.ink}
            >
              {l.depth > 0 ? "├─ " : ""}
              {l.name}
            </text>
            {l.note ? (
              <text
                x={offsetX + 280}
                y={offsetY + i * lineH + 14}
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.muted}
              >
                {l.note}
              </text>
            ) : null}
          </motion.g>
        ))}
      </svg>
    </VizFrame>
  );
}
