"""nn.Module, parameters, optimizers, and a tiny MLP trained end to end.

What this teaches:
- nn.Module registration of parameters and submodules
- state_dict / load_state_dict (checkpointing)
- optim.SGD / optim.Adam step + zero_grad
- train() / eval() modes (dropout/batchnorm behavior)
- A hand-rolled training loop (foreshadows the Transformer trainer in 02)
"""

import torch
import torch.nn as nn
import torch.optim as optim


class TinyMLP(nn.Module):
    def __init__(self, in_dim: int, hidden: int, out_dim: int):
        super().__init__()
        self.fc1 = nn.Linear(in_dim, hidden)
        self.act = nn.ReLU()
        self.fc2 = nn.Linear(hidden, out_dim)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (batch, in_dim) -> (batch, out_dim)
        h = self.act(self.fc1(x))
        return self.fc2(h)


def module_inspection():
    print("=== nn.Module inspection ===")
    model = TinyMLP(2, 8, 1)
    print(model)

    # named parameters
    print("\nNamed parameters:")
    for name, param in model.named_parameters():
        print(f"  {name:12s} tuple={tuple(param.shape)} requires_grad={param.requires_grad}")

    # state_dict (checkpoint)
    sd = model.state_dict()
    print("\nstate_dict keys:", list(sd.keys()))

    # clone and load
    model2 = TinyMLP(2, 8, 1)
    model2.load_state_dict(sd)
    print("load_state_dict OK; params equal:",
        torch.equal(model.fc1.weight, model2.fc1.weight))


def train_tiny_mlp():
    print("\n=== Train TinyMLP on XOR ===")
    torch.manual_seed(0)
    X = torch.tensor([[0., 0.], [0., 1.], [1., 0.], [1., 1.]])
    Y = torch.tensor([[0.], [1.], [1.], [0.]])

    model = TinyMLP(2, 8, 1)
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.SGD(model.parameters(), lr=0.5)

    model.train()
    for epoch in range(500):
        optimizer.zero_grad()
        logits = model(X)
        loss = criterion(logits, Y)
        loss.backward()
        optimizer.step()
        if epoch % 100 == 0:
            with torch.no_grad():
                probs = torch.sigmoid(model(X))
                print(f"epoch {epoch}: loss={loss.item():.4f} probs={probs.squeeze().tolist()}")

    model.eval()
    with torch.no_grad():
        print("Final predictions:", torch.sigmoid(model(X)).squeeze().round().tolist())


def optimizer_states():
    print("\n=== Optimizer state (Adam momentum) ===")
    p = torch.nn.Parameter(torch.randn(3))
    opt = optim.Adam([p], lr=0.01)
    loss = (p ** 2).sum()
    loss.backward()
    opt.step()
    state = opt.state[p]
    print("Adam state keys:", list(state.keys()))
    print("step:", state.get("step"), "exp_avg shape:", tuple(state["exp_avg"].shape))


if __name__ == "__main__":
    module_inspection()
    train_tiny_mlp()
    optimizer_states()
