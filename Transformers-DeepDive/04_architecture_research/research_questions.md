# Open Research Questions

Answer each by reading HF `transformers` source + original papers. Write your answer + the source file:line next to each.

## Qwen
1. [ ] What is `rope_theta` for Qwen-2-7B vs Qwen-2.5-72B, and where is `inv_freq` computed? (modeling_qwen2.py)
2. [ ] Does Qwen-2 use `tie_word_embeddings`? If False, how is `lm_head` initialized relative to `embed_tokens`?
3. [ ] In Qwen-2.5 MoE variants, which layers are MoE vs dense, and what is `num_experts_per_topk`?
4. [ ] How does `repeat_kv` implement GQA — `expand` or `repeat_interleave`, and on which axis?
5. [ ] What is the exact SwiGLU intermediate-size formula, and is it rounded to a multiple of 256?
6. [ ] Qwen chat template: which tokens mark system/user/assistant, and how are they represented in `tokenizer.json`?

## Gemma
7. [ ] Where is `attn_logit_softcap` applied inside `GemmaAttention.forward` — before or after the causal mask?
8. [ ] How does Gemma-2 construct the sliding-window mask (even layers local, odd layers global)?
9. [ ] Gemma-2: is `final_logit_softcap` applied in `lm_head` or after, in `for_causal_lm`?
10. [ ] GeGLU vs SwiGLU: confirm Gemma-2's MLP uses GeGLU (`gelu(gate) * up`).
11. [ ] Gemma-3: how are image tokens inserted into the text sequence, and which attention layers are global vs local?
12. [ ] What is Gemma's vocab construction (SentencePiece unigram), and does it include byte fallback?

## Shared (Qwen vs Gemma vs your from-scratch model)
13. [ ] Your module-02 model uses RoPE base 10000; Qwen uses 1e6. What changes in `inv_freq` and what is the effect on longest learnable dependency?
14. [ ] Compare parameter counts: for equal hidden size, how many fewer params does GQA (H_kv = H/8) save in KV projections?
15. [ ] Measure perplexity difference: train your tiny model with SwiGLU vs GeGLU vs standard FFN on the same corpus.
16. [ ] After LoRA fine-tuning, compare merged weights vs unmerged: are outputs bit-identical? (merge should be exact.)

## Deliverable
For each question: one paragraph answer + `file:line` citations. Add answers to this file.
