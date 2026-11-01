# 04_architecture_research

Deep-research notes on Qwen and Gemma architectures, mapped to Hugging Face `transformers` source.

Files:
- `qwen_architecture.md` — Qwen-1.5/2/2.5/3: RoPE base 1e6, GQA, SwiGLU, MoE, chat template.
- `gemma_architecture.md` — Gemma-1/2/3: RoPE base 1e4/1e6, GQA, GeGLU, sliding window, logit softcapping, SigLIP.
- `comparison_matrix.md` — side-by-side minutiae with source locations to verify.
- `research_questions.md` — 16 open questions to answer by reading `file:line` in HF source.

Method:
1. Pick a question in `research_questions.md`.
2. `pip install transformers`; inspect `transformers/models/qwen2/` and `transformers/models/gemma/`.
3. Write the answer + `file:line` citation in the notes.
4. Map each config field to its mathematical role (d_model, H, H_kv, rope_theta, etc.).

No training code lives here — use `AutoConfig` / `AutoModelForCausalLM` only to print hyperparameters, not to download multi-GB weights by default.