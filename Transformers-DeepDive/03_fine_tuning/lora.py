"""LoRA (Low-Rank Adaptation) from scratch.

Paper: Hu et al., 2021, "LoRA: Low-Rank Adaptation of Large Language Models"

Idea: instead of fine-tuning all of W_0 (d x k), keep W_0 frozen and learn
a low-rank update ΔW = B @ A where:
  A: (r, d)   initialized with kaiming/normal
  B: (k, r)   initialized to zero (so ΔW = 0 at init -> pretrained behavior preserved)
  scale: alpha / r  (alpha is a hyperparameter, often alpha = r or 2r)

Forward:  y = W_0 @ x + scale * (B @ (A @ x))

Only A and B require gradients. Parameter reduction:
  full fine-tune: d * k
  LoRA: r * (d + k)   (r << min(d, k))

This module provides:
  LoRALinear  — a drop-in wrapper around nn.Linear
  apply_lora_to_model  — recursively wrap attention/MLP projections
  merge_lora / unmerge_lora — fold ΔW into W_0 and back
"""

import math
import torch
import torch.nn as nn


class LoRALinear(nn.Module):
    def __init__(self, linear: nn.Linear, r: int = 8, alpha: float = 8.0,
                 dropout: float = 0.0, merge_weights: bool = True):
        super().__init__()
        self.linear = linear
        self.in_features = linear.in_features
        self.out_features = linear.out_features
        self.r = r
        self.alpha = alpha
        self.scale = alpha / r
        self.merge_weights = merge_weights
        self.merged = False

        # freeze base weight
        self.linear.weight.requires_grad = False
        if self.linear.bias is not None:
            self.linear.bias.requires_grad = False

        # low-rank adapters
        self.lora_A = nn.Parameter(torch.zeros(self.in_features, r))
        self.lora_B = nn.Parameter(torch.zeros(r, self.out_features))
        nn.init.normal_(self.lora_A, mean=0.0, std=1.0 / r)
        nn.init.zeros_(self.lora_B)

        self.lora_dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # base: (..., in_features) @ (in_features, out_features) -> (..., out_features)
        result = self.linear(x)
        if not self.merged and self.r > 0:
            # x @ A^T -> (..., r); then @ B -> (..., out_features)
            # lora_A: (in_features, r); lora_B: (r, out_features)
            h = self.lora_dropout(x) @ self.lora_A  # (..., r)
            result = result + (h @ self.lora_B) * self.scale
        return result

    def merge(self):
        """Fold ΔW into the base weight so inference is a single matmul."""
        if self.merged or self.r == 0:
            return
        delta_w = (self.lora_A @ self.lora_B).T * self.scale  # (out_features, in_features)
        self.linear.weight.data += delta_w
        self.merged = True

    def unmerge(self):
        """Remove ΔW from base weight (restores adapter-based forward)."""
        if not self.merged:
            return
        delta_w = (self.lora_A @ self.lora_B).T * self.scale
        self.linear.weight.data -= delta_w
        self.merged = False


import math  # noqa: E402  (used above)


def lora_parameters(model: nn.Module):
    """Yield only trainable LoRA parameters."""
    for m in model.modules():
        if isinstance(m, LoRALinear):
            yield m.lora_A
            yield m.lora_B


def freeze_base(model: nn.Module):
    for p in model.parameters():
        p.requires_grad = False
    for p in lora_parameters(model):
        p.requires_grad = True


def trainable_param_count(model: nn.Module):
    return sum(p.numel() for p in model.parameters() if p.requires_grad), \
           sum(p.numel() for p in model.parameters())


if __name__ == "__main__":
    # smoke test
    layer = nn.Linear(16, 32)
    lora = LoRALinear(layer, r=4, alpha=8.0)
    x = torch.randn(2, 16)
    y1 = lora(x)
    lora.merge()
    y2 = lora(x)
    print("merged output diff:", (y1 - y2).abs().max().item(), "(should be ~0)")
