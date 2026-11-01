# Qwen vs Gemma — Comparison Matrix

Read both model sources in parallel. For each row, find the exact line in source.

| # | Detail | Qwen (2/2.5/3) | Gemma (1/2/3) | Where to verify |
|---|--------|----------------|---------------|-----------------|
| 1 | Family | Tongyi (Alibaba) | Google DeepMind | config.json `model_type` |
| 2 | Block layout | Pre-norm RMSNorm | Pre-norm RMSNorm | modeling_*.py block |
| 3 | Norm eps | 1e-6 | 1e-6 | RMSNorm __init__ |
| 4 | Linear bias | False | False | nn.Linear(bias=...) |
| 5 | Attention | GQA | GQA | num_key_value_heads |
| 6 | RoPE base | 1e6 | 1e4 (1/2), 1e6 (3) | rope_theta |
| 7 | Activation | SwiGLU | GeGLU | MLP forward |
| 8 | Sliding window | variants only | Gemma-2+ (even layers) | sliding_window config |
| 9 | Logit softcap | no | yes (attn + final) | logit_softcap |
| 10 | tie_word_embeddings | False | False | config |
| 11 | Vocab size | ~151k (tiktoken/BPE) | 256k (SentencePiece) | vocab.json / tokenizer.json |
| 12 | Special chat tokens | im_start/im_end | start_of_turn/end_of_turn | tokenizer chat template |
| 13 | MoE | Qwen-2.5/3 MoE variants | dense only | num_experts in config |
| 14 | Multimodal | Qwen-VL (mRoPE) | Gemma-3 (SigLIP+Perceiver) | modeling_vl.py |
| 15 | Context (train) | 32k–1M | 8k–128k | max_position_embeddings |

## Minute-detail cross-checks

1. **RoPE interleaving**: Qwen rotates pairs (x[0::2], x[1::2]); confirm Gemma does the same or uses GPT-NeoX style (x[:d/2], x[d/2:]).
2. **GQA repetition**: both use `repeat_kv` — confirm the repeat axis and whether it's `repeat_interleave` or `expand`.
3. **MLP intermediate size rounding**: Qwen rounds to 256; Gemma may differ — find the formula.
4. **Softcap placement**: Gemma applies softcap inside attention and at the final logits — Qwen does not; measure the effect on generation entropy.
5. **Weight tying**: confirm both set `tie_word_embeddings=False`; if True, `lm_head.weight = embed_tokens.weight`.

## How to run the cross-check

```python
from transformers import AutoConfig, AutoModelForCausalLM
qwen = AutoConfig.from_pretrained("Qwen/Qwen2-7B")
gemma = AutoConfig.from_pretrained("google/gemma-2-9b")
for k in sorted(set(vars(qwen)) | vars(gemma)):
    print(k, "| Qwen:", getattr(qwen, k, None), "| Gemma:", getattr(gemma, k, None))
```
