import type { Chapter } from "@/components/slide/types";
import { MaskOverlay } from "@/components/viz/Scene";
import { BboxFormats } from "@/components/viz/BboxFormats";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch07: Chapter = {
  id: "ch07",
  number: 7,
  slug: "cv-tasks",
  title: "Computer vision tasks",
  subtitle: "Same image, different outputs",
  slides: [
    {
      id: "ch07-00",
      title: "Classification",
      eyebrow: "What is in this image",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            A single label per image. Output is a probability distribution over
            classes through softmax:
          </p>
          <MBlock>{"\\hat p_k = \\frac{e^{z_k}}{\\sum_j e^{z_j}}"}</MBlock>
          <p className="text-muted">
            Loss is cross-entropy. Top-1 and top-5 accuracy are the standard metrics.
            ImageNet was the long-standing benchmark.
          </p>
        </div>
      ),
      viz: <MaskOverlay mode="classification" />,
    },
    {
      id: "ch07-01",
      title: "Detection",
      eyebrow: "What and where",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Predict a set of bounding boxes plus a class label per box. Each prediction
            carries a confidence score.
          </p>
          <p className="text-muted">
            Most Black Bee perception lives here: gates, posts, drones. Chapter 8 is
            entirely about this task.
          </p>
        </div>
      ),
      viz: <MaskOverlay mode="detection" />,
    },
    {
      id: "ch07-02",
      title: "Bounding box formats",
      eyebrow: "Three ways to write the same box",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Three conventions you will see daily, all describing the same rectangle:
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              <strong>xyxy</strong> · top-left and bottom-right corners. COCO, supervision.
            </li>
            <li>
              <strong>xywh</strong> · centre with width and height. Internal to many models.
            </li>
            <li>
              <strong>normalized</strong> · everything divided by image size. YOLO labels.
            </li>
          </ul>
          <Callout label="In Nectar">
            <code className="font-mono text-[12px]">FormatConverter</code> in the SDK
            handles COCO ↔ YOLO conversion automatically. Chapter 11 returns to it.
          </Callout>
        </div>
      ),
      viz: <BboxFormats />,
    },
    {
      id: "ch07-03",
      title: "Semantic segmentation",
      eyebrow: "Per-pixel class",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Every pixel gets a class label. Output is an image with the same spatial
            size as the input but with channels equal to the number of classes.
          </p>
          <MBlock>{"\\hat Y \\in \\mathbb{R}^{H \\times W \\times C}, \\quad \\hat y_{ij} = \\arg\\max_c \\hat Y_{ijc}"}</MBlock>
          <p className="text-muted">
            All pixels of the same class share one mask — &quot;all gate pixels&quot;,
            not &quot;this gate vs. that gate&quot;.
          </p>
        </div>
      ),
      viz: <MaskOverlay mode="semantic" />,
    },
    {
      id: "ch07-04",
      title: "Instance segmentation",
      eyebrow: "Per-instance mask",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Detection + per-pixel mask, separate per object. Mask R-CNN added a small
            mask head on top of Faster R-CNN; YOLO-seg and DETR-seg do similarly.
          </p>
          <p className="text-muted">
            The Nectar SDK supports this through{" "}
            <code className="font-mono text-[12px]">Segmentor</code> with the same
            three frameworks (YOLO, DETR, RF-DETR). See chapter 11.
          </p>
        </div>
      ),
      viz: <MaskOverlay mode="instance" />,
    },
    {
      id: "ch07-05",
      title: "Keypoints",
      eyebrow: "Sparse landmarks",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Predict a small set of named points per object — corners of a gate, joints
            of a body. Either as a heatmap per keypoint, or as a regressed coordinate.
          </p>
          <p className="text-muted">
            Useful when downstream geometry (pose estimation, alignment) needs precise
            anchors.
          </p>
        </div>
      ),
      viz: <MaskOverlay mode="keypoint" />,
    },
    {
      id: "ch07-06",
      title: "Depth",
      eyebrow: "How far",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Per-pixel distance in metres. Stereo, time-of-flight, or learned monocular
            depth from a single RGB image.
          </p>
          <p>
            Black Bee uses this directly: the RealSense and OAK-D drivers in the
            Nectar vision module return depth alongside colour.
          </p>
          <Callout label="Tip" tone="warm">
            Monocular depth is up to a scale factor. Useful for ordering objects, less
            useful for absolute distances without calibration.
          </Callout>
        </div>
      ),
      viz: <MaskOverlay mode="depth" />,
    },
    {
      id: "ch07-07",
      title: "Where each task fits",
      eyebrow: "Black Bee context",
      layout: "prose",
      content: (
        <div className="overflow-hidden rounded-md border border-stroke">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-bone text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                <th className="border-b border-stroke px-4 py-3">Task</th>
                <th className="border-b border-stroke px-4 py-3">Output</th>
                <th className="border-b border-stroke px-4 py-3">Where we use it</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {[
                ["Classification", "1 label", "scene type, gate vs no-gate"],
                ["Detection", "boxes + classes", "gates, drones, obstacles"],
                ["Semantic seg.", "pixel labels", "free-space mapping"],
                ["Instance seg.", "per-object masks", "counting, fine grasp targets"],
                ["Keypoints", "named points", "gate corners → 6-DoF pose"],
                ["Depth", "metres per pixel", "obstacle distance, landing"],
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
      ),
    },
  ],
};
