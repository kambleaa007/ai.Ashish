# Tree Depth-First Search Pattern
## Study Plan - Phase 2: Highly Frequent Patterns (Days 33–36)

Welcome to the **Tree Depth-First Search Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Recursion stack (system call stack) or explicit Stack.
* **Complexity Parameters:** Time: O(n) | Space: O(h) where h is the tree height (worst-case recursive call stack depth is O(n) for a skewed tree).
* **The "Move" (Algorithm Mechanics):** At current node, execute base case check (e.g., node is null). Run processing. Recursively call DFS on the left child, and recursively call DFS on the right child. Return combined status to the parent.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Exploring all possible leaf paths or branch trajectories**
* • **Pre-order, In-order, or Post-order traversal requirements**
* • **Properties that bubble up from children to parent nodes**

---

### 3. Your 4-Day Execution Plan

#### **Day 33**: Build deep recursive call confidence. Solve 3 Easy Warm-up problems examining depths and properties.

#### **Day 34**: Practice path reconstruction. Solve 2 Medium problems tracking values from root to leaf.

#### **Day 35**: Master ancestor checks, BST rules, and serializations. Solve 3 Medium problems.

#### **Day 36**: Peak Challenge: Binary Tree Maximum Path Sum. Coordinate complex sub-tree summaries where path routes can start and end anywhere.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #104** | `Easy` | **Maximum Depth of Binary Tree** | Simple recursive bottom-up leaf depth accumulation. |
| **LC #112** | `Easy` | **Path Sum** | Recursively subtracts node values along paths, validating if a target sum reaches 0 at a leaf. |
| **LC #226** | `Easy` | **Invert Binary Tree** | Recursively swaps left and right child pointers at every tree node. |
| **LC #113** | `Medium` | **Path Sum II** | Tracks current path contents and appends copies to lists upon reaching leaf sums. |
| **LC #129** | `Medium` | **Sum Root to Leaf Numbers** | Carries numerical base-10 values down paths, returning cumulative sums from branches. |
| **LC #236** | `Medium` | **Lowest Common Ancestor of a Binary Tree** | Bubbles up matching node detections to locate split-points in parent trees. |
| **LC #98** | `Medium` | **Validate Binary Search Tree** | Passes min/max constraint ranges down recursion tree to check node bounds. |
| **LC #105** | `Medium` | **Construct Binary Tree from Preorder and Inorder Traversal** | Uses pre-order roots and in-order boundaries to build trees recursively. |
| **LC #124** | `Hard` | **Binary Tree Maximum Path Sum** | Calculates local node branches, updating global max variables across recursive returns. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
