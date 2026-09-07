# Days 17–20: Master Merge Intervals (The Definitive Guide)
## Study Plan - Phase 2: Highly Frequent Patterns

Welcome to the **Merge Intervals** masterclass study guide. Interval overlaps represent the highest frequency pattern for companies organizing continuous calendar dates, resource allocations, or event scheduling.

---

### 1. Architectural Deep Dive & Mechanics

The core strategy for interval problems is almost always **Sorting**. By sorting intervals by their **start times**, we simplify overlap detection from a combinatorial $O(n^2)$ search to a single-pass linear scan.

#### **Visualizing Overlap States**
Given two sorted intervals $A$ and $B$ (where $A.	ext{start} \le B.	ext{start}$):

```
State 1: No Overlap
A: [1, 5]
B:       [6, 10]
Action: No intersection. Append A to results, make B the active reference interval.

State 2: Overlap (B sits partially within A)
A: [1, 6]
B:   [3, 8]
Action: Merge B into A.
New end = max(A.end, B.end) = max(6, 8) = 8. Merged: [1, 8]

State 3: Complete Subsumption (B sits entirely within A)
A: [1, 10]
B:   [3, 8]
Action: Merge B into A.
New end = max(10, 8) = 10. Merged: [1, 10]
```

---

### 2. Universal Code Blueprint

```python
def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
        
    # Step 1: Sort by interval start times (Crucial first step!)
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for i in range(1, len(intervals)):
        current = intervals[i]
        last_merged = merged[-1]
        
        # Overlap check: current start is less than or equal to previous end
        if current[0] <= last_merged[1]:
            # Update end time of previous interval to cover current
            last_merged[1] = max(last_merged[1], current[1])
        else:
            # No overlap, safely append current to results
            merged.append(current)
            
    return merged
```

---

### 3. Vetted LeetCode Drills (All 9 Problems)

---

#### **LC #252: Meeting Rooms (Easy)**
* **Trigger Cue**: "Determine if a person could attend all meetings."
* **Python Implementation**:
```python
def canAttendMeetings(intervals: list[list[int]]) -> bool:
    intervals.sort(key=lambda x: x[0])
    for i in range(len(intervals) - 1):
        if intervals[i][1] > intervals[i+1][0]:
            return False
    return True
```
* **Complexity**: Time: $O(n \log n)$ | Space: $O(1)$ (or $O(n)$ depending on sort footprint)

---

#### **LC #605: Can Place Flowers (Easy)**
* **Trigger Cue**: "Determine if $n$ new flowers can be planted in the flowerbed without violating the no-adjacent-flowers rule."
* **Python Implementation**:
```python
def canPlaceFlowers(flowerbed: list[int], n: int) -> bool:
    count = 0
    size = len(flowerbed)
    for i in range(size):
        if flowerbed[i] == 0:
            left_empty = (i == 0) or (flowerbed[i - 1] == 0)
            right_empty = (i == size - 1) or (flowerbed[i + 1] == 0)
            if left_empty and right_empty:
                flowerbed[i] = 1
                count += 1
                if count >= n:
                    return True
    return count >= n
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #122: Best Time to Buy and Sell Stock II (Easy)**
* **Trigger Cue**: "Find the maximum profit you can achieve... can buy and sell on the same day."
* **Insight**: Accumulate all upward slope segments. This maps to micro-overlapping intervals of price hikes.
* **Python Implementation**:
```python
def maxProfit(prices: list[int]) -> int:
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i-1]:
            profit += prices[i] - prices[i-1]
    return profit
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #56: Merge Intervals (Medium)**
* **Trigger Cue**: "Merge all overlapping intervals."
* **Python Implementation**:
*(See the standard Universal Code Blueprint above.)*

---

#### **LC #57: Insert Interval (Medium)**
* **Trigger Cue**: "Insert `newInterval` into `intervals`... intervals are already sorted."
* **Insight**: Since input is sorted, we can complete the insertion and merging in a single $O(n)$ pass without re-sorting.
* **Python Implementation**:
```python
def insert(intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
    result = []
    i = 0
    n = len(intervals)
    
    # Step 1: Add all intervals that end before newInterval starts
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
        
    # Step 2: Merge overlapping intervals with newInterval
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    
    # Step 3: Add the remaining intervals
    while i < n:
        result.append(intervals[i])
        i += 1
        
    return result
```
* **Complexity**: Time: $O(n)$ | Space: $O(n)$ to store result.

---

#### **LC #435: Non-overlapping Intervals (Medium)**
* **Trigger Cue**: "Find the minimum number of intervals you need to remove to make the rest of them non-overlapping."
* **Insight**: Greedy approach sorted by **end times**. Sorting by end times always preserves the maximal room for subsequent intervals.
* **Python Implementation**:
```python
def eraseOverlapIntervals(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    count = 0
    end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        if intervals[i][0] < end:
            count += 1  # Overlap found! Erase it
        else:
            end = intervals[i][1]  # Update active end bound
            
    return count
```
* **Complexity**: Time: $O(n \log n)$ | Space: $O(1)$

---

#### **LC #253: Meeting Rooms II (Medium)**
* **Trigger Cue**: "Find the minimum number of conference rooms required."
* **Insight**: Track room release schedules. When a new meeting starts, can we reuse a room that has already finished? Use a **Min-Heap** to store active meeting end-times.
* **Python Implementation**:
```python
import heapq

def minMeetingRooms(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0
        
    intervals.sort(key=lambda x: x[0])
    rooms = []  # Min-heap of end times
    
    # Initialize with first meeting
    heapq.heappush(rooms, intervals[0][1])
    
    for meeting in intervals[1:]:
        # If room with earliest end time is free, reuse it
        if meeting[0] >= rooms[0]:
            heapq.heappop(rooms)
        
        # Add current meeting's end time
        heapq.heappush(rooms, meeting[1])
        
    return len(rooms)
```
* **Complexity**: Time: $O(n \log n)$ | Space: $O(n)$ for the heap.

---

#### **LC #986: Interval List Intersections (Medium)**
* **Trigger Cue**: "Return the intersection of these two interval lists."
* **Python Implementation**:
```python
def intervalIntersection(A: list[list[int]], B: list[list[int]]) -> list[list[int]]:
    i = j = 0
    result = []
    
    while i < len(A) and j < len(B):
        # Determine overlap boundaries
        start = max(A[i][0], B[j][0])
        end = min(A[i][1], B[j][1])
        
        if start <= end:
            result.append([start, end])
            
        # Move forward pointer that ends earlier
        if A[i][1] < B[j][1]:
            i += 1
        else:
            j += 1
            
    return result
```
* **Complexity**: Time: $O(m + n)$ | Space: $O(1)$ (auxiliary space)

---

#### **LC #759: Employee Free Time (Hard)**
* **Trigger Cue**: "Find the common free time intervals for all employees."
* **Python Implementation**:
```python
def employeeFreeTime(schedule: list[list[list[int]]]) -> list[list[int]]:
    # Step 1: Flatten and sort all intervals
    intervals = []
    for emp in schedule:
        for val in emp:
            intervals.append(val)
    intervals.sort(key=lambda x: x[0])
    
    # Step 2: Merge and find gaps
    result = []
    temp_end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        curr = intervals[i]
        if curr[0] > temp_end:
            # We found a gap between the end of previous meeting and start of current
            result.append([temp_end, curr[0]])
        temp_end = max(temp_end, curr[1])
        
    return result
```
* **Complexity**: Time: $O(n \log n)$ | Space: $O(n)$ where $n$ is total intervals across all schedules.

---

### 4. Practice Checklist

- [ ] Are you certain of the sort key? Usually sorting by `x[0]` (start time) is correct, except for Greedy Non-overlapping (`x[1]`).
- [ ] Are you using `max()` to handle embedded/subsumed intervals correctly when updating end bounds?
- [ ] For boundary definitions, did you clarify if $[1, 2]$ and $[2, 3]$ touch or overlap? (Problems vary on whether sharing a boundary counts as overlapping).
