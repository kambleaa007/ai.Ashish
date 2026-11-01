r"""Model hyperparameters for the from-scratch decoder-only Transformer.

Every field maps to a mathematical quantity:
  vocab_size     \|V\|       number of token IDs in the embedding table
  d_model        d           residual-stream width (also called hidden size)
  n_layers       L           number of Transformer blocks
  n_heads        H           number of query heads (MHA) / KV heads (GQA/MQA)
  n_kv_heads     H_kv        number of key/value heads (GQA: 1 < H_kv < H; MQA: 1; MHA: H_kv = H)
  d_ff           d_ff         FFN hidden width (SwiGLU intermediate)
  max_seq_len    T           context window
  rope_base      \theta_0    RoPE base frequency (10000 typical)
  rms_norm_eps   \epsilon    RMSNorm epsilon
  tie_embeddings bool        share input embedding and output LM head weights
r"""

from dataclasses import dataclass


@dataclass
class ModelConfig:
    vocab_size: int = 256
    d_model: int = 128
    n_layers: int = 4
    n_heads: int = 4
    n_kv_heads: int = 4
    d_ff: int = 512
    max_seq_len: int = 128
    rope_base: float = 10000.0
    rms_norm_eps: float = 1e-5
    tie_embeddings: bool = True
    dropout: float = 0.0
    device: str = "cuda" if __import__("torch").cuda.is_available() else "cpu"
    head_dim: int = 0  # set in __post_init__

    def __post_init__(self):
        if self.head_dim == 0:
            assert self.d_model % self.n_heads == 0
            self.head_dim = self.d_model // self.n_heads
