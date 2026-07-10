import type { Chapter } from "@/components/slide/types";
import { IoUDemo } from "@/components/viz/IoUDemo";
import { TPFPFNDemo } from "@/components/viz/TPFPFNDemo";
import { ConfusionMatrix } from "@/components/viz/ConfusionMatrix";
import { PRCurve } from "@/components/viz/PRCurve";
import { DetectionTimeline } from "@/components/viz/DetectionTimeline";
import { TwoStagePipeline } from "@/components/viz/TwoStagePipeline";
import { YOLOHeadDiagram } from "@/components/viz/YOLOHeadDiagram";
import { NMSDemo } from "@/components/viz/NMSDemo";
import { BipartiteMatching } from "@/components/viz/BipartiteMatching";
import { LatencyMap } from "@/components/viz/LatencyMap";
import { SlicingDemo } from "@/components/viz/SlicingDemo";
import { MaskOverlay } from "@/components/viz/Scene";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch11: Chapter = {
  id: "ch11",
  number: 11,
  part: 4,
  slug: "detection",
  title: "Object detection",
  subtitle: "From R-CNN to RF-DETR",
  slides: [
    {
      id: "ch11-00",
      title: "Detection output",
      eyebrow: "Definition",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Variable length list of <em>(box, class, confidence)</em> per image. Three design
            questions every detector must answer:
          </p>
          <ul className="space-y-2 text-[15px]">
            <li>· How many boxes to emit?</li>
            <li>· Which prediction matches which ground truth?</li>
            <li>· How to remove duplicate boxes?</li>
          </ul>
          <p className="text-muted">
            COCO stores boxes as <M>[x, y, w, h]</M> plus category id. Nectar uses{" "}
            <M>xyxy</M> internally.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://cocodataset.org/#format-data" target="_blank" rel="noreferrer">
              COCO annotation format
            </a>
          </Callout>
        </div>
      ),
      viz: <MaskOverlay mode="detection" />,
    },
    {
      id: "ch11-01",
      title: "Intersection over union",
      eyebrow: "Metric",
      layout: "split",
      content: (
        <div className="space-y-4">
          <MBlock>{"\\mathrm{IoU}(A, B) = \\frac{|A \\cap B|}{|A \\cup B|}"}</MBlock>
          <p>
            IoU measures box overlap on a scale from 0 (no overlap) to 1 (identical boxes). A
            prediction is matched to a ground truth box when IoU ≥ τ, commonly τ = 0.5 for a
            &quot;correct&quot; detection in COCO.
          </p>
          <p className="text-muted">
            IoU is used in three places: matching preds to labels during evaluation, suppressing
            duplicate boxes in NMS, and inside box regression losses (GIoU, CIoU).
          </p>
        </div>
      ),
      viz: <IoUDemo />,
    },
    {
      id: "ch11-02",
      title: "True positives, false positives, false negatives",
      eyebrow: "Matching",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            After matching predictions to ground truth at IoU ≥ τ:
          </p>
          <ul className="space-y-2 text-[14px]">
            <li><strong>TP</strong> — prediction matched to a GT box of the same class</li>
            <li><strong>FP</strong> — prediction with no matching GT (wrong location or spurious object)</li>
            <li><strong>FN</strong> — GT box with no matching prediction (missed object)</li>
          </ul>
          <p className="text-muted">
            Each GT box matches at most one prediction (highest IoU above threshold). Lowering the
            confidence threshold usually increases recall but also false positives.
          </p>
        </div>
      ),
      viz: <TPFPFNDemo />,
    },
    {
      id: "ch11-03",
      title: "Precision, recall, and F1",
      eyebrow: "Classification metrics",
      layout: "scrollProse",
      content: (
        <div className="space-y-4">
          <MBlock>{"P = \\frac{TP}{TP + FP}, \\qquad R = \\frac{TP}{TP + FN}"}</MBlock>
          <p>
            <strong>Precision</strong> answers: when the model predicts an object, how often is it
            right? Low precision means many false alarms.
          </p>
          <p>
            <strong>Recall</strong> answers: of all real objects, how many did we find? Low recall
            means missed targets.
          </p>
          <MBlock>{"F_1 = \\frac{2PR}{P + R}"}</MBlock>
          <p className="text-muted">
            Example: 8 TP, 2 FP, 2 FN → P = 0.80, R = 0.80, F1 = 0.80. On detection benchmarks,
            precision and recall are usually plotted as the confidence threshold sweeps from high
            to low.
          </p>
        </div>
      ),
    },
    {
      id: "ch11-04",
      title: "Confusion matrix for detection",
      eyebrow: "Errors",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Rows are ground truth classes, columns are predicted classes. The diagonal counts
            correct class assignments among matched boxes.
          </p>
          <ul className="space-y-2 text-[14px]">
            <li>· Off diagonal cells — class confusion (gate predicted as post)</li>
            <li>· Background row — false positives (prediction where no object exists)</li>
            <li>· Background column — false negatives (missed objects)</li>
          </ul>
        </div>
      ),
      viz: <ConfusionMatrix />,
    },
    {
      id: "ch11-05",
      title: "Average precision and mAP",
      eyebrow: "Detection metric",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <p>
            For one class: sort all predictions by confidence. At each threshold, compute precision
            and recall. Plot P vs R; <strong>AP</strong> is the area under that curve.
          </p>
          <MBlock>
            {"\\mathrm{mAP}@\\tau = \\frac{1}{C}\\sum_{c=1}^{C} AP_c \\quad \\text{at IoU} \\geq \\tau"}
          </MBlock>
          <p>
            <strong>mAP@50</strong> (COCO primary) uses τ = 0.5. <strong>mAP@50:95</strong> averages
            AP over IoU thresholds 0.50, 0.55, …, 0.95 — stricter, harder to improve.
          </p>
          <p className="text-muted">
            COCO reports mAP on val2017 with 80 thing classes. When comparing models, always note
            which split and metric variant was used.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://cocodataset.org/#detection-eval" target="_blank" rel="noreferrer">
              COCO detection evaluation
            </a>
          </Callout>
        </div>
      ),
      viz: <PRCurve />,
    },
    {
      id: "ch11-06",
      title: "Detection evolution",
      eyebrow: "History",
      layout: "fullViz",
      content: null,
      viz: <DetectionTimeline />,
    },
    {
      id: "ch11-07",
      title: "Two stage: R-CNN to Faster R-CNN",
      eyebrow: "Two stage",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <p>
            <strong>R-CNN</strong> (Girshick 2014): external region proposals, CNN feature per
            region, SVM classifier. Slow but showed CNN features beat hand crafted descriptors.
          </p>
          <p>
            <strong>Fast R-CNN</strong> (2015): shared convolutional backbone; RoI pooling extracts
            fixed size features per proposal in one forward pass.
          </p>
          <p>
            <strong>Faster R-CNN</strong> (Ren et al. 2015): Region Proposal Network (RPN) learns
            proposals from the feature map. Still two stages — propose regions, then classify and
            refine each — but end to end trainable. Strong on small objects, higher latency than
            one stage models.
          </p>
          <Callout label="References">
            <a className="underline" href="https://arxiv.org/abs/1311.2524" target="_blank" rel="noreferrer">R-CNN</a>
            {" · "}
            <a className="underline" href="https://arxiv.org/abs/1504.08083" target="_blank" rel="noreferrer">Fast R-CNN</a>
            {" · "}
            <a className="underline" href="https://arxiv.org/abs/1506.01497" target="_blank" rel="noreferrer">Faster R-CNN</a>
          </Callout>
        </div>
      ),
      viz: <TwoStagePipeline />,
    },
    {
      id: "ch11-08",
      title: "One stage: YOLO",
      eyebrow: "YOLO",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            YOLO (Redmon 2015) treats detection as regression: one network, one forward pass, boxes
            and class scores at every grid cell. Modern YOLO (v8+) is anchor free: each cell predicts
            a centred box directly.
          </p>
          <p>
            A Feature Pyramid Network (FPN) neck merges low and high level features. Detection
            heads at P3, P4, P5 (strides 8, 16, 32 on a 640 px input) handle small, medium, and
            large objects respectively.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://docs.ultralytics.com/models/yolov8/" target="_blank" rel="noreferrer">
              Ultralytics YOLOv8
            </a>
          </Callout>
        </div>
      ),
      viz: <YOLOHeadDiagram />,
    },
    {
      id: "ch11-09",
      title: "GIoU and CIoU",
      eyebrow: "Box regression",
      layout: "scrollProse",
      content: (
        <div className="space-y-5">
          <p>
            L1 or L2 loss on <M>{"(x, y, w, h)"}</M> does not match the IoU evaluation metric: two
            boxes can have similar coordinates but low IoU, and vice versa. IoU based losses align
            training with mAP.
          </p>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Intersection over union
            </div>
            <MBlock>{"\\mathrm{IoU}(A, B) = \\frac{|A \\cap B|}{|A \\cup B|}"}</MBlock>
            <p className="text-muted">Zero gradient when boxes do not overlap — GIoU fixes this.</p>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Generalized IoU (Rezatofighi et al. 2019)
            </div>
            <p>
              Let <M>C</M> be the smallest axis aligned box containing both <M>A</M> and <M>B</M>:
            </p>
            <MBlock>
              {"\\mathrm{GIoU}(A, B) = \\mathrm{IoU}(A, B) - \\frac{|C| - |A \\cup B|}{|C|}"}
            </MBlock>
            <MBlock>{"\\mathcal{L}_{\\mathrm{GIoU}} = 1 - \\mathrm{GIoU}"}</MBlock>
            <p className="text-muted">
              The penalty term is non zero even at IoU = 0, so the network receives a signal when
              predictions are far from the target.
            </p>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Complete IoU (Zheng et al. 2020)
            </div>
            <p>
              CIoU adds centre distance and aspect ratio on top of the enclosing box{" "}
              <M>C</M>. Let <M>{"\\rho^2"}</M> be the squared distance between box centres,{" "}
              <M>{"c^2"}</M> the squared diagonal of <M>C</M>, and:
            </p>
            <MBlock>
              {"v = \\frac{4}{\\pi^2}\\left(\\arctan\\frac{w^{gt}}{h^{gt}} - \\arctan\\frac{w}{h}\\right)^2"}
            </MBlock>
            <MBlock>
              {"\\mathrm{CIoU} = \\mathrm{IoU} - \\frac{\\rho^2}{c^2} - \\alpha v, \\qquad \\alpha = \\frac{v}{1 - \\mathrm{IoU} + v}"}
            </MBlock>
            <MBlock>{"\\mathcal{L}_{\\mathrm{CIoU}} = 1 - \\mathrm{CIoU}"}</MBlock>
            <p className="text-muted">
              The <M>{"\\rho^2/c^2"}</M> term pulls centres together; <M>v</M> penalises wrong
              aspect ratio even when overlap is similar. YOLOv8 uses CIoU for{" "}
              <M>{"\\mathcal{L}_{\\mathrm{box}}"}</M>.
            </p>
          </div>
          <Callout label="References">
            <a className="underline" href="https://arxiv.org/abs/1902.09630" target="_blank" rel="noreferrer">
              Rezatofighi et al. 2019 — GIoU
            </a>
            {" · "}
            <a className="underline" href="https://arxiv.org/abs/2005.03572" target="_blank" rel="noreferrer">
              Zheng et al. 2020 — DIoU and CIoU
            </a>
          </Callout>
        </div>
      ),
    },
    {
      id: "ch11-10",
      title: "YOLOv8 training losses",
      eyebrow: "Training",
      layout: "scrollProse",
      content: (
        <div className="space-y-5">
          <p>
            Ultralytics YOLOv8 combines three terms, weighted by hyperparameters{" "}
            <M>{"\\lambda_{\\mathrm{box}}, \\lambda_{\\mathrm{cls}}, \\lambda_{\\mathrm{dfl}}"}</M>:
          </p>
          <MBlock>
            {"\\mathcal{L} = \\lambda_{\\mathrm{box}}\\mathcal{L}_{\\mathrm{box}} + \\lambda_{\\mathrm{cls}}\\mathcal{L}_{\\mathrm{cls}} + \\lambda_{\\mathrm{dfl}}\\mathcal{L}_{\\mathrm{dfl}}"}
          </MBlock>
          <p>
            A task aligned assigner matches each ground truth box to one or more grid cells (using
            predicted class quality × IoU). Only matched <em>positive</em> cells contribute to{" "}
            <M>{"\\mathcal{L}_{\\mathrm{box}}"}</M> and <M>{"\\mathcal{L}_{\\mathrm{dfl}}"}</M>;
            classification runs on positives and negatives.
          </p>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              box_loss — CIoU localisation
            </div>
            <p>
              Decode the predicted box from the head output at each positive cell. Compare to the
              assigned GT box:
            </p>
            <MBlock>
              {"\\mathcal{L}_{\\mathrm{box}} = \\frac{1}{N_{\\mathrm{pos}}}\\sum_{i \\in \\mathrm{pos}} \\big(1 - \\mathrm{CIoU}(\\hat B_i, B_i^{gt})\\big)"}
            </MBlock>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              cls_loss — binary cross entropy on class logits
            </div>
            <p>
              Each cell outputs one logit per class (multi label BCE, not softmax). For a positive
              assigned to class <M>c</M>, target is 1 on class <M>c</M> and 0 elsewhere; negatives
              target all zeros:
            </p>
            <MBlock>
              {"\\mathcal{L}_{\\mathrm{cls}} = -\\frac{1}{N}\\sum_{i,c}\\Big[y_{ic}\\log\\sigma(\\hat p_{ic}) + (1-y_{ic})\\log(1-\\sigma(\\hat p_{ic}))\\Big]"}
            </MBlock>
            <p className="text-muted">
              <M>{"\\sigma"}</M> is the sigmoid. Label smoothing may soften hard 0/1 targets during
              training.
            </p>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              dfl_loss — distribution focal loss on box sides
            </div>
            <p>
              YOLOv8 does not regress each side as a single scalar. For each of the four sides
              (left, top, right, bottom from the anchor point), the head outputs a discrete
              distribution over <M>{"n"}</M> bins. DFL applies cross entropy on the two bins
              bracketing the continuous GT distance:
            </p>
            <MBlock>
              {"\\mathcal{L}_{\\mathrm{dfl}} = \\frac{1}{N_{\\mathrm{pos}}}\\sum_{i \\in \\mathrm{pos}}\\sum_{s \\in \\{l,t,r,b\\}} \\mathrm{DFL}(\\hat{\\mathbf{d}}_{is},\\, d_{is}^{gt})"}
            </MBlock>
            <p className="text-muted">
              Refines sub pixel boundaries after coarse CIoU alignment. Reported as{" "}
              <code className="font-mono text-[12px]">dfl_loss</code> in the Ultralytics training
              log.
            </p>
          </div>
          <p className="text-muted">
            Nectar wraps the Ultralytics trainer — all three curves appear in TensorBoard during{" "}
            <code className="font-mono text-[12px]">detector.train()</code>. At inference these
            losses are unused; raw boxes pass through NMS (next slides).
          </p>
          <Callout label="References">
            <a className="underline" href="https://docs.ultralytics.com/models/yolov8/" target="_blank" rel="noreferrer">
              Ultralytics YOLOv8
            </a>
            {" · "}
            <a className="underline" href="https://arxiv.org/abs/2006.04388" target="_blank" rel="noreferrer">
              Li et al. 2020 — Generalized Focal Loss (DFL)
            </a>
          </Callout>
        </div>
      ),
    },
    {
      id: "ch11-11",
      title: "Non maximum suppression",
      eyebrow: "Post-processing",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <p>
            Dense grid prediction produces many overlapping boxes on the same object. NMS is greedy
            post processing, not part of training:
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-[14px]">
            <li>Sort all boxes by confidence (descending)</li>
            <li>Take the top box, add to output</li>
            <li>Remove every remaining box with IoU &gt; τ to the kept box</li>
            <li>Repeat until no boxes remain</li>
          </ol>
          <CodeBlock language="python" filename="nms_pseudocode">
{`def nms(boxes, scores, iou_threshold):
    order = scores.argsort()[::-1]
    keep = []
    while order.size > 0:
        i = order[0]
        keep.append(i)
        ious = compute_iou(boxes[i], boxes[order[1:]])
        order = order[1:][ious <= iou_threshold]
    return keep`}
          </CodeBlock>
        </div>
      ),
      viz: <NMSDemo />,
    },
    {
      id: "ch11-12",
      title: "NMS variants and when they apply",
      eyebrow: "Post-processing",
      layout: "scrollProse",
      content: (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-md border border-stroke text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bone font-mono text-[11px] uppercase text-muted">
                  <th className="border-b border-stroke px-4 py-2">Model family</th>
                  <th className="border-b border-stroke px-4 py-2">NMS at inference</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["YOLO", "yes — default τ ≈ 0.7"],
                  ["RT-DETR", "optional — often disabled"],
                  ["DETR / RF-DETR", "no — set prediction with Hungarian matching"],
                ].map(([m, n]) => (
                  <tr key={m} className="border-b border-stroke">
                    <td className="px-4 py-2 font-medium">{m}</td>
                    <td className="px-4 py-2 text-muted">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Nectar merge strategies for tiled inference:{" "}
            <code className="font-mono text-[12px]">NMSStrategy</code>,{" "}
            <code className="font-mono text-[12px]">SoftNMSStrategy</code> (decays scores instead of
            hard delete), <code className="font-mono text-[12px]">WBFStrategy</code> (weighted box
            fusion), <code className="font-mono text-[12px]">NMMStrategy</code>.
          </p>
        </div>
      ),
    },
    {
      id: "ch11-13",
      title: "DETR: set prediction",
      eyebrow: "DETR",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <p>
            DETR (Carion et al. 2020) outputs a fixed set of <M>N</M> predictions (e.g. 100). A
            transformer decoder reads the CNN feature map via attention (chapter 6). Training uses
            bipartite matching: Hungarian algorithm pairs each GT to one prediction; unmatched
            slots learn &quot;no object&quot;.
          </p>
          <MBlock>
            {"\\hat\\sigma = \\arg\\min_\\sigma \\sum_i \\mathcal{L}_{\\mathrm{match}}\\big(y_i, \\hat y_{\\sigma(i)}\\big)"}
          </MBlock>
          <div className="overflow-hidden rounded-md border border-stroke text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bone font-mono text-[11px] uppercase text-muted">
                  <th className="border-b border-stroke px-4 py-2">Property</th>
                  <th className="border-b border-stroke px-4 py-2">YOLO</th>
                  <th className="border-b border-stroke px-4 py-2">DETR</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Output count", "variable (grid × anchors)", "fixed N queries"],
                  ["Matching", "IoU + anchor assignment", "Hungarian matching"],
                  ["NMS", "required", "not used"],
                  ["Latency", "lower on edge", "higher (transformer decoder)"],
                ].map(([p, y, d]) => (
                  <tr key={p} className="border-b border-stroke">
                    <td className="px-4 py-2">{p}</td>
                    <td className="px-4 py-2 text-muted">{y}</td>
                    <td className="px-4 py-2 text-muted">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      id: "ch11-14",
      title: "RT-DETR and RF-DETR",
      eyebrow: "Descendants",
      layout: "scrollProse",
      content: (
        <div className="space-y-4">
          <p>
            <strong>RT-DETR</strong> (Zhao et al. 2023) — hybrid design: efficient CNN encoder,
            transformer decoder, IoU aware query selection. Reported real-time speeds on GPU while
            keeping set prediction (no NMS).
          </p>
          <p>
            <strong>RF-DETR</strong> (Roboflow 2024) — DINOv2 ViT backbone (self supervised pretrain,
            chapter 10 transfer learning), deformable cross attention, refinement heads. Strong on
            small custom datasets. Nectar exposes it via{" "}
            <code className="font-mono text-[12px]">Detector(&quot;rfdetr-medium&quot;, framework=RFDETR)</code>.
          </p>
          <Callout label="References">
            <a className="underline" href="https://arxiv.org/abs/2304.08069" target="_blank" rel="noreferrer">RT-DETR</a>
            {" · "}
            <a className="underline" href="https://github.com/roboflow/rf-detr" target="_blank" rel="noreferrer">RF-DETR</a>
          </Callout>
        </div>
      ),
    },
    {
      id: "ch11-15",
      title: "Latency vs accuracy",
      eyebrow: "Tradeoffs",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>Reported numbers on COCO val2017. Choice depends on onboard compute budget.</p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>· YOLO n/s — lowest absolute latency on Orin Nano class hardware</li>
            <li>· RT-DETR — mid range, higher mAP at similar GPU latency</li>
            <li>· RF-DETR — strong mAP per millisecond on small/base sizes</li>
          </ul>
        </div>
      ),
      viz: <LatencyMap />,
    },
    {
      id: "ch11-16",
      title: "Slicing for high resolution",
      eyebrow: "Tiling",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Aerial imagery has small targets at high resolution. Tile with overlap, detect per tile,
            merge with NMS / Soft-NMS / WBF. Augmentation presets for aerial data are in chapter 13.
          </p>
        </div>
      ),
      viz: <SlicingDemo />,
    },
    {
      id: "ch11-17",
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
          <p className="text-muted">Full module tour in chapter 15.</p>
        </div>
      ),
    },
  ],
};
