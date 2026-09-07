# Sliding Window Pattern
## Study Plan - Phase 1: The 'Big 3' Pillars (Days 1–4)

Welcome to the **Sliding Window Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Two pointers (representing left and right window bounds), Hash Map/Set for tracking element uniqueness and frequency.
* **Complexity Parameters:** Time: O(n) (single-pass linear scan) | Space: O(k) or O(1) (where k is the size of the unique element set or character alphabet).
* **The "Move" (Algorithm Mechanics):** Set up left and right pointers at index 0. Advance the right pointer to expand the window. The second your condition/constraint is violated, advance the left pointer to contract the window. Record the maximum or minimum window size at each valid state.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Contiguous substring or subarray**
* • **Keywords like 'longest', 'shortest', 'count', or 'exactly K elements' under a specific rule**
* • **Tracking rolling data window sizes over sequential data structures**

---

### 3. Your 4-Day Execution Plan

#### **Day 1**: Learn the core blueprint. Solve 3 Easy Warm-up problems to build physical intuition for the two pointers representing the bounds.

#### **Day 2**: Move into variable-sized window problems. Solve 2 Medium problems focusing on uniqueness tracking using sets/maps.

#### **Day 3**: Increase complexity with count replacement logic. Solve 3 Medium problems using advanced rolling frequency dictionaries.

#### **Day 4**: Peak Challenge: Conquer the hard sliding window standard. Redo any missed problem, write down 'aha' moments, and practice writing the template from memory.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #643** | `Easy` | **Maximum Average Subarray I** | Builds basic window tracking and rolling sum calculation with a fixed window size. |
| **LC #219** | `Easy` | **Contains Duplicate II** | Teaches window range constraint combined with hashing for element checks. |
| **LC #1876** | `Easy` | **Substrings of Size Three with Distinct Characters** | Simple string sliding window with unique character constraints. |
| **LC #3** | `Medium` | **Longest Substring Without Repeating Characters** | Standard variable-size sliding window with hash sets for dynamic contraction. |
| **LC #904** | `Medium` | **Fruit Into Baskets** | Variable-size sliding window restricting the unique element count to exactly 2. |
| **LC #424** | `Medium` | **Longest Repeating Character Replacement** | Tracks maximum frequency of a single character in the window to allow dynamic modifications. |
| **LC #567** | `Medium` | **Permutation in String** | Uses two frequency maps to check if the window contains a perfect permutation of another string. |
| **LC #438** | `Medium` | **Find All Anagrams in a String** | Applies a fixed-size window sliding across a string matching dynamic character frequencies. |
| **LC #76** | `Hard` | **Minimum Window Substring** | The ultimate sliding window challenge. Variable-size window with complex validation of matching counts. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
