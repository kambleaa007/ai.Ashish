"""Multi-head attention with causal masking, RoPE, and GQA/MQA support.

Math (single head, scaled dot-product):
  Q = X W_Q, K = X W_K, V = X W_V
  attn = softmax( (Q K^T) / sqrt(d_k) )  masked causally
  out  = attn V

RoPE is applied to Q and K before the dot product so attention logits depend on
relative position m - n.

GQA/MQA: H query heads share H_kv key/value heads. Each query head i attends to
KV head i % H_kv. This reduces KV-cache memory (H_kv << H) at slight quality cost.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class CausalSelfAttention(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.d_model = config.d_model
        self.n_heads = config.n_heads
        self.n_kv_heads = config.n_kv_heads
        self.head_dim = config.d_model // config.n_heads
        assert config.d_model % config.n_heads == 0, "d_model must divide by n_heads"
        assert config.n_heads % config.n_kv_heads == 0, "n_heads must divide by n_kv_heads"

        self.q_proj = nn.Linear(config.d_model, config.n_heads * self.head_dim, bias=False)
        self.k_proj = nn.Linear(config.d_model, config.n_kv_heads * self.head_dim, bias=False)
        self.v_proj = nn.Linear(config.d_model, config.n_kv_heads * self.head_dim, bias=False)
        self.o_proj = nn.Linear(config.n_heads * self.head_dim, config.d_model, bias=False)

        self.scale = self.head_dim ** -0.5

        # causal mask buffer (upper triangle True = masked)
        self.register_buffer(
            "causal_mask",
            torch.triu(torch.ones(config.max_seq_len, config.max_seq_len, dtype=torch.bool), diagonal=1),
            persistent=False,
        )

    def forward(self, x: torch.Tensor, cos: torch.Tensor, sin: torch.Tensor) -> torch.Tensor:
        B, T, C = x.shape  # C = d_model

        # --- projections ---
        q = self.q_proj(x)  # (B, T, H * head_dim)
        k = self.k_proj(x)  # (B, T, H_kv * head_dim)
        v = self.v_proj(x)  # (B, T, H_kv * head_dim)

        # --- reshape to multi-head ---
        q = q.view(B, T, self.n_heads, self.head_dim).transpose(1, 2)  # (B, H, T, head_dim)
        k = k.view(B, T, self.n_kv_heads, self.head_dim).transpose(1, 2)  # (B, H_kv, T, head_dim)
        v = v.view(B, T, self.n_kv_heads, self.head_dim).transpose(1, 2)  # (B, H_kv, T, head_dim)

        # --- RoPE on Q and K ---
        q = apply_rope(q, cos[:T], sin[:T])
        k = apply_rope(k, cos[:T], sin[:T])

        # --- GQA expansion: repeat KV heads to match query heads ---
        # (B, H_kv, T, head_dim) -> (B, H, T, head_dim)
        if self.n_kv_heads != self.n_heads:
            rep = self.n_heads // self.n_kv_heads
            k = k.repeat_interleave(rep, dim=1)
            v = v.repeat_interleave(rep, dim=1)

        # --- scaled dot-product attention ---
        # attn_weights: (B, H, T, T)
        att = (q @ k.transpose(-2, -1)) * self.scale
        # apply causal mask: position i can only attend to j <= i
        att = att.masked_fill(self.causal_mask[:T, :T], float("-inf"))
        att = F.softmax(att, dim=-1)

        # --- weighted sum of values ---
        out = att @ v  # (B, H, T, head_dim)

        # --- merge heads ---
        out = out.transpose(1, 2).contiguous().view(B, T, C)  # (B, T, d_model)
        out = self.o_proj(out)
        return out


def apply_rope(x: torch.Tensor, cos: torch.Tensor, sin: torch.Tensor) -> torch.Tensor:
    """Local import-safe RoPE application for attention tensors.

    x: (B, H, T, d_head); cos/sin: (T, d_head//2)
    """
    from embedding import apply_rope as _apply_rope
    return _apply_rope(x, cos, sin)
