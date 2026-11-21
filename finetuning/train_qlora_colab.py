import os
import torch
import gc
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling,
    BitsAndBytesConfig,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer

os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"

def clear_memory():
    gc.collect()
    torch.cuda.empty_cache()

def main():
    clear_memory()
    
    model_id = "google/gemma-2-9b-it"
    
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_use_double_quant=True,
    )
    
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        quantization_config=bnb_config,
        device_map="auto",
        attn_implementation="flash_attention_2",
        torch_dtype=torch.bfloat16,
    )
    
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"
    
    model = prepare_model_for_kbit_training(model, use_gradient_checkpointing=True)
    model.gradient_checkpointing_enable()
    
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
    )
    
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()
    
    dataset = load_dataset("json", data_files="marathi_instruct.jsonl", split="train")
    
    def format_chat(example):
        messages = [
            {"role": "user", "content": example["instruction"]},
            {"role": "assistant", "content": example["output"]},
        ]
        return {"text": tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=False)}
    
    dataset = dataset.map(format_chat, remove_columns=dataset.column_names)
    
    training_args = TrainingArguments(
        output_dir="marathi-gemma-2-9b-qlora",
        num_train_epochs=3,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=16,
        warmup_steps=50,
        learning_rate=2e-4,
        bf16=True,
        logging_steps=10,
        save_steps=100,
        save_total_limit=2,
        optim="paged_adamw_8bit",
        lr_scheduler_type="cosine",
        weight_decay=0.01,
        max_grad_norm=0.3,
        gradient_checkpointing=True,
        gradient_checkpointing_kwargs={"use_reentrant": False},
        report_to="none",
        remove_unused_columns=False,
        dataloader_pin_memory=False,
        dataloader_num_workers=0,
    )
    
    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        args=training_args,
        data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
        tokenizer=tokenizer,
        max_seq_length=2048,
        packing=False,
    )
    
    trainer.train()
    
    trainer.save_model("marathi-gemma-2-9b-qlora-final")
    tokenizer.save_pretrained("marathi-gemma-2-9b-qlora-final")
    
    clear_memory()
    print("Training complete!")

if __name__ == "__main__":
    main()