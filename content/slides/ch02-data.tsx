import type { Chapter } from "@/components/slide/types";
import { DataPipeline } from "@/components/viz/DataPipeline";
import { DatasetWorkflow } from "@/components/viz/DatasetWorkflow";
import { TabularDataViz } from "@/components/viz/TabularDataViz";
import { ImagePixelGrid } from "@/components/viz/ImagePixelGrid";
import { RGBChannels } from "@/components/viz/RGBChannels";
import { TextTokenViz } from "@/components/viz/TextTokenViz";
import { AudioSpectrogramViz } from "@/components/viz/AudioSpectrogramViz";
import { VideoClipViz } from "@/components/viz/VideoClipViz";
import { DataModalities } from "@/components/viz/DataModalities";
import { NoiseVsClean } from "@/components/viz/NoiseVsClean";
import { SplitBar } from "@/components/viz/SplitBar";
import { ParetoCurve } from "@/components/viz/ParetoCurve";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch02: Chapter = {
  id: "ch02",
  number: 2,
  part: 1,
  slug: "data",
  title: "Data",
  subtitle: "Fuel, representation, and preparation",
  slides: [
    {
      id: "ch02-00",
      title: "Data as fuel",
      eyebrow: "Foundation",
      layout: "prose",
      content: (
        <div className="space-y-5">
          <p>
            Models learn patterns from the examples they are exposed to. Each training example pairs
            an <strong>input</strong> (image, sensor reading, text) with a <strong>label</strong>{" "}
            (class name, bounding box, mask, or numeric target). Quality and quantity of data
            determine what the model can learn — not architecture alone.
          </p>
          <ul className="space-y-2 text-[15px]">
            <li>· Models generalise patterns seen in training data; they cannot invent what was never shown</li>
            <li>· Poor labels, biased sampling, or missing edge cases cannot be fixed by a bigger network</li>
            <li>· Different modalities (image, tabular, text, audio, video) need specialised preprocessing</li>
            <li>· Data collection, cleaning, and labelling often consume most of project time (~80%)</li>
          </ul>
          <p className="text-muted">
            Chapter 3 covers how we learn from labelled examples. First: what data looks like and how
            we prepare it.
          </p>
        </div>
      ),
    },
    {
      id: "ch02-01",
      title: "Preprocessing pipeline",
      eyebrow: "Workflow",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>Every project follows the same five stages before training starts:</p>
          <div className="space-y-3">
            {[
              {
                stage: "Collect",
                items: ["extract frames from flight MP4", "log IMU / GPS / baro streams", "version raw captures"],
              },
              {
                stage: "Clean",
                items: ["drop blurry or underexposed frames", "remove near-duplicate images", "fix obvious mislabels"],
              },
              {
                stage: "Transform",
                items: ["letterbox to model input size (e.g. 640)", "normalise pixel values or tokenise text", "resample audio to fixed rate"],
              },
              {
                stage: "Split",
                items: ["train / validation / test", "stratify by class where possible", "keep all frames from one flight in the same split"],
              },
              {
                stage: "Validate",
                items: ["check tensor shapes and file formats", "audit train/test leakage", "review class balance"],
              },
            ].map((s) => (
              <div key={s.stage}>
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-honey">{s.stage}</div>
                <ul className="mt-1 space-y-0.5 text-muted">
                  {s.items.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ),
      viz: <DataPipeline />,
    },
    {
      id: "ch02-02",
      title: "Tabular data",
      eyebrow: "Modality",
      layout: "scrollSplit",
      content: (
        <div className="space-y-5 text-[14px]">
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Representation</h3>
            <p className="mt-2">
              A table of <M>N</M> rows (samples) and <M>F</M> columns (features). Shape{" "}
              <M>{"(N, F)"}</M>. One column is the <strong>target</strong> — what we predict. Numeric
              and categorical columns coexist.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Preprocessing</h3>
            <ul className="mt-2 space-y-1 text-muted">
              <li>· <strong>Missing values</strong> — impute with mean/median/mode, or drop rows</li>
              <li>· <strong>Scaling</strong> — z-score standardisation or min-max to <M>[0,1]</M></li>
              <li>· <strong>Categorical encoding</strong> — one-hot or label encoding</li>
            </ul>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Applications</h3>
            <ul className="mt-2 space-y-1 text-muted">
              <li>· Classification — credit approval, fraud detection</li>
              <li>· Regression — price prediction, risk scoring</li>
              <li>· Clustering — customer segmentation, anomaly detection</li>
            </ul>
            <Callout label="Black Bee">
              IMU, GPS, and barometer telemetry during flights — altitude, velocity, attitude for
              state estimation and anomaly checks.
            </Callout>
          </section>
        </div>
      ),
      viz: <TabularDataViz />,
    },
    {
      id: "ch02-03",
      title: "Image data — pixels to tensor",
      eyebrow: "Modality",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Representation</h3>
            <MBlock>{"X \\in \\mathbb{R}^{H \\times W \\times C}"}</MBlock>
            <p>
              Each pixel stores intensity (greyscale, <M>{"C=1"}</M>) or three colour channels (RGB,{" "}
              <M>{"C=3"}</M>). The visual image and its numeric matrix are the same data — hover
              pixels on the right to see the correspondence.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Applications</h3>
            <p className="text-muted">
              Classification, detection, segmentation — the primary modality for Black Bee perception.
            </p>
          </section>
        </div>
      ),
      viz: <ImagePixelGrid />,
    },
    {
      id: "ch02-04",
      title: "Image data — preprocessing",
      eyebrow: "Modality",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Preprocessing</h3>
            <ul className="space-y-2">
              <li>
                · <strong>Resize / letterbox</strong> — fit variable camera resolutions to fixed
                model input (e.g. 640×640) without distorting aspect ratio
              </li>
              <li>
                · <strong>Normalisation</strong> — scale to <M>[0,1]</M> or subtract dataset mean and
                divide by std per channel
              </li>
              <li>
                · <strong>Colour order</strong> — OpenCV loads BGR; most models expect RGB
              </li>
              <li>
                · <strong>Batch layout</strong> — PyTorch expects <M>{"(N, C, H, W)"}</M>
              </li>
            </ul>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">OpenCV bridge</h3>
            <p className="text-muted">
              In the CV class you applied fixed kernels (Sobel edges, Gaussian blur). CNNs learn
              similar filters from data instead of hand-designing them.
            </p>
          </section>
        </div>
      ),
      viz: <RGBChannels />,
    },
    {
      id: "ch02-05",
      title: "Text data",
      eyebrow: "Modality",
      layout: "scrollSplit",
      content: (
        <div className="space-y-5 text-[14px]">
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Representation</h3>
            <p className="mt-2">
              Raw strings are not fed directly to models. Text becomes a sequence of integers — token
              IDs from a vocabulary. Shape <M>{"(T,)"}</M> per sample or <M>{"(N, T)"}</M> per batch
              after padding.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Preprocessing</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted">
              <li>Lowercase and clean punctuation</li>
              <li>Tokenize with BPE or WordPiece (subword units)</li>
              <li>Map tokens to integer IDs via vocabulary</li>
              <li>Pad sequences to fixed length <M>T</M>; attention masks hide padding</li>
            </ol>
            <p className="mt-2 text-muted">
              Modern models use dense <strong>embeddings</strong> instead of sparse one-hot vectors —
              similar words get nearby vectors.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Applications</h3>
            <ul className="mt-2 space-y-1 text-muted">
              <li>· Mission briefings and log parsing</li>
              <li>· CLIP-style image+text models for multimodal search</li>
            </ul>
          </section>
        </div>
      ),
      viz: <TextTokenViz />,
    },
    {
      id: "ch02-06",
      title: "Audio data",
      eyebrow: "Modality",
      layout: "scrollSplit",
      content: (
        <div className="space-y-5 text-[14px]">
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Representation</h3>
            <p className="mt-2">
              <strong>Time domain:</strong> waveform <M>{"(T,)"}</M> — amplitude sampled at rate{" "}
              <M>{"f_s"}</M> Hz (e.g. 16 kHz for speech, 44.1 kHz for music). Digital audio is a
              sequence of amplitude values at regular intervals.
            </p>
            <p className="mt-2">
              <strong>Frequency domain:</strong> FFT decomposes the signal into frequency components.
              STFT slides a window along time to get a 2D spectrogram.
            </p>
            <p className="mt-2">
              <strong>Feature input:</strong> log-mel filterbank <M>{"(F, T)"}</M> — standard for
              speech and sound classifiers.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Preprocessing</h3>
            <ul className="mt-2 space-y-1 text-muted">
              <li>· Resample to fixed <M>{"f_s"}</M></li>
              <li>· Normalise amplitude</li>
              <li>· STFT → mel filterbank → log scale</li>
            </ul>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Applications</h3>
            <ul className="mt-2 space-y-1 text-muted">
              <li>· Voice commands and speech recognition</li>
              <li>· Rotor / motor anomaly detection from acoustic signatures</li>
            </ul>
          </section>
        </div>
      ),
      viz: <AudioSpectrogramViz />,
    },
    {
      id: "ch02-07",
      title: "Video data",
      eyebrow: "Modality",
      layout: "scrollSplit",
      content: (
        <div className="space-y-5 text-[14px]">
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Representation</h3>
            <p className="mt-2">
              A clip is a stack of frames: shape <M>{"(T, H, W, C)"}</M> where <M>T</M> is the
              number of frames, <M>{"H \\times W"}</M> resolution, <M>C</M> channels per frame.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Preprocessing</h3>
            <ul className="mt-2 space-y-1 text-muted">
              <li>· Extract frames at fixed fps or subsample every <M>k</M> frames</li>
              <li>· Normalise each frame (same as image preprocessing)</li>
              <li>· Optional temporal consistency checks across frames</li>
            </ul>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Models and applications</h3>
            <ul className="mt-2 space-y-1 text-muted">
              <li>· 3D CNN or video transformer — temporal patterns in the clip</li>
              <li>· Per-frame detector + tracker — simpler, often sufficient</li>
            </ul>
            <Callout label="Black Bee">
              Flight video is stored as MP4; we extract frames and run per-frame YOLO detection.
              Tracking links detections across time.
            </Callout>
          </section>
        </div>
      ),
      viz: <VideoClipViz />,
    },
    {
      id: "ch02-08",
      title: "Modalities overview",
      eyebrow: "Recap",
      layout: "split",
      content: (
        <div className="space-y-3 text-[14px]">
          <p>Same pipeline stages, different tensor shapes and preprocessing per modality.</p>
          <div className="overflow-hidden rounded-md border border-stroke text-[12px]">
            <table className="w-full border-collapse">
              <tbody>
                {[
                  ["Tabular", "(N, F)", "IMU / GPS telemetry"],
                  ["Image", "(H, W, C)", "gate detection frames"],
                  ["Text", "(N, T) tokens", "mission logs"],
                  ["Audio", "(F, T) mel", "rotor diagnostics"],
                  ["Video", "(T, H, W, C)", "flight MP4 → frames"],
                ].map(([mod, shape, bb]) => (
                  <tr key={mod} className="border-b border-stroke">
                    <td className="px-3 py-2 font-medium">{mod}</td>
                    <td className="px-3 py-2 font-mono text-muted">{shape}</td>
                    <td className="px-3 py-2 text-muted">{bb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
      viz: <DataModalities />,
    },
    {
      id: "ch02-09",
      title: "From flights to a dataset",
      eyebrow: "Black Bee",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            This is how Black Bee turns raw flights into a trainable dataset. Chapter 12 expands
            each step with Nectar SDK code.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Collect</strong> — record flight video (MP4) from onboard camera
            </li>
            <li>
              <strong>Extract frames</strong> — sample at useful fps; discard motion-blurred frames
            </li>
            <li>
              <strong>Select</strong> — keep diverse poses, lighting, and distances to target
            </li>
            <li>
              <strong>Label in Roboflow</strong> — draw bounding boxes (detection) or polygons
              (segmentation) per class
            </li>
            <li>
              <strong>Preprocess</strong> — letterbox to model size, normalise pixels
            </li>
            <li>
              <strong>Augment</strong> — flips, hue shifts, mosaic (chapter 13)
            </li>
            <li>
              <strong>Export</strong> — YOLO or COCO format for training
            </li>
            <li>
              <strong>Split</strong> — train / val / test by flight session, not by random frame
            </li>
          </ol>
        </div>
      ),
      viz: <DatasetWorkflow />,
    },
    {
      id: "ch02-10",
      title: "What counts as noise",
      eyebrow: "Quality",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            After the Roboflow workflow above, these are the noise sources that hurt model
            performance:
          </p>
          <ul className="space-y-2">
            <li>
              · <strong>Mislabelled class</strong> — gate tagged as post; model learns the wrong
              association
            </li>
            <li>
              · <strong>Loose bounding box</strong> — box includes background; detector learns
              imprecise localisation
            </li>
            <li>
              · <strong>Blurry or dark frame kept</strong> — model sees features that will not
              appear at inference
            </li>
            <li>
              · <strong>Near-duplicate frames</strong> — inflates sample count without adding
              diversity
            </li>
          </ul>
          <MBlock>{"y_i = y_i^* + \\varepsilon_i"}</MBlock>
          <p className="text-muted">
            On Black Bee datasets, fixing box labels often moves mAP more than swapping
            architecture.
          </p>
        </div>
      ),
      viz: <NoiseVsClean />,
    },
    {
      id: "ch02-11",
      title: "Train · validation · test",
      eyebrow: "Splits",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <ul className="space-y-2">
            <li>
              · <strong>Train</strong> — fit model parameters
            </li>
            <li>
              · <strong>Validation</strong> — tune hyperparameters, pick checkpoints
            </li>
            <li>
              · <strong>Test</strong> — estimate generalisation once, at the end
            </li>
          </ul>
          <p className="text-muted">
            Split before augmenting. Never use a test frame as an augmentation source for training.
          </p>
        </div>
      ),
      viz: <SplitBar />,
    },
    {
      id: "ch02-12",
      title: "Annotation cost and sample size",
      eyebrow: "Labels",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            Labelling is expensive. Each hour in Roboflow drawing boxes has diminishing returns —
            early labels cover common poses; later labels should target hard frames and rare classes.
          </p>
          <ul className="space-y-2 text-muted">
            <li>· First 200 labels: large mAP gain on frequent classes</li>
            <li>· Next 500: smaller gains; focus on edge cases (occlusion, glare, distance)</li>
            <li>· Rare classes need explicit quota — underrepresented classes dominate failure modes</li>
          </ul>
          <p>
            <strong>Why N matters:</strong> a class with 10 examples will be missed at inference. Set
            minimum samples per class before training.
          </p>
          <p className="text-muted">Chapter 12 returns to prioritisation in the full training pipeline.</p>
        </div>
      ),
      viz: <ParetoCurve />,
    },
    {
      id: "ch02-13",
      title: "Chapter summary",
      eyebrow: "Summary",
      layout: "prose",
      content: (
        <div className="space-y-4 text-[15px]">
          <p>
            <strong>Pipeline:</strong> collect → clean → transform → split → validate.
          </p>
          <p>
            <strong>Modalities:</strong> tabular <M>{"(N,F)"}</M>, image <M>{"(H,W,C)"}</M>, text
            tokens <M>{"(N,T)"}</M>, audio log-mel <M>{"(F,T)"}</M>, video <M>{"(T,H,W,C)"}</M>.
          </p>
          <p>
            <strong>Black Bee path:</strong> flight video → frame extract → Roboflow label → resize →
            augment → export → session-aware split.
          </p>
          <p>
            <strong>Quality:</strong> label noise and leakage hurt more than model choice. Annotation
            budget should target hard cases after common poses are covered.
          </p>
          <p className="text-muted">Next: chapter 3 — learning paradigms and which algorithms fit each.</p>
        </div>
      ),
    },
  ],
};
