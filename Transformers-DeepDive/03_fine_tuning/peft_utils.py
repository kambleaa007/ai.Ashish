"""PEFT utilities: merge/unmerge LoRA adapters, parameter analysis."""

import torch


def count_params_by_type(model):
    """Return (total, trainable, frozen) parameter counts and LoRA share."""
    total = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    return total, trainable, total - trainable


def merge_all_lora(model):
    """Merge every LoRALinear in place; returns list of merged layers."""
    from lora import LoRALinear
    merged = []
    for m in model.modules():
        if isinstance(m, LoRALinear):
            m.merge()
            merged.append(m)
    return merged


def unmerge_all_lora(model):
    from lora import LoRALinear
    unmerged = []
    for m in model.modules():
        if isinstance(m, LoRALinear):
            m.unmerge()
            unmerged.append(m)
    return unmerged


def lora_rank_efficiency(base_params: int, lora_params: int, d: int, k: int, r: int):
    """Show parameter reduction vs full fine-tune for one linear layer."""
    full = d * k
    lora = r * (d + k)
    return {
        "full_finetune_params": full,
        "lora_params": lora,
        "reduction_x": round(full / lora, 2) if lora else float("inf"),
        "percent_trainable": round(100 * lora_params / base_params, 4),
    }
