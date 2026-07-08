---
title: AI Learning
emoji: 🐝
colorFrom: yellow
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
short_description: From perceptrons to the Nectar SDK detection workflow.
---

# AI Learning — Black Bee Drones

A Next.js + TypeScript presentation that walks from "what is AI" to a deep
tour of the [Nectar SDK](https://github.com/Black-Bee-Drones/nectar-sdk)
detection workflow. Designed as a live, in-room talk to a teammate joining
from the hardware side.

Hosted at <https://huggingface.co/spaces/blackbeedrones/ai-learning>.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build identical to what the Space runs:

```bash
docker build -t ai-learning .
docker run --rm -p 7860:7860 ai-learning
# open http://localhost:7860
```

## Navigation

- **Cover** (`/`) lists every chapter.
- Inside a chapter:
  - `→` / `Space` — next slide (rolls into next chapter at the end)
  - `←` — previous slide
  - `↑` / `↓` — previous / next chapter
  - Dots in the footer — jump to a specific slide

## Layout

```
ai-learning/
├─ app/                          # Next.js App Router
│  ├─ page.tsx                   # Cover
│  └─ chapter/[slug]/page.tsx    # SlideRunner over a chapter manifest
├─ content/
│  ├─ chapters.ts                # Ordered chapter list
│  └─ slides/                    # One .tsx per chapter, slide objects
├─ components/
│  ├─ chrome/                    # SlideChrome · ProgressDots · CoverKeys
│  ├─ slide/                     # Slide · SlideRunner
│  ├─ math/                      # KaTeX wrappers
│  ├─ ui/                        # Kbd · Callout · CodeBlock
│  └─ viz/                       # ≈ 30 visualisation primitives
├─ lib/
│  ├─ hooks/                     # useKey · useReducedMotion · useInView
│  └─ utils.ts
├─ Dockerfile                    # HF Space build (Node 20-slim)
├─ next.config.mjs               # output: "standalone"
└─ tailwind.config.ts
```

## Chapters (15, five parts)

| Part | #  | Slug                    | Title                       |
|------|----|-------------------------|-----------------------------|
| I    | 1  | `what-is-ai`            | What is AI                  |
| I    | 2  | `data`                  | Data                        |
| I    | 3  | `paradigms`             | Learning paradigms          |
| II   | 4  | `classical-ml`          | Classical machine learning  |
| II   | 5  | `deep-learning`         | Deep learning foundations   |
| II   | 6  | `frameworks`            | Frameworks and ecosystem    |
| II   | 7  | `convolutional-networks`| Convolutional networks      |
| III  | 8  | `cv-tasks`              | Computer vision tasks       |
| III  | 9  | `classification`        | Image classification        |
| IV   | 10 | `detection`             | Object detection            |
| IV   | 11 | `segmentation`          | Segmentation                |
| V    | 12 | `lifecycle`             | Training and evaluation     |
| V    | 13 | `deployment`            | Deployment to the edge      |
| V    | 14 | `nectar`                | The Nectar AI module        |
| V    | 15 | `references`            | References                  |

## Lesson path

- Cover offers **Lesson path** (`?path=lesson`) for core slides only.
- **Full deck** includes reference and deep-dive slides for self-study.
- See `content/STYLE.md` for copy conventions.


## Stack

- Next.js 14 (App Router) + TypeScript, strict mode
- Tailwind CSS with custom design tokens
- Framer Motion for transitions and primitive animations
- KaTeX for inline / block math
- HTML Canvas for the convolution, augmentation gallery, loss surface,
  decision boundary
- D3 reserved for future curves (light dependency)

## Editing content

Each chapter lives in `content/slides/chXX-*.tsx` as an array of `Slide`
objects. To add or reorder slides, edit the array — no router changes
needed. The slide manifest contract is in `components/slide/types.ts`.

## Reduced motion

Auto-running animations (loss surface, convolution, augmentations, agent
loop, gradient descent) honour `prefers-reduced-motion: reduce` and either
freeze on a representative frame or stop iterating.

## License

For internal Black Bee Drones use.
