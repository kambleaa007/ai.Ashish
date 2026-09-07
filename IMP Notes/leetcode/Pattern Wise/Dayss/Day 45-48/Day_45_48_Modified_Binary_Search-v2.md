# Days 45–48: Master Modified Binary Search (The Definitive Guide)

Welcome to the **Modified Binary Search Pattern** Deep Dive. This guide equips you with the mental frameworks, templates, and walk-throughs to conquer binary searches on arrays and monotonic answer spaces.

---

### 1. Conceptual Deep Dive: Search Spaces and Binary Cuts

Binary search is an optimal search paradigm that achieves sub-linear time ($O(\log n)$) by halving the active search space in each decision iteration.

$$\text{Search Range} = [\text{low}, \text{high}]$$
$$\text{Midpoint Selection: } mid = low + \frac{high - low}{2}$$

#### Key Concepts of Boundary Cuts:
1. **Sorted Structure Assumptions:** Classical binary search requires elements to be sorted.
2. **Rotated Arrays (Pivot Points):** Rotated sorted arrays possess a singular discontinuity point (the pivot). This divides the array into two sorted halves. **At least one half is guaranteed to be strictly sorted** at any midpoint split.
3. **Binary Search on Answer (Optimization Boundary):** When asked to find a minimum-of-maximum or maximum-of-minimum threshold, we can perform a binary search on the continuous, monotonic answer range itself, using a linear-time feasibility check to narrow down the correct boundary.

```
Monotonic Answer Space:
[Feasible: Yes, Yes, Yes, YES (Boundary Peak), No, No, No, No]
                          ^-- Target Decision Coordinate
```

---

### 2. The Universal Modified Binary Search Skeletons

#### A. Standard/Rotated Boundary Converging Template
Uses `low <= high` loop structures to search for a singular target value.

```python
def binary_search_target(arr: List[int], target: int) -> int:
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        # Avoid integer overflow with safe index calculation
        mid = low + (high - low) // 2
        
        if arr[mid] == target:
            return mid  # Target acquired
            
        # Condition check: Identify which half is sorted
        if arr[low] <= arr[mid]:  # Left half is sorted
            if arr[low] <= target < arr[mid]:
                high = mid - 1
            else:
                low = mid + 1
        else:                     # Right half is sorted
            if arr[mid] < target <= arr[high]:
                low = mid + 1
            else:
                high = mid - 1
                
    return -1  # Target is not present
```

#### B. The Feasibility Boundary Template (Binary Search on Answer)
Locates the exact transition coordinate in monotonic answer spaces.

```python
def binary_search_on_answer(nums: List[int], constraints: int) -> int:
    def is_feasible(candidate_value: int) -> bool:
        # Implement custom linear O(n) validation criteria
        current_sum = 0
        allocated_groups = 1
        for num in nums:
            if num > candidate_value:
                return False
            if current_sum + num > candidate_value:
                allocated_groups += 1
                current_sum = num
            else:
                current_sum += num
        return allocated_groups <= constraints

    # Range initialization based on the answer space bounds
    low = max(nums)        # Absolute minimum possible single value
    high = sum(nums)       # Absolute maximum possible single value
    optimal_boundary = high
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if is_feasible(mid):
            optimal_boundary = mid  # Track the current best result
            high = mid - 1          # Try to find a smaller feasible maximum value
        else:
            low = mid + 1           # Value is too small, shift range rightward
            
    return optimal_boundary
```

---

### 3. Instant Pattern Recognition (Trigger Cues)

* • **Sub-linear search time constraints:** explicitly demanding $O(\log n)$ runtime.
* • **Input is sorted, or sorted with a rotational pivot point.**
* • **Keywords: "minimum speed to finish", "smallest capacity to transport within $D$ days".**
* • **Min-of-max optimization problems** with binary monotonic pass/fail conditions.

---

### 4. 9 Vetted LeetCode Drills: Fleshed Out

#### LC #704: Binary Search (Easy)
* **Trigger:** Search target integer within a fully sorted array.
* **Trace:** Calculate midpoint and shift left/right pointers to isolate target.
* **Code:**
```python
def search(nums: List[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
```
* **Complexity:** Time: $O(\log n)$ | Space: $O(1)$.

#### LC #278: First Bad Version (Easy)
* **Trigger:** Locate the first corrupted API build in a sorted range of API versions.
* **Trace:** Binary bisect. Shift high left on true API reports, shift low right on false.
* **Code:**
```python
# The API isBadVersion is pre-defined for us.
# def isBadVersion(version: int) -> bool:

def firstBadVersion(n: int) -> int:
    low, high = 1, n
    ans = n
    while low <= high:
        mid = low + (high - low) // 2
        if isBadVersion(mid):
            ans = mid
            high = mid - 1  # Check earlier builds
        else:
            low = mid + 1   # Target is in the right half
    return ans
```
* **Complexity:** Time: $O(\log n)$ | Space: $O(1)$.

#### LC #35: Search Insert Position (Easy)
* **Trigger:** Retrieve the target's index inside a sorted array, or return where it *should* be inserted.
* **Trace:** Converge boundaries. `low` will naturally land on the correct insertion index.
* **Code:**
```python
def searchInsert(nums: List[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return low
```
* **Complexity:** Time: $O(\log n)$ | Space: $O(1)$.

#### LC #33: Search in Rotated Sorted Array (Medium)
* **Trigger:** Find target index in a sorted array that has been shifted around an unknown pivot point.
* **Trace:** Isolate which half of the array is sorted. Check bounds to determine which side to discard.
* **Code:**
```python
def search_rotated(nums: List[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
            
        # Left half is sorted
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
    return -1
```
* **Complexity:** Time: $O(\log n)$ | Space: $O(1)$.

#### LC #153: Find Minimum in Rotated Sorted Array (Medium)
* **Trigger:** Locate the absolute smallest integer inside a rotated sorted array.
* **Trace:** Compare `nums[mid]` with `nums[high]`. If `nums[mid] > nums[high]`, the minimum is in the right half.
* **Code:**
```python
def findMin(nums: List[int]) -> int:
    low, high = 0, len(nums) - 1
    while low < high:
        mid = low + (high - low) // 2
        if nums[mid] > nums[high]:
            low = mid + 1   # Minimum is in the unsorted right half
        else:
            high = mid      # Minimum is mid or to its left
    return nums[low]
```
* **Complexity:** Time: $O(\log n)$ | Space: $O(1)$.

#### LC #162: Find Peak Element (Medium)
* **Trigger:** Find a peak node that is strictly greater than its direct neighbors.
* **Trace:** Compare `nums[mid]` to `nums[mid + 1]`. Step toward the climbing slope.
* **Code:**
```python
def findPeakElement(nums: List[int]) -> int:
    low, high = 0, len(nums) - 1
    while low < high:
        mid = low + (high - low) // 2
        if nums[mid] < nums[mid + 1]:
            low = mid + 1   # Slope is rising to the right; peak must be on that side
        else:
            high = mid      # Slope is falling; peak is on the left (including mid)
    return low
```
* **Complexity:** Time: $O(\log n)$ | Space: $O(1)$.

#### LC #74: Search a 2D Matrix (Medium)
* **Trigger:** Scan a sorted 2D grid of values where rows are aligned end-to-end.
* **Trace:** Map 1D search coordinates to 2D row/col locations: `row = mid // cols`, `col = mid % cols`.
* **Code:**
```python
def searchMatrix(matrix: List[List[int]], target: int) -> bool:
    if not matrix or not matrix[0]:
        return False
    rows, cols = len(matrix), len(matrix[0])
    low, high = 0, (rows * cols) - 1
    
    while low <= high:
        mid = low + (high - low) // 2
        val = matrix[mid // cols][mid % cols]
        
        if val == target:
            return True
        elif val < target:
            low = mid + 1
        else:
            high = mid - 1
    return False
```
* **Complexity:** Time: $O(\log(R \cdot C))$ | Space: $O(1)$.

#### LC #875: Koko Eating Bananas (Medium)
* **Trigger:** Find the minimum eating speed $K$ to finish all bananas within a given hour budget.
* **Trace:** Perform binary search on the candidate answer space $[1, \max(	ext{piles})]$.
* **Code:**
```python
import math

def minEatingSpeed(piles: List[int], h: int) -> int:
    def can_eat_all(speed: int) -> bool:
        time_needed = sum(math.ceil(pile / speed) for pile in piles)
        return time_needed <= h
        
    low = 1
    high = max(piles)
    ans = high
    
    while low <= high:
        mid = low + (high - low) // 2
        if can_eat_all(mid):
            ans = mid
            high = mid - 1  # Try to find a slower viable eating speed
        else:
            low = mid + 1   # Speed is too slow; increase bounds
    return ans
```
* **Complexity:** Time: $O(n \cdot \log(\max(	ext{piles})))$ | Space: $O(1)$.

#### LC #410: Split Array Largest Sum (Hard)
* **Trigger:** Divide an array into $M$ non-empty contiguous subarrays such that the largest sum is minimized.
* **Trace:** Perform binary search on the answer range: low = `max(nums)`, high = `sum(nums)`.
* **Code:**
```python
def splitArray(nums: List[int], k: int) -> int:
    def isValidSplit(max_allowed_sum: int) -> bool:
        current_sum = 0
        splits = 1
        for num in nums:
            if current_sum + num > max_allowed_sum:
                splits += 1
                current_sum = num
                if splits > k:
                    return False
            else:
                current_sum += num
        return True
        
    low = max(nums)
    high = sum(nums)
    ans = high
    
    while low <= high:
        mid = low + (high - low) // 2
        if isValidSplit(mid):
            ans = mid
            high = mid - 1  # Minimize the maximum subarray sum
        else:
            low = mid + 1   # Subarray sum capacity is too small; increase bounds
    return ans
```
* **Complexity:** Time: $O(n \cdot \log(	ext{sum}(	ext{nums}) - 	ext{max}(	ext{nums})))$ | Space: $O(1)$.

---

### 5. Common Interview Pitfalls

1. **Integer Midpoint Overflow:** Writing `mid = (low + high) // 2` instead of `mid = low + (high - low) // 2`. In languages with bounded integers (like Java or C++), if `low` and `high` are large, their sum can exceed the maximum integer limit. (Python handles arbitrarily large integers, but using the overflow-safe formula shows professional code discipline on a whiteboard).
2. **Infinite Loops in While Boundaries:** Failing to increment/decrement indices safely (e.g., setting `low = mid` or `high = mid` in `low <= high` loops, which causes the search range to stagnate when `low == high - 1`).
3. **Improper High/Low Initializations on Answer Spaces:** Initializing `low = 0` instead of the absolute largest element in the list (`max(arr)`), which can result in runtime errors if the array elements exceed the minimum limits.

---

### 6. Whiteboard Defense Checklist

- [ ] Is your loop condition correct? (`low <= high` for standard searches, or `low < high` for convergence/peak detection)?
- [ ] Have you tested your index updates? Do they guarantee the search space reduces in each branch (e.g., using `mid + 1` or `mid - 1`) to prevent infinite loops?
- [ ] For binary search on an answer space, is your feasibility check function capable of running in linear $O(n)$ time?
- [ ] Have you verified your bounds for corner cases, such as arrays with only one or two elements?
