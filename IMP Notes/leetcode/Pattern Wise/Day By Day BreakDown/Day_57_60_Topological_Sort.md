# Topological Sort Pattern
## Study Plan - Phase 3: Advanced Optimization & Graphs (Days 57–60)

Welcome to the **Topological Sort Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Adjacency List (Graph representation), Indegree Array, Queue.
* **Complexity Parameters:** Time: O(V + E) | Space: O(V + E) (where V is vertices and E is edges).
* **The "Move" (Algorithm Mechanics):** Calculate indegree counts for all vertices. Push all vertices with indegree 0 (no prerequisites) into a queue. While queue is not empty: pop vertex u, append to result. For each outgoing neighbor v of u, decrement indegree[v]. If indegree[v] reaches 0, push v into queue. If result length matches total nodes, a valid sort exists.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Input tasks have prerequisites, dependencies, or ordered build steps**
* • **Directed Acyclic Graphs (DAG) mapping item dependencies**
* • **Finding a valid sequence or determining if courses can be completed without circular locks**

---

### 3. Your 4-Day Execution Plan

#### **Day 57**: Build graphs and indegree maps from list arrays. Solve 3 Easy/Medium Warm-ups.

#### **Day 58**: Master course dependency validations. Solve 2 core Medium problems (Course Schedule I & II).

#### **Day 59**: Check for cycle existence and multiple valid paths. Solve 3 Medium problems.

#### **Day 60**: Peak Challenge: Alien Dictionary. Build character graphs based on dictionary lexicographical strings and run Topological Sort to find alphabetical orders.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #310** | `Easy/Medium` | **Minimum Height Trees (Setup)** | Prunes outer leaf nodes (indegree 1) inwards to identify centroids. |
| **LC #415** | `Easy` | **Add Strings (DAG Prep)** | Builds basic index step sequencing. |
| **LC #141** | `Easy` | **Cycle Detection Basics** | Graph cycle intuition baseline. |
| **LC #207** | `Medium` | **Course Schedule** | Uses Kahn's algorithm topological sort to detect if cycles exist (preventing course graduation). |
| **LC #210** | `Medium` | **Course Schedule II** | Returns the exact topological sort path of course schedules. |
| **LC #802** | `Medium` | **Find Eventual Safe States** | Reverse topological sorting or graph color-marking to find terminal-pointing nodes. |
| **LC #210** | `Medium` | **Course Schedule II (DFS variant)** | Runs alternative topological sort using recursion and backtracking stack tracking. |
| **LC #1136** | `Medium` | **Parallel Courses** | Calculates the maximum levels (semesters) needed by topological BFS grouping. |
| **LC #269** | `Hard` | **Alien Dictionary** | Extracts alphabetical relationships from sorted words, runs Kahn's algorithm to resolve lexicographical order. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
