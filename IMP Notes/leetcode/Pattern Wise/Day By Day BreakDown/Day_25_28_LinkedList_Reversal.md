# In-place Linked List Reversal Pattern
## Study Plan - Phase 2: Highly Frequent Patterns (Days 25–28)

Welcome to the **In-place Linked List Reversal Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Linked List with auxiliary tracking pointers (`prev`, `curr`, `next`).
* **Complexity Parameters:** Time: O(n) | Space: O(1) (requires swapping existing pointers on-the-fly).
* **The "Move" (Algorithm Mechanics):** Initialize `prev = null`, `curr = head`. Loop through the list. Temporarily store `next = curr.next`. Set `curr.next = prev` (reverse the pointer direction). Move pointers forward: `prev = curr`, `curr = next`.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Rearranging or reversing pointers in a linked list structure**
* • **Modifying a sublist or nodes grouped in sizes of K**
* • **Absolutely no allocation of new nodes (must mutate pointers in-place)**

---

### 3. Your 4-Day Execution Plan

#### **Day 25**: Nail the 3-pointer swap movement from memory. Solve 3 Easy Warm-up problems.

#### **Day 26**: Solve 2 Medium problems focusing on sublist boundaries (reversing only from position m to n).

#### **Day 27**: Solve 3 Medium problems handling swapping pairs and rotating nodes around cyclic offsets.

#### **Day 28**: Peak Challenge: Reverse Nodes in k-Group. Implement a highly structured node count lookup and multi-sublist in-place reversal.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #206** | `Easy` | **Reverse Linked List** | The foundational 3-pointer state swap representing clean list reversal. |
| **LC #234** | `Easy` | **Palindrome Linked List** | Finds list middle, reverses the second half in-place, and compares values with the first half. |
| **LC #83** | `Easy` | **Remove Duplicates from Sorted List** | Practices pointer redirections to drop overlapping nodes in-place. |
| **LC #92** | `Medium` | **Reverse Linked List II** | Reverses a sublist between explicit indices, carefully linking boundaries. |
| **LC #24** | `Medium` | **Swap Nodes in Pairs** | Swaps adjacent nodes iteratively or recursively via in-place linking. |
| **LC #143** | `Medium` | **Reorder List (Reversal)** | Nails the half-reversal step to weave front and end nodes together. |
| **LC #61** | `Medium` | **Rotate List** | Connects list tail to head to form a cycle, then breaks it at the correct offset index. |
| **LC #328** | `Medium` | **Odd Even Linked List** | Group odd and even indexed nodes separately and merges them in-place. |
| **LC #25** | `Hard` | **Reverse Nodes in k-Group** | Reverses lists in repeating blocks of size k, maintaining absolute links between groups. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
