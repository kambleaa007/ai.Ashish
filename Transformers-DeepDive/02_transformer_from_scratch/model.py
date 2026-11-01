"""Full decoder-only language model.

Architecture (GPT-style, pre-norm, RoPE, RMSNorm, SwiGLU, GQA):

  input_ids -> TokenEmbedding -> [Block x L] -> RMSNorm -> LM Head -> logits

If tie_embeddings: LM head weight = token embedding weight (weight tying).
"""

import torch
import torch.nn as nn
import torch.nn.functional as F

from config import ModelConfig
from embedding import Embeddings
from block import Block, RMSNorm


class TransformerLM(nn.Module):
    def __init__(self, config: ModelConfig):
        super().__init__()
        self.config = config
        self.emb = Embeddings(
            config.vocab_size, config.d_model, config.head_dim,
            config.max_seq_len, config.rope_base
        )
        self.layers = nn.ModuleList([Block(config, i) for i in range(config.n_layers)])
        self.norm_f = RMSNorm(config.d_model, config.rms_norm_eps)
        self.lm_head = nn.Linear(config.d_model, config.vocab_size, bias=False)

        if config.tie_embeddings:
            # weight tying: input and output embeddings share the same matrix
            self.lm_head.weight = self.emb.tok_emb.weight

        # init
        self.apply(self._init_weights)

    def _init_weights(self, module):
        if isinstance(module, nn.Linear):
            nn.init.normal_(module.weight, mean=0.0, std=0.02)
        elif isinstance(module, nn.Embedding):
            nn.init.normal_(module.weight, mean=0.0, std=0.02)

    def forward(self, input_ids: torch.Tensor, attention_mask: torch.Tensor | None = None):
        # input_ids: (B, T); attention_mask: (B, T) bool (unused in causal attention,
        # but kept for interface compatibility with HF-style models)
        B, T = input_ids.shape
        assert T <= self.config.max_seq_len, f"seq len {T} exceeds max {self.config.max_seq_len}"

        x = self.emb(input_ids)  # (B, T, d_model)
        cos = self.emb.cos
        sin = self.emb.sin

        for block in self.layers:
            x = block(x, cos, sin)  # (B, T, d_model)

        x = self.norm_f(x)          # (B, T, d_model)
        logits = self.lm_head(x)    # (B, T, vocab_size)
        return logits

    @torch.no_grad()
    def generate(self, input_ids: torch.Tensor, max_new_tokens: int = 40,
                 temperature: float = 1.0, top_k: int | None = None,
                 top_p: float | None = None, eos_id: int | None = None):
        """Autoregressive generation: sample one token at a time, append, repeat.

        Args:
          input_ids: (1, T) prompt (single sequence for teaching clarity)
          temperature: >0; lower = sharper distribution; 1.0 = raw softmax
          top_k: keep only top-k most likely tokens
          top_p: nucleus sampling, keep smallest set with cumulative prob >= top_p
          eos_id: stop generation when this token is sampled
        """
        self.eval()
        ids = input_ids.clone()  # (1, T)
        for _ in range(max_new_tokens):
            # crop to context window if needed
            input_crop = ids[:, -self.config.max_seq_len:]
            logits = self(input_crop)[:, -1, :] / temperature  # (1, vocab)
            probs = F.softmax(logits, dim=-1)

            if top_k is not None:
                topk_vals, topk_idx = torch.topk(probs, min(top_k, probs.size(-1)))
                mask = torch.full_like(probs, float("-inf"))
                mask.scatter_(1, topk_idx, topk_vals)
                probs = F.softmax(mask, dim=-1)

            if top_p is not None:
                sorted_probs, sorted_idx = torch.sort(probs, descending=True, dim=-1)
                cum_probs = torch.cumsum(sorted_probs, dim=-1)
                # remove tokens with cumulative prob > top_p (keep first above threshold)
                sorted_mask = cum_probs > top_p
                sorted_mask[..., 1:] = sorted_mask[..., :-1].clone()
                sorted_mask[..., 0] = False
                idx_to_remove = sorted_mask.scatter(1, sorted_idx, sorted_mask)
                probs = probs.masked_fill(idx_to_remove.bool(), 0.0)
                probs = probs / probs.sum(dim=-1, keepdim=True).clamp(min=1e-12)

            next_token = torch.multinomial(probs, num_samples=1)  # (1, 1)
            ids = torch.cat([ids, next_token], dim=1)
            if eos_id is not None and next_token.item() == eos_id:
                break
        return ids
