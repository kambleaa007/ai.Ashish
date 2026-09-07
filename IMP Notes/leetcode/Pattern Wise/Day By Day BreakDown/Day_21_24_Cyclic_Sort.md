# Cyclic Sort Pattern
## Study Plan - Phase 2: Highly Frequent Patterns (Days 21–24)

Welcome to the **Cyclic Sort Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Array mutated in-place.
* **Complexity Parameters:** Time: O(n) (while it looks like nested loops, each element is swapped to its correct spot at most once) | Space: O(1).
* **The "Move" (Algorithm Mechanics):** Iterate index i from 0 to n - 1. While nums[i] is in range [1, n] and nums[i] != nums[nums[i] - 1] (the number is not at its correct index), swap nums[i] with nums[nums[i] - 1]. If they match or are out of bounds, increment i.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Input is an array of consecutive numbers in a given range (e.g., 1 to n)**
* • **Finding missing numbers, duplicates, or out-of-place values**
* • **Stringent in-place mutation constraints with O(1) space**

---

### 3. Your 4-Day Execution Plan

#### **Day 21**: Learn the simple swap loop. Solve 3 Easy Warm-up problems to master 1-to-n alignment.

#### **Day 22**: Solve 2 Medium problems targeting duplicates and missing arrays using cyclic index modifications.

#### **Day 23**: Identify implicit cyclic structures where constraints imply a fixed integer range. Solve 3 Medium problems.

#### **Day 24**: Peak Challenge: First Missing Positive. Solve this Hard LeetCode problem using cyclic sort to find index mismatches in linear time with O(1) space.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #268** | `Easy` | **Missing Number** | Standard 0-to-n index placement to detect the single missing array number. |
| **LC #448** | `Easy` | **Find All Numbers Disappeared in an Array** | Applies cyclic sorting to find indices where correct values are missing. |
| **LC #645** | `Easy` | **Set Mismatch** | Exposes both the duplicate and missing numbers in a single cyclic scan. |
| **LC #287** | `Medium` | **Find the Duplicate Number** | Solves duplicate identification using in-place cyclic sort overrides. |
| **LC #442** | `Medium` | **Find All Duplicates in an Array** | Scans array and collects all cyclic sorting mismatches representing duplicates. |
| **LC #41** | `Medium/Hard` | **First Missing Positive** | Cyclic-sorts all valid positive integers; the first index containing a mismatch is the answer. |
| **LC #287** | `Medium` | **Find the Duplicate Number (Marking Method)** | Alternate approach to mark indices as negative to check seen states. |
| **LC #448** | `Medium` | **Find All Numbers Disappeared II** | In-place array marking variation to find all absent sequence elements. |
| **LC #41** | `Hard` | **First Missing Positive (Optimal)** | True classic in-place constraint sort to resolve the absolute minimum positive hole. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
