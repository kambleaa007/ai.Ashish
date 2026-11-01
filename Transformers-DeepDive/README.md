# Transformers-DeepDive

A from-scratch, minute-detail learning project for **PyTorch**, **Transformer architecture**, **fine-tuning**, and deep-research on production LLMs (**Qwen**, **Gemma**).

## Why this project exists

Most tutorials teach you to call `AutoModelForCausalLM` and `Trainer.train()`. This project teaches you what happens *inside* those calls:

1. Build PyTorch tensors/autograd from first principles (conceptually).
2. Implement a full Transformer (decoder-only) from scratch in pure PyTorch — no `nn.Transformer`, no HF shortcuts.
3. Pre-train it on a tiny corpus to see loss curves and overfitting.
4. Fine-tune it with SFT, then parameter-efficient methods (LoRA, QLoRA).
5. Reverse-engineer Qwen and Gemma architecture details: attention variants, RoPE, normalization, SwiGLU, group-query attention, sliding-window attention, quantization, and more.

## Repository layout

```
Transformers-DeepDive/
├── AGENTS.md                  # guidance for AI coding agents working here
├── README.md                  # this file (roadmap + how to run)
├── requirements.txt           # Python dependencies
├── data/                      # tiny corpora for from-scratch training
├── notebooks/                 # optional Jupyter notebooks mirroring the modules
│
├── 01_pytorch_fundamentals/   # tensors, autograd, modules, optimizers, data loading
│   ├── README.md
│   ├── tensors_autograd.py
│   ├── modules_optimizers.py
│   └── data_pipeline.py
│
├── 02_transformer_from_scratch/  # build a decoder-only LLM block by block
│   ├── README.md
│   ├── config.py              # model hyperparameters
│   ├── tokenizer.py           # char-level + BPE-style tokenizer
│   ├── embedding.py           # token + positional embeddings, RoPE
│   ├── attention.py           # MHA, GQA, MQA, causal mask, RoPE application
│   ├── mlp.py                 # SwiGLU / GeGLU / FFN
│   ├── block.py               # single Transformer block (norm + attn + mlp)
│   ├── model.py               # full decoder-only LM
│   ├── train.py               # training loop, loss, generation
│   └── generate.py            # greedy / temperature / top-p sampling
│
├── 03_fine_tuning/            # supervised fine-tuning + PEFT
│   ├── README.md
│   ├── sft.py                 # instruction fine-tuning loop
│   ├── lora.py                # LoRA from scratch + swap-in to Linear
│   ├── qlora.py               # 4-bit NF4 quantization + QLoRA
│   ├── peft_utils.py          # merge/unmerge adapters, rank analysis
│   └── train_finetune.py      # end-to-end SFT + LoRA training script
│
└── 04_architecture_research/  # deep-dive notes on Qwen & Gemma
    ├── README.md
    ├── qwen_architecture.md   # Qwen 1.5 / 2 / 2.5 / 3 details
    ├── gemma_architecture.md  # Gemma 1 / 2 / 3 details
    ├── comparison_matrix.md   # Qwen vs Gemma side-by-side minutiae
    └── research_questions.md  # open questions to answer by reading code
```

## Learning roadmap (in order)

| Module | Goal | Verify |
|--------|------|--------|
| `01_pytorch_fundamentals` | Understand tensors, autograd graph, `nn.Module`, optimizers, `DataLoader` | Run each script, inspect `.grad` and computation graph |
| `02_transformer_from_scratch` | Implement attention, RoPE, block, LM head; train on tiny text; generate | Perplexity drops; generated text looks like training corpus |
| `03_fine_tuning` | SFT on instruction pairs; inject LoRA adapters; compare full vs LoRA fine-tuning | Loss curves, adapter merge works, generation follows instructions |
| `04_architecture_research` | Map Qwen/Gemma source to equations; document every hyperparameter | Can explain each config field and its mathematical role |

## Prerequisites

- Python 3.10+ (tested on 3.14)
- A GPU (CUDA) is strongly recommended for modules 02–03; CPU works for tiny models
- Basic Python + linear algebra (matrix multiply, transpose, softmax)

## Install

```powershell
cd D:\git\ai.Ashish\Transformers-DeepDive
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run each module

```powershell
# PyTorch fundamentals
python 01_pytorch_fundamentals\tensors_autograd.py
python 01_pytorch_fundamentals\modules_optimizers.py

# Transformer from scratch (train tiny model)
python 02_transformer_from_scratch\train.py

# Generate from the trained model
python 02_transformer_from_scratch\generate.py --prompt "hello"

# Fine-tuning (SFT + LoRA)
python 03_fine_tuning\train_finetune.py
```

## How to use this for deep research

Open `04_architecture_research/qwen_architecture.md` and `gemma_architecture.md` side-by-side with the official model source code (Hugging Face `transformers` `models/qwen2` / `models/gemma`). For every claim in the notes, find the corresponding line in source and annotate it. That is how you go to the root of the architecture.

## License

MIT