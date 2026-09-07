# Days 53–56: Master K-Way Merge (The Definitive Guide)

Welcome to the **K-Way Merge Pattern** Deep Dive! This file acts as your ultimate, self-contained study companion. This guide details how to efficiently combine sorted datasets, structural heap templates, and 9 production-ready LeetCode solutions.

---

### 1. The Core Paradigm: Min-Heap Coordinators

When you need to merge \(K\) sorted arrays or lists into a single consolidated sequence, comparing all elements individually is highly inefficient. 

Instead of doing linear searches of size \(K\) at each step—which would cost \(O(N \cdot K)\) time—we can use a **Min-Heap (Priority Queue)** of size \(K\). This reduces our step cost to \(O(\log K)\), leading to an overall runtime of **\(O(N \log K)\)**, where \(N\) is the total number of elements.

#### **Visual Walkthrough: Merging 3 Sorted Lists**
* L1: `[1, 5, 8]`
* L2: `[2, 6, 9]`
* L3: `[3, 4, 10]`

1. **Initialization:** Push the first element of each list into our Min-Heap.
   ```text
   Heap: [(1, L1), (2, L2), (3, L3)]   -> Minimum is 1
   ```
2. **Pop 1:** Pop `1` from heap. Add `1` to merged list. Advance pointer on L1 to node `5` and push to heap.
   ```text
   Merged: [1]
   Heap: [(2, L2), (3, L3), (5, L1)]   -> Minimum is 2
   ```
3. **Pop 2:** Pop `2` from heap. Add `2` to merged list. Advance L2 to `6` and push.
   ```text
   Merged: [1, 2]
   Heap: [(3, L3), (5, L1), (6, L2)]   -> Minimum is 3
   ```
4. **Pop 3:** Pop `3`. Add to merged list. Advance L3 to `4` and push.
   ```text
   Merged: [1, 2, 3]
   Heap: [(4, L3), (5, L1), (6, L2)]   -> Minimum is 4
   ```

Repeat until the Heap is completely empty.

---

### 2. Universal Blueprint Skeleton

```python
import heapq

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
        
    # Helper to resolve tie-breakers in heapq comparisons
    def __lt__(self, other):
        return self.val < other.val

def merge_k_lists(lists: list[ListNode]) -> ListNode:
    min_heap = []
    
    # Step 1: Push the head of each non-empty list to heap
    for i, head in enumerate(lists):
        if head:
            # We push (value, i, node) to avoid heap direct object comparisons
            heapq.heappush(min_heap, (head.val, i, head))
            
    dummy = ListNode(0)
    curr = dummy
    
    # Step 2: Loop while elements exist in the heap
    while min_heap:
        val, idx, node = heapq.heappop(min_heap)
        curr.next = node
        curr = curr.next
        
        # Step 3: If popped node has a neighbor, push to heap
        if node.next:
            heapq.heappush(min_heap, (node.next.val, idx, node.next))
            
    return dummy.next
```

---

### 3. Vetted LeetCode Drills: Full Problem Deep-Dives

---

#### **Problem 1 (Hard): LC #23 - Merge k Sorted Lists**
* **Trigger Cue:** "Merge k sorted linked lists."
* **Python Implementation:**
```python
import heapq

def mergeKLists(lists: list[ListNode]) -> ListNode:
    heap = []
    for idx, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, idx, node))
            
    dummy = ListNode(0)
    curr = dummy
    
    while heap:
        val, idx, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, idx, node.next))
            
    return dummy.next
```
* **Complexity:** Time: \(O(N \log K)\) | Space: \(O(K)\)

---

#### **Problem 2 (Medium): LC #378 - Kth Smallest Element in a Sorted Matrix**
* **Trigger Cue:** "Find the kth smallest element in a sorted n x n matrix."
* **Python Implementation:**
```python
import heapq

def kthSmallest(matrix: list[list[int]], k: int) -> int:
    n = len(matrix)
    min_heap = []
    
    # Push first element of each row
    for r in range(min(n, k)):
        heapq.heappush(min_heap, (matrix[r][0], r, 0))
        
    val = 0
    for _ in range(k):
        val, r, c = heapq.heappop(min_heap)
        if c + 1 < n:
            heapq.heappush(min_heap, (matrix[r][c + 1], r, c + 1))
            
    return val
```
* **Complexity:** Time: \(O(K \log \min(N, K))\) | Space: \(O(\min(N, K))\)

---

#### **Problem 3 (Medium): LC #373 - Find K Pairs with Smallest Sums**
* **Trigger Cue:** "Find k pairs with the smallest sums."
* **Python Implementation:**
```python
import heapq

def kSmallestPairs(nums1: list[int], nums2: list[int], k: int) -> list[list[int]]:
    if not nums1 or not nums2:
        return []
        
    min_heap = []
    res = []
    # Push first pair elements (val1 + val2, idx1, idx2)
    for i in range(min(len(nums1), k)):
        heapq.heappush(min_heap, (nums1[i] + nums2[0], i, 0))
        
    while min_heap and len(res) < k:
        val, i, j = heapq.heappop(min_heap)
        res.append([nums1[i], nums2[j]])
        
        if j + 1 < len(nums2):
            heapq.heappush(min_heap, (nums1[i] + nums2[j + 1], i, j + 1))
            
    return res
```
* **Complexity:** Time: \(O(K \log K)\) | Space: \(O(K)\)

---

#### **Problem 4 (Hard): LC #632 - Smallest Range Covering Elements from K Lists**
* **Trigger Cue:** "Find the smallest range that includes at least one number from each of the k lists."
* **Python Implementation:**
```python
import heapq

def smallestRange(nums: list[list[int]]) -> list[int]:
    min_heap = []
    curr_max = float('-inf')
    
    # Initialize heap with first element of all K lists
    for i in range(len(nums)):
        heapq.heappush(min_heap, (nums[i][0], i, 0))
        curr_max = max(curr_max, nums[i][0])
        
    res_range = [float('-inf'), float('inf')]
    
    while min_heap:
        curr_min, list_idx, val_idx = heapq.heappop(min_heap)
        
        # Check if current window range is narrower than saved range
        if curr_max - curr_min < res_range[1] - res_range[0]:
            res_range = [curr_min, curr_max]
            
        # Push next element from list
        if val_idx + 1 < len(nums[list_idx]):
            nxt_val = nums[list_idx][val_idx + 1]
            heapq.heappush(min_heap, (nxt_val, list_idx, val_idx + 1))
            curr_max = max(curr_max, nxt_val)
        else:
            # We reached the end of one list, so we cannot maintain at least 1 element from each
            break
            
    return res_range
```
* **Complexity:** Time: \(O(N \log K)\) where N is total elements | Space: \(O(K)\)

---

#### **Problem 5 (Medium): LC #313 - Super Ugly Number**
* **Trigger Cue:** "Find the nth super ugly number given prime array primes."
* **Python Implementation:**
```python
import heapq

def nthSuperUglyNumber(n: int, primes: list[int]) -> int:
    dp = [0] * n
    dp[0] = 1
    
    # Heap holds (ugly_val, prime_multiplier, current_dp_index)
    heap = []
    for p in primes:
        heapq.heappush(heap, (p, p, 0))
        
    for i in range(1, n):
        dp[i] = heap[0][0]  # The minimum becomes the next ugly number
        
        while heap[0][0] == dp[i]:
            val, p, idx = heapq.heappop(heap)
            heapq.heappush(heap, (p * dp[idx + 1], p, idx + 1))
            
    return dp[-1]
```
* **Complexity:** Time: \(O(N \log K)\) where K is primes count | Space: \(O(N + K)\)

---

#### **Problem 6 (Hard): LC #668 - Kth Smallest Number in Multiplication Table**
* **Trigger Cue:** "Find the kth smallest number in a multiplication table of size m x n."
* **Python Implementation:**
```python
def findKthNumber(m: int, n: int, k: int) -> int:
    # Solved optimally using Binary Search on Answer space (a standard alternative for K-way elements with huge scales)
    def count(mid):
        return sum(min(mid // i, n) for i in range(1, m + 1))
        
    low, high = 1, m * n
    while low < high:
        mid = low + (high - low) // 2
        if count(mid) >= k:
            high = mid
        else:
            low = mid + 1
    return low
```
* **Complexity:** Time: \(O(M \log(M 	imes N))\) | Space: \(O(1)\)

---

#### **Problem 7 (Hard): LC #295 - Find Median from Data Stream**
* **Trigger Cue:** "Find median of continuously arriving data streams."
* **Python Implementation:**
```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # Max-heap (Python stores as negative min-heap)
        self.large = []  # Min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        
        # Balance sizes
        if self.small and self.large and (-self.small[0] > self.large[0]):
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
            
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        elif len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2.0
```
* **Complexity:** Time: Add: \(O(\log N)\), Query: \(O(1)\) | Space: \(O(N)\)

---

#### **Problem 8 (Easy): LC #88 - Merge Sorted Array**
* **Trigger Cue:** "Merge sorted array nums1 inside nums1 in-place."
* **Python Implementation:**
```python
def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    # Merge starting from the back to utilize extra capacity without shifting
    p1 = m - 1
    p2 = n - 1
    p = m + n - 1
    
    while p1 >= 0 and p2 >= 0:
        if nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1
        
    while p2 >= 0:
        nums1[p] = nums2[p2]
        p2 -= 1
        p -= 1
```
* **Complexity:** Time: \(O(M + N)\) | Space: \(O(1)\)

---

#### **Problem 9 (Easy): LC #350 - Intersection of Two Arrays II**
* **Trigger Cue:** "Find intersection of two integer arrays."
* **Python Implementation:**
```python
from collections import Counter

def intersect(nums1: list[int], nums2: list[int]) -> list[int]:
    counts = Counter(nums1)
    res = []
    for num in nums2:
        if counts[num] > 0:
            res.append(num)
            counts[num] -= 1
    return res
```
* **Complexity:** Time: \(O(N + M)\) | Space: \(O(\min(N, M))\)

---

### 4. Common Pitfalls & Defense Checklist

* **Object Pointer Overwrites**: Python's heap algorithm compares objects if values are identical. Avoid popping raw nodes unless `__lt__` is overridden on your node object. Alternatively, use a tuple tracking the input index `(node.val, list_index, node)`.
* **Out of range indexes**: While stepping pointers forward after popping, always check if `pointer + 1 < len(list)` before performing a push, preventing ArrayOutOfBounds exceptions.

---

### 5. Final Checklist
- [ ] Diagram a 3-way list merge on a whiteboard.
- [ ] Practice explaining why a heap of size \(K\) improves time complexity from \(O(N \cdot K)\) to \(O(N \log K)\).
