# Gemma Architecture Deep Dive

Target models: Gemma-1 (2B/7B), Gemma-2 (2B/9B/27B), Gemma-3 (1B/4B/12B/27B, multimodal).
Source to read alongside these notes: Hugging Face `transformers/src/transformers/models/gemma/`.

## 1. High-level family tree
- Gemma-1: dense decoder-only, RoPE base 10000, GQA, GeGLU, vocab 256k (SentencePiece).
- Gemma-2: adds GQA (more aggressive), sliding-window attention (4096), logit softcapping (final=30, attn=...), RoPE base 10000, interleaved local/global layers.
- Gemma-3: multimodal (text+image), sliding window + local/global attention, RoPE base 1e6 (supports 128k ctx), SigLIP vision encoder + Perceiver resampler.

All are **causal decoder-only**: next-token prediction, left-to-right mask.

## 2. Block structure

Pre-norm residual (Gemma uses `pre_feedforward_layernorm` / `post_attention_layernorm` naming):
```
h = x + Attn(attention_layernorm(x))
out = h + MLP(feedforward_layernorm(x))
```
Gemma RMSNorm: `eps = 1e-6`, no bias, `weight` initialized to ones.

Layer ordering per block:
1. input_layernorm (RMSNorm)
2. self_attn (GQA + RoPE + optional sliding window)
3. post_attention_layernorm
4. mlp (GeGLU)
5. residual adds

Final: `norm` (RMSNorm) → `lm_head`.

## 3. Attention

- GQA: `num_key_value_heads` < `num_attention_heads`. Gemma-2-9B: 16 query heads, 8 KV heads (rep=2). Gemma-2-27B: 32 query, 16 KV.
- Head dim: `head_dim = hidden_size / num_attention_heads` (e.g. 256).
- Gemma attention uses **logit softcapping** (Gemma-2): attention logits divided by `attn_logit_softcap` then tanh-scaled before softmax:
  ```
  attn = softmax( tanh(QK^T / sqrt(d_h) / attn_logit_softcap) * attn_logit_softcap )
  ```
  This prevents logits from growing too large and improves training stability / FP8.
- Sliding-window attention (Gemma-2+): every even layer uses local window (`sliding_window = 4096`), odd layers use global. Reduces memory for long context.
- RoPE: base 10000 (Gemma-1/2), base 1e6 (Gemma-3). No `rope_scaling` by default; Gemma-3 extends via long-context RoPE.

Math per head (Gemma-2):
```
Q, K, V = projections
Q', K' = RoPE(Q), RoPE(K)
scores = Q' K'^T / sqrt(d_h)
scores = tanh(scores / attn_logit_softcap) * attn_logit_softcap   # Gemma-2 softcap
scores = causal_mask(scores)
attn = softmax(scores)
out = attn V
```

## 4. MLP (GeGLU)

Gemma-1 uses GeGLU:
```
FFN(x) = W_down * (gelu(W_gate x) * (W_up x))
```
Gemma-2 may use GeGLU too (verify per variant). Intermediate size (`intermediate_size`) is typically much larger than hidden (e.g. hidden 2304 → intermediate 9216? Gemma-2-9B: hidden 3584, intermediate 14336 ≈ 4×). Actually GeGLU intermediate often ≈ (8/3)·hidden rounded.

- `gate_proj`, `up_proj`, `down_proj`, all bias=False.

## 5. Normalization

RMSNorm with `eps = 1e-6`. Gemma names norms:
- `input_layernorm` before attention
- `post_attention_layernorm` after attention (before MLP)
- `norm` final before lm_head

No bias in any Linear (`bias=False` across the board in Gemma-2).

## 6. Embeddings & output head

- `tie_word_embeddings = False` in Gemma (separate lm_head) — verify.
- Vocab: 256,000 tokens, SentencePiece (Unigram LM), no byte fallback by default.
- `logit_softcap` (final): Gemma-2 applies tanh softcap to final logits:
  ```
  logits = tanh(logits / logit_softcap) * logit_softcap   # logit_softcap = 30.0
  ```
  This directly affects generation temperature behavior — higher softcap → sharper logits.

## 7. Chat template (Gemma)

Gemma instruction models use a specific format:
```
<bos><start_of_turn>user
{prompt}<end_of_turn>
<start_of_turn>model
{response}<end_of_turn>
```
Fine-tuning: mask user + system tokens (-100), train on model turn only. Same pattern as module-03 SFT.

## 8. Gemma-3 specifics (multimodal)

- Vision: SigLIP vision encoder → image tokens → Perceiver resampler → projected into text embedding space.
- Text backbone: same as Gemma-2 (GQA, sliding window, RoPE base 1e6).
- Attention alternates: local sliding-window layers and global layers; image tokens attend globally.
- Context up to 128k tokens.

## 9. Gemma vs Qwen — side-by-side minutiae

| Aspect | Qwen (2/2.5) | Gemma (2/3) |
|--------|-----------|-------------|
| RoPE base | 1,000,000 | 10,000 (1/2), 1e6 (3) |
| Activation | SwiGLU | GeGLU (1/2) |
| Norm | RMSNorm eps=1e-6 | RMSNorm eps=1e-6 |
| Bias in Linear | False | False |
| tie_word_embeddings | False | False |
| GQA | yes (H_kv < H) | yes |
| Sliding window | some variants | yes (Gemma-2+, even layers) |
| Logit softcap | no | yes (attn + final, Gemma-2) |
| Vocab | ~151k tiktoken | 256k SentencePiece |
| MoE | Qwen-2.5/3 MoE variants | no (dense) |
| Multimodal | Qwen-VL (mRoPE) | Gemma-3 (SigLIP + Perceiver) |

## 10. Configuration fields to verify

| Field | Gemma-2 typical | Meaning |
|-------|-----------------|---------|
| hidden_size | 3584 (9B) | d_model |
| num_attention_heads | 16 (9B) | H |
| num_key_value_heads | 8 (9B) | H_kv |
| head_dim | 256 | hidden/H |
| intermediate_size | 14336 (9B) | GeGLU width |
| num_hidden_layers | 40 (9B) | L |
| max_position_embeddings | 8192 | T |
| rope_theta | 10000 | RoPE base |
| sliding_window | 4096 | local window |
| attn_logit_softcap | 30.0 | attention logit cap |
| final_logit_softcap | 30.0 | output logit cap |
| rms_norm_eps | 1e-6 | norm epsilon |

## 11. Verification task

Open `transformers/models/gemma/modeling_gemma.py` and annotate:
1. `GemmaRMSNorm.forward` — confirm no bias, eps usage.
2. `GemmaAttention.forward` — RoPE application, `repeat_kv` for GQA, sliding-window mask construction, `attn_logit_softcap`.
3. `GemmaMLP.forward` — GeGLU order: `gelu(gate) * up`, then `down`.
4. `GemmaForCausalLM.forward` — `final_logit_softcap` applied to lm_head output.
5. Config mapping: which fields control sliding window vs global layers (layer pattern).
