import type { Chapter } from "@/components/slide/types";
import { DataModalities } from "@/components/viz/DataModalities";
import { SplitBar } from "@/components/viz/SplitBar";
import { ParetoCurve } from "@/components/viz/ParetoCurve";
import { NoiseVsClean } from "@/components/viz/NoiseVsClean";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch02: Chapter = {
  id: "ch02",
  number: 2,
  slug: "data",
  title: "Data",
  subtitle: "The substrate of every model",
  slides: [
    {
      id: "ch02-00",
      title: "Garbage in, garbage out",
      eyebrow: "Why data first",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            A learning algorithm cannot recover signal that was never recorded.
            Same model, same underlying truth — the only thing that changes
            on the right is the noise on the labels:
          </p>
          <MBlock>{"y_i = w^* x_i + b^* + \\varepsilon_i"}</MBlock>
          <p>
            The fit drifts every time the noise is resampled. The dashed line is
            the truth; the blue line is what the model recovers.
          </p>
          <Callout label="In practice" tone="warm">
            Black Bee's biggest mAP gains usually come from re-labelling, not
            from new architectures.
          </Callout>
        </div>
      ),
      viz: <NoiseVsClean />,
    },
    {
      id: "ch02-01",
      title: "Modalities and tensor shapes",
      eyebrow: "What data looks like",
      layout: "fullViz",
      viz: <DataModalities />,
    },
    {
      id: "ch02-02",
      title: "How each modality is fed to a model",
      eyebrow: "From raw bytes to tensors",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-md border border-stroke">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-bone text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  <th className="border-b border-stroke px-4 py-3">Modality</th>
                  <th className="border-b border-stroke px-4 py-3">Encoded as</th>
                  <th className="border-b border-stroke px-4 py-3">Typical preprocessing</th>
                  <th className="border-b border-stroke px-4 py-3">Typical model</th>
                </tr>
              </thead>
              <tbody className="text-ink">
                {[
                  ["Tabular", "(N, F) floats", "normalise · one-hot · imputation", "tree ensembles · MLP"],
                  ["Image", "(H, W, C) ∈ [0, 1]", "resize · letterbox · normalise", "CNN · ViT · DETR"],
                  ["Text", "(T,) token ids", "tokenize (BPE) · pad · mask", "transformer (LLM)"],
                  ["Audio", "(T,) waveform → (F, T) spectrogram", "STFT · log-mel · normalise", "CNN · transformer · CRNN"],
                  ["Video", "(T, H, W, C)", "subsample · normalise · clip", "3D CNN · video transformer"],
                  ["Multimodal", "concatenated embeddings", "shared latent · contrastive", "CLIP · LLaVA"],
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
          <Callout label="What we use">
            Black Bee missions are mostly <strong>image</strong> and{" "}
            <strong>video</strong> from on-board cameras, with{" "}
            <strong>tabular</strong> telemetry alongside (IMU, GPS, baro). All
            three plug into the same SDK.
          </Callout>
        </div>
      ),
    },
    {
      id: "ch02-03",
      title: "Train · validation · test",
      eyebrow: "Splits & leakage",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            The training set fits the parameters, the validation set tunes the
            hyperparameters, the test set is an honest estimate of generalisation.
            Test data is opened once and never again.
          </p>
          <p className="text-muted">
            Stratification keeps the class distribution balanced across splits —
            vital for our drone datasets where rare classes would otherwise
            concentrate in one split.
          </p>
          <Callout label="Leakage">
            If any test image, frame, or augmentation is also in train, your
            reported mAP is fiction. Split <em>before</em> augmenting.
          </Callout>
        </div>
      ),
      viz: <SplitBar />,
    },
    {
      id: "ch02-04",
      title: "Annotation has a price",
      eyebrow: "Pareto",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Doubling annotation does not double accuracy. The first thousand
            labels buy most of the gain; later labels pay diminishing returns
            unless they target rare cases or new conditions.
          </p>
          <MBlock>{"\\text{mAP}(N) \\approx \\text{mAP}_\\infty\\,\\big(1 - e^{-N/N_0}\\big)"}</MBlock>
          <p className="text-muted">
            Spend hours on hard frames, not easy ones — chapter 9 returns to this
            with active augmentation and rare-class prioritisation.
          </p>
        </div>
      ),
      viz: <ParetoCurve />,
    },
  ],
};
