# Matrix DFS & BFS Pattern
## Study Plan - Phase 2: Highly Frequent Patterns (Days 37–40)

Welcome to the **Matrix DFS & BFS Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** 2D Array, Queue/Stack, Visited state markers.
* **Complexity Parameters:** Time: O(R * C) where R is rows and C is columns | Space: O(R * C) for visited tracking arrays or recursive system limits.
* **The "Move" (Algorithm Mechanics):** Scan the grid cell by cell. When hitting a starting trigger coordinate (like 1 for land), initialize DFS or BFS. Walk the 4 directions (up, down, left, right). Change cell values in-place (or record in a visited set) immediately to prevent infinite loops.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Input is a 2D grid, binary matrix, or maze mapping coordinates**
* • **Connected horizontal/vertical components, 'islands', or 'regions'**
* • **Shortest path search or flood fills across grid coordinates**

---

### 3. Your 4-Day Execution Plan

#### **Day 37**: Develop grid coordinate transition arrays. Solve 3 Easy Warm-up problems.

#### **Day 38**: Master island extraction. Solve 2 Medium problems isolating grid regions.

#### **Day 39**: Compare Multi-source BFS (shortest path) with DFS (flood fills). Solve 3 Medium problems.

#### **Day 40**: Peak Challenge: Shortest Path in a Grid with Obstacles Elimination. Implement advanced coordinate tracking combining BFS levels with active asset state checks.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #733** | `Easy` | **Flood Fill** | Baseline matrix DFS recursively coloring connected components. |
| **LC #463** | `Easy` | **Island Perimeter** | Validates boundary count checks over island coordinate cells. |
| **LC #542** | `Easy` | **01 Matrix (Warm-up)** | Basic BFS distance setup for grid coordinates. |
| **LC #200** | `Medium` | **Number of Islands** | The legendary grid DFS. Counts and extracts disjoint coordinate groups. |
| **LC #695** | `Medium` | **Max Area of Island** | DFS tracking cumulative cell sums during island walks to return maximum counts. |
| **LC #130** | `Medium` | **Surrounded Regions** | DFS starts at grid boundaries to protect connected land, flipping the remaining holes. |
| **LC #994** | `Medium` | **Rotting Oranges** | Multi-source BFS. Processes coordinate updates level-by-level using an initial queue of multiple points. |
| **LC #542** | `Medium` | **01 Matrix** | Multi-source BFS finding shortest distance of every cell from a set of target inputs. |
| **LC #1293** | `Hard` | **Shortest Path in a Grid with Obstacles Elimination** | Optimal BFS routing tracking visited locations alongside remaining obstacle-removal limits. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
