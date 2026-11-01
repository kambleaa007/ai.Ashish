"""Training loop for the from-scratch Transformer LM.

Trains a small model on a tiny text corpus using next-token prediction
(cross-entropy over shifted targets). Prints loss and perplexity each epoch.

Run:
    python train.py
"""

import argparse
import math
import os
import torch
import torch.nn as nn
import torch.optim as optim

from config import ModelConfig
from tokenizer import CharTokenizer
from model import TransformerLM


def load_corpus(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def get_batch(data_ids: torch.Tensor, block_size: int, batch_size: int, device):
    """Sample a random batch of contiguous chunks for next-token prediction."""
    ix = torch.randint(len(data_ids) - block_size, (batch_size,))
    x = torch.stack([data_ids[i : i + block_size] for i in ix])
    y = torch.stack([data_ids[i + 1 : i + block_size + 1] for i in ix])
    return x.to(device), y.to(device)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/tiny_corpus.txt")
    parser.add_argument("--epochs", type=int, default=20)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--block-size", type=int, default=64)
    parser.add_argument("--lr", type=float, default=1e-3)
    parser.add_argument("--device", default=None)
    args = parser.parse_args()

    device = args.device or ("cuda" if torch.cuda.is_available() else "cpu")
    print("device:", device)

    # --- data ---
    text = load_corpus(args.data)
    tok = CharTokenizer()
    ids = torch.tensor(tok.encode(text), dtype=torch.long)
    print("corpus chars:", len(text), "| tokens:", len(ids), "| vocab:", len(tok))

    # --- model ---
    config = ModelConfig(
        vocab_size=len(tok),
        d_model=128,
        n_layers=4,
        n_heads=4,
        n_kv_heads=4,   # set 2 for GQA, 1 for MQA
        d_ff=512,
        max_seq_len=args.block_size,
        device=device,
    )
    model = TransformerLM(config).to(device)
    total_params = sum(p.numel() for p in model.parameters())
    print("total params:", total_params)

    optimizer = optim.Adam(model.parameters(), lr=args.lr)
    criterion = nn.CrossEntropyLoss()

    # --- training ---
    model.train()
    for epoch in range(args.epochs):
        xb, yb = get_batch(ids, args.block_size, args.batch_size, device)
        logits = model(xb)  # (B, T, V)
        loss = criterion(logits.view(-1, logits.size(-1)), yb.view(-1))

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        ppl = math.exp(min(loss.item(), 20))  # clamp to avoid overflow
        if (epoch + 1) % 5 == 0 or epoch == 0:
            print(f"epoch {epoch+1:3d}: loss={loss.item():.4f}  perplexity={ppl:.2f}")

    # save checkpoint next to this script
    ckpt_dir = os.path.dirname(os.path.abspath(__file__))
    torch.save({"model": model.state_dict(), "config": config}, os.path.join(ckpt_dir, "checkpoint.pt"))
    print("saved checkpoint.pt")


if __name__ == "__main__":
    main()
