"""Greedy / temperature / top-p / top-k generation from the trained model.

Run:
    python generate.py --prompt "the quick brown" --max-new-tokens 60 --temperature 0.8
"""

import argparse
import torch

from config import ModelConfig
from tokenizer import CharTokenizer
from model import TransformerLM


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", default="the quick")
    parser.add_argument("--checkpoint", default="checkpoint.pt")
    parser.add_argument("--max-new-tokens", type=int, default=60)
    parser.add_argument("--temperature", type=float, default=0.9)
    parser.add_argument("--top-k", type=int, default=None)
    parser.add_argument("--top-p", type=float, default=None)
    parser.add_argument("--device", default=None)
    args = parser.parse_args()

    device = args.device or ("cuda" if torch.cuda.is_available() else "cpu")
    ckpt = torch.load(args.checkpoint, map_location=device, weights_only=False)
    config = ckpt["config"]
    tok = CharTokenizer()

    model = TransformerLM(config).to(device)
    model.load_state_dict(ckpt["model"])
    model.eval()

    input_ids = torch.tensor([tok.encode(args.prompt)], dtype=torch.long, device=device)
    out = model.generate(
        input_ids,
        max_new_tokens=args.max_new_tokens,
        temperature=args.temperature,
        top_k=args.top_k,
        top_p=args.top_p,
        eos_id=tok.eos_id,
    )
    print("generated:", tok.decode(out[0].tolist()))


if __name__ == "__main__":
    main()
