# Merge Intervals Pattern
## Study Plan - Phase 2: Highly Frequent Patterns (Days 17–20)

Welcome to the **Merge Intervals Pattern** Deep Dive! This file acts as your focused curriculum guide for the next 4 days. Remember the rule: *Master the blueprint first. Solve 3 Easy, 5 Medium, and 1 Hard problem, then memorize the base skeleton before moving on.*

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Array/List of intervals sorted by start time.
* **Complexity Parameters:** Time: O(n log n) (dominated by interval sorting) | Space: O(n) (to hold the merged interval output).
* **The "Move" (Algorithm Mechanics):** Sort the intervals by their start time. Iterate through. Compare current interval with the last merged interval. If current start <= previous end, they overlap: merge them by updating previous end to max(previous end, current end). Otherwise, add current interval.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these key indicators inside any LeetCode problem description to immediately diagnose this pattern:
* • **Input elements are ranges with start and end markers (meetings, bookings, schedules)**
* • **Keywords: 'merge', 'overlapping', 'intersection', 'insert interval'**
* • **Optimizing scheduling or finding resource capacities over intervals**

---

### 3. Your 4-Day Execution Plan

#### **Day 17**: Familiarize yourself with interval start-end comparisons. Solve 3 Easy Warm-ups.

#### **Day 18**: Master the sorting step and in-place insertion logic. Solve 2 core Medium problems.

#### **Day 19**: Solve 3 Medium problems handling multi-interval intersections and scheduler limits (Meeting Rooms II).

#### **Day 20**: Peak Challenge: Employee Free Time. Conquer an advanced interval scheduling problem, write down interval overlap conditions, and memorize the sorting template.

---

### 4. Vetted LeetCode Drills

Here is your vertical deep-dive list. Work these problems sequentially:

| LeetCode # | Difficulty | Problem Name | Purpose / Why it was selected |
| :--- | :---: | :--- | :--- |
| **LC #252** | `Easy` | **Meeting Rooms** | Determines if any meetings overlap by sorting and checking adjacent bounds. |
| **LC #605** | `Easy` | **Can Place Flowers** | Familiarizes with boundary interval checking over discrete indices. |
| **LC #122** | `Easy` | **Best Time to Buy and Sell Stock II** | Treats consecutive days as micro-profit intervals to collect maximum sums. |
| **LC #56** | `Medium` | **Merge Intervals** | The baseline problem. Sorts and combines overlapping start/end values. |
| **LC #57** | `Medium` | **Insert Interval** | Inserts a new interval into a pre-sorted list, merging overlaps on-the-fly without re-sorting. |
| **LC #435** | `Medium` | **Non-overlapping Intervals** | Greedy approach over sorted intervals to remove the minimum overlap counts. |
| **LC #253** | `Medium` | **Meeting Rooms II** | Uses a min-heap to keep track of end times, finding the minimum rooms needed simultaneously. |
| **LC #986** | `Medium` | **Interval List Intersections** | Finds intersection intervals of two sorted lists in linear time with dual pointers. |
| **LC #759** | `Hard` | **Employee Free Time** | Merges intervals across multiple sorted list structures to find silent, non-overlapping gaps. |

---

### 5. Retain & Practice Checklist
- [ ] Read the problem and say the **Trigger Cue** out loud before writing any code.
- [ ] Implement a brute-force approach first to see the bottleneck.
- [ ] Apply the pattern's structural skeleton.
- [ ] Verify you are within the standard Time/Space complexities.
- [ ] Redo the problem 2 days later using spaced repetition if you struggled.
- [ ] Write your own personal "aha!" moment in your developer study journal.
