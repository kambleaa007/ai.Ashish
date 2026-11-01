# AGENTS.md — Transformers-DeepDive

Guidance for AI coding agents working in this project.

## Project purpose

Teach PyTorch, Transformer architecture, fine-tuning, and deep-research into Qwen/Gemma by building everything from scratch. No black-box `Trainer.train()` without first knowing what's inside.

## Conventions

- Python 3.14, standard library + PyTorch only where possible. Avoid heavy HF abstractions in modules 01–02 so the math stays visible.
- One concept per file. File names are lowercase_with_underscores.
- Every public function/class needs a docstring explaining *what*, *why* (math), and *shape* of inputs/outputs (e.g. `(batch, seq, d_model)`).
- Shapes must be documented with comments on non-obvious tensor transformations (`einops`-style rearrange comments are encouraged but `einops` is not a hard dependency).
- Deterministic: set seeds (`torch.manual_seed`, `random.seed`, `numpy.seed`) in training scripts.
- Device agnostic: use `device = torch.device("cuda" if torch.cuda.is_available() else "cpu")`; move all tensors/modules explicitly.

## Module rules

1. `01_pytorch_fundamentals`: pure PyTorch, no transformer logic.
2. `02_transformer_from_scratch`: implement attention/norm/MLP/block/model from `torch.nn` primitives only. Do not import `transformers` or `nn.Transformer`.
3. `03_fine_tuning`: may import `transformers`, `peft`, `datasets` for real SFT/LoRA, but must also include a from-scratch LoRA implementation for comparison.
4. `04_architecture_research`: markdown notes + optional small scripts that print model config/hyperparameters from HF `AutoConfig`. No training here.

## Verification

- Run `pip install -r requirements.txt` before suggesting code that imports new packages.
- For any training script, confirm it runs on CPU with a tiny config (fast test), then note GPU requirement for full runs.
- Prefer printing tensor shapes at runtime over static assertions for teaching clarity.

## Do not

- Do not commit secrets or HF tokens.
- Do not download multi-GB model weights by default; use tiny configs or `torch.random` init for from-scratch modules.
- Do not add comments explaining obvious syntax; do add comments explaining *why* a shape changes or *why* a hyperparameter exists.
