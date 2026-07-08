import type { Chapter } from "@/components/slide/types";
import { IoUDemo } from "@/components/viz/IoUDemo";
import { NMSDemo } from "@/components/viz/NMSDemo";
import { BipartiteMatching } from "@/components/viz/BipartiteMatching";
import { LatencyMap } from "@/components/viz/LatencyMap";
import { SlicingDemo } from "@/components/viz/SlicingDemo";
import { DetectionTimeline } from "@/components/viz/DetectionTimeline";
import { TransformerBlock } from "@/components/viz/TransformerBlock";
import { AttentionMatrix } from "@/components/viz/AttentionMatrix";
import { MaskOverlay } from "@/components/viz/Scene";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch10: Chapter = {
  id: "ch10",
  number: 10,
  part: 4,
  slug: "detection",
  title: "Object detection",
  subtitle: "From R-CNN to RF-DETR",
  slides: [
    {
      id: "ch10-00",
      title: "Detection output",
      eyebrow: "Definition",
      layout: "split",
      notes: "5 min. Three design questions.",
      content: (
        <div className="space-y-4">
          <p>
            Variable-length list of <em>(box, class, confidence)</em> per image. Three design
            questions:
          </p>
          <ul className="space-y-2 text-[15px]">
            <li>· How many boxes to emit?</li>
            <li>· Which prediction matches which ground truth?</li>
            <li>· How to remove duplicate boxes?</li>
          </ul>
        </div>
      ),
      viz: <MaskOverlay mode="detection" />,
    },
    {
      id: "ch10-01",
      title: "Detection evolution",
      eyebrow: "History",
      layout: "fullViz",
      notes: "6 min skim timeline.",
      content: null,
      viz: <DetectionTimeline />,
    },
    {
      id: "ch10-02",
      title: "Intersection over union",
      eyebrow: "Metric",
      layout: "split",
      notes: "8 min. Draggable boxes.",
      content: (
        <div className="space-y-4">
          <MBlock>{"\\mathrm{IoU}(A, B) = \\frac{|A \\cap B|}{|A \\cup B|}"}</MBlock>
          <p>
            Used for matching predictions to ground truth (typical threshold 0.5), NMS, and mAP
            evaluation.
          </p>
        </div>
      ),
      viz: <IoUDemo />,
    },
    {
      id: "ch10-03",
      title: "Two-stage detectors",
      eyebrow: "Reference",
      layout: "prose",
      tier: "reference",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Faster R-CNN</strong> — region proposal network generates candidates; a second
            head classifies and refines each region. Strong on small objects, higher latency.
            Largely superseded for real-time drone inference by one-stage and DETR models.
          </p>
        </div>
      ),
    },
    {
      id: "ch10-04",
      title: "One-stage detectors (YOLO)",
      eyebrow: "YOLO",
      layout: "prose",
      notes: "12 min. Anchor-free grid prediction.",
      content: (
        <div className="space-y-4">
          <p>
            Single forward pass predicts boxes and classes at each spatial location. Modern YOLO
            (v8+) is anchor-free: each cell predicts a centred box directly.
          </p>
          <MBlock>
            {"\\mathcal{L} = \\mathcal{L}_{\\text{cls}} + \\lambda_{\\text{box}}\\,\\mathcal{L}_{\\text{box}} + \\lambda_{\\text{obj}}\\,\\mathcal{L}_{\\text{obj}}"}
          </MBlock>
          <p>
            Box regression uses GIoU or CIoU so the loss aligns with the evaluation metric. FPN
            (feature pyramid network) combines multi-scale features for objects at different sizes.
          </p>
          <Callout label="References">
            <a className="underline" href="https://arxiv.org/abs/1506.02640" target="_blank" rel="noreferrer">
              Redmon et al. 2015
            </a>
            {" · "}
            <a className="underline" href="https://docs.ultralytics.com/models/yolov8/" target="_blank" rel="noreferrer">
              Ultralytics YOLOv8
            </a>
          </Callout>
        </div>
      ),
    },
    {
      id: "ch10-05",
      title: "Non-maximum suppression",
      eyebrow: "Post-processing",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Sort by confidence, keep the top box, discard overlapping boxes above an IoU threshold.
            Repeat until done.
          </p>
          <Callout label="Nectar merge strategies">
            <code className="font-mono text-[12px]">NMSStrategy</code>,{" "}
            <code className="font-mono text-[12px]">SoftNMSStrategy</code>,{" "}
            <code className="font-mono text-[12px]">WBFStrategy</code>,{" "}
            <code className="font-mono text-[12px]">NMMStrategy</code>
          </Callout>
        </div>
      ),
      viz: <NMSDemo />,
    },
    {
      id: "ch10-06",
      title: "Attention for detection",
      eyebrow: "Transformer",
      layout: "split",
      notes: "8 min. Needed before DETR.",
      content: (
        <div className="space-y-4">
          <MBlock>
            {"\\mathrm{Attn}(Q, K, V) = \\mathrm{softmax}\\!\\Big(\\frac{Q K^\\top}{\\sqrt{d_k}}\\Big) V"}
          </MBlock>
          <p>
            Each query attends over all keys. DETR uses a transformer decoder so each detection
            query can attend to the full image feature map.
          </p>
        </div>
      ),
      viz: <AttentionMatrix />,
    },
    {
      id: "ch10-07",
      title: "DETR — set prediction",
      eyebrow: "DETR",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Fixed set of <M>N</M> predictions. Hungarian algorithm matches predictions to ground
            truth; unmatched slots learn &quot;no object&quot;.
          </p>
          <MBlock>
            {"\\hat\\sigma = \\arg\\min_\\sigma \\sum_i \\mathcal{L}_{\\text{match}}\\big(y_i, \\hat y_{\\sigma(i)}\\big)"}
          </MBlock>
          <Callout label="Reference">
            <a className="underline" href="https://arxiv.org/abs/2005.12872" target="_blank" rel="noreferrer">
              Carion et al. 2020
            </a>
          </Callout>
        </div>
      ),
      viz: <BipartiteMatching />,
    },
    {
      id: "ch10-08",
      title: "Transformer block",
      eyebrow: "Architecture",
      layout: "split",
      tier: "reference",
      content: (
        <p>
          Self-attention, residual connections, LayerNorm, feed-forward MLP — stacked N times in
          encoder and decoder.
        </p>
      ),
      viz: <TransformerBlock />,
    },
    {
      id: "ch10-09",
      title: "RT-DETR and RF-DETR",
      eyebrow: "Descendants",
      layout: "prose",
      notes: "10 min. What we deploy in Nectar.",
      content: (
        <div className="space-y-4">
          <ul className="space-y-3 text-[15px]">
            <li>
              <strong>RT-DETR</strong> (Zhao et al., 2024) — hybrid CNN encoder, transformer
              decoder, IoU-aware query selection. Reported real-time on GPU.{" "}
              <a className="underline" href="https://arxiv.org/abs/2304.08069" target="_blank" rel="noreferrer">
                paper
              </a>
            </li>
            <li>
              <strong>RF-DETR</strong> (Roboflow, 2024) — DINOv2 ViT backbone, deformable
              cross-attention, refinement heads. Strong on small datasets. Used in Nectar via{" "}
              <code className="font-mono text-[12px]">RFDETRModel</code>.{" "}
              <a className="underline" href="https://github.com/roboflow/rf-detr" target="_blank" rel="noreferrer">
                code
              </a>
            </li>
          </ul>
          <p>Both keep set prediction: fixed output count, bipartite matching, no NMS at inference.</p>
        </div>
      ),
    },
    {
      id: "ch10-10",
      title: "Latency vs accuracy",
      eyebrow: "Tradeoffs",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>Reported numbers on COCO val2017. Choice depends on onboard compute budget.</p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>· YOLO n/s — lowest absolute latency</li>
            <li>· RT-DETR — mid range, higher mAP at similar latency</li>
            <li>· RF-DETR — strong mAP per millisecond on small/base sizes</li>
          </ul>
        </div>
      ),
      viz: <LatencyMap />,
    },
    {
      id: "ch10-11",
      title: "Slicing for high resolution",
      eyebrow: "Tiling",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Aerial imagery has small targets at high resolution. Tile with overlap, detect per
            tile, merge with NMS / Soft-NMS / WBF.
          </p>
        </div>
      ),
      viz: <SlicingDemo />,
    },
    {
      id: "ch10-12",
      title: "Nectar slicing API",
      eyebrow: "Code",
      layout: "scrollProse",
      content: (
        <div className="space-y-5">
          <CodeBlock language="python" filename="nectar.ai.detection">
{`from nectar.ai.detection import Detector

detector = Detector("yolov8n.pt")
detector.load()

detector.enable_slicing({
    "strategy": "grid",
    "slice_size": (640, 640),
    "overlap_ratio": 0.2,
    "merge_strategy": "nms",
})

result = detector.detect(large_image)
detector.disable_slicing()`}
          </CodeBlock>
          <p className="text-muted">Full module tour in chapter 14.</p>
        </div>
      ),
    },
    {
      id: "ch10-13",
      title: "CIoU box loss",
      eyebrow: "Deep dive",
      layout: "prose",
      tier: "deep",
      content: (
        <div className="space-y-4">
          <p>
            Complete IoU extends GIoU with aspect ratio consistency. YOLO trainers use CIoU or
            variants so box regression penalises centre distance, scale mismatch, and aspect ratio
            together.
          </p>
          <p className="text-muted">
            See Zheng et al. 2020 — Distance-IoU Loss. Implementation in Ultralytics loss head.
          </p>
        </div>
      ),
    },
  ],
};
