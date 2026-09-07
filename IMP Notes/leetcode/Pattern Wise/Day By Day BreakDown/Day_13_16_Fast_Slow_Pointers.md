# Fast & Slow Pointers Pattern
## Study Plan - Phase 2: Highly Frequent Patterns (Days 13–16)

Welcome to the **Fast & Slow Pointers Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Linked List Nodes / Array indices.
* **Complexity Parameters:** Time: O(n) | Space: O(1) (zero allocations).
* **The "Move" (Algorithm Mechanics):** Set slow pointer at head, fast pointer at head. In each step, move slow forward by 1 node, fast forward by 2 nodes. If fast reaches the end (null), no cycle exists. If slow and fast collide, a cycle is present. To find the cycle start, reset slow to head, move both 1 step at a time until they collide.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Linked list structures or indices mimicking circular connections**
* • **Keywords: 'cycle', 'loop', 'circular', or finding the 'middle' node**
* • **Hard constraint of O(1) auxiliary space over linear list mutations**

---

### 3. Your 4-Day Execution Plan

#### **Day 13**: Learn cycle detection basics (Floyd's Tortoise and Hare). Solve 3 Easy Warm-up problems.

#### **Day 14**: Solve 2 Medium problems where arrays are treated as implicit linked lists with cyclical transitions.

#### **Day 15**: Explore list mutations, reordering, and circular walks. Solve 3 Medium problems.

#### **Day 16**: Peak Challenge: Find the cycle start or reverse sub-cycles in-place. Review the O(1) space logic and memorize the fast-and-slow skeleton.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #141** | `Easy` | **Linked List Cycle** | The entry point for Floyd's algorithm. Simple cycle detection. |
| **LC #202** | `Easy` | **Happy Number** | Demonstrates cycle detection in number sequences where numbers eventually loop back. |
| **LC #876** | `Easy` | **Middle of the Linked List** | Moves fast pointer at 2x speed; when it finishes, slow is exactly at the middle. |
| **LC #142** | `Medium` | **Linked List Cycle II** | Locates the exact start node of the cycle using mathematical pointer resets. |
| **LC #287** | `Medium` | **Find the Duplicate Number** | Treats an array as a linked list where indices represent node addresses, exposing duplicates as a cycle. |
| **LC #143** | `Medium` | **Reorder List** | Splits a list in half with fast/slow pointers, reverses the second half, and merges them. |
| **LC #457** | `Medium` | **Circular Array Loop** | Checks for cycles inside index-jump arrays with positive/negative moves. |
| **LC #148** | `Medium` | **Sort List** | Splits list using fast/slow pointer to perform optimal O(n log n) merge sort. |
| **LC #25** | `Hard` | **Reverse Nodes in k-Group** | Combines group length checking, fast pointer bounds, and localized list reversals. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
