"""QLoRA concepts: 4-bit NF4 quantization + LoRA on quantized weights.

Paper: Dettmers et al., 2023, "QLoRA: Efficient Finetuning of Quantized LLMs"

Key ideas (documented here; full GPU offload/paged optimizers are implementation
details of bitsandbytes):
  1. NF4 (NormalFloat 4): quantization designed for normally-distributed weights.
     Each 4-bit value maps to a quantile of the normal distribution; asymmetric
     2-point quantization per block with block-wise scaling.
  2. Double quantization: quantize the quantization constants themselves.
  3. Paged optimizers: handle CPU offload / GPU memory fragmentation during long
     fine-tuning runs.
  4. QLoRA: load base model in 4-bit NF4, train only LoRA adapters in bfloat16/
     float32, dequantize on the fly during forward/backward.

This file demonstrates the NF4 codebook + 4-bit pack/unpack on a small tensor.
It does NOT replace bitsandbytes for production training.
"""

import torch


# NF4 codebook: 16 values approximating quantiles of a standard normal.
# Source: QLoRA paper (Table 8 / Appendix).
NF4_CODEBOOK = torch.tensor([
    -1.0, -0.6961928001999855, -0.5250730303311348, -0.39481742382055286,
    -0.2844403862953186, -0.18477644979953766, -0.09105002675902843, 0.0,
    0.09105002675902843, 0.18477644979953766, 0.2844403862953186,
    0.39481742382055286, 0.5250730303311348, 0.6961928001999855, 1.0,
    # one extra slot (16 values total used above); keep length 16 exactly
], dtype=torch.float32)[:16]


def quantize_nf4(w: torch.Tensor, block_size: int = 64):
    """Quantize a weight matrix to 4-bit NF4 per block.

    Returns:
      q: (num_blocks, block_size // 2) uint8 packed 4-bit values
      scales: (num_blocks,) float32 absmax scale per block
      absmax: (num_blocks,) float32 used to dequantize
    """
    assert w.dim() == 2
    out_features, in_features = w.shape
    assert in_features % block_size == 0, "pad in_features to block_size multiple"

    w = w.view(out_features, -1, block_size)  # (O, B, block_size)
    absmax = w.abs().max(dim=-1, keepdim=True).values  # (O, B, 1)
    absmax = absmax.clamp(min=1e-5)
    # normalize to [-1, 1], map to nearest NF4 code
    norm = w / absmax  # (O, B, block_size)
    # nearest codebook index (keep int64 for indexing)
    dist = (norm.unsqueeze(-1) - NF4_CODEBOOK.view(1, 1, 1, -1)).abs()  # (O,B,block,16)
    idx = dist.argmin(dim=-1)  # (O, B, block_size) int64
    # pack two 4-bit values per byte
    idx_hi = (idx[:, :, 0::2]).to(torch.uint8)
    idx_lo = (idx[:, :, 1::2]).to(torch.uint8)
    packed = (idx_hi << 4) | idx_lo  # (O, B, block_size//2)
    scales = absmax.squeeze(-1)  # (O, B)
    return packed, scales


def dequantize_nf4(packed: torch.Tensor, scales: torch.Tensor, block_size: int = 64,
                   out_features: int = None, in_features: int = None):
    """Reverse of quantize_nf4. Returns (out_features, in_features) float tensor."""
    num_blocks = packed.shape[1] if packed.dim() == 3 else packed.shape[0]
    # unpack
    idx_hi = (packed >> 4) & 0xF
    idx_lo = packed & 0xF
    # interleave
    idx = torch.stack([idx_hi, idx_lo], dim=-1).flatten(start_dim=-2)  # (..., block_size)
    idx = idx.to(torch.long)
    vals = NF4_CODEBOOK[idx]  # (..., block_size)
    scales_exp = scales.unsqueeze(-1).expand_as(vals)
    w = vals * scales_exp
    if out_features is not None:
        w = w.reshape(out_features, in_features)
    return w


def qlora_forward_note():
    """Print the QLoRA forward equation for documentation."""
    print("""
QLoRA forward (per linear layer):
  W_quantized (4-bit NF4) is stored; during forward:
    W_dq = dequantize(W_quantized)          # bfloat16 / float32 on the fly
    y = W_dq @ x + scale * (B @ (A @ x))     # LoRA adapters in bf16/fp32
  Only A and B get gradients; W_quantized stays frozen.
    """)


if __name__ == "__main__":
    torch.manual_seed(0)
    w = torch.randn(128, 256)
    packed, scales = quantize_nf4(w, block_size=64)
    w_dq = dequantize_nf4(packed, scales, block_size=64,
                          out_features=128, in_features=256)
    err = (w - w_dq).abs().max().item()
    print(f"NF4 roundtrip max abs error: {err:.4f}")
    qlora_forward_note()
