# Top 'K' Elements Pattern
## Study Plan - Phase 3: Advanced Optimization & Graphs (Days 49–52)

Welcome to the **Top 'K' Elements Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Min-Heap (for largest queries) or Max-Heap (for smallest queries).
* **Complexity Parameters:** Time: O(n log k) (insertion into heap of size k) | Space: O(k) (strictly caps heap storage to size k).
* **The "Move" (Algorithm Mechanics):** Create a heap. For 'K largest', initialize a Min-Heap. Iterate through elements: push each element. If heap size exceeds K, pop the top (smallest) element. At the end, the heap contains the K largest elements (with the K-th largest at the top).

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Finding the k largest, smallest, closest, or most frequent items**
* • **Asks for dynamic, rolling rankings over streaming/large datasets**
* • **Explicit desire to avoid O(n log n) sorting operations over the whole set**

---

### 3. Your 4-Day Execution Plan

#### **Day 49**: Deepen dynamic size-k heap checks. Solve 3 Easy Warm-up problems.

#### **Day 50**: Master frequency tracking combined with heap storage. Solve 2 core Medium problems.

#### **Day 51**: Solve 3 Medium problems handling coordinate sorting and segment mappings.

#### **Day 52**: Peak Challenge: Rearrange String k Distance Apart. Use a max-heap and queues to place characters at least k positions apart.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #703** | `Easy` | **Kth Largest Element in a Stream** | Monitors K elements dynamically inside min-heaps. |
| **LC #1046** | `Easy` | **Last Stone Weight** | Pops two heaviest stones from max-heaps and inserts differences recursively. |
| **LC #506** | `Easy` | **Relative Ranks** | Extracts scores in order from max-heaps to map ranks. |
| **LC #215** | `Medium` | **Kth Largest Element in an Array** | Uses a min-heap of size K to find the Kth largest element in linear time. |
| **LC #347** | `Medium` | **Top K Frequent Elements** | Uses hash maps for frequencies, and heap size-K constraints to extract top entries. |
| **LC #973** | `Medium` | **K Closest Points to Origin** | Cuts sorting complexity by checking coordinate distances via max-heaps. |
| **LC #451** | `Medium` | **Sort Characters By Frequency** | Frequencies guide char placement using heap pops. |
| **LC #658** | `Medium` | **Find K Closest Elements** | Finds K closest values to target using custom sorting logic in a heap. |
| **LC #358** | `Hard` | **Rearrange String k Distance Apart** | Heaps dictate character placement, utilizing temp queues for cooling-down intervals. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
