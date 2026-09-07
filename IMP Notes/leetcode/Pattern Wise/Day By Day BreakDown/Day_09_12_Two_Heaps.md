# Two Heaps Pattern
## Study Plan - Phase 1: The 'Big 3' Pillars (Days 9–12)

Welcome to the **Two Heaps Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Min-Heap and Max-Heap simultaneously.
* **Complexity Parameters:** Time: O(log n) insertion, O(1) median lookup | Space: O(n) to store dataset elements.
* **The "Move" (Algorithm Mechanics):** Split the dataset into two halves. Store the smaller half in a Max-Heap (making the largest of the small half accessible at the top) and the larger half in a Min-Heap (making the smallest of the large half accessible at the top). Balance sizes so they differ by at most 1.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Tracking running medians of streaming data**
* • **Identifying extreme values (min/max) dynamically across splitting halves**
* • **Dynamic datasets requiring continuous insertion and calculation of middle values**

---

### 3. Your 4-Day Execution Plan

#### **Day 9**: Build deep familiarity with Heap mechanics. Solve 3 Easy problems focusing on heap insertions and pop boundaries.

#### **Day 10**: Solve 2 Medium problems where multiple lists are dynamically tracked, or elements are partitioned based on priority.

#### **Day 11**: Solve 3 Medium problems combining heaps with custom classes or coordinate distances.

#### **Day 12**: Peak Challenge: Find Median from Data Stream. Implement a dynamic split-heap structure, write the median balance skeleton, and verify O(log n) efficiency.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #703** | `Easy` | **Kth Largest Element in a Stream** | Directly applies Min-Heap constraints to track a running threshold of elements. |
| **LC #506** | `Easy` | **Relative Ranks** | Familiarizes with custom heap sort sorting mechanics. |
| **LC #1046** | `Easy` | **Last Stone Weight** | Familiarizes with heap pop-pop-push operations (greedy simulation). |
| **LC #373** | `Medium` | **Find K Pairs with Smallest Sums** | Uses a min-heap to dynamically track minimal pairs without exhaustively computing all pairs. |
| **LC #378** | `Medium` | **Kth Smallest Element in a Sorted Matrix** | Treats matrix rows as sorted lists and merges them using a heap. |
| **LC #621** | `Medium` | **Task Scheduler** | Uses a heap to dynamically prioritize highest frequency elements with cooling timers. |
| **LC #973** | `Medium` | **K Closest Points to Origin** | Maintains a max-heap of size K containing the closest Euclidean distance points. |
| **LC #1834** | `Medium` | **Single-Threaded CPU** | Simulates CPU task processing based on processing time and index ordering. |
| **LC #295** | `Hard` | **Find Median from Data Stream** | The canonical Two Heaps question. Tracks medians across a dual heap configuration. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
