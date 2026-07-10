import type { Chapter } from "@/components/slide/types";
import { FrameworkMap } from "@/components/viz/FrameworkMap";

export const ch08: Chapter = {
  id: "ch08",
  number: 8,
  part: 2,
  slug: "frameworks",
  title: "Frameworks and ecosystem",
  subtitle: "Libraries that implement the training loop",
  slides: [
    {
      id: "ch08-00",
      title: "Why frameworks",
      eyebrow: "Abstraction",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            You know the train loop from chapter 5, architecture families from chapter 6, and
            convolution blocks from chapter 7. A framework implements that loop on GPU: automatic
            differentiation, tensor kernels, data loaders, and checkpointing. Without this stack,
            every project would reimplement backprop and CUDA bindings.
          </p>
        </div>
      ),
    },
    {
      id: "ch08-01",
      title: "Python data stack",
      eyebrow: "Classical ML",
      layout: "prose",
      content: (
        <ul className="space-y-2 text-[15px]">
          <li><strong>NumPy</strong> — ndarray, linear algebra</li>
          <li><strong>Pandas</strong> — tabular data frames</li>
          <li><strong>SciPy</strong> — optimisation, statistics</li>
          <li><strong>scikit-learn</strong> — classical algorithms from chapter 4</li>
        </ul>
      ),
    },
    {
      id: "ch08-02",
      title: "Deep learning frameworks",
      eyebrow: "Neural nets",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            <strong>PyTorch</strong> — default in research and industry. Eager execution, dynamic
            graphs, strong ecosystem.
          </p>
          <p>
            <strong>TensorFlow / Keras</strong> — production deployment, TFLite.{" "}
            <strong>JAX</strong> — functional autograd, research at scale.
          </p>
          <p className="text-muted">
            All expose: tensor ops → autograd → optimiser step. Chapter 5 PyTorch snippet is the
            minimal pattern.
          </p>
        </div>
      ),
      viz: <FrameworkMap />,
    },
    {
      id: "ch08-03",
      title: "Model hubs and deployment",
      eyebrow: "Reuse",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 text-[15px]">
            <li>
              <strong>Hugging Face Hub</strong> — pretrained weights, configs, datasets
            </li>
            <li>
              <strong>ONNX</strong> — exchange format between frameworks
            </li>
            <li>
              <strong>TensorRT</strong> — NVIDIA inference optimisation (chapter 14)
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "ch08-04",
      title: "MLOps tooling",
      eyebrow: "Workflow",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 text-[15px]">
            <li><strong>MLflow</strong> — experiment tracking, model registry</li>
            <li><strong>Weights & Biases</strong> — metrics, hyperparameter sweeps</li>
            <li><strong>DVC</strong> — data and model versioning in git</li>
          </ul>
          <p className="text-muted">Chapter 13 expands the full training lifecycle.</p>
        </div>
      ),
    },
    {
      id: "ch08-05",
      title: "Chapter summary",
      eyebrow: "Summary",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Black Bee stack:</strong> PyTorch via Ultralytics (YOLO) and Hugging Face
            Transformers (DETR, RF-DETR) inside Nectar (chapter 15).
          </p>
          <p>Next: chapter 9 — computer vision tasks.</p>
        </div>
      ),
    },
  ],
};
