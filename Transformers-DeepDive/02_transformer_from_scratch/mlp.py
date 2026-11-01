"""Feed-forward network: standard FFN, SwiGLU, and GeGLU.

Modern LLMs (Qwen2, Gemma) use SwiGLU:
  FFN(x) = (W2 * swish(x W1) * (x W3))  ... gated linear unit

Where swish(x) = x * sigmoid(x). The "gate" (x W3) controls how much of the
activation passes through. Intermediate dim is typically ~ 8/3 * d_model (rounded).

References:
  - Shazeer, 2020: "GLU Variants Improve Transformer" (GLU/SwiGLU)
  - PaLM / Llama 2 / Qwen / Gemma use SwiGLU or GeGLU
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class SwiGLUMLP(nn.Module):
    def __init__(self, d_model: int, d_ff: int):
        super().__init__()
        # SwiGLU uses three matrices: up (gate), up (value), down
        self.w_gate = nn.Linear(d_model, d_ff, bias=False)   # x W3  (gate)
        self.w_up = nn.Linear(d_model, d_ff, bias=False)     # x W1  (value)
        self.w_down = nn.Linear(d_ff, d_model, bias=False)   # W2

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (B, T, d_model)
        gate = F.silu(self.w_gate(x))  # swish(x W3), (B, T, d_ff)
        up = self.w_up(x)              # x W1, (B, T, d_ff)
        return self.w_down(gate * up)  # (B, T, d_model)


class GeGLUMLP(nn.Module):
    """GeGLU: GELU(x W_gate) * (x W_up) then W_down."""

    def __init__(self, d_model: int, d_ff: int):
        super().__init__()
        self.w_gate = nn.Linear(d_model, d_ff, bias=False)
        self.w_up = nn.Linear(d_model, d_ff, bias=False)
        self.w_down = nn.Linear(d_ff, d_model, bias=False)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        gate = F.gelu(self.w_gate(x), approximate="tanh")
        up = self.w_up(x)
        return self.w_down(gate * up)


class StandardFFN(nn.Module):
    """Vanilla Transformer FFN: W2 * relu(W1 x + b1) + b2."""

    def __init__(self, d_model: int, d_ff: int):
        super().__init__()
        self.w1 = nn.Linear(d_model, d_ff)
        self.w2 = nn.Linear(d_ff, d_model)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.w2(F.relu(self.w1(x)))


def build_mlp(kind: str, d_model: int, d_ff: int) -> nn.Module:
    kinds = {"swiglu": SwiGLUMLP, "geglu": GeGLUMLP, "standard": StandardFFN}
    if kind not in kinds:
        raise ValueError(f"unknown mlp kind {kind}; choose from {list(kinds)}")
    return kinds[kind](d_model, d_ff)
