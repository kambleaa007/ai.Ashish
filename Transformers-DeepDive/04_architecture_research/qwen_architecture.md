# Qwen Architecture Deep Dive

Target models: Qwen-1.5 / Qwen-2 / Qwen-2.5 / Qwen-3 (dense + MoE).
Source to read alongside these notes: Hugging Face `transformers/src/transformers/models/qwen2/`.

## 1. High-level family tree
- Qwen-1 / Qwen-1.5: dense decoder-only, ~0.5B–72B, RoPE, GQA, SwiGLU.
- Qwen-2: dense decoder-only, 0.5B–72B, larger vocab (~151k tiktoken), RoPE base 1e6, 32k–128k ctx.
- Qwen-2.5: dense + MoE (Qwen2.5-32B-MoE etc.), up to 1M ctx (long context), same core blocks.
- Qwen-3: dense + MoE, more aggressive GQA, independent head_dim per variant, same RoPE.

All are **causal decoder-only language models**: next-token prediction, left-to-right attention mask.

## 2. Block structure (per layer)

Pre-norm residual (like LLaMA):
```
h = x + Attn(RMSNorm(x))
out = h + MLP(RMSNorm(h))
```
No bias in Linear layers unless noted. RMSNorm applied before attention and MLP (Qwen uses RMSNorm, not LayerNorm).

## 3. Attention

- Type: Grouped-Query Attention (GQA). `num_key_value_heads` < `num_attention_heads`.
  Example Qwen2-72B: 80 query heads, 8 KV heads → each KV head shared by 10 query heads.
- Head dimension: `head_dim = hidden_size / num_attention_heads` (e.g. 128).
- Projections: `q_proj`, `k_proj`, `v_proj`, `o_proj`, all `bias=False` typically.
- Causal mask: upper triangle `-inf`; position i attends to j <= i.
- RoPE applied to Q and K (not V).

RoPE details (Qwen):
- Base frequency `rope_theta = 1,000,000` (much larger than LLaMA's 10,000 → supports long context).
- Frequencies: `inv_freq[i] = theta^(-2i/d)`, i in [0, d/2).
- Position m paired with rotation m·inv_freq.
- Qwen2 uses `rope_scaling` (linear / dynamic) to extend beyond training context.
- Qwen2-VL uses `mrope` (multimodal RoPE) with separate frequency slices for image/text.

Math for one head:
```
Q = X W_Q, K = X W_K, V = X W_V            # (B,T,H,d_h)
Q', K' = RoPE(Q), RoPE(K)
attn = softmax( (Q' K'^T) / sqrt(d_h) ) masked
out  = attn V                              # (B,T,H,d_h) -> merge -> W_O
```

## 4. MLP (SwiGLU)

Qwen uses SwiGLU (Shazeer 2020):
```
FFN(x) = W_down * (swish(W_gate x) * (W_up x))
swish(z) = z * sigmoid(z)
```
- `up_proj` (W_up): d_model → intermediate (typically 8/3 × d_model rounded to 256 multiple)
- `gate_proj` (W_gate): d_model → intermediate
- `down_proj` (W_down): intermediate → d_model
- No bias. Intermediate size is larger than LLaMA's FFN (SwiGLU uses 2 matrices of intermediate size).

## 5. Normalization

RMSNorm:
```
RMSNorm(x) = x * weight / sqrt(mean(x^2) + eps)
eps = 1e-6 (Qwen); no bias, no centering (differs from LayerNorm).
```
Applied pre-attention and pre-MLP; a final RMSNorm before the LM head (`norm_f`).

## 6. Embeddings & output head

- Token embedding `embed_tokens`: vocab_size × hidden_size.
- Qwen2 `tie_word_embeddings = False` (separate lm_head) — verify in config.
- Vocab: ~151,643 tokens (Qwen2), tiktoken-based (BPE), includes special tokens (im_start, im_end for chat).
- Qwen2.5 vocab up to ~152k+.

## 7. Chat template

Qwen chat models use special tokens:
```
<|im_start|>system
you are a helpful assistant<|im_end|>
<|im_start|>user
{prompt}<|im_end|>
<|im_start|>assistant
{response}<|im_end|>
```
Fine-tuning must mask everything except assistant tokens (same as module-03 SFT labels).

## 8. Qwen-3 MoE (when reading MoE variants)

- `num_experts`, `num_experts_per_topk`, `top_k` (usually 1–8).
- Router: `gate_proj` over experts → softmax → top-k dispatch → weighted sum of expert outputs.
- Shared experts (always on) + routed experts.
- MoE layers interleaved with dense layers (pattern in config).

## 9. Configuration fields to verify in source

| Field | Meaning | Qwen typical |
|-------|---------|--------------|
| hidden_size | d_model | 896 (1.5B), 2048 (7B), 8192 (72B) |
| num_attention_heads | H | variable |
| num_key_value_heads | H_kv (GQA) | H (MHA) down to H/10 (GQA) |
| intermediate_size | SwiGLU width | ~8/3 × hidden |
| num_hidden_layers | L | variable |
| max_position_embeddings | T | 32768 / 131072 / 1M |
| rope_theta | RoPE base | 1e6 |
| rms_norm_eps | eps | 1e-6 |
| tie_word_embeddings | embed/lm_head share | False |
| sliding_window | local attention | null (dense Qwen2), set in some variants |

## 10. Minute details that matter for fine-tuning

- Weight decay applied to all but LayerNorm/RMSNorm weights and biases (standard AdamW decoupled).
- Learning rate warmup + cosine decay.
- For Qwen chat fine-tuning: use the chat template, mask system/user tokens (-100), train on assistant completion only.
- Qwen2 supports `sliding_window` = null → full attention (O(T²) memory); long-context variants may use sliding window.

## 11. Verification task

Open `transformers/models/qwen2/modeling_qwen2.py` and annotate:
1. Where RoPE is computed (`Qwen2RotaryEmbedding`) and applied (`apply_rotary_pos_emb`).
2. Where GQA repeat happens (`repeat_kv`).
3. SwiGLU MLP forward order (gate * up then down).
4. `tie_word_embeddings` handling in `Qwen2LMHeadModel`.
