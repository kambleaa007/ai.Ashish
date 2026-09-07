# Days 21–24: Master Cyclic Sort (The Definitive Guide)
## Study Plan - Phase 2: Highly Frequent Patterns

Welcome to the **Cyclic Sort** masterclass study guide. This pattern represents an incredibly powerful visual strategy for sorting discrete integer arrays in linear time without any extra space allocations.

---

### 1. Architectural Deep Dive & Mechanics

Most sorting algorithms (Quicksort, Mergesort) require $O(n \log n)$ time because they rely on binary comparisons. However, if we have a special constraint—namely, that the array contains $N$ items falling strictly within a known integer range (typically $[1, N]$ or $[0, N]$)—we can sort the array in **exactly $O(n)$ time and $O(1)$ space**.

#### **The Swap-to-Home State Machine**
Every value has a unique "home index" where it belongs. For range $[1, N]$, any number $X$ belongs precisely at index $X - 1$.
The cyclic sort algorithm iterates through the array. For each element, if it is not in its home position (and is not a duplicate/out of bounds), we **swap** it into its home index. This displaces another number, which we then also swap to its home index, and so on.

```
Array: [3, 5, 2, 1, 4]
Indices: 0, 1, 2, 3, 4

At i = 0, val = 3. 3 belongs at index 3 - 1 = 2. Swap nums[0] with nums[2].
Array becomes: [2, 5, 3, 1, 4]

At i = 0, val = 2. 2 belongs at index 2 - 1 = 1. Swap nums[0] with nums[1].
Array becomes: [5, 2, 3, 1, 4]

At i = 0, val = 5. 5 belongs at index 5 - 1 = 4. Swap nums[0] with nums[4].
Array becomes: [4, 2, 3, 1, 5]

At i = 0, val = 4. 4 belongs at index 4 - 1 = 3. Swap nums[0] with nums[3].
Array becomes: [1, 2, 3, 4, 5]

At i = 0, val = 1. 1 belongs at index 0. Match! Advance i to 1.
At i = 1, val = 2. Home. Advance i to 2... and so on.
```

---

### 2. Universal Code Blueprint

```python
def cyclic_sort(nums: list[int]) -> list[int]:
    i = 0
    n = len(nums)
    while i < n:
        correct_idx = nums[i] - 1  # For range [1, N]
        
        # Check if value is in bounds and NOT already at its correct index
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            # Swap to home position
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1  # Move forward ONLY when current position is settled
            
    return nums
```

---

### 3. Vetted LeetCode Drills (All 9 Problems)

---

#### **LC #268: Missing Number (Easy)**
* **Trigger Cue**: "Array contains $n$ distinct numbers in range $[0, n]$... find the single missing number."
* **Python Implementation**:
```python
def missingNumber(nums: list[int]) -> int:
    i = 0
    n = len(nums)
    while i < n:
        correct_idx = nums[i]
        if correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
            
    for idx in range(n):
        if nums[idx] != idx:
            return idx
    return n
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #448: Find All Numbers Disappeared in an Array (Easy)**
* **Trigger Cue**: "Find all the integers in the range $[1, n]$ that do not appear in `nums`."
* **Python Implementation**:
```python
def findDisappearedNumbers(nums: list[int]) -> list[int]:
    i = 0
    n = len(nums)
    while i < n:
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
            
    return [idx + 1 for idx in range(n) if nums[idx] != idx + 1]
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$ (output list doesn't count as auxiliary space)

---

#### **LC #645: Set Mismatch (Easy)**
* **Trigger Cue**: "Find the number occurs twice and the number that is missing."
* **Python Implementation**:
```python
def findErrorNums(nums: list[int]) -> list[int]:
    i = 0
    n = len(nums)
    while i < n:
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
            
    for idx in range(n):
        if nums[idx] != idx + 1:
            return [nums[idx], idx + 1]  # [duplicate, missing]
    return []
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #287: Find the Duplicate Number (Medium)**
* **Trigger Cue**: "Find the duplicate number using in-place cyclic sorting."
* **Python Implementation**:
```python
def findDuplicate_Cyclic(nums: list[int]) -> int:
    i = 0
    while i < len(nums):
        if nums[i] != i + 1:
            correct_idx = nums[i] - 1
            if nums[i] != nums[correct_idx]:
                nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
            else:
                return nums[i]  # Found the duplicate value matching its target
        else:
            i += 1
    return -1
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #442: Find All Duplicates in an Array (Medium)**
* **Trigger Cue**: "Given an integer array... find all integers that appear twice."
* **Python Implementation**:
```python
def findDuplicates(nums: list[int]) -> list[int]:
    i = 0
    n = len(nums)
    while i < n:
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
            
    return [nums[idx] for idx in range(n) if nums[idx] != idx + 1]
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #41: First Missing Positive (Hard)**
* **Trigger Cue**: "Find the smallest missing positive integer in $O(n)$ time and $O(1)$ space."
* **Python Implementation**:
```python
def firstMissingPositive(nums: list[int]) -> int:
    i = 0
    n = len(nums)
    while i < n:
        correct_idx = nums[i] - 1
        # Range criteria: positive integers from 1 to n only
        if 0 < nums[i] <= n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
            
    for idx in range(n):
        if nums[idx] != idx + 1:
            return idx + 1
            
    return n + 1
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #287 Alternate: Find the Duplicate Number (Marking Method)**
* **Trigger Cue**: "Find duplicate by marking seen numbers as negative in-place."
* **Python Implementation**:
```python
def findDuplicate_Marking(nums: list[int]) -> int:
    for num in nums:
        idx = abs(num)
        if nums[idx] < 0:
            return idx
        nums[idx] = -nums[idx]
    return -1
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #448 Alternate: In-place Array Marking**
* **Trigger Cue**: "Find disappeared elements without extra space using element negativity marking."
* **Python Implementation**:
```python
def findDisappearedNumbers_Marking(nums: list[int]) -> list[int]:
    for num in nums:
        idx = abs(num) - 1
        if nums[idx] > 0:
            nums[idx] = -nums[idx]
            
    return [i + 1 for i in range(len(nums)) if nums[i] > 0]
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #41 Alternate: First Missing Positive (Optimal Verification)**
* **Trigger Cue**: "Ultimate minimum positive space hole checker."
*(See the standard optimal implementation of LC #41 above.)*

---

### 4. Practice Checklist

- [ ] Remember: Never increment `i` inside the while loop if a swap just occurred. You must re-examine the newly swapped element at index `i`.
- [ ] For Range $[1, N]$, home index is `nums[i] - 1`. For Range $[0, N]$, home index is `nums[i]`.
- [ ] Are you handling negative numbers or values larger than $N$ by bypassing swaps on them?
