import type { Chapter } from "@/components/slide/types";
import { MaskOverlay } from "@/components/viz/Scene";
import { BboxFormats } from "@/components/viz/BboxFormats";
import { ClassificationDemo } from "@/components/viz/ClassificationDemo";
import { VideoDemo } from "@/components/viz/VideoDemo";
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
            One label per image. Output is a probability distribution over a
            fixed vocabulary, produced by softmax over the network logits:
          </p>
          <MBlock>{"\\hat p_k = \\frac{e^{z_k}}{\\sum_j e^{z_j}}"}</MBlock>
          <p>
            The prediction is <M>{"\\arg\\max_k \\hat p_k"}</M>; loss is
            categorical cross-entropy. Top-1 and top-5 accuracy are the
            standard metrics. ImageNet (1000 classes) was the long-standing
            benchmark.
          </p>
          <p className="text-muted">
            The bars on the right show the full distribution, not just the
            argmax. Image 5 is the same person as image 1; the model splits
            probability between two classes once the appearance changes.
          </p>
        </div>
      ),
      viz: <ClassificationDemo />,
    },
    {
      id: "ch07-01",
      title: "Detection",
      eyebrow: "What and where",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Predict a variable-length list of (box, class, confidence). The
            output structure is what makes detection harder than classification
            — a single image can contain zero or many objects.
          </p>
          <p>
            Most Black Bee perception lives here: gates, posts, drones. The
            video on the right is one of our trained YOLO models running on a
            real flight log. Chapter 8 unpacks the architecture.
          </p>
        </div>
      ),
      viz: (
        <VideoDemo
          caption="real Black Bee mission · YOLO detection on flight footage"
          clips={[
            { src: "/team/det-1.mp4", label: "clip 1" },
            { src: "/team/det-2.mp4", label: "clip 2" },
          ]}
        />
      ),
    },
    {
      id: "ch07-02",
      title: "Bounding box formats",
      eyebrow: "Three ways to write the same box",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Three conventions you will see daily, all describing the same
            rectangle:
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              <strong>xyxy</strong> · top-left and bottom-right corners. COCO,
              supervision.
            </li>
            <li>
              <strong>xywh</strong> · centre with width and height. Internal
              to many models.
            </li>
            <li>
              <strong>normalized</strong> · everything divided by image size.
              YOLO labels.
            </li>
          </ul>
          <Callout label="In Nectar">
            <code className="font-mono text-[12px]">FormatConverter</code> in
            the SDK handles COCO ↔ YOLO conversion automatically. Chapter 11
            returns to it.
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
            Every pixel gets a class label. The output has the same spatial
            size as the input, with one channel per class:
          </p>
          <MBlock>
            {"\\hat Y \\in \\mathbb{R}^{H \\times W \\times C}, \\quad \\hat y_{ij} = \\arg\\max_c \\hat Y_{ijc}"}
          </MBlock>
          <p>
            All pixels of the same class share one mask — &quot;all gate
            pixels&quot;, not &quot;this gate vs that gate&quot;. Loss is
            per-pixel cross-entropy, often combined with Dice loss to handle
            class imbalance.
          </p>
          <p className="text-muted">
            Typical use cases: free-space mapping for autonomous driving, lane
            segmentation, terrain classification from aerial imagery.
            Architectures: U-Net, DeepLab, SegFormer, Mask2Former.
          </p>
          <Callout>
            We do not use this on Black Bee yet — most of our targets are
            countable objects, where instance segmentation or detection fits
            better.
          </Callout>
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
            Detection plus a per-pixel mask, separate for each object. Mask
            R-CNN added a small mask head on top of Faster R-CNN; YOLO-seg and
            DETR-seg do similarly.
          </p>
          <p>
            The video on the right is one of our segmentation models on a real
            flight; each instance gets its own coloured mask, which lets us
            count, sort, or pick objects individually.
          </p>
          <p className="text-muted">
            The Nectar SDK supports this through{" "}
            <code className="font-mono text-[12px]">Segmentor</code> with the
            same three frameworks (YOLO, DETR, RF-DETR). See chapter 11.
          </p>
        </div>
      ),
      viz: (
        <VideoDemo
          caption="real Black Bee mission · instance segmentation on flight footage"
          clips={[
            { src: "/team/seg-2.mp4", label: "clip 1" },
            { src: "/team/seg-1.mp4", label: "clip 2" },
          ]}
        />
      ),
    },
    {
      id: "ch07-05",
      title: "Keypoints",
      eyebrow: "Sparse landmarks",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Predict a small set of named points per object — corners of a
            gate, joints of a body. Either as a heatmap per keypoint, or as a
            regressed coordinate.
          </p>
          <p className="text-muted">
            Useful when downstream geometry (pose estimation, alignment) needs
            precise anchors.
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
            Per-pixel distance in metres. Stereo, time-of-flight, or learned
            monocular depth from a single RGB image.
          </p>
          <p>
            Black Bee uses this directly: the RealSense and OAK-D drivers in
            the Nectar vision module return depth alongside colour.
          </p>
          <Callout tone="warm">
            Monocular depth is recovered up to a scale factor — useful for
            ordering objects, not for absolute distances without calibration.
          </Callout>
        </div>
      ),
      viz: <MaskOverlay mode="depth" />,
    },
  ],
};
