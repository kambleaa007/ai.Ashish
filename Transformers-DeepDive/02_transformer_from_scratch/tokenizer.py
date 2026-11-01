"""Character-level tokenizer (bytes / ASCII) with an optional BPE demonstration.

Why char-level: zero external dependencies, deterministic, and every training
string maps to the same vocabulary so we can focus on the Transformer math rather
than tokenization algorithms.

For real LLMs (Qwen/Gemma) this is replaced by BPE/WordPiece/Unigram with vocab
sizes of 30k–150k tokens; see 04_architecture_research for how Qwen's tiktoken
and Gemma's SentencePiece differ.
"""

from typing import List


class CharTokenizer:
    def __init__(self, vocab: List[str] | None = None):
        if vocab is None:
            # Printable ASCII + control chars; index 0 = padding
            vocab = ["<pad>", "<bos>", "<eos>", "<unk>"] + [chr(i) for i in range(32, 127)]
        self.vocab = list(vocab)
        self.stoi = {ch: i for i, ch in enumerate(self.vocab)}
        self.itos = {i: ch for i, ch in enumerate(self.vocab)}
        self.pad_id = self.stoi["<pad>"]
        self.bos_id = self.stoi["<bos>"]
        self.eos_id = self.stoi["<eos>"]
        self.unk_id = self.stoi["<unk>"]

    def __len__(self) -> int:
        return len(self.vocab)

    def encode(self, text: str, add_bos: bool = False, add_eos: bool = False) -> List[int]:
        ids = [self.stoi.get(ch, self.unk_id) for ch in text]
        if add_bos:
            ids = [self.bos_id] + ids
        if add_eos:
            ids = ids + [self.eos_id]
        return ids

    def decode(self, ids: List[int]) -> str:
        return "".join(self.itos.get(i, "?") for i in ids if i not in (self.pad_id,))

    def batch_encode(self, texts: List[str], max_len: int, add_bos: bool = True, add_eos: bool = True):
        """Encode a list of strings into a padded tensor + attention mask.

        Returns:
          input_ids: (B, T) int64
          attention_mask: (B, T) bool  (True = real token, False = padding)
        """
        encoded = [self.encode(t, add_bos=add_bos, add_eos=add_eos)[:max_len] for t in texts]
        input_ids = []
        masks = []
        for ids in encoded:
            pad_len = max_len - len(ids)
            input_ids.append(ids + [self.pad_id] * pad_len)
            masks.append([True] * len(ids) + [False] * pad_len)
        import torch
        return (
            torch.tensor(input_ids, dtype=torch.long),
            torch.tensor(masks, dtype=torch.bool),
        )


if __name__ == "__main__":
    tok = CharTokenizer()
    print("vocab size:", len(tok))
    ids = tok.encode("hello", add_bos=True, add_eos=True)
    print("encode('hello'):", ids)
    print("decode:", tok.decode(ids))
