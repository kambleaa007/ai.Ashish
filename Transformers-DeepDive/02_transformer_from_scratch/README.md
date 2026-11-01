# 02_transformer_from_scratch

Build a decoder-only Transformer (GPT-style) from scratch using only `torch.nn` primitives. No `transformers`, no `nn.Transformer`.

Files:
- `config.py` — hyperparameters (d_model, n_layers, n_heads, etc.)
- `tokenizer.py` — char-level vocab + optional BPE via `tokenizers`
- `embedding.py` — token embeddings + RoPE rotary embeddings
- `attention.py` — MHA / GQA / MQA with causal mask + RoPE
- `mlp.py` — SwiGLU / GeGLU / standard FFN
- `block.py` — one Transformer block (RMSNorm + attention + MLP + residuals)
- `model.py` — full decoder-only language model
- `train.py` — training loop, cross-entropy loss, perplexity
- `generate.py` — greedy / temperature / top-p / top-k sampling

Run order:
```powershell
python train.py          # trains on data/tiny_corpus.txt
python generate.py --prompt "the quick" --max-new-tokens 40
```