"use client";

import { COLORS, VizFrame } from "./common";

/**
 * Hardware reference numbers compiled from official datasheets and vendor
 * docs. Sources are linked from the slide content.
 *
 *  Jetson Orin Nano 8 GB    NVIDIA datasheet · Jetson Orin Nano Series
 *  Jetson Orin NX 16 GB     NVIDIA datasheet · Jetson Orin NX Series
 *  Jetson AGX Orin 64 GB    NVIDIA datasheet · Jetson AGX Orin Series
 *  Raspberry Pi 5            raspberrypi.com product brief
 *  Coral USB Accelerator     coral.ai · Edge TPU
 *  NVIDIA T4 (cloud ref)    NVIDIA T4 datasheet
 */

const ROWS: {
  name: string;
  chip: string;
  perf: string;
  mem: string;
  power: string;
  notes: string;
}[] = [
  {
    name: "Jetson Orin Nano 8 GB",
    chip: "Ampere · 1024 CUDA · 32 Tensor",
    perf: "67 INT8 TOPS (super mode)",
    mem: "8 GB LPDDR5 · 102 GB/s",
    power: "7 – 25 W",
    notes: "primary edge target for our team",
  },
  {
    name: "Jetson Orin NX 16 GB",
    chip: "Ampere · 1024 CUDA · 32 Tensor",
    perf: "157 INT8 TOPS (super mode)",
    mem: "16 GB LPDDR5 · 102 GB/s",
    power: "10 – 40 W",
    notes: "drop-in upgrade, same SO-DIMM",
  },
  {
    name: "Jetson AGX Orin 64 GB",
    chip: "Ampere · 2048 CUDA · 64 Tensor",
    perf: "275 INT8 TOPS",
    mem: "64 GB LPDDR5 · 204 GB/s",
    power: "15 – 60 W",
    notes: "heavier airframes, multi-stream",
  },
  {
    name: "Raspberry Pi 5 (8 GB)",
    chip: "BCM2712 · 4× Cortex-A76 @ 2.4 GHz",
    perf: "no NPU — CPU only",
    mem: "8 GB LPDDR4X · 17 GB/s",
    power: "≈ 8 W",
    notes: "pair with Coral USB for INT8",
  },
  {
    name: "Coral USB Accelerator",
    chip: "Google Edge TPU",
    perf: "4 INT8 TOPS",
    mem: "host-shared",
    power: "≈ 2.5 W",
    notes: "fixed INT8 ops only, USB 3.0",
  },
  {
    name: "NVIDIA T4 (cloud ref.)",
    chip: "Turing · 2560 CUDA · 320 Tensor",
    perf: "65 FP16 / 130 INT8 TFLOPS",
    mem: "16 GB GDDR6 · 320 GB/s",
    power: "70 W",
    notes: "common benchmark baseline",
  },
];

export function HardwareTable({
  width = 980,
  height = 360,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <VizFrame width={width} height={height} caption="vendor-published specs · see references on the slide">
      <div className="h-full w-full overflow-auto p-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              {["device", "chip", "performance", "memory", "power", "notes"].map((h) => (
                <th key={h} className="border-b border-stroke px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-ink">
            {ROWS.map((r) => (
              <tr key={r.name} className="border-b border-stroke last:border-b-0 align-top">
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2 font-mono text-[12px] text-muted">{r.chip}</td>
                <td className="px-3 py-2 font-mono text-[12px]" style={{ color: COLORS.ink }}>
                  {r.perf}
                </td>
                <td className="px-3 py-2 font-mono text-[12px] text-muted">{r.mem}</td>
                <td className="px-3 py-2 font-mono text-[12px] text-muted">{r.power}</td>
                <td className="px-3 py-2 text-[12px] text-muted">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VizFrame>
  );
}
