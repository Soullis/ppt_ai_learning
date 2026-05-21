import type { Chapter } from "@/components/slide/types";
import { IoUDemo } from "@/components/viz/IoUDemo";
import { NMSDemo } from "@/components/viz/NMSDemo";
import { BipartiteMatching } from "@/components/viz/BipartiteMatching";
import { LatencyMap } from "@/components/viz/LatencyMap";
import { SlicingDemo } from "@/components/viz/SlicingDemo";
import { MaskOverlay } from "@/components/viz/Scene";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch08: Chapter = {
  id: "ch08",
  number: 8,
  slug: "detection",
  title: "Object detection",
  subtitle: "From two-stage to set prediction",
  slides: [
    {
      id: "ch08-00",
      title: "What detection actually outputs",
      eyebrow: "Recap",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            For each image, a variable-length list of{" "}
            <em>(box, class, confidence)</em>. Three design questions follow
            from that one fact:
          </p>
          <ul className="space-y-2 text-[15px]">
            <li>· How many boxes to output?</li>
            <li>· Which prediction matches which ground truth?</li>
            <li>· How to merge nearby duplicate boxes?</li>
          </ul>
          <p className="text-muted">
            Different families of detectors answer these three questions in
            different ways.
          </p>
        </div>
      ),
      viz: <MaskOverlay mode="detection" />,
    },
    {
      id: "ch08-01",
      title: "IoU — the workhorse metric",
      eyebrow: "How well do two boxes overlap?",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>Intersection over union:</p>
          <MBlock>{"\\mathrm{IoU}(A, B) = \\frac{|A \\cap B|}{|A \\cup B|}"}</MBlock>
          <p>
            Used for matching predictions to ground truth (anything below 0.5 is
            usually called a wrong detection), for NMS, and for evaluation. The two
            boxes on the right are draggable.
          </p>
        </div>
      ),
      viz: <IoUDemo />,
    },
    {
      id: "ch08-02",
      title: "Two-stage detectors",
      eyebrow: "Region proposal then classification",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Faster R-CNN.</strong> A region proposal network (RPN) spits out a
            few thousand candidate boxes. A second-stage head crops features for each
            and classifies + refines them.
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>· Strong accuracy, especially on small objects.</li>
            <li>· Higher latency, two passes through the head.</li>
            <li>· Hard to deploy on the edge in real time.</li>
          </ul>
          <p>
            Largely superseded by one-stage and DETR-family models for live drone
            inference, but still used in research and as a strong baseline.
          </p>
        </div>
      ),
    },
    {
      id: "ch08-03",
      title: "One-stage detectors",
      eyebrow: "Predict in one pass",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            <strong>YOLO, SSD, RetinaNet.</strong> A single fully-convolutional
            pass predicts boxes and classes at every spatial position. Modern
            YOLOs (v8+, v10, v11) are anchor-free: each grid cell predicts one
            centred box.
          </p>
          <p>Detection loss is the sum of three terms:</p>
          <MBlock>{"\\mathcal{L} = \\mathcal{L}_{\\text{cls}} + \\lambda_{\\text{box}}\\,\\mathcal{L}_{\\text{box}} + \\lambda_{\\text{obj}}\\,\\mathcal{L}_{\\text{obj}}"}</MBlock>
          <p className="text-muted">
            Box regression is usually GIoU or CIoU instead of L1, because it
            ties the loss to the metric.
          </p>
          <Callout label="YOLO papers" tone="accent">
            <a className="underline" href="https://arxiv.org/abs/1506.02640" target="_blank" rel="noreferrer">
              Redmon et al. 2015 (YOLO)
            </a>
            {" · "}
            <a className="underline" href="https://docs.ultralytics.com/models/yolov8/" target="_blank" rel="noreferrer">
              YOLOv8
            </a>
            {" · "}
            <a className="underline" href="https://arxiv.org/abs/2405.14458" target="_blank" rel="noreferrer">
              YOLOv10
            </a>
            {" · "}
            <a className="underline" href="https://docs.ultralytics.com/models/yolo11/" target="_blank" rel="noreferrer">
              YOLO11
            </a>
          </Callout>
        </div>
      ),
    },
    {
      id: "ch08-04",
      title: "Non-maximum suppression",
      eyebrow: "Collapse duplicates",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            One-stage detectors fire many boxes around the same object. NMS keeps the
            highest-confidence box and drops anything that overlaps it more than a
            threshold.
          </p>
          <ol className="space-y-2 text-[14px] text-ink/85">
            <li>1. Sort all boxes by confidence.</li>
            <li>2. Take the top box. Add it to the output set.</li>
            <li>3. Drop every remaining box whose IoU with it exceeds the threshold.</li>
            <li>4. Repeat until the queue is empty.</li>
          </ol>
          <Callout label="Variants in Nectar" tone="accent">
            <code className="font-mono text-[12px]">NMSStrategy</code>,{" "}
            <code className="font-mono text-[12px]">SoftNMSStrategy</code>,{" "}
            <code className="font-mono text-[12px]">WBFStrategy</code>,{" "}
            <code className="font-mono text-[12px]">NMMStrategy</code>.
          </Callout>
        </div>
      ),
      viz: <NMSDemo />,
    },
    {
      id: "ch08-05",
      title: "DETR — set prediction",
      eyebrow: "End-to-end detection",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            DETR (Carion et al., 2020) replaces anchors and NMS with a
            transformer that emits a fixed set of <em>N</em> predictions. Loss
            matches predictions to ground truth with the Hungarian algorithm,
            then computes class + box losses on the matched pairs.
          </p>
          <MBlock>
            {"\\hat\\sigma = \\arg\\min_\\sigma \\sum_i \\mathcal{L}_{\\text{match}}\\big(y_i, \\hat y_{\\sigma(i)}\\big)"}
          </MBlock>
          <p className="text-muted">
            Unmatched predictions are pushed toward &quot;no object&quot;.
            Clean training, no NMS at inference.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://arxiv.org/abs/2005.12872" target="_blank" rel="noreferrer">
              Carion et al. 2020 — End-to-End Object Detection with Transformers
            </a>
          </Callout>
        </div>
      ),
      viz: <BipartiteMatching />,
    },
    {
      id: "ch08-06",
      title: "DETR descendants",
      eyebrow: "RF-DETR · RT-DETR",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>DETR was slow to converge. Two important descendants:</p>
          <ul className="space-y-3 text-[15px]">
            <li>
              <strong>RT-DETR</strong> (Zhao et al., 2024) — hybrid CNN encoder
              with transformer decoder, IoU-aware query selection. The first
              real-time DETR, surpassing YOLO at comparable latency.{" "}
              <a className="underline" href="https://arxiv.org/abs/2304.08069" target="_blank" rel="noreferrer">
                paper
              </a>
              .
            </li>
            <li>
              <strong>RF-DETR</strong> (Roboflow, 2024) — DINOv2 ViT backbone
              with deformable cross-attention and refinement heads. Strong on
              small datasets, ships open-vocabulary checkpoints. Used in Nectar
              via <code className="font-mono text-[12px]">RFDETRModel</code>.{" "}
              <a className="underline" href="https://blog.roboflow.com/rf-detr/" target="_blank" rel="noreferrer">
                blog
              </a>
              {" · "}
              <a className="underline" href="https://github.com/roboflow/rf-detr" target="_blank" rel="noreferrer">
                code
              </a>
              .
            </li>
          </ul>
          <p>
            Both keep DETR's set-prediction recipe: fixed-size output,
            bipartite matching, no NMS.
          </p>
        </div>
      ),
    },
    {
      id: "ch08-07",
      title: "Latency vs accuracy",
      eyebrow: "Public reported numbers, COCO val2017",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            More parameters, higher mAP, more latency. The right choice depends
            on the compute budget on board.
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              · <strong>YOLO</strong> wins on tiny models (n / s) — the lowest
              latency in absolute terms.
            </li>
            <li>
              · <strong>RT-DETR</strong> dominates the mid range with higher
              mAP at similar latency.
            </li>
            <li>
              · <strong>RF-DETR</strong> reports the highest mAP / latency
              ratio for the small / base sizes.
            </li>
          </ul>
          <Callout label="Sources">
            <a className="underline" href="https://docs.ultralytics.com/models/" target="_blank" rel="noreferrer">
              Ultralytics docs
            </a>
            {" · "}
            <a className="underline" href="https://arxiv.org/abs/2005.12872" target="_blank" rel="noreferrer">
              DETR
            </a>
            {" · "}
            <a className="underline" href="https://arxiv.org/abs/2304.08069" target="_blank" rel="noreferrer">
              RT-DETR
            </a>
            {" · "}
            <a className="underline" href="https://blog.roboflow.com/rf-detr/" target="_blank" rel="noreferrer">
              RF-DETR
            </a>
          </Callout>
        </div>
      ),
      viz: <LatencyMap />,
    },
    {
      id: "ch08-08",
      title: "Slicing for high resolution",
      eyebrow: "Tile, predict, merge",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Aerial imagery often has small targets at high resolution. Inference at
            full size is expensive; downsampling kills small objects. The middle path
            is to slice, infer per tile, then merge.
          </p>
          <p>Steps on the right:</p>
          <ol className="space-y-1 text-[14px] text-ink/85">
            <li>1. Original image.</li>
            <li>2. Tile into overlapping windows.</li>
            <li>3. Run the detector per tile.</li>
            <li>4. Merge across tiles via NMS / Soft-NMS / WBF / NMM.</li>
          </ol>
        </div>
      ),
      viz: <SlicingDemo />,
    },
    {
      id: "ch08-09",
      title: "How Nectar exposes it",
      eyebrow: "SlicingConfig",
      layout: "prose",
      content: (
        <div className="space-y-5">
          <p>
            One call enables tiled inference with a chosen merge strategy. The detector
            keeps its existing API — slicing is transparent at the call site.
          </p>
          <CodeBlock language="python" filename="nectar.ai.detection">
{`from nectar.ai.detection import Detector

detector = Detector("yolov8n.pt")
detector.load()

detector.enable_slicing({
    "strategy": "grid",
    "slice_size": (640, 640),
    "overlap_ratio": 0.2,
    "merge_strategy": "nms",  # nms | soft_nms | wbf | nmm
})

result = detector.detect(large_image)
detector.disable_slicing()`}
          </CodeBlock>
          <p className="text-muted">
            Reference:{" "}
            <code className="font-mono text-[12px]">
              nectar/nectar/ai/detection/slicing/
            </code>
            . Chapter 11 walks the full module.
          </p>
        </div>
      ),
    },
  ],
};
