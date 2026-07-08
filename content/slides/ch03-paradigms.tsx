import type { Chapter } from "@/components/slide/types";
import { ScatterFit } from "@/components/viz/ScatterFit";
import { KMeans } from "@/components/viz/KMeans";
import { AgentEnvLoop } from "@/components/viz/AgentEnvLoop";
import { MaskedPatch } from "@/components/viz/MaskedPatch";
import { FoundationModelStack } from "@/components/viz/FoundationModelStack";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch03: Chapter = {
  id: "ch03",
  number: 3,
  part: 1,
  slug: "paradigms",
  title: "Learning paradigms",
  subtitle: "What you are given and what you optimise",
  slides: [
    {
      id: "ch03-00",
      title: "Algorithms and paradigms",
      eyebrow: "Introduction",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            A <strong>paradigm</strong> defines what information the algorithm receives. An{" "}
            <strong>algorithm</strong> is a concrete method within that paradigm (linear regression,
            k-means, CNN, PPO).
          </p>
          <p className="text-muted">Most Black Bee perception is supervised learning on images.</p>
        </div>
      ),
    },
    {
      id: "ch03-01",
      title: "The four families",
      eyebrow: "Overview",
      layout: "scrollProse",
      content: (
        <div className="overflow-hidden rounded-md border border-stroke">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-bone text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                <th className="border-b border-stroke px-4 py-3">Paradigm</th>
                <th className="border-b border-stroke px-4 py-3">Given</th>
                <th className="border-b border-stroke px-4 py-3">Key algorithms</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {[
                ["Supervised", "(x, y) pairs", "linear/logistic regression · trees · SVM · kNN · CNN · DETR"],
                ["Unsupervised", "x only", "k-means · PCA · GMM · autoencoders"],
                ["Self-supervised", "x + pretext task", "MAE · SimCLR · DINO · CLIP · BERT"],
                ["Reinforcement", "states, actions, reward", "DQN · PPO · SAC"],
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
      ),
    },
    {
      id: "ch03-02",
      title: "Supervised learning",
      eyebrow: "Paradigm",
      layout: "split",
      content: (
        <div className="space-y-4">
          <MBlock>
            {"\\theta^* = \\arg\\min_\\theta \\frac{1}{N}\\sum_{i=1}^{N} \\ell\\big(f_\\theta(x_i), y_i\\big)"}
          </MBlock>
          <ul className="space-y-2 text-[14px]">
            <li><strong>Regression</strong>: the target <M>y</M> is a number, for example linear regression trained with MSE</li>
            <li><strong>Classification</strong>: the target is a discrete label, for example logistic regression trained with cross entropy</li>
            <li><strong>Structured</strong>: the target has internal structure, for example boxes in detection or masks in segmentation</li>
          </ul>
          <p className="text-muted">
            Fitting a line through noisy points by minimising the squared error, shown on the right,
            is the simplest instance of this objective. Chapter 4 covers the algorithms in detail.
          </p>
        </div>
      ),
      viz: <ScatterFit />,
    },
    {
      id: "ch03-03",
      title: "Unsupervised learning",
      eyebrow: "Paradigm",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>Only inputs <M>{"\\{x_i\\}"}</M> are given, with no target to predict. The goal is to find structure in the data itself: clusters, a lower dimensional representation, or a density.</p>
          <ul className="space-y-2 text-[14px]">
            <li><strong>Clustering</strong>: group similar points together, for example k-means, DBSCAN</li>
            <li><strong>Dimensionality reduction</strong>: represent the data with fewer numbers, for example PCA, UMAP</li>
            <li><strong>Density estimation</strong>: model how the data is distributed, for example Gaussian mixture models</li>
          </ul>
          <p className="text-muted">
            The animation on the right steps through k-means: assign each point to the nearest
            centroid, then move each centroid to the mean of its assigned points.
          </p>
        </div>
      ),
      viz: <KMeans />,
    },
    {
      id: "ch03-04",
      title: "Self-supervised learning",
      eyebrow: "Paradigm",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>The labels are generated from the data itself instead of being collected by hand. The model is given a pretext task: predict something that was deliberately hidden or transformed.</p>
          <ul className="space-y-2 text-[14px]">
            <li>MAE, SimCLR, DINO learn image representations from masked patches or contrastive pairs</li>
            <li>CLIP aligns images with their captions</li>
            <li>BERT and GPT predict masked or next tokens in text</li>
          </ul>
          <p className="text-muted">
            On the right, MAE hides random patches and trains the network to reconstruct them. This
            is one specific pretext task. DINOv2, a self-supervised vision transformer, is the
            backbone in RF-DETR (chapter 10).
          </p>
        </div>
      ),
      viz: <MaskedPatch />,
    },
    {
      id: "ch03-05",
      title: "Reinforcement learning",
      eyebrow: "Paradigm",
      layout: "split",
      content: (
        <div className="space-y-4">
          <MBlock>{"J(\\pi) = \\mathbb{E}_\\pi\\!\\left[\\sum_{t=0}^{T} \\gamma^t r_t\\right]"}</MBlock>
          <p>Value-based (DQN), policy-based (PPO), actor-critic (SAC). Used in robotics control research.</p>
        </div>
      ),
      viz: <AgentEnvLoop />,
    },
    {
      id: "ch03-05a",
      title: "Foundation models combine paradigms",
      eyebrow: "Synthesis",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Large language models are not one paradigm. They stack the four you just learned into a
            training pipeline:
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-[14px]">
            <li>
              <strong>Pretraining</strong>: self-supervised next-token prediction on trillions of
              unlabelled tokens builds a general-purpose base model
            </li>
            <li>
              <strong>Supervised fine-tuning (SFT)</strong>: curated instruction and response pairs
              teach the model to follow instructions
            </li>
            <li>
              <strong>RLHF</strong>: reinforcement learning from human (or AI) feedback shapes tone,
              safety, and preference beyond what SFT alone can specify
            </li>
          </ol>
          <Callout label="Yann LeCun's cake analogy">
            &quot;If intelligence is a cake, the bulk is self-supervised learning, the icing is
            supervised learning, and the cherry on top is reinforcement learning.&quot;
          </Callout>
          <p className="text-muted">
            The same idea applies to RF-DETR: a DINOv2 self-supervised backbone, fine-tuned with
            supervised detection labels. Chapter 10 covers this.
          </p>
        </div>
      ),
      viz: <FoundationModelStack />,
    },
    {
      id: "ch03-10",
      title: "Chapter summary",
      eyebrow: "Summary",
      layout: "prose",
      content: (
        <div className="space-y-3 text-[15px]">
          <p>A paradigm is what data you have. An algorithm is how you optimise it.</p>
          <ul className="space-y-2 text-[14px]">
            <li>Labels available: supervised, this covers most Black Bee perception (gates, drones, posts)</li>
            <li>Structure without labels: unsupervised, useful for calibration and telemetry anomalies</li>
            <li>Many unlabelled frames and few labels: self-supervised pretraining, then supervised fine-tuning</li>
          </ul>
          <p className="text-muted">Next: chapter 4, classical supervised algorithms before neural networks.</p>
        </div>
      ),
    },
  ],
};
