import type { Chapter } from "@/components/slide/types";
import { ModuleTree } from "@/components/viz/ModuleTree";
import { NectarMap } from "@/components/viz/NectarMap";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Callout } from "@/components/ui/Callout";

export const ch11: Chapter = {
  id: "ch11",
  number: 11,
  slug: "nectar",
  title: "The Nectar AI module",
  subtitle: "Architecture and CLI",
  slides: [
    {
      id: "ch11-00",
      title: "Module map",
      eyebrow: "nectar/nectar/ai/",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            <code className="font-mono text-[12px]">ai/</code> contains two
            task packages — <em>detection</em> and <em>segmentation</em> —
            sharing one CLI (
            <code className="font-mono text-[12px]">nectar-ai</code>) and one
            set of data and output paths.
          </p>
          <p className="text-muted">
            Reference:{" "}
            <code className="font-mono text-[12px]">
              nectar/nectar/ai/README.md
            </code>
            .
          </p>
        </div>
      ),
      viz: <ModuleTree />,
    },
    {
      id: "ch11-01",
      title: "One factory, three frameworks",
      eyebrow: "Detector",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            The <code className="font-mono text-[12px]">Detector</code> class is a
            thin facade over a model registry. The framework is auto-detected from
            the model path, or selected explicitly.
          </p>
          <CodeBlock language="python" filename="nectar.ai.detection">
{`from nectar.ai.detection import Detector

detector = Detector("yolov8n.pt")                  # ULTRALYTICS
detector = Detector("facebook/detr-resnet-50")     # TRANSFORMERS
detector = Detector("rf-detr-nano.pth")            # RFDETR

detector.load()
result = detector.detect(image, conf=0.5)`}
          </CodeBlock>
        </div>
      ),
      viz: <NectarMap />,
    },
    {
      id: "ch11-03",
      title: "Same API, three families",
      eyebrow: "What the user sees",
      layout: "prose",
      content: (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Ultralytics
            </div>
            <CodeBlock language="python">
{`detector = Detector("yolov8n.pt")
detector.load()
out = detector.detect(img)`}
            </CodeBlock>
          </div>
          <div>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Transformers (DETR)
            </div>
            <CodeBlock language="python">
{`detector = Detector(
    "facebook/detr-resnet-50",
)
detector.load()
out = detector.detect(img)`}
            </CodeBlock>
          </div>
          <div>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              RF-DETR
            </div>
            <CodeBlock language="python">
{`detector = Detector(
    "rf-detr-base",
    resolution=560,
)
detector.load()
out = detector.detect(img)`}
            </CodeBlock>
          </div>
        </div>
      ),
    },
    {
      id: "ch11-04",
      title: "CLI tour",
      eyebrow: "nectar-ai detect …",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <CodeBlock language="bash">
{`# Train from a YAML config
nectar-ai detect train --config configs/imav_yolo11n.yaml

# Predict on a folder, save annotated frames
nectar-ai detect predict --model best.pt --input frames/ --output preds/

# Evaluate on the test split with a chosen merge strategy
nectar-ai detect eval --model-path best.pt --dataset-path datasets/imav-gate \\
  --merge-strategy nms --merge-iou-threshold 0.5

# Dataset operations
nectar-ai detect dataset download --source visdrone --output data/visdrone
nectar-ai detect dataset convert --input datasets/coco --output datasets/yolo --format yolo
nectar-ai detect dataset stratify --input datasets/unsplit --output datasets/split --train-ratio 0.8
nectar-ai detect dataset augment --input datasets/imav-gate --output datasets/imav-gate-aug \\
  --preset aerial --num-augmented 2 --splits train --num-workers 8
nectar-ai detect dataset analyze --input datasets/imav-gate
nectar-ai detect dataset upload --target huggingface \\
  --repo black-bee/imav-2025-gate --dataset datasets/imav-gate`}
          </CodeBlock>
        </div>
      ),
    },
    {
      id: "ch11-05",
      title: "Slicing in practice",
      eyebrow: "SlicingConfig + merge strategies",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Enable slicing on any detector. Pick a merge strategy that fits the
            density of your scene.
          </p>
          <CodeBlock language="python">
{`detector.enable_slicing({
    "strategy": "grid",
    "slice_size": (640, 640),
    "overlap_ratio": 0.2,
    "merge_strategy": "wbf",  # crowd-friendly
})`}
          </CodeBlock>
          <Callout>
            Use <code className="font-mono text-[12px]">soft_nms</code> when boxes
            overlap heavily, <code className="font-mono text-[12px]">wbf</code> for
            ensembling, <code className="font-mono text-[12px]">nmm</code> when many
            small boxes describe parts of the same object.
          </Callout>
        </div>
      ),
      viz: (
        <CodeBlock language="python" filename="merge strategies">
{`NMSStrategy        # baseline, drops by IoU
SoftNMSStrategy    # decays scores instead of dropping
WBFStrategy        # weighted box fusion, ensemble-friendly
NMMStrategy        # non-maximum merging (clusters → one)`}
        </CodeBlock>
      ),
    },
    {
      id: "ch11-06",
      title: "Evaluation artifacts",
      eyebrow: "Per run, on disk",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            <code className="font-mono text-[12px]">ObjectDetectionEvaluator</code>{" "}
            writes a folder of plots and tables alongside the model:
          </p>
          <ul className="space-y-1 text-[14px] text-ink/85">
            <li>· PR / P / R / F1 curves per class</li>
            <li>· confusion matrix (raw and normalised)</li>
            <li>· per-class metrics CSV + JSON</li>
            <li>· prediction samples on the test split</li>
            <li>· error analysis (FP/FN breakdown)</li>
          </ul>
          <CodeBlock language="python" filename="evaluation snippet">
{`from nectar.ai.detection import EvaluationConfig
from nectar.ai.detection.evaluation import ObjectDetectionEvaluator

cfg = EvaluationConfig(
    model_path="outputs/imav-2025/best.pt",
    dataset_path="datasets/imav-gate-balanced",
    framework="ultralytics",
    split="test",
    conf_threshold=0.25,
)
ObjectDetectionEvaluator(detector.model, cfg).evaluate()`}
          </CodeBlock>
        </div>
      ),
    },
    {
      id: "ch11-07",
      title: "Black Bee case study",
      eyebrow: "IMAV 2025 — gate detection",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            We collected 4 hours of indoor flight footage, sampled to ~6k frames,
            labelled in Roboflow as four classes (gate, drone, post, marker), then
            trained a YOLOv8n with the SDK.
          </p>
          <div className="overflow-hidden rounded-md border border-stroke">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-bone text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  <th className="border-b border-stroke px-4 py-3">Stage</th>
                  <th className="border-b border-stroke px-4 py-3">Detail</th>
                </tr>
              </thead>
              <tbody className="text-ink">
                {[
                  ["Dataset", "6,082 frames · 4 classes · 80/20 stratified"],
                  ["Augmentation", "aerial preset · num_augmented=2 · prioritise rare"],
                  ["Model", "yolov8n.pt fine-tune"],
                  ["Training", "100 epochs · Adam · 1e-3 · batch 16"],
                  ["Result (illustrative)", "mAP@50 ~ 0.91 · mAP@50:95 ~ 0.62"],
                  ["Deployment", "ONNX → TensorRT INT8 · Jetson Orin Nano · 12 ms/frame"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-stroke last:border-b-0">
                    {row.map((cell) => (
                      <td key={cell} className="px-4 py-3">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout label="Worked example, published" tone="accent">
            For a full, public end-to-end detection project that follows the
            same pipeline (data → architecture comparison → training →
            evaluation → deployment), see{" "}
            <a className="underline" href="https://huggingface.co/blog/samuellimabraz/signature-detection-model" target="_blank" rel="noreferrer">
              Open-Source Handwritten Signature Detection Model
            </a>{" "}
            — YOLO vs DETR vs RF-DETR with real numbers and an open model on
            the Hub.
          </Callout>
        </div>
      ),
    },
  ],
};
