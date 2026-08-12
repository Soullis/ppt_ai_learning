# Content style guide

Internal reference for slide copy in `content/slides/`.

## Tone

- Technical and precise. Name papers, dates, and benchmarks.
- No marketing language: avoid "revolutionary", "game-changing", "unlock", "powerful".
- Prefer "reported on COCO val2017" over "state of the art".
- Eyebrows are section labels (`Definitions`, `Convolution`, `Metrics`), not slogans.

## Structure

- One canonical slide per concept (perceptron, backprop, LeNet, ResNet).
- Forward references only to chapters already covered in the lesson path.
- `tier: "core"` — live lesson. `reference` / `deep` — self-study.

## Math

- Use `M` for inline, `MBlock` for display equations.
- Define symbols on first use in each chapter.

## Links

- Prefer primary sources: arXiv, official docs, dataset sites.
- Hedge team numbers: "illustrative", "on Orin Nano", etc.

## Layout

- Dense tables and CLI tours: `scrollProse`.
- Conv/detection animations: `wideViz` or `fullViz`.
- Interactive viz: caption via `VizFrame`.
