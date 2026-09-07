# Tree Breadth-First Search Pattern
## Study Plan - Phase 2: Highly Frequent Patterns (Days 29–32)

Welcome to the **Tree Breadth-First Search Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Queue (FIFO structure).
* **Complexity Parameters:** Time: O(n) (visits every node once) | Space: O(n) (worst-case queue holds widest level, roughly O(n/2) for full tree).
* **The "Move" (Algorithm Mechanics):** Initialize a queue containing the root node. While queue is not empty, count the current queue size (representing nodes at this level). Loop through size times: pop a node, record its value, and push its unvisited children. Move to the next level.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Level-by-level processing of tree nodes**
* • **Finding the shortest path or nearest neighbor in an unweighted tree structure**
* • **Assembling node values grouped by depth level**

---

### 3. Your 4-Day Execution Plan

#### **Day 29**: Establish queue loop structure. Solve 3 Easy Warm-up problems counting depths and averages.

#### **Day 30**: Solve 2 Medium problems grouping level values inside a List of Lists (Binary Tree Level Order Traversal).

#### **Day 31**: Handle zigzag variations, right-side perspectives, and adjacent horizontal pointers. Solve 3 Medium problems.

#### **Day 32**: Peak Challenge: Word Ladder. Treat word permutations as tree/graph branches and solve using level-by-level BFS shortest path search.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #104** | `Easy` | **Maximum Depth of Binary Tree (BFS)** | Tracks the level count iteratively to determine tree depth. |
| **LC #111** | `Easy` | **Minimum Depth of Binary Tree** | Checks for leaf nodes level-by-level to return shortest path instantly. |
| **LC #637** | `Easy` | **Average of Levels in Binary Tree** | Collects level averages by computing cumulative sums across each level queue size. |
| **LC #102** | `Medium` | **Binary Tree Level Order Traversal** | The baseline BFS. Groups node values by levels into arrays. |
| **LC #107** | `Medium` | **Binary Tree Level Order Traversal II** | Groups level arrays and inserts them in reverse order (bottom-up). |
| **LC #103** | `Medium` | **Binary Tree Zigzag Level Order Traversal** | Alternates the insertion direction of level lists based on parity. |
| **LC #199** | `Medium` | **Binary Tree Right Side View** | Picks the absolute last element of each level queue to construct a right-side profile. |
| **LC #116** | `Medium` | **Populating Next Right Pointers in Each Node** | Links adjacent horizontal nodes on the same level using BFS level traversal. |
| **LC #127** | `Hard` | **Word Ladder** | Models word transitions as an unweighted graph, finding the absolute minimum path from start to end. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
