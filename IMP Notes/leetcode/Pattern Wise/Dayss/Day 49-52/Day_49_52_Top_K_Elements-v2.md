# Days 49–52: Master Top 'K' Elements (The Definitive Guide)

Welcome to the **Top 'K' Elements Pattern** Deep Dive. This guide equips you with the mental frameworks, templates, and walk-throughs to solve dynamic rankings, frequencies, and sorting optimizations using Heaps.

---

### 1. Conceptual Deep Dive: Heap Constraints and Sorting Optimization

To extract top rankings, the naïve approach is to sort the entire dataset and slice the top elements. However, this is computationally expensive:

$$\text{Na\"{i}ve Complete Sort: } O(n \log n) \text{ time}$$

The **Top 'K' Elements** pattern uses a **Heap** to maintain only the relevant target entries dynamically, reducing the runtime complexity significantly:

$$\text{Size-Bounded Heap: } O(n \log k) \text{ time} \quad | \quad O(k) \text{ auxiliary space}$$

```
                Min-Heap of Size K (Tracking the K Largest elements):
                             [15] (Smallest of top K)
                             /  \
                           [20]  [35]

      New element (40) arrives:
      • Compare 40 > 15 (root). Yes.
      • Pop 15, insert 40, bubble down.
      • Heap size is maintained at exactly K elements.
```

#### Selection Rule:
* **To find the $K$ Largest elements:** Initialize a **Min-Heap**. The smallest of the top $K$ largest elements sits at the root, making it easy to pop when a larger candidate is found.
* **To find the $K$ Smallest elements:** Initialize a **Max-Heap**. The largest of the top $K$ smallest elements sits at the root, ready to be popped when a smaller candidate is found.

---

### 2. The Universal Top 'K' Skeletons

#### A. Standard Size-Bounded Min-Heap (K Largest Elements)
Keeps an active min-heap strictly capped at size $K$ to extract the highest elements.

```python
import heapq
from typing import List

def find_k_largest(nums: List[int], k: int) -> List[int]:
    # Initialize min-heap containing the first K elements
    min_heap = []
    
    for i in range(len(nums)):
        if len(min_heap) < k:
            heapq.heappush(min_heap, nums[i])
        else:
            # If current number is larger than the smallest in our top K, update the heap
            if nums[i] > min_heap[0]:
                heapq.heappushpop(min_heap, nums[i])  # Push new, pop smallest
                
    return min_heap  # Contains the K largest elements
```

#### B. Frequency-Map Bounded Heap Template
Pulls top items after counting occurrence metrics.

```python
from collections import Counter

def find_top_k_frequent(nums: List[int], k: int) -> List[int]:
    # Phase 1: Build occurrence frequency map
    frequency_map = Counter(nums)
    
    # Phase 2: Build a min-heap bounded by size K.
    # Elements in the heap are tuples: (frequency, value)
    min_heap = []
    
    for val, freq in frequency_map.items():
        if len(min_heap) < k:
            heapq.heappush(min_heap, (freq, val))
        else:
            if freq > min_heap[0][0]:
                heapq.heappushpop(min_heap, (freq, val))
                
    # Phase 3: Extract values
    return [val for freq, val in min_heap]
```

---

### 3. Instant Pattern Recognition (Trigger Cues)

* • **Keywords: "k-largest", "k-closest points", "top frequent", "most common".**
* • **Requests rolling rankings or dynamic tracking of elements in streaming data.**
* • **Explicit desire to optimize** sorting operations below $O(n \log n)$ time bounds.

---

### 4. 9 Vetted LeetCode Drills: Fleshed Out

#### LC #703: Kth Largest Element in a Stream (Easy)
* **Trigger:** Track the $K$-th largest element in a continuously growing stream of integers.
* **Trace:** Maintain a min-heap of size $K$. The root of the heap is the $K$-th largest element.
* **Code:**
```python
class KthLargest:
    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.heap = []
        for num in nums:
            self.add(num)

    def add(self, val: int) -> int:
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)
        elif val > self.heap[0]:
            heapq.heappushpop(self.heap, val)
        return self.heap[0]
```
* **Complexity:** Time: $O(\log k)$ per insertion | Space: $O(k)$ to store the heap.

#### LC #1046: Last Stone Weight (Easy)
* **Trigger:** Smash the two heaviest stones iteratively, inserting the remainder back into the set.
* **Trace:** Use a max-heap (implemented using negative values in Python). Pop the top two values, find the difference, and push the remainder.
* **Code:**
```python
def lastStoneWeight(stones: List[int]) -> int:
    # Python has min-heap by default; negate values to construct a max-heap
    max_heap = [-stone for stone in stones]
    heapq.heapify(max_heap)
    
    while len(max_heap) > 1:
        stone1 = -heapq.heappop(max_heap)
        stone2 = -heapq.heappop(max_heap)
        if stone1 != stone2:
            heapq.heappush(max_heap, -(stone1 - stone2))
            
    return -max_heap[0] if max_heap else 0
```
* **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$ heap storage.

#### LC #506: Relative Ranks (Easy)
* **Trigger:** Assign relative ranks ("Gold Medal", etc.) to athletes based on their score hierarchy.
* **Trace:** Push index-score pairs into a max-heap and pop them in descending order to assign ranks.
* **Code:**
```python
def findRelativeRanks(score: List[int]) -> List[str]:
    max_heap = [(-s, i) for i, s in enumerate(score)]
    heapq.heapify(max_heap)
    
    results = [""] * len(score)
    rank = 1
    
    while max_heap:
        _, idx = heapq.heappop(max_heap)
        if rank == 1:
            results[idx] = "Gold Medal"
        elif rank == 2:
            results[idx] = "Silver Medal"
        elif rank == 3:
            results[idx] = "Bronze Medal"
        else:
            results[idx] = str(rank)
        rank += 1
        
    return results
```
* **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$.

#### LC #215: Kth Largest Element in an Array (Medium)
* **Trigger:** Locate the $K$-th largest element in an unsorted array.
* **Trace:** Maintain a min-heap of size $K$. The root of the heap is the $K$-th largest element.
* **Code:**
```python
def findKthLargest(nums: List[int], k: int) -> int:
    min_heap = []
    for num in nums:
        if len(min_heap) < k:
            heapq.heappush(min_heap, num)
        elif num > min_heap[0]:
            heapq.heappushpop(min_heap, num)
    return min_heap[0]
```
* **Complexity:** Time: $O(n \log k)$ | Space: $O(k)$ auxiliary space.

#### LC #347: Top K Frequent Elements (Medium)
* **Trigger:** Return the $K$ most frequent elements from a list of integers.
* **Trace:** Map frequencies using a Counter, then insert (frequency, value) tuples into a size-bounded min-heap.
* **Code:**
```python
def topKFrequent(nums: List[int], k: int) -> List[int]:
    counts = Counter(nums)
    min_heap = []
    
    for num, freq in counts.items():
        if len(min_heap) < k:
            heapq.heappush(min_heap, (freq, num))
        elif freq > min_heap[0][0]:
            heapq.heappushpop(min_heap, (freq, num))
            
    return [num for freq, num in min_heap]
```
* **Complexity:** Time: $O(n \log k)$ | Space: $O(n + k)$ map and heap space.

#### LC #973: K Closest Points to Origin (Medium)
* **Trigger:** Find the $K$ points on a 2D plane closest to the origin $(0, 0)$.
* **Trace:** Use Euclidean distance as the key for a max-heap. Pop the largest distances to keep the smallest.
* **Code:**
```python
def kClosest(points: List[List[int]], k: int) -> List[List[int]]:
    # Compute negative distance to build a max-heap in Python
    def get_distance(point):
        return -(point[0]**2 + point[1]**2)
        
    max_heap = []
    for point in points:
        dist = get_distance(point)
        if len(max_heap) < k:
            heapq.heappush(max_heap, (dist, point))
        elif dist > max_heap[0][0]:
            heapq.heappushpop(max_heap, (dist, point))
            
    return [point for dist, point in max_heap]
```
* **Complexity:** Time: $O(n \log k)$ | Space: $O(k)$ heap storage.

#### LC #451: Sort Characters By Frequency (Medium)
* **Trigger:** Sort a string in descending order based on character frequencies.
* **Trace:** Count frequencies and push tuples into a max-heap, then reconstruct the string.
* **Code:**
```python
def frequencySort(s: str) -> str:
    counts = Counter(s)
    # Python defaults to min-heap; negate frequency to create max-heap
    max_heap = [(-freq, char) for char, freq in counts.items()]
    heapq.heapify(max_heap)
    
    result = []
    while max_heap:
        neg_freq, char = heapq.heappop(max_heap)
        result.append(char * (-neg_freq))
        
    return "".join(result)
```
* **Complexity:** Time: $O(n \log u)$ where $u$ is the number of unique characters | Space: $O(u)$ storage.

#### LC #658: Find K Closest Elements (Medium)
* **Trigger:** Find the $K$ closest integers to a target $X$ in a sorted array.
* **Trace:** Build a heap of size $K$ using absolute difference as the priority key.
* **Code:**
```python
def findClosestElements(arr: List[int], k: int, x: int) -> List[int]:
    # Max-heap based on (-diff, -val) to satisfy tie-breaker conditions
    max_heap = []
    for val in arr:
        diff = abs(val - x)
        if len(max_heap) < k:
            heapq.heappush(max_heap, (-diff, -val))
        else:
            if -diff > max_heap[0][0] or (-diff == max_heap[0][0] and -val > max_heap[0][1]):
                heapq.heappushpop(max_heap, (-diff, -val))
                
    # Extract, strip heap negation keys, and sort the final K elements
    return sorted([-val for _, val in max_heap])
```
* **Complexity:** Time: $O(n \log k + k \log k)$ | Space: $O(k)$ storage.

#### LC #358: Rearrange String k Distance Apart (Hard)
* **Trigger:** Rearrange a string such that identical characters are at least $K$ positions apart.
* **Trace:** Use a max-heap of character frequencies. Use a queue to hold characters on a cool-down list.
* **Code:**
```python
from collections import deque

def rearrangeString(s: str, k: int) -> str:
    if k <= 1:
        return s
        
    counts = Counter(s)
    max_heap = [(-freq, char) for char, freq in counts.items()]
    heapq.heapify(max_heap)
    
    cooldown_queue = deque()
    result = []
    
    while max_heap:
        neg_freq, char = heapq.heappop(max_heap)
        result.append(char)
        
        # Decrement frequency (closer to 0)
        new_freq = neg_freq + 1
        
        # Add character and its cool-down status to the queue
        cooldown_queue.append((new_freq, char))
        
        # If the cool-down period has passed, release the character back to the heap
        if len(cooldown_queue) >= k:
            freq_to_release, char_to_release = cooldown_queue.popleft()
            if freq_to_release < 0:
                heapq.heappush(max_heap, (freq_to_release, char_to_release))
                
    return "".join(result) if len(result) == len(s) else ""
```
* **Complexity:** Time: $O(n \log u)$ where $u$ is the unique characters | Space: $O(u)$ queue and heap.

---

### 5. Common Interview Pitfalls

1. **Confusing Max-Heaps with Min-Heaps:** Using a max-heap when looking for the $K$ largest elements. This is a common logical error: if you use a max-heap, the absolute largest element sits at the root, so any new, smaller element will not trigger a swap, and you will eventually pop the wrong values. Remember: **largest needs min-heap, smallest needs max-heap**.
2. **Forgetting Negation Keys in Python:** Python's `heapq` is strictly a min-heap. To implement a max-heap, you *must* negate values before pushing them and negate them again upon popping.
3. **Omitting Tie-Breaker Logic:** When sorting elements with equal keys (like identical coordinates or character frequencies), you must specify tie-breaker criteria (e.g., lexical ordering) to avoid logical inconsistencies in the heap.

---

### 6. Whiteboard Defense Checklist

- [ ] Have you verified your choice of heap? Did you use a **Min-Heap** for finding the $K$ Largest elements?
- [ ] For max-heap operations in Python, have you safely **negated elements** during both push and pop?
- [ ] Is your heap's size strictly bounded by **$K$ elements**? (Pushing all elements into the heap before popping yields $O(n \log n)$ space and time, which defeats the optimization of the pattern).
- [ ] Have you handled tie-breaker conditions when elements have identical priority keys?
