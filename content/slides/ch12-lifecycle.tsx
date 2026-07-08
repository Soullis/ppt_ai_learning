import type { Chapter } from "@/components/slide/types";
import { LifecyclePipeline } from "@/components/viz/LifecyclePipeline";
import { SplitBar } from "@/components/viz/SplitBar";
import { AugmentationGallery } from "@/components/viz/AugmentationGallery";
import { ClassHist } from "@/components/viz/ClassHist";
import { TrainingCurves } from "@/components/viz/TrainingCurves";
import { PRCurve } from "@/components/viz/PRCurve";
import { ConfusionMatrix } from "@/components/viz/ConfusionMatrix";
import { FailureModes } from "@/components/viz/FailureModes";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch12: Chapter = {
  id: "ch12",
  number: 12,
  part: 5,
  slug: "lifecycle",
  title: "Training and evaluation",
  subtitle: "From raw flights to a deployable model",
  slides: [
    {
      id: "ch12-00",
      title: "The end-to-end pipeline",
      eyebrow: "Pipeline",
      layout: "fullViz",
      viz: <LifecyclePipeline />,
    },
    {
      id: "ch12-01",
      title: "Annotation",
      eyebrow: "Roboflow workflow",
      layout: "scrollProse",
      content: (
        <div className="space-y-4">
          <p>
            Black Bee labels in <strong>Roboflow</strong>: upload videos as frames,
            draw bounding boxes per class, review, export. The Nectar SDK has direct
            integrations:
          </p>
          <CodeBlock language="python" filename="nectar.ai.detection.datasets">
{`from nectar.ai.detection.datasets import RoboflowHandler, RoboflowUploader

# Pull a versioned project from Roboflow
handler = RoboflowHandler("data/imav-gate", api_key=KEY)
handler.download(workspace="black-bee", project="imav-2025-gate", version=4, format_type="yolo")

# Upload images + annotations to a Roboflow project
uploader = RoboflowUploader(api_key=KEY)
uploader.upload_dataset(
    dataset_path="datasets/imav-gate",
    project_name="imav-2025-gate",
    splits=["train", "valid", "test"],
)`}
          </CodeBlock>
          <p className="text-muted">
            Tighter labels = better mAP. Box edges should hug the object — every extra
            pixel is noise.
          </p>
        </div>
      ),
    },
    {
      id: "ch12-02",
      title: "Format conversion",
      eyebrow: "COCO ↔ YOLO",
      layout: "scrollProse",
      content: (
        <div className="space-y-5">
          <p>
            COCO and YOLO encode the same bounding boxes differently. Nectar
            auto-detects and converts as needed:
          </p>
          <CodeBlock language="python" filename="nectar.ai.detection.datasets">
{`from nectar.ai.detection.datasets import FormatDetector, FormatConverter

# Auto-detect what we have
fmt = FormatDetector("datasets/imav-gate").detect()  # "coco" | "yolo"

# Convert if the trainer expects the other format
yaml_path = FormatConverter("datasets/imav-gate", "datasets/imav-gate-yolo").convert(target_format="yolo")`}
          </CodeBlock>
          <p className="text-muted">
            YAML → trainer.{" "}
            <code className="font-mono text-[12px]">data.yaml</code> describes the
            class names and split paths.
          </p>
        </div>
      ),
    },
    {
      id: "ch12-03",
      title: "Stratified splitting",
      eyebrow: "Stratified splits",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Random splits can leave a rare class entirely out of validation, which
            makes its mAP undefined. Stratification preserves the per-class
            distribution.
          </p>
          <CodeBlock language="python" filename="nectar.ai.detection.datasets">
{`from nectar.ai.detection.datasets import Stratifier

Stratifier(
    "datasets/imav-gate-unsplit",
    "datasets/imav-gate-split",
    seed=42,
).stratify(train_ratio=0.8, val_ratio=0.2, test_ratio=0.0)`}
          </CodeBlock>
        </div>
      ),
      viz: <SplitBar />,
    },
    {
      id: "ch12-04a",
      title: "Why augment",
      eyebrow: "Three benefits at once",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            Augmentation synthesises new training examples by applying
            label-preserving transforms to existing ones. Three things it
            achieves at once:
          </p>
          <ul className="space-y-2 text-[15px]">
            <li>
              · <strong>Effective dataset size</strong> grows by{" "}
              <M>k</M>× without re-labelling.
            </li>
            <li>
              · <strong>Invariance</strong> is taught explicitly: the model
              must give the same answer whether the gate is flipped, rotated,
              brighter or in shadow.
            </li>
            <li>
              · <strong>Regularisation</strong> — the model can no longer
              memorise pixel-by-pixel; it has to learn the underlying object.
            </li>
          </ul>
          <p>
            On detection, augmentation must update the boxes too — flipping
            mirrors the box, rotating rotates it. Albumentations handles this
            automatically.
          </p>
          <MBlock>
            {"\\text{train size} = N + k\\,N \\quad \\text{where } k = \\text{num\\_augmented}"}
          </MBlock>
          <Callout label="Reference">
            <a className="underline" href="https://albumentations.ai/" target="_blank" rel="noreferrer">
              albumentations.ai
            </a>
            {" — "}
            the library Nectar uses; we ship an{" "}
            <code className="font-mono text-[12px]">aerial</code> preset.
          </Callout>
        </div>
      ),
    },
    {
      id: "ch12-04",
      title: "The augmentation menu",
      eyebrow: "Pixel · geometric · composite",
      layout: "split",
      content: (
        <div className="space-y-3">
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Pixel-level (do not move boxes)
            </div>
            <p className="text-[14px]">
              brightness, contrast, HSV jitter, gaussian noise, motion blur,
              JPEG compression, fog / rain.
            </p>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Geometric (boxes update)
            </div>
            <p className="text-[14px]">
              horizontal flip, rotate, scale, perspective, random crop, cutout.
            </p>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Composite (multi-image)
            </div>
            <p className="text-[14px]">
              <strong>mosaic</strong> — 4 images glued together, the strongest
              single trick in YOLO training. <strong>mixup</strong> — two
              images blended at α; the model gets soft labels.
            </p>
          </div>
          <Callout label="Active augmentation" tone="warm">
            <code className="font-mono text-[12px]">prioritize_rare_classes</code>{" "}
            biases augmentation toward under-represented categories — the next
            slide shows the effect.
          </Callout>
        </div>
      ),
      viz: <AugmentationGallery />,
    },
    {
      id: "ch12-05",
      title: "Class balancing",
      eyebrow: "Long tail · short tail",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Aerial datasets are long-tailed: gates everywhere, posts rarely. A network
            trained on raw frequencies just learns the head and ignores the tail.
          </p>
          <p>
            Two levers: oversample with augmentation, or weight the loss per class.
            Nectar offers the first directly:
          </p>
          <CodeBlock language="bash">
{`nectar-ai detect dataset augment \\
  --input  datasets/imav-gate \\
  --output datasets/imav-gate-balanced \\
  --preset aerial \\
  --num-augmented 2 \\
  --max-original-samples 1000 \\
  --prioritize-rare-classes`}
          </CodeBlock>
        </div>
      ),
      viz: <ClassHist />,
    },
    {
      id: "ch12-06",
      title: "Training",
      eyebrow: "End-to-end",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            One config drives all three frameworks. The trainer starts a TensorBoard
            server, can push checkpoints to HuggingFace Hub, and runs evaluation at
            the end.
          </p>
          <CodeBlock language="python" filename="nectar.ai.detection">
{`from nectar.ai.detection import Detector, TrainingConfig

detector = Detector("yolov8n.pt")
detector.load()

result = detector.train(TrainingConfig(
    dataset_path="datasets/imav-gate-balanced",
    epochs=100,
    batch_size=16,
    learning_rate=1e-3,
    output_dir="outputs/imav-2025/",
    tensorboard=True,
    push_to_hub=True,
    hub_model_id="black-bee/imav-2025-gate",
))`}
          </CodeBlock>
        </div>
      ),
      viz: <TrainingCurves />,
    },
    {
      id: "ch12-07",
      title: "Evaluation metrics",
      eyebrow: "What numbers mean",
      layout: "prose",
      content: (
        <div className="space-y-5">
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Precision · how often we are right when we predict
            </div>
            <MBlock>{"P = \\frac{TP}{TP + FP}"}</MBlock>
            <p className="text-muted">
              Low precision = many false alarms. The model says &quot;gate&quot; on things that aren&apos;t gates.
            </p>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Recall · how much of the truth we find
            </div>
            <MBlock>{"R = \\frac{TP}{TP + FN}"}</MBlock>
            <p className="text-muted">
              Low recall = many misses. Real gates that should have triggered a detection.
            </p>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              F1 · harmonic mean of P and R
            </div>
            <MBlock>{"F_1 = \\frac{2 P R}{P + R}"}</MBlock>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              mAP · the COCO standard for detection
            </div>
            <MBlock>
              {"\\mathrm{mAP}@\\tau = \\frac{1}{C}\\sum_{c=1}^{C} \\int_0^1 P_c(r)\\,dr \\quad \\text{at IoU} \\geq \\tau"}
            </MBlock>
            <p className="text-muted">
              <strong>mAP@50</strong> averages AP per class at IoU ≥ 0.5.{" "}
              <strong>mAP@50:95</strong> averages also over IoU ∈ [0.5, 0.95] in
              steps of 0.05 — stricter, harder to improve, the headline COCO
              number.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "ch12-08",
      title: "Precision–recall curves",
      eyebrow: "The shape behind the number",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Sweep the confidence threshold from high to low. Each operating point
            gives a (recall, precision) pair. The area under the curve is AP.
          </p>
          <p className="text-muted">
            Per-class curves expose where the model struggles. Here, posts at AP 0.65
            are the obvious next class to label more of.
          </p>
        </div>
      ),
      viz: <PRCurve />,
    },
    {
      id: "ch12-09",
      title: "Confusion matrix",
      eyebrow: "Where the mistakes go",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Each row is a ground-truth class, each column is what the model
            predicted. The diagonal is correct, everything else is a mistake
            with a name:
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              · <span style={{ color: "#2E7D5C" }}>green</span> — true positives
              on the diagonal.
            </li>
            <li>
              · <span style={{ color: "#E8B53C" }}>honey</span> — bottom row, the{" "}
              <em>background</em> row: false positives. The model imagined an
              object where there was none.
            </li>
            <li>
              · <span style={{ color: "#B23A48" }}>red</span> — last column,
              the <em>background</em> column: false negatives. A real object
              the model missed entirely.
            </li>
          </ul>
          <p className="text-muted">
            In this example, posts are confused with background — fix by adding
            posts to training, especially on cluttered terrain.
          </p>
        </div>
      ),
      viz: <ConfusionMatrix />,
    },
    {
      id: "ch12-10",
      title: "Common failure modes",
      eyebrow: "Loss curves",
      layout: "fullViz",
      viz: <FailureModes />,
    },
    {
      id: "ch12-11",
      title: "Diagnosing in practice",
      eyebrow: "First questions to ask",
      layout: "prose",
      content: (
        <div className="space-y-3 text-[15px]">
          <p>
            <strong>Overfitting</strong> · train loss keeps falling, val loss
            flattens or rises. Add augmentation, weight decay, dropout, or
            stop earlier.
          </p>
          <p>
            <strong>Underfitting</strong> · both losses high. Use a bigger
            model, train longer, raise the learning rate, remove constraints.
          </p>
          <p>
            <strong>Class imbalance</strong> · rare classes have low recall.
            Augment them with{" "}
            <code className="font-mono text-[12px]">prioritize_rare_classes</code>{" "}
            or weight the loss per class.
          </p>
          <p>
            <strong>Label noise</strong> · ceiling on mAP. Spot-check the worst
            predictions; many are actually right and the labels are wrong.
          </p>
          <p>
            <strong>Distribution shift</strong> · works on the bench, fails in
            the real flight. Add data from deployment conditions: weather,
            lighting, altitude.
          </p>
          <p>
            <strong>Leakage</strong> · val drops too fast or unrealistically
            low. Re-split, augment <em>after</em> splitting, never before.
          </p>
        </div>
      ),
    },
  ],
};
