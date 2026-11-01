"""Supervised Fine-Tuning (SFT) loop on instruction/response pairs.

SFT format:
  prompt:  "<bos> instruction: {instruction}\nresponse:"
  target:  "{response} <eos>"

The model is trained to predict the response tokens given the instruction.
Only response tokens contribute to the loss (instruction tokens masked with -100).
"""

import torch
import torch.nn as nn
import torch.optim as optim

from lora import LoRALinear, freeze_base, trainable_param_count


def build_sft_dataset(pairs, tokenizer, max_len=128):
    """Tokenize (instruction, response) pairs into input_ids and labels.

    labels[i] = -100 for instruction/padding tokens (ignored in loss),
                = token id for response tokens.
    """
    input_ids, labels, masks = [], [], []
    for instr, resp in pairs:
        prompt = f"instruction: {instr}\nresponse:"
        target = f" {resp}"
        p_ids = tokenizer.encode(prompt, add_bos=True)
        t_ids = tokenizer.encode(target, add_eos=True)
        ids = p_ids + t_ids
        label = [-100] * len(p_ids) + t_ids
        # truncate
        ids = ids[:max_len]
        label = label[:max_len]
        pad = max_len - len(ids)
        ids = ids + [tokenizer.pad_id] * pad
        label = label + [-100] * pad
        mask = [i != tokenizer.pad_id for i in ids]
        input_ids.append(ids)
        labels.append(label)
        masks.append(mask)

    import torch
    return (
        torch.tensor(input_ids, dtype=torch.long),
        torch.tensor(labels, dtype=torch.long),
        torch.tensor(masks, dtype=torch.bool),
    )


def sft_step(model, batch, optimizer, criterion, device):
    input_ids, labels, masks = [b.to(device) for b in batch]
    logits = model(input_ids)  # (B, T, V)
    loss = criterion(logits.view(-1, logits.size(-1)), labels.view(-1))
    # mask out padding/instruction positions by weighting
    # (CrossEntropy already ignores -100 labels)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    return loss.item()


if __name__ == "__main__":
    print("sft.py: import build_sft_dataset / sft_step into train_finetune.py")
