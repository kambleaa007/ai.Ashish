r"""Embeddings + Rotary Positional Embeddings (RoPE).

Math:
  Token embedding:   E \in R^{|V| x d}, lookup h = E[token_id]
  RoPE: rotates pairs of dimensions by m\theta where \theta_i = 10000^{-2i/d}
        so attention depends only on relative offset m - n.

RoPE references every modern LLM uses: Qwen2, Gemma, Llama, Mistral.
r"""

import math
import torch
import torch.nn as nn


class TokenEmbedding(nn.Module):
    def __init__(self, vocab_size: int, d_model: int):
        super().__init__()
        self.weight = nn.Parameter(torch.empty(vocab_size, d_model))
        nn.init.normal_(self.weight, mean=0.0, std=0.02)

    def forward(self, input_ids: torch.Tensor) -> torch.Tensor:
        # input_ids: (B, T) -> (B, T, d_model)
        return self.weight[input_ids]


def precompute_rope_freqs(dim: int, max_seq_len: int, base: float = 10000.0, device=None):
    r"""Compute RoPE rotation angles for every position and frequency band.

    Returns:
      cos, sin: (max_seq_len, dim//2) — cosine/sine of m\theta_i for each position m
    r"""
    inv_freq = 1.0 / (base ** (torch.arange(0, dim, 2, device=device).float() / dim))
    # positions m = 0..max_seq_len-1
    t = torch.arange(max_seq_len, device=device).float()
    # freqs: (max_seq_len, dim//2) where freqs[m, i] = m * inv_freq[i]
    freqs = torch.outer(t, inv_freq)
    return torch.cos(freqs), torch.sin(freqs)


def apply_rope(x: torch.Tensor, cos: torch.Tensor, sin: torch.Tensor) -> torch.Tensor:
    r"""Apply rotary embeddings to queries/keys.

    x: (B, H, T, d_head) where d_head is even.
    cos/sin: (T, d_head//2) broadcast across batch & heads.
    Returns same shape as x.
    r"""
    B, H, T, d = x.shape
    d2 = d // 2
    # split into interleaved pairs: x1 = x[..., 0::2], x2 = x[..., 1::2]
    x1 = x[..., 0::2]   # (B, H, T, d2)
    x2 = x[..., 1::2]   # (B, H, T, d2)
    # cos/sin: (T, d2) -> (1, 1, T, d2)
    cos = cos[:T].unsqueeze(0).unsqueeze(0)
    sin = sin[:T].unsqueeze(0).unsqueeze(0)
    # rotate: [x1, x2] -> [x1*cos - x2*sin, x1*sin + x2*cos]
    rot1 = x1 * cos - x2 * sin
    rot2 = x1 * sin + x2 * cos
    # interleave back
    out = torch.empty_like(x)
    out[..., 0::2] = rot1
    out[..., 1::2] = rot2
    return out


class Embeddings(nn.Module):
    """Token embeddings + RoPE frequency tables (no learned positional embeddings).

    Token table is d_model wide (the residual stream).  RoPE rotates pairs within
    each head, so the frequency table uses head_dim, not d_model.
    """

    def __init__(self, vocab_size: int, d_model: int, head_dim: int,
                 max_seq_len: int, rope_base: float, device=None):
        super().__init__()
        self.tok_emb = TokenEmbedding(vocab_size, d_model)
        cos, sin = precompute_rope_freqs(head_dim, max_seq_len, rope_base, device=device)
        self.register_buffer("cos", cos, persistent=False)
        self.register_buffer("sin", sin, persistent=False)

    def forward(self, input_ids: torch.Tensor) -> torch.Tensor:
        return self.tok_emb(input_ids)  # (B, T, d_model)
