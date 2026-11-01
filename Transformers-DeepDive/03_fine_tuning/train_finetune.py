"""End-to-end SFT + LoRA fine-tuning on the module-02 TransformerLM.

Flow:
  1. Load the pretrained checkpoint from 02_transformer_from_scratch/checkpoint.pt
  2. Wrap q_proj / k_proj / v_proj / o_proj in each block with LoRALinear
  3. Freeze base weights; train only LoRA adapters on instruction/response pairs
  4. Merge adapters; save fine-tuned checkpoint
  5. Generate a response to an instruction

Run:
    python train_finetune.py
"""

import os
import sys
import torch
import torch.nn as nn
import torch.optim as optim

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "02_transformer_from_scratch"))

from config import ModelConfig
from tokenizer import CharTokenizer
from model import TransformerLM

from lora import LoRALinear, freeze_base, trainable_param_count
from peft_utils import merge_all_lora
from sft import build_sft_dataset


INSTRUCTION_PAIRS = [
    ("what is the capital of france?", "paris"),
    ("translate hello to french", "bonjour"),
    ("what is 2 plus 2?", "4"),
    ("who wrote romeo and juliet?", "william shakespeare"),
    ("say something kind", "you are doing great"),
    ("reverse the word cat", "tac"),
    ("what color is the sky?", "blue"),
    ("count to three", "one two three"),
]


def wrap_attention_with_lora(model: TransformerLM, r: int = 8, alpha: float = 16.0):
    """Replace attention projections with LoRALinear wrappers."""
    for block in model.layers:
        block.attn.q_proj = LoRALinear(block.attn.q_proj, r=r, alpha=alpha)
        block.attn.k_proj = LoRALinear(block.attn.k_proj, r=r, alpha=alpha)
        block.attn.v_proj = LoRALinear(block.attn.v_proj, r=r, alpha=alpha)
        block.attn.o_proj = LoRALinear(block.attn.o_proj, r=r, alpha=alpha)


def main():
    device = "cuda" if torch.cuda.is_available() else "cpu"
    ckpt_path = os.path.join("02_transformer_from_scratch", "checkpoint.pt")
    if not os.path.exists(ckpt_path):
        print("No pretrained checkpoint found. Run 02/train.py first.")
        return

    ckpt = torch.load(ckpt_path, map_location=device, weights_only=False)
    config = ckpt["config"]
    tok = CharTokenizer()

    model = TransformerLM(config).to(device)
    model.load_state_dict(ckpt["model"])

    # wrap + freeze
    wrap_attention_with_lora(model, r=8, alpha=16.0)
    freeze_base(model)
    trainable, total = trainable_param_count(model)
    print(f"trainable: {trainable:,} / {total:,} "
          f"({100*trainable/total:.2f}%)")

    # dataset
    input_ids, labels, masks = build_sft_dataset(INSTRUCTION_PAIRS, tok, max_len=64)
    dataset = torch.utils.data.TensorDataset(input_ids, labels, masks)
    loader = torch.utils.data.DataLoader(dataset, batch_size=4, shuffle=True)

    optimizer = optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=1e-3)
    criterion = nn.CrossEntropyLoss(ignore_index=-100)

    model.train()
    for epoch in range(100):
        total_loss = 0.0
        for batch in loader:
            loss = 0.0
            input_ids_b, labels_b, masks_b = batch
            logits = model(input_ids_b.to(device))
            loss = criterion(logits.view(-1, logits.size(-1)), labels_b.to(device).view(-1))
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        if (epoch + 1) % 20 == 0:
            print(f"sft epoch {epoch+1}: loss={total_loss/len(loader):.4f}")

    # merge adapters for inference
    merge_all_lora(model)
    # save next to this script
    ckpt_dir = os.path.dirname(os.path.abspath(__file__))
    torch.save({"model": model.state_dict(), "config": config}, os.path.join(ckpt_dir, "sft_checkpoint.pt"))
    print("saved sft_checkpoint.pt")

    # generate a response
    model.eval()
    prompt = "instruction: what is the capital of france?\nresponse:"
    ids = torch.tensor([tok.encode(prompt, add_bos=True)], dtype=torch.long, device=device)
    out = model.generate(ids, max_new_tokens=16, temperature=0.0 if False else 0.7, eos_id=tok.eos_id)
    print("prompt :", prompt)
    print("output :", tok.decode(out[0].tolist()))


if __name__ == "__main__":
    main()
