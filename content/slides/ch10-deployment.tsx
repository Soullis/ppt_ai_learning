import type { Chapter } from "@/components/slide/types";
import { QuantizationBar } from "@/components/viz/QuantizationBar";
import { HardwareTable } from "@/components/viz/HardwareTable";
import { Pipeline } from "@/components/viz/Pipeline";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch10: Chapter = {
  id: "ch10",
  number: 10,
  slug: "deployment",
  title: "Deployment to the edge",
  subtitle: "From PyTorch checkpoint to onboard inference",
  slides: [
    {
      id: "ch10-00",
      title: "Why edge",
      eyebrow: "Latency · privacy · power",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            A drone over a forest cannot wait 200 ms for a cloud round-trip and cannot
            assume it has Wi-Fi. We run perception on board, where every millisecond
            of latency is millimetres of drift in the control loop.
          </p>
          <ul className="space-y-2 text-[15px]">
            <li>
              <strong>Latency.</strong> ~30 ms perception, leaving room for control.
            </li>
            <li>
              <strong>Power.</strong> Inference draws from the same battery that flies
              the drone.
            </li>
            <li>
              <strong>Privacy.</strong> Data stays on the airframe.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "ch10-01",
      title: "Export pipeline",
      eyebrow: "PyTorch → ONNX → TensorRT",
      layout: "fullViz",
      viz: (
        <Pipeline
          steps={[
            { label: "PyTorch", detail: ".pt checkpoint" },
            { label: "ONNX", detail: "graph IR" },
            { label: "TensorRT", detail: "fused · quantised" },
            { label: "Engine", detail: ".engine on disk" },
            { label: "Runtime", detail: "trtexec / Python" },
          ]}
        />
      ),
    },
    {
      id: "ch10-02",
      title: "Quantisation",
      eyebrow: "Trade precision for speed",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Going from FP32 to INT8 cuts the model size by 4× and roughly halves
            latency. Accuracy usually drops by only a few tenths of a percent if
            calibrated on representative data.
          </p>
          <MBlock>{"q = \\mathrm{round}\\!\\Big(\\frac{x}{s}\\Big) - z, \\quad x \\approx s\\,(q + z)"}</MBlock>
          <Callout label="In practice">
            Pad the calibration set with hard cases. INT8 calibrated only on easy
            frames will collapse on hard ones.
          </Callout>
        </div>
      ),
      viz: <QuantizationBar />,
    },
    {
      id: "ch10-03",
      title: "Hardware",
      eyebrow: "What the airframe carries",
      layout: "fullViz",
      viz: <HardwareTable />,
    },
    {
      id: "ch10-03b",
      title: "Hardware sources",
      eyebrow: "Where the numbers come from",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 text-[14px]">
            <li>
              ·{" "}
              <a className="underline" href="https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/nano-developer-kit/" target="_blank" rel="noreferrer">
                Jetson Orin Nano 8 GB · datasheet
              </a>{" "}
              — 67 INT8 TOPS (super mode), 1024 CUDA, 32 Tensor cores, 7–25 W.
            </li>
            <li>
              ·{" "}
              <a className="underline" href="https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/" target="_blank" rel="noreferrer">
                Jetson Orin NX / AGX Orin · datasheets
              </a>{" "}
              — 157 / 275 INT8 TOPS, 16 / 64 GB LPDDR5.
            </li>
            <li>
              ·{" "}
              <a className="underline" href="https://www.raspberrypi.com/products/raspberry-pi-5/" target="_blank" rel="noreferrer">
                Raspberry Pi 5 · product brief
              </a>{" "}
              — BCM2712, quad Cortex-A76 @ 2.4 GHz, no NPU.
            </li>
            <li>
              ·{" "}
              <a className="underline" href="https://coral.ai/products/accelerator" target="_blank" rel="noreferrer">
                Coral USB Accelerator
              </a>{" "}
              — 4 INT8 TOPS, USB 3.0, fixed-op set; pair with the Pi for
              quantised inference.
            </li>
            <li>
              ·{" "}
              <a className="underline" href="https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/tesla-t4/t4-tensor-core-datasheet-951643.pdf" target="_blank" rel="noreferrer">
                NVIDIA T4 datasheet
              </a>{" "}
              — the common public-benchmark baseline used in the chapter 8
              latency / mAP plot.
            </li>
          </ul>
          <Callout label="In our airframes" tone="warm">
            Black Bee competition platforms run primarily on the Jetson Orin
            Nano 8 GB; the Pi 5 + Coral combination is reserved for
            ultra-light builds where every gram counts.
          </Callout>
        </div>
      ),
    },
    {
      id: "ch10-04",
      title: "Latency budget",
      eyebrow: "Allocate your milliseconds",
      layout: "prose",
      content: (
        <div className="space-y-5">
          <p>
            A 30 Hz mission gives 33 ms per frame. Spend it deliberately:
          </p>
          <div className="overflow-hidden rounded-md border border-stroke">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-bone text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  <th className="border-b border-stroke px-4 py-3">Stage</th>
                  <th className="border-b border-stroke px-4 py-3">Budget</th>
                  <th className="border-b border-stroke px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="text-ink">
                {[
                  ["Capture + resize", "≈ 3 ms", "GStreamer / RealSense / OAK-D"],
                  ["Pre-processing", "≈ 2 ms", "letterbox · normalise"],
                  ["Inference", "≈ 8 – 12 ms", "YOLOv8n INT8 · Orin Nano super"],
                  ["Post-processing", "≈ 3 ms", "NMS · per-class filter"],
                  ["Decision + control", "≈ 5 ms", "PID · setpoint publish"],
                  ["Slack", "≈ 8 ms", "logging · multi-stream · future features"],
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
        </div>
      ),
    },
    {
      id: "ch10-05",
      title: "From model to drone",
      eyebrow: "End to end",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            One node consumes camera frames, runs the detector, and publishes detection
            messages on a ROS 2 topic. Mission code subscribes and reacts.
          </p>
          <CodeBlock language="bash">
{`# On the Jetson
ros2 run nectar detector_example.py --ros-args \\
    -p model_source:="black-bee/imav-2025-gate.engine" \\
    -p image_source:=realsense \\
    -p conf_threshold:=0.45`}
          </CodeBlock>
          <p className="text-muted">
            The mission planner subscribes to the resulting topic and turns
            detections into goals for{" "}
            <code className="font-mono text-[12px]">drone.move_to</code>. We just
            taught a copter to see.
          </p>
        </div>
      ),
    },
  ],
};
