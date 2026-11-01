"""Data loading fundamentals: TensorDataset, DataLoader, collation, batching.

What this teaches:
- Dataset vs DataLoader
- Batch iteration and drop_last / shuffle
- Custom collate_fn (variable-length sequences → padding)
- train/val split
"""

import torch
from torch.utils.data import TensorDataset, DataLoader, random_split


def basic_dataloader():
    print("=== Basic DataLoader ===")
    X = torch.randn(100, 10)
    Y = (X[:, :3].sum(dim=1, keepdim=True) + 0.1 * torch.randn(100, 1)).clamp(0, 1)
    ds = TensorDataset(X, Y)

    loader = DataLoader(ds, batch_size=16, shuffle=True, drop_last=False)
    n_batches = 0
    for xb, yb in loader:
        print(f"batch {n_batches}: x={tuple(xb.shape)} y={tuple(yb.shape)}")
        n_batches += 1
    print("total batches:", n_batches, "(ceil(100/16) = 7)")


def train_val_split():
    print("\n=== train/val split ===")
    ds = TensorDataset(torch.randn(100, 5), torch.randn(100, 1))
    train_ds, val_ds = random_split(ds, [80, 20], generator=torch.Generator().manual_seed(42))
    print("train:", len(train_ds), "| val:", len(val_ds))


def variable_length_collate():
    """Collate variable-length integer sequences with padding.

    This mirrors what a Transformer data pipeline does before attention masking.
    """
    print("\n=== Variable-length collate (padding + mask) ===")
    sequences = [
        torch.tensor([1, 2, 3]),
        torch.tensor([4, 5]),
        torch.tensor([6, 7, 8, 9]),
        torch.tensor([10]),
    ]
    pad_id = 0

    def collate(batch):
        max_len = max(len(s) for s in batch)
        padded = []
        masks = []
        for s in batch:
            pad_len = max_len - len(s)
            padded.append(torch.cat([s, torch.full((pad_len,), pad_id, dtype=s.dtype)]))
            masks.append(torch.cat([torch.ones(len(s), dtype=torch.bool), torch.zeros(pad_len, dtype=torch.bool)]))
        return torch.stack(padded), torch.stack(masks)

    loader = DataLoader(sequences, batch_size=2, shuffle=False, collate_fn=collate)
    for padded, mask in loader:
        print("padded:\n", padded)
        print("mask :\n", mask.long())
        print()


if __name__ == "__main__":
    basic_dataloader()
    train_val_split()
    variable_length_collate()
