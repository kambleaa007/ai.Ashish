"""PyTorch tensors + autograd from first principles.

What this teaches:
- torch.Tensor creation, dtype, device, requires_grad
- In-place vs out-of-place ops and their effect on the computation graph
- .backward(), .grad, .detach(), torch.no_grad()
- Graph inspection: .grad_fn, .is_leaf
- A manual scalar "neuron" trained with gradient descent (no nn.Module yet)
"""

import torch


def tensor_basics():
    print("=== Tensor basics ===")
    x = torch.tensor([[1.0, 2.0], [3.0, 4.0]], requires_grad=True)
    print("x =\n", x)
    print("dtype:", x.dtype, "| device:", x.device, "| shape:", x.shape, "| requires_grad:", x.requires_grad)

    # view vs reshape vs clone
    y = x.view(-1)          # shares memory (if contiguous)
    z = x.clone()           # independent copy
    print("view shape:", y.shape, "| clone shape:", z.shape)

    # device move
    if torch.cuda.is_available():
        print("x on CUDA:\n", x.cuda())


def autograd_graph():
    print("\n=== Autograd graph ===")
    a = torch.tensor(2.0, requires_grad=True)
    b = torch.tensor(3.0, requires_grad=True)
    c = a * b          # mul
    d = c + a          # add
    loss = d * d       # square

    print("loss.grad_fn:", loss.grad_fn)
    print("loss.is_leaf:", loss.is_leaf, "| a.is_leaf:", a.is_leaf)

    loss.backward()
    print("d(loss)/da =", a.grad, "(expect:", 2 * (a * b + a) * (b + 1), ")")
    print("d(loss)/db =", b.grad, "(expect:", 2 * (a * b + a) * a, ")")

    # detach breaks the graph
    detached = loss.detach()
    print("detached requires_grad:", detached.requires_grad)

    # no_grad context
    with torch.no_grad():
        e = a * b
    print("inside no_grad requires_grad:", e.requires_grad)


def manual_neuron():
    """A single linear neuron y = w*x + b trained by hand with SGD.

    This mirrors what nn.Linear + optim.SGD do under the hood.
    """
    print("\n=== Manual neuron (y = w*x + b) ===")
    torch.manual_seed(0)
    X = torch.tensor([[0.0], [1.0], [2.0], [3.0]])
    Y = torch.tensor([[2.0], [4.0], [6.0], [8.0]])

    w = torch.randn(1, 1, requires_grad=True)
    b = torch.zeros(1, requires_grad=True)

    lr = 0.1
    for epoch in range(50):
        # forward
        Y_pred = X @ w + b
        loss = ((Y_pred - Y) ** 2).mean()

        # backward
        loss.backward()

        # update (no_grad so we don't track the update in the graph)
        with torch.no_grad():
            w -= lr * w.grad
            b -= lr * b.grad

        # zero grads for next iteration
        w.grad.zero_()
        b.grad.zero_()

        if epoch % 10 == 0:
            print(f"epoch {epoch}: loss={loss.item():.6f}, w={w.item():.4f}, b={b.item():.4f}")

    print("Final: y =", round(w.item(), 4), "* x +", round(b.item(), 4), "(expect w ~= 2, b ~= 0)")


if __name__ == "__main__":
    tensor_basics()
    autograd_graph()
    manual_neuron()
