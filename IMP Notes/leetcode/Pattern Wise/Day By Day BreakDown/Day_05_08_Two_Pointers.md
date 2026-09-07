# Two Pointers Pattern
## Study Plan - Phase 1: The 'Big 3' Pillars (Days 5–8)

Welcome to the **Two Pointers Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Pointers / Indices over linear structure (Array, List).
* **Complexity Parameters:** Time: O(n) for pairs, O(n^2) for triplets (like 3Sum) | Space: O(1) (requires in-place pointer updates with no extra space).
* **The "Move" (Algorithm Mechanics):** Initialize two pointers: left at the beginning (index 0) and right at the end (n - 1). Evaluate the condition at current pointers. If the sum is too small, increment left. If too large, decrement right. Shrink the pointers inward until they meet.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Sorted array or list**
* • **Searching for a pair, triplet, or collection meeting a specific target sum**
* • **In-place modifications or partitioning of a sequential structure**

---

### 3. Your 4-Day Execution Plan

#### **Day 5**: Learn the opposite-converging pointer structure. Solve 3 Easy Warm-up problems to master basic in-place movement.

#### **Day 6**: Move to Medium problems where sorted data guarantees linear-time coordinate selection (Two Sum II and Container With Most Water).

#### **Day 7**: Learn how to wrap Two Pointers inside a loop to solve triplet summation problems (3Sum, 3Sum Closest).

#### **Day 8**: Peak Challenge: Trapping Rain Water. Solve 1 Hard problem, trace the pointers, write down your mental model, and memorize the Converging Pointer skeleton.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #125** | `Easy` | **Valid Palindrome** | Classic converging pointers comparing characters from both ends inward. |
| **LC #283** | `Easy` | **Move Zeroes** | Fast and slow pointers moving in the same direction to partition an array in-place. |
| **LC #344** | `Easy` | **Reverse String** | In-place array swap using converging pointers at opposite ends. |
| **LC #167** | `Medium` | **Two Sum II - Input Array is Sorted** | The canonical two-pointer sum check where sorted properties guide index steps. |
| **LC #11** | `Medium` | **Container With Most Water** | Pinch the window from outer edges, moving the pointer pointing to the shorter height to maximize area. |
| **LC #15** | `Medium` | **3Sum** | Fixes one element and runs a standard Two Pointers scan on the remainder, carefully skipping duplicates. |
| **LC #16** | `Medium` | **3Sum Closest** | Finds a triplet whose sum is closest to a target, tracking the minimum absolute difference. |
| **LC #80** | `Medium` | **Remove Duplicates from Sorted Array II** | An in-place double-pointer partition allowing duplicates at most twice. |
| **LC #42** | `Hard` | **Trapping Rain Water** | Combines dynamic programming-like state tracks with two converging pointers tracking max-left and max-right. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
