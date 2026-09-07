# Days 05–08: Master Two Pointers (The Definitive Guide)
## Study Plan - Phase 1: The 'Big 3' Pillars (Days 5–8)

Welcome to the **Two Pointers Pattern** Master Guide. This document is designed to give you an elite, interview-ready capability to handle linear collections by exploiting index-directed convergence. 

---

### 1. Pattern Specifications

* **Fundamental Data Structure:** Arrays, Strings, or Linked Lists.
* **Complexity Parameters:** Time: $O(n)$ (linear scan with opposing/adjacent pointers) | Space: $O(1)$ (constant auxiliary space).
* **The "Move" (Algorithm Mechanics):** Initialize two pointers—usually at opposite ends (`left = 0`, `right = len - 1`) or at the same end with different speeds. Move them toward each other (opposite direction) or in parallel based on a monotonic criteria (sorted nature of the data). This eliminates the need to scan all $O(n^2)$ pairs.

---

### 2. Instant Pattern Recognition (Trigger Cues)

Look for these dead giveaways in any problem statement:
* • **Sorted input array, list, or string** (or instructions allowing you to sort first).
* • Finding a pair, triplet, or collection of elements that meet a target sum.
* • Modifying array elements **in-place** without extra memory allocations.
* • Keywords: "pair", "triplet", "in-place", "sorted", "reverse", "palindrome".

---

### 3. Skeletons & Skeletons

#### **Opposite Direction Template (Pairs/Triplets)**
```python
def two_pointers_opposite(arr, target):
    # Data MUST be sorted
    arr.sort() 
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_val = arr[left] + arr[right]
        if current_val == target:
            return [left, right]
        elif current_val < target:
            left += 1  # Need a larger sum
        else:
            right -= 1  # Need a smaller sum
    return []
```

---

### 4. Vetted LeetCode Drills (9 Hand-Picked Problems)

#### **LC #125: Valid Palindrome (Easy)**
* **Recognition Cue:** Checking symmetry of a string by ignoring non-alphanumeric characters.
* **Trace Walkthrough:** `s = "A man, a plan, a canal: Panama"`. Cleaned: `"amanaplanacanalpanama"`. `left` starts at 0 ('a'), `right` at 21 ('a'). Compare and step both inward.
* **Pitfall:** Forgetting to handle index bounds when skipping non-alphanumeric characters.
* **Python Code:**
```python
def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True
```
* **Complexity:** Time: $O(n)$ | Space: $O(1)$

#### **LC #167: Two Sum II - Input Array Is Sorted (Medium)**
* **Recognition Cue:** "Sorted array", finding indices of two numbers that add up to a target.
* **Trace Walkthrough:** `numbers = [2, 7, 11, 15], target = 9`. `left=0` (2), `right=3` (15). Sum is 17 > 9 $ightarrow$ decrement `right` to 2 (11). Sum is 13 > 9 $ightarrow$ decrement `right` to 1 (7). Sum is 9 == 9 $ightarrow$ Return `[1, 2]` (1-based indices).
* **Python Code:**
```python
def twoSum(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        cur = numbers[left] + numbers[right]
        if cur == target:
            return [left + 1, right + 1]
        elif cur < target:
            left += 1
        else:
            right -= 1
    return []
```
* **Complexity:** Time: $O(n)$ | Space: $O(1)$

#### **LC #15: 3Sum (Medium)**
* **Recognition Cue:** Finding unique triplets that sum to zero.
* **Trace Walkthrough:** Sort array. Loop through elements. For each unique element `numbers[i]`, perform Two Sum II on the sub-array `numbers[i+1:]` looking for `-numbers[i]`. Skip duplicate values to prevent duplicate triplets.
* **Pitfall:** Not skipping duplicate values for both the pivot `i` and the pointers `left`/`right`, causing duplicates in output.
* **Python Code:**
```python
def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if s == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left+1]: left += 1
                while left < right and nums[right] == nums[right-1]: right -= 1
                left += 1
                right -= 1
            elif s < 0:
                left += 1
            else:
                right -= 1
    return res
```
* **Complexity:** Time: $O(n^2)$ | Space: $O(1)$ (ignoring sorting output space)

#### **LC #11: Container With Most Water (Medium)**
* **Recognition Cue:** Maximizing area under boundaries by moving inwards.
* **Trace Walkthrough:** `left` at 0, `right` at `n-1`. Calculate area as `(right - left) * min(height[left], height[right])`. To find a larger area, we must always shift the pointer with the *smaller* height because moving the larger one can never increase height but always decreases width.
* **Python Code:**
```python
def maxArea(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_w = 0
    while left < right:
        h = min(height[left], height[right])
        max_w = max(max_w, h * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_w
```
* **Complexity:** Time: $O(n)$ | Space: $O(1)$

#### **LC #42: Trapping Rain Water (Hard)**
* **Recognition Cue:** Calculating water trapped at each cell.
* **Trace Walkthrough:** Keep track of `left_max` and `right_max`. If `left_max < right_max`, the amount of water trapped is dictated by `left_max - height[left]`, then increment `left`. Otherwise, it is dictated by `right_max - height[right]`, then decrement `right`.
* **Python Code:**
```python
def trap(height: list[int]) -> int:
    if not height: return 0
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    return water
```
* **Complexity:** Time: $O(n)$ | Space: $O(1)$

#### **LC #26: Remove Duplicates from Sorted Array (Easy)**
* **Recognition Cue:** Modify array in-place, keeping only unique elements.
* **Python Code:**
```python
def removeDuplicates(nums: list[int]) -> int:
    if not nums: return 0
    insert_idx = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[i-1]:
            nums[insert_idx] = nums[i]
            insert_idx += 1
    return insert_idx
```
* **Complexity:** Time: $O(n)$ | Space: $O(1)$

#### **LC #977: Squares of a Sorted Array (Easy)**
* **Recognition Cue:** Input sorted but contains negative values; squares must be sorted.
* **Python Code:**
```python
def sortedSquares(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [0] * n
    left, right = 0, n - 1
    for i in range(n - 1, -1, -1):
        if abs(nums[left]) > abs(nums[right]):
            res[i] = nums[left] ** 2
            left += 1
        else:
            res[i] = nums[right] ** 2
            right -= 1
    return res
```
* **Complexity:** Time: $O(n)$ | Space: $O(n)$

#### **LC #844: Backspace String Compare (Easy)**
* **Recognition Cue:** Compare strings with backspaces backward.
* **Python Code:**
```python
def backspaceCompare(s: str, t: str) -> bool:
    def get_next_idx(string, idx):
        backspaces = 0
        while idx >= 0:
            if string[idx] == '#':
                backspaces += 1
            elif backspaces > 0:
                backspaces -= 1
            else:
                break
            idx -= 1
        return idx
        
    i, j = len(s) - 1, len(t) - 1
    while i >= 0 or j >= 0:
        i = get_next_idx(s, i)
        j = get_next_idx(t, j)
        if i >= 0 and j >= 0 and s[i] != t[j]:
            return False
        if (i >= 0) != (j >= 0):
            return False
        i -= 1
        j -= 1
    return True
```
* **Complexity:** Time: $O(m + n)$ | Space: $O(1)$

#### **LC #16: 3Sum Closest (Medium)**
* **Recognition Cue:** Triplet with sum closest to a target in a sorted list.
* **Python Code:**
```python
def threeSumClosest(nums: list[int], target: int) -> int:
    nums.sort()
    closest_sum = float('inf')
    for i in range(len(nums) - 2):
        left, right = i + 1, len(nums) - 1
        while left < right:
            cur = nums[i] + nums[left] + nums[right]
            if abs(target - cur) < abs(target - closest_sum):
                closest_sum = cur
            if cur < target:
                left += 1
            elif cur > target:
                right -= 1
            else:
                return cur
    return closest_sum
```
* **Complexity:** Time: $O(n^2)$ | Space: $O(1)$

---

### 5. Two Pointers Checklist
- [ ] Ensure input is sorted before using converging pointers.
- [ ] Pay close attention to in-place edits and 0-based vs 1-based indexing expectations.
- [ ] Skip duplicates when matching unique sets (e.g., in 3Sum).
- [ ] Trace boundary steps to prevent index errors inside skip loops.
