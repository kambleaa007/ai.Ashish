# Subsets & Combinatorial Backtracking Pattern
## Study Plan - Phase 3: Advanced Optimization & Graphs (Days 41–44)

Welcome to the **Subsets & Combinatorial Backtracking Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Recursion Tree.
* **Complexity Parameters:** Time: Exponential (O(2^n) subsets, O(n!) permutations) | Space: O(n) (system stack depth matches recursion height).
* **The "Move" (Algorithm Mechanics):** At current step, evaluate base case (e.g., path is complete -> record, target sum is reached). Loop through remaining options. If option is valid: Choose option (modify path state), Recurse (call backtrack recursively), Un-choose option (restore path state to try next options).

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Output must contain combinations, permutations, subsets, or arrangements**
* • **Keywords: 'all valid permutations', 'all paths', 'all combinations'**
* • **Constraint-driven search requiring backtracking of state options**

---

### 3. Your 4-Day Execution Plan

#### **Day 41**: Understand the Pick / Not Pick and State Swap strategies. Solve 3 Easy/Medium hybrid Warm-up problems.

#### **Day 42**: Conquer standard set generation. Solve 2 core Medium problems (Subsets, Permutations).

#### **Day 43**: Introduce sorting, duplication elimination, and string arrays. Solve 3 Medium problems.

#### **Day 44**: Peak Challenge: N-Queens. Handle 2D grid cell checks, write backtrack constraints, and manage diagonal/column checks.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #257** | `Easy` | **Binary Tree Paths** | Simple DFS tracking strings representing paths to leaves. |
| **LC #1863** | `Easy` | **Sum of All Subset XOR Totals** | Familiarizes with Pick / Not Pick decision branches. |
| **LC #401** | `Easy` | **Binary Watch** | Simple backtrack tracking LED count combinations. |
| **LC #78** | `Medium` | **Subsets** | The canonical subset generation blueprint using Pick / Not Pick recursive paths. |
| **LC #46** | `Medium` | **Permutations** | Generates all possible orderings by keeping track of visited elements recursively. |
| **LC #39** | `Medium` | **Combination Sum** | Recursively accumulates element values, allowing repetitive elements until target is exceeded. |
| **LC #77** | `Medium` | **Combinations** | Finds combinations of size k from numbers up to n. |
| **LC #79** | `Medium` | **Word Search** | Runs matrix DFS tracking characters, resetting visited cells upon backtracking. |
| **LC #51** | `Hard` | **N-Queens** | Validates queen positions on boards, recursive backtracking to find all valid placements. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
