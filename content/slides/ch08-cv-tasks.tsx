import type { Chapter } from "@/components/slide/types";
import { MaskOverlay } from "@/components/viz/Scene";
import { BboxFormats } from "@/components/viz/BboxFormats";
import { VideoDemo } from "@/components/viz/VideoDemo";
import { Callout } from "@/components/ui/Callout";

export const ch08: Chapter = {
  id: "ch08",
  number: 8,
  part: 3,
  slug: "cv-tasks",
  title: "Computer vision tasks",
  subtitle: "Same sensor, different outputs",
  slides: [
    {
      id: "ch08-00",
      title: "Task taxonomy",
      eyebrow: "Overview",
      layout: "prose",
      notes: "8 min. Map outputs before diving into each task.",
      content: (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-md border border-stroke">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-bone text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  <th className="border-b border-stroke px-4 py-3">Task</th>
                  <th className="border-b border-stroke px-4 py-3">Output</th>
                  <th className="border-b border-stroke px-4 py-3">Black Bee use</th>
                </tr>
              </thead>
              <tbody className="text-ink">
                {[
                  ["Classification", "one label per image", "scene / terrain type"],
                  ["Detection", "list of (box, class, score)", "gates, drones, posts — primary"],
                  ["Semantic segmentation", "per-pixel class", "terrain, free space"],
                  ["Instance segmentation", "per-object mask", "counting, sorting objects"],
                  ["Keypoints", "named landmarks", "geometry, alignment"],
                  ["Depth", "per-pixel distance", "RealSense, OAK-D drivers"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-stroke last:border-b-0">
                    {row.map((cell) => (
                      <td key={cell} className="px-4 py-3 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "ch08-01",
      title: "Detection preview",
      eyebrow: "Detection",
      layout: "split",
      notes: "4 min teaser. Chapter 9 goes deep.",
      content: (
        <div className="space-y-4">
          <p>
            Detection outputs a variable-length list of bounding boxes with class labels and
            confidence scores. Most Black Bee perception lives here.
          </p>
          <p className="text-muted">Flight footage: trained YOLO on a real mission log.</p>
        </div>
      ),
      viz: (
        <VideoDemo
          caption="Black Bee mission · YOLO detection"
          clips={[
            { src: "/team/det-1.mp4", label: "clip 1" },
            { src: "/team/det-2.mp4", label: "clip 2" },
          ]}
        />
      ),
    },
    {
      id: "ch08-02",
      title: "Bounding box formats",
      eyebrow: "Formats",
      layout: "split",
      notes: "6 min. Critical for annotation and Nectar conversion.",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              <strong>xyxy</strong> — corner coordinates. COCO, many annotation tools.
            </li>
            <li>
              <strong>xywh</strong> — centre plus width and height. Internal to many models.
            </li>
            <li>
              <strong>normalised</strong> — divided by image size. YOLO label files.
            </li>
          </ul>
          <Callout label="Nectar">
            <code className="font-mono text-[12px]">FormatConverter</code> handles COCO ↔ YOLO.
            Chapter 11.
          </Callout>
        </div>
      ),
      viz: <BboxFormats />,
    },
    {
      id: "ch08-03",
      title: "Segmentation preview",
      eyebrow: "Segmentation",
      layout: "split",
      notes: "4 min teaser. Chapter 10 goes deep.",
      content: (
        <div className="space-y-4">
          <p>
            Segmentation assigns a label to every pixel — either per class (semantic) or per object
            instance. Nectar exposes this via <code className="font-mono text-[12px]">Segmentor</code>.
          </p>
        </div>
      ),
      viz: (
        <VideoDemo
          caption="Black Bee mission · instance segmentation"
          clips={[
            { src: "/team/seg-2.mp4", label: "clip 1" },
            { src: "/team/seg-1.mp4", label: "clip 2" },
          ]}
        />
      ),
    },
    {
      id: "ch08-04",
      title: "Semantic vs instance",
      eyebrow: "Segmentation types",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Semantic</strong> — all pixels of class &quot;gate&quot; share one mask.{" "}
            <strong>Instance</strong> — each object gets its own mask, enabling counting and
            sorting.
          </p>
          <p className="text-muted">
            For countable mission targets, detection or instance segmentation usually fits better
            than pure semantic segmentation.
          </p>
        </div>
      ),
      viz: <MaskOverlay mode="semantic" />,
    },
    {
      id: "ch08-05",
      title: "Keypoints and depth",
      eyebrow: "Reference",
      layout: "split",
      tier: "reference",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Keypoints</strong> — sparse landmarks (gate corners, body joints). Predicted as
            heatmaps or regressed coordinates.
          </p>
          <p>
            <strong>Depth</strong> — per-pixel distance. Stereo, time-of-flight, or monocular
            (scale-ambiguous). Black Bee uses RealSense and OAK-D depth alongside RGB.
          </p>
        </div>
      ),
      viz: <MaskOverlay mode="depth" />,
    },
  ],
};
