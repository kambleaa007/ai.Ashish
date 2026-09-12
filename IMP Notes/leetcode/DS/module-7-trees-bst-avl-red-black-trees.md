# Module 7: Hierarchical Structures: Trees, BST, AVL & Red-Black Trees (Lec 52–63)

## Lecture Scope
* **Lec-52**: Introduction to Trees | Binary Tree, Almost Complete BT, Full BT, Complete [11]
* **Lec-53**: Binary Search Tree in Data Structure | Insertion and Traversal in BST [12]
* **Lec-54**: Deletion from Binary Search Tree(BST) with Example [12]
* **Lec-55**: Find Preorder, Postorder & Inorder of BST [12]
* **Lec-56**: Preorder, Inorder and Postorder in 5 minute | Tree Traversal [12]
* **Lec-57**: Imp Question on Binary Search Tree | GATE Question [12]
* **Lec-58**: Introduction to AVL Tree in Data Structure [13]
* **Lec-59**: How to Create AVL tree | LL, RR, LR, RL Rotation in AVL [13]
* **Lec-60**: AVL Tree Creation in Data Structure | All Imp Points [13]
* **Lec-61**: Time Complexities of All Trees | Binary Tree, BST, AVL Tree, Heap Tree [13]
* **Lec-62**: Introduction to Red-Black Tree [13]
* **Lec-63**: Insertion in Red Black Tree [14]

---

## 1. Core Logic & Classifications
A Tree is a non-linear hierarchical data structure consisting of nodes connected by directed or undirected edges [11].

### Binary Tree Classifications
* **Full Binary Tree**: Every node has either 0 or 2 children [11].
* **Complete Binary Tree**: Every level is completely filled, except possibly the last level, which is filled from left to right [11].
* **Almost Complete Binary Tree (ACBT)**: Nodes are filled sequentially level by level from left to right [11].

---

## 2. Tree Traversals
1. **Preorder (NLR)**: Visit Node $\to$ Left Subtree $\to$ Right Subtree [12].
2. **Inorder (LNR)**: Visit Left Subtree $\to$ Node $\to$ Right Subtree. *Property: Inorder traversal of a BST yields elements in strictly sorted ascending order* [12].
3. **Postorder (LRN)**: Visit Left Subtree $\to$ Right Subtree $\to$ Node [12].

---

## 3. Binary Search Tree (BST) & Deletion Mechanics
* **BST Property**: For any node $X$, all values in the left subtree $< X$, and all values in the right subtree $> X$ [12].
* **BST Deletion Cases**:
  1. *Leaf Node*: Remove node directly [12].
  2. *Single Child Node*: Replace node with its child [12].
  3. *Two Children Node*: Replace node value with either its **Inorder Predecessor** (maximum value in left subtree) or **Inorder Successor** (minimum value in right subtree), then recursively delete that node [12].

---

## 4. Self-Balancing Search Trees

### A. AVL Trees
An AVL tree is a height-balanced BST where the **Balance Factor (BF)** of every node is constrained to $\{-1, 0, +1\}$ [13]:
$$\text{Balance Factor} = \text{Height}(\text{Left Subtree}) - \text{Height}(\text{Right Subtree})$$

#### Rotations to Fix Imbalance
* **LL Rotation**: Single right rotation for Left-Left imbalance [13].
* **RR Rotation**: Single left rotation for Right-Right imbalance [13].
* **LR Rotation**: Left rotation on left child, then right rotation on root [13].
* **RL Rotation**: Right rotation on right child, then left rotation on root [13].

### B. Red-Black Trees
A self-balancing search tree maintaining balance via node coloring (Red/Black) and strict structural rules:
1. Every node is either Red or Black [13].
2. The root node is always Black [13].
3. No two consecutive Red nodes (No Red-Red parent-child relationship) [13].
4. Every path from a node to its descendant NULL pointers contains the exact same number of Black nodes [13].

---

## 5. Comparative Time Complexity Analysis

| Data Structure | Search (Avg) | Search (Worst) | Insertion (Worst) | Deletion (Worst) |
| :--- | :--- | :--- | :--- | :--- |
| **Binary Tree** | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ [13] |
| **Unbalanced BST** | $O(\log n)$ | $O(n)$ (Skewed tree) [12, 13] | $O(n)$ [12, 13] | $O(n)$ [12, 13] |
| **AVL Tree** | $O(\log n)$ | $O(\log n)$ [13] | $O(\log n)$ [13] | $O(\log n)$ [13] |
| **Heap Tree** | $O(n)$ | $O(n)$ | $O(\log n)$ [13] | $O(\log n)$ [13] |

---

## 6. Active Recall Checkpoints

### Question 1
Why does an AVL Tree guarantee $O(\log n)$ operational bounds whereas a standard BST can degrade to $O(n)$?
* **Answer**: A standard BST can become completely skewed (linear list) upon inserting sorted data, giving $O(n)$ height. AVL trees enforce tree re-balancing via LL, RR, LR, RL rotations after every insertion/deletion, keeping tree height strictly $O(\log n)$ [12, 13].

---
*Grounded in source: Data Structure - YouTube (Gate Smashers) [11–14]*
