#!/bin/bash
# Complete Colab Setup & Training Script for Marathi Gemma-2-9B QLoRA
# Run this in a Colab notebook cell

set -e

echo "=== Setting up environment ==="
# Install dependencies with specific versions for compatibility
pip install -q \
    torch==2.3.0 \
    transformers==4.41.0 \
    datasets==2.19.0 \
    peft==0.11.0 \
    trl==0.8.6 \
    accelerate==0.30.0 \
    bitsandbytes==0.43.0 \
    huggingface_hub==0.22.0

echo "=== Checking GPU ==="
nvidia-smi

echo "=== Cloning repository ==="
cd /content
if [ -d "myai" ]; then
    rm -rf myai
fi
git clone https://github.com/kambleaa007/my.ai.llm.git myai
cd /content/myai/finetuning

echo "=== Preparing data ==="
python data_prep_colab.py

echo "=== Starting training ==="
python train_qlora_colab.py

echo "=== Training complete ==="
ls -la marathi-gemma-2-9b-qlora-final/