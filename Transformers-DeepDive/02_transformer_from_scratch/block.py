"""RMSNorm + a single Transformer block.

RMSNorm (used by Qwen, Gemma, Llama) differs from LayerNorm:
  RMSNorm(x) = x / sqrt(mean(x^2) + eps) * weight     (no centering, no bias)

LayerNorm centers (subtracts mean) and has bias; RMSNorm does not, which is
slightly cheaper and works well with RoPE.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F

from attention import CausalSelfAttention
from mlp import build_mlp


class RMSNorm(nn.Module):
    def __init__(self, d_model: int, eps: float = 1e-5):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(d_model))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (..., d_model)
        variance = x.pow(2).mean(dim=-1, keepdim=True)
        x = x * torch.rsqrt(variance + self.eps)
        return x * self.weight


class Block(nn.Module):
    """One decoder-only Transformer block:

      h = x + Attn(RMSNorm(x))        (pre-norm residual)
      out = h + MLP(RMSNorm(h))

    Pre-norm (norm before attention/MLP) is used by GPT-Neo, Qwen, Gemma;
    it stabilizes training of very deep models.
    """

    def __init__(self, config, layer_idx: int):
        super().__init__()
        self.layer_idx = layer_idx
        self.norm1 = RMSNorm(config.d_model, config.rms_norm_eps)
        self.attn = CausalSelfAttention(config)
        self.norm2 = RMSNorm(config.d_model, config.rms_norm_eps)
        self.mlp = build_mlp("swiglu", config.d_model, config.d_ff)

    def forward(self, x: torch.Tensor, cos: torch.Tensor, sin: torch.Tensor) -> torch.Tensor:
        # x: (B, T, d_model)
        h = x + self.attn(self.norm1(x), cos, sin)
        out = h + self.mlp(self.norm2(h))
        return out
