# 03_fine_tuning

Supervised fine-tuning (SFT) + parameter-efficient fine-tuning (PEFT).

Files:
- `lora.py` — LoRA from scratch: wraps `nn.Linear`, adds trainable low-rank adapters `A (d x r)` and `B (r x k)`, freezes base weight. Forward: `y = W x + B @ (A @ x) * (alpha / r)`.
- `qlora.py` — 4-bit NF4 quantization concept + QLoRA (LoRA on quantized base, double-quant, paged optimizers noted).
- `peft_utils.py` — merge/unmerge adapters into base weights, rank/scaling analysis.
- `sft.py` — instruction fine-tuning loop on (instruction, response) pairs.
- `train_finetune.py` — end-to-end: load the module-02 checkpoint, wrap layers with LoRA, SFT, merge, generate.

Key equations:
  h = W_0 x + ΔW x,  ΔW = B A,  A ~ N(0, 1/r), B = 0,  scale = alpha / r
  Only A and B are trained; W_0 is frozen.

Run:
```powershell
python train_finetune.py
```