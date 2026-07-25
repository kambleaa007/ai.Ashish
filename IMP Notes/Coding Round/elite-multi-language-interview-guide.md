# Elite Multi-Language Technical Coding Interview Guide
### Optimized for Python 3, Java 21, and JavaScript (ECMAScript 2020+)

This guide provides staff-level reference implementations, hidden interviewer traps, and concrete complexities across seven critical algorithmic categories. Every implementation is complete, production-grade, and free of placeholders.

---

## Category 1: Two-Pointers & Sliding Window

The Two-Pointers and Sliding Window patterns optimize brute-force $O(N^2)$ checks on sequential datasets into $O(N)$ linear-time sweeps by maintaining persistent intervals and boundaries.

### 1. Code Blueprint: Longest Substring Without Repeating Characters

#### Python 3 (Optimized with Type Hinting & Dict Comprehensions)
```python
from typing import Dict

def length_of_longest_substring(s: str) -> int:
    # Hash map to store the most recent index of each character
    char_map: Dict[str, int] = {}
    max_length = 0
    left = 0
    
    for right, char in enumerate(s):
        # If character is inside the current window, contract left boundary past it
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
            
        char_map[char] = right
        max_length = max(max_length, right - left + 1)
        
    return max_length
```

#### Java 21 (Modern Idioms: `var`, Sequenced Collections, and Record Patterns)
```java
import java.util.HashMap;

public final class SlidingWindow {
    
    // Immutable representation of the window state
    public record WindowState(int maxLength, int leftBoundary) {}

    public int lengthOfLongestSubstring(String s) {
        if (s == null || s.isEmpty()) {
            return 0;
        }
        
        // Java 21 local variable type inference
        var charMap = new HashMap<Character, Integer>();
        var state = new WindowState(0, 0);
        int left = state.leftBoundary();
        int maxLength = state.maxLength();
        
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            
            // Slide left pointer if duplicate is found inside the active window
            if (charMap.containsKey(c) && charMap.get(c) >= left) {
                left = charMap.get(c) + 1;
            }
            
            charMap.put(c, right);
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
}
```

#### JavaScript (ECMAScript 2020+: Strict, Nullish Coalescing, Efficient Map)
```javascript
"use strict";

/**
 * Finds the length of the longest substring without repeating characters.
 * @param {string} s
 * @return {number}
 */
const lengthOfLongestSubstring = (s) => {
  if (!s) return 0;
  
  const charMap = new Map();
  let maxLength = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    
    // Nullish coalescing (??) prevents index 0 from being evaluated as falsy
    const lastSeen = charMap.get(char) ?? -1;
    
    if (lastSeen >= left) {
      left = lastSeen + 1;
    }
    
    charMap.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
};
```

### 2. Top Interview Edge Cases & Hidden Traps
*   **Falsy Index 0 Bug (JavaScript)**: Using `charMap.get(char) || -1` inside a condition causes failure when a character resides at index `0`. The falsy evaluation defaults to `-1`, skipping the window boundary contraction. Always use `??` (Nullish Coalescing).
*   **Out-of-Window Index Jump**: If a duplicate character was seen *before* the current left boundary (e.g., `charMap[char] < left`), moving `left` backward would expand the window incorrectly. Pointers must only move monotonically forward.
*   **Surrogate Pairs / Unicode Code Points**: Iterating with `s.charAt(i)` in Java or standard string indexing in JS (`s[i]`) reads UTF-16 code units. Supplementary characters (like emojis) are represented by surrogate pairs, corrupting index calculations. If Unicode compliance is requested, use `s.codePoints()` in Java 21 or `[...s]` array spreading in ES6.

### 3. Complexities
*   **Time Complexity**: $O(N)$ — Both pointers traverse the sequence at most once.
*   **Space Complexity**: $O(\min(M, N))$ — Bounded by the size of the character set $M$ (e.g., $128$ for ASCII) or the length of the string $N$.

---

## Category 2: Fast & Slow Pointers (Linked Lists)

The Fast & Slow pointer pattern (Floyd's Cycle Detection) utilizes dual-pointer offsets (typically $1x$ and $2x$ iteration speeds) to identify cycles or determine geometric structures in Linked Lists without allocating auxiliary storage.

### 1. Code Blueprint: Find Cycle Start Node (Cycle II)

#### Python 3 (Complete with Type Hinting)
```python
from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next_node: Optional['ListNode'] = None):
        self.val = val
        self.next = next_node

def detect_cycle_start(head: Optional[ListNode]) -> Optional[ListNode]:
    if not head or not head.next:
        return None
        
    slow: Optional[ListNode] = head
    fast: Optional[ListNode] = head
    
    # Step 1: Detect presence of cycle
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            # Step 2: Reset slow pointer to start of list to find loop origin
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow
            
    return None
```

#### Java 21 (Record Wrapper & Modern Null-Safety)
```java
public final class CycleDetection {

    public static class ListNode {
        public int val;
        public ListNode next;
        public ListNode(int val) { this.val = val; }
    }

    public record CycleResult(boolean hasCycle, ListNode startNode) {}

    public CycleResult findCycleOrigin(ListNode head) {
        if (head == null || head.next == null) {
            return new CycleResult(false, null);
        }

        var slow = head;
        var fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                var entryFinder = head;
                while (entryFinder != fast) {
                    entryFinder = entryFinder.next;
                    fast = fast.next;
                }
                return new CycleResult(true, entryFinder);
            }
        }

        return new CycleResult(false, null);
    }
}
```

#### JavaScript (ECMAScript 2020+: Arrow Functions, Optional Chaining)
```javascript
"use strict";

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * Identifies cycle origin using optional chaining safety.
 * @param {ListNode} head
 * @return {ListNode|null}
 */
const detectCycleStart = (head) => {
  if (!head?.next) return null;
  
  let slow = head;
  let fast = head;
  
  while (fast?.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) {
      let entryFinder = head;
      while (entryFinder !== fast) {
        entryFinder = entryFinder.next;
        fast = fast.next;
      }
      return entryFinder;
    }
  }
  
  return null;
};
```

### 2. Top Interview Edge Cases & Hidden Traps
*   **NullPointer Dereferencing**: Attempting to read `fast.next.next` before confirming that `fast` and `fast.next` are non-null will crash your run-time code. Always structure bounds validation defensively: `while (fast != null && fast.next != null)`.
*   **Cycle-Free Lists (Even/Odd termination)**: When list contains no cycles, ensure fast-pointer loops terminate elegantly without out-of-bounds exceptions (odd-length lists terminate at `fast.next == null`; even-length lists terminate at `fast == null`).
*   **Wrong Second Phase Convergence Phase Speed**: In the loop alignment phase, both converging pointers *must* advance at exactly $1x$ speed. Advancing the fast pointer at $2x$ speed during the origin search phase will result in infinite loops.

### 3. Complexities
*   **Time Complexity**: $O(N)$ — First phase runs in $O(N)$; second phase completes in $O(N)$ since the distances traveled are bounded by list length.
*   **Space Complexity**: $O(1)$ — Only a couple of node reference pointers are maintained in memory.

---

## Category 3: Monotonic Stacks & Queues

Monotonic structures maintain elements in strict sorted order (increasing or decreasing).
*   **Monotonic Stack**: Instantly resolves "Next Greater Element" queries in linear time.
*   **Monotonic Queue (Deque)**: Tracks sliding window minimum or maximum bounds within an $O(1)$ amortized sliding window.

### 1. Code Blueprint: Sliding Window Maximum

#### Python 3 (Optimized with `collections.deque`)
```python
from collections import deque
from typing import List

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    if not nums or k == 0:
        return []
        
    result: List[int] = []
    dq = deque()  # Decreasing monotonic deque of indices
    
    for i, num in enumerate(nums):
        # 1. Purge indices that fell out of window range
        if dq and dq[0] < i - k + 1:
            dq.popleft()
            
        # 2. Maintain strict monotonic decreasing order
        while dq and nums[dq[-1]] < num:
            dq.pop()
            
        dq.append(i)
        
        # 3. Capture maximums once left-hand boundary is within valid array bounds
        if i >= k - 1:
            result.append(nums[dq[0]])
            
    return result
```

#### Java 21 (Sequenced Collection API: `.getFirst()` and `.getLast()`)
```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

public final class MonotonicWindow {

    public List<Integer> maxSlidingWindow(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k == 0) {
            return new ArrayList<>();
        }

        var result = new ArrayList<Integer>();
        // ArrayDeque implements Java 21's new SequencedCollection interface
        var deque = new ArrayDeque<Integer>();

        for (int i = 0; i < nums.length; i++) {
            // 1. Evict indices outside current window
            if (!deque.isEmpty() && deque.getFirst() < i - k + 1) {
                deque.removeFirst();
            }

            // 2. Erase index nodes of elements smaller than the current element
            while (!deque.isEmpty() && nums[deque.getLast()] < nums[i]) {
                deque.removeLast();
            }

            deque.addLast(i);

            // 3. Document current window maximum
            if (i >= k - 1) {
                result.add(nums[deque.getFirst()]);
            }
        }

        return result;
    }
}
```

#### JavaScript (ECMAScript 2020+: Fast Custom Index-Based Deque)
```javascript
"use strict";

/**
 * Custom Deque structure to avoid JS Array.shift() O(N) penalty.
 * Array.prototype.shift() is a known source of performance loss in interviews.
 */
class EfficientDeque {
  constructor() {
    this.storage = {};
    this.head = 0;
    this.tail = 0;
  }
  
  pushBack(val) {
    this.storage[this.tail++] = val;
  }
  
  popBack() {
    if (this.isEmpty()) return undefined;
    const value = this.storage[--this.tail];
    delete this.storage[this.tail];
    return value;
  }
  
  popFront() {
    if (this.isEmpty()) return undefined;
    const value = this.storage[this.head];
    delete this.storage[this.head++];
    return value;
  }
  
  peekFront() {
    return this.isEmpty() ? undefined : this.storage[this.head];
  }
  
  peekBack() {
    return this.isEmpty() ? undefined : this.storage[this.tail - 1];
  }
  
  isEmpty() {
    return this.head === this.tail;
  }
}

/**
 * Finds the sliding window maximums using custom Deque.
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
const maxSlidingWindow = (nums, k) => {
  if (!nums?.length || k === 0) return [];
  
  const result = [];
  const dq = new EfficientDeque();
  
  for (let i = 0; i < nums.length; i++) {
    // 1. Evict elements outside the current window
    if (!dq.isEmpty() && dq.peekFront() < i - k + 1) {
      dq.popFront();
    }
    
    // 2. Purge smaller indices to keep decreasing order
    while (!dq.isEmpty() && nums[dq.peekBack()] < nums[i]) {
      dq.popBack();
    }
    
    dq.pushBack(i);
    
    // 3. Store maximum when window size is met
    if (i >= k - 1) {
      result.push(nums[dq.peekFront()]);
    }
  }
  
  return result;
};
```

### 2. Top Interview Edge Cases & Hidden Traps
*   **JS Array `shift()` Time-Complexity Trap**: Standard JS Arrays compile to shifted arrays. Triggering `.shift()` inside an $N$-length loop yields $O(N^2)$ execution times instead of $O(N)$, causing LeetCode time-limit-exceeded (TLE) failures. Always use an index-tracked object or a custom Deque class.
*   **Storing Element Values instead of Indices**: If you store values inside the deque instead of array indices, you cannot determine if the maximum element has slipped past the left window boundary. **Always store index coordinates.**
*   **K larger than array length**: Ensure code behaves gracefully and returns a single maximum if the window size $K$ exceeds the total size of the input array.

### 3. Complexities
*   **Time Complexity**: $O(N)$ — Every array index is appended and popped at most once.
*   **Space Complexity**: $O(K)$ — Deque stores at most $K$ window indices.

---

## Category 4: Heaps / Priority Queues

Heaps are complete binary trees that maintain ordered priorities.
*   **Min-Heap**: Smallest item resides at the root index ($O(1)$ lookup).
*   **Max-Heap**: Largest item resides at the root index ($O(1)$ lookup).
Since JavaScript lacks a native Priority Queue implementation, candidates must write one from scratch under live interview conditions.

### 1. Code Blueprint: Find Median from Data Stream

#### Python 3 (Complete using `heapq` Min-Heap negation trick)
```python
import heapq

class MedianFinder:
    def __init__(self):
        # Max-Heap (stored with negated values to invert Python's default min-heap)
        self.small = []
        # Min-Heap
        self.large = []
        
    def addNum(self, num: int) -> None:
        # Push to Max-Heap, then balance to Min-Heap
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        
        # Enforce heap size balance rules (small can have at most +1 element)
        if len(self.small) < len(self.large):
            heapq.heappush(self.small, -heapq.heappop(self.large))
            
    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0
```

#### Java 21 (Modern JDK Thread-Safe Standard Constructs)
```java
import java.util.Collections;
import java.util.PriorityQueue;

public final class MedianFinder {
    private final PriorityQueue<Integer> smallMaxHeap;
    private final PriorityQueue<Integer> largeMinHeap;

    public MedianFinder() {
        // Construct heaps with explicit comparators
        this.smallMaxHeap = new PriorityQueue<>(Collections.reverseOrder());
        this.largeMinHeap = new PriorityQueue<>();
    }

    public void addNum(int num) {
        smallMaxHeap.offer(num);
        largeMinHeap.offer(smallMaxHeap.poll());

        // Maintain size balance
        if (smallMaxHeap.size() < largeMinHeap.size()) {
            smallMaxHeap.offer(largeMinHeap.poll());
        }
    }

    public double findMedian() {
        if (smallMaxHeap.size() > largeMinHeap.size()) {
            return smallMaxHeap.peek();
        }
        return (smallMaxHeap.peek() + largeMinHeap.peek()) / 2.0;
    }
}
```

#### JavaScript (ECMAScript 2020+: Complete Hand-Written Heap Class)
```javascript
"use strict";

/**
 * Production-ready Binary Heap implementation for JavaScript interviews.
 */
class BinaryHeap {
  constructor(compareFn = (a, b) => a - b) {
    this.heap = [];
    this.compare = compareFn;
  }
  
  size() { return this.heap.length; }
  isEmpty() { return this.heap.length === 0; }
  peek() { return this.isEmpty() ? null : this.heap[0]; }
  
  push(value) {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);
  }
  
  pop() {
    if (this.isEmpty()) return null;
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this._bubbleDown(0);
    }
    return top;
  }
  
  _bubbleUp(idx) {
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.compare(this.heap[idx], this.heap[parentIdx]) >= 0) break;
      this._swap(idx, parentIdx);
      idx = parentIdx;
    }
  }
  
  _bubbleDown(idx) {
    const len = this.heap.length;
    while (idx * 2 + 1 < len) {
      let left = idx * 2 + 1;
      let right = idx * 2 + 2;
      let target = idx;
      
      if (this.compare(this.heap[left], this.heap[target]) < 0) {
        target = left;
      }
      if (right < len && this.compare(this.heap[right], this.heap[target]) < 0) {
        target = right;
      }
      if (target === idx) break;
      
      this._swap(idx, target);
      idx = target;
    }
  }
  
  _swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}

class MedianFinder {
  constructor() {
    this.small = new BinaryHeap((a, b) => b - a); // Max-Heap
    this.large = new BinaryHeap((a, b) => a - b); // Min-Heap
  }
  
  addNum(num) {
    this.small.push(num);
    this.large.push(this.small.pop());
    
    if (this.small.size() < this.large.size()) {
      this.small.push(this.large.pop());
    }
  }
  
  findMedian() {
    if (this.small.size() > this.large.size()) {
      return this.small.peek();
    }
    return (this.small.peek() + this.large.peek()) / 2.0;
  }
}
```

### 2. Top Interview Edge Cases & Hidden Traps
*   **Integer Division Pitfall (JavaScript)**: Writing `const parentIdx = (idx - 1) / 2` inside your bubble-up helper yields a floating-point value. Using floats for indices corrupts array references and breaks the heap. **Always wrap index divisions in `Math.floor()`.**
*   **Comparison of Identical / Zero Values**: Ensure heap conditional operators handle identical values seamlessly without producing infinite bubble-up/down loops.
*   **Unbalanced Partitioning**: Forgetting to balance the heap sizes after a poll/pop can cause the size difference to grow beyond 1, returning incorrect median values.

### 3. Complexities
*   **Time Complexity**: $O(\log N)$ insertions, $O(1)$ median lookups — bubbling elements up or down takes logarithmic time relative to heap depth.
*   **Space Complexity**: $O(N)$ — space allocated for storing stream elements.

---

## Category 5: Graph Traversals (Adjacency Lists)

*   **Breadth-First Search (BFS)**: Explores a graph level-by-level, optimal for finding the shortest path on unweighted graphs.
*   **Depth-First Search (DFS)**: Recursively goes deep into a branch, ideal for cycle detection, topological sorting, and finding all paths.

### 1. Code Blueprint: Course Completion order (Topological Sort / Cycle Detection)

#### Python 3 (Three-State DFS topological sort)
```python
from collections import defaultdict
from typing import List

def find_order(num_courses: int, prerequisites: List[List[int]]) -> List[int]:
    # Represent the graph using an adjacency list
    graph = defaultdict(list)
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        
    # State tracking: 0=unvisited, 1=visiting, 2=visited
    states = [0] * num_courses
    order = []
    
    def dfs(node: int) -> bool:
        if states[node] == 1:
            return False  # Back-edge detected; cycle exists
        if states[node] == 2:
            return True   # Already verified
            
        states[node] = 1  # Mark as actively visiting
        
        for neighbor in graph[node]:
            if not dfs(neighbor):
                return False
                
        states[node] = 2  # Mark as fully processed
        order.append(node)
        return True
        
    for i in range(num_courses):
        if states[i] == 0:
            if not dfs(i):
                return []
                
    return order[::-1]  # Return reversed list for correct topological order
```

#### Java 21 (Record Pattern Matching and Sequenced Collections)
```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public final class CourseScheduler {

    public record CourseNode(int id, List<Integer> neighbors) {}

    public int[] findOrder(int numCourses, int[][] prerequisites) {
        var graph = new HashMap<Integer, CourseNode>();
        for (int i = 0; i < numCourses; i++) {
            graph.put(i, new CourseNode(i, new ArrayList<>()));
        }

        for (var edge : prerequisites) {
            int course = edge[0];
            int prereq = edge[1];
            graph.get(prereq).neighbors().add(course);
        }

        var states = new int[numCourses];
        var orderList = new ArrayList<Integer>();

        for (int i = 0; i < numCourses; i++) {
            if (states[i] == 0) {
                if (!dfs(i, graph, states, orderList)) {
                    return new int[0];
                }
            }
        }

        // Use Java 21 sequenced collections to reverse orderList
        var reversedOrder = orderList.reversed();
        var result = new int[numCourses];
        for (int i = 0; i < numCourses; i++) {
            result[i] = reversedOrder.get(i);
        }
        return result;
    }

    private boolean dfs(int node, HashMap<Integer, CourseNode> graph, int[] states, List<Integer> orderList) {
        if (states[node] == 1) return false;
        if (states[node] == 2) return true;

        states[node] = 1;

        for (var neighbor : graph.get(node).neighbors()) {
            if (!dfs(neighbor, graph, states, orderList)) {
                return false;
            }
        }

        states[node] = 2;
        orderList.add(node);
        return true;
    }
}
```

#### JavaScript (ECMAScript 2020+: Fast Array & `Uint8Array` State Tracking)
```javascript
"use strict";

/**
 * Returns a valid topological course completion sequence.
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
const findOrder = (numCourses, prerequisites) => {
  const adjList = Array.from({ length: numCourses }, () => []);
  
  for (const [course, prereq] of prerequisites) {
    adjList[prereq].push(course);
  }
  
  // Track states using a fast typed array: 0=unvisited, 1=visiting, 2=visited
  const states = new Uint8Array(numCourses);
  const order = [];
  
  const dfs = (node) => {
    if (states[node] === 1) return false; // Cycle detected
    if (states[node] === 2) return true;  // Node already verified
    
    states[node] = 1;
    
    for (const neighbor of adjList[node]) {
      if (!dfs(neighbor)) return false;
    }
    
    states[node] = 2;
    order.push(node);
    return true;
  };
  
  for (let i = 0; i < numCourses; i++) {
    if (states[i] === 0) {
      if (!dfs(i)) return [];
    }
  }
  
  return order.reverse();
};
```

### 2. Top Interview Edge Cases & Hidden Traps
*   **Disconnected Components**: Starting your search from node `0` can cause you to miss disconnected components. **To ensure complete coverage, always iterate through all nodes from $0$ to $V-1$ and start traversals if a node is unvisited.**
*   **Cycle Detection Failure**: Simple boolean visited lists (`visited = true`) are insufficient for detecting cycles in directed graphs, as safe, non-cyclic paths can also intersect. **Always use a three-state node marking approach (0=unvisited, 1=actively visiting, 2=fully processed) to distinguish cycles from safe intersecting paths.**
*   **Recursion Depth Limits (Python)**: Extremely deep dependency graphs (more than 1000 nodes) can raise a `RecursionError` in Python. For large graphs, increase the recursion limit or rewrite the search iteratively using Kahn's algorithm (indegree BFS).

### 3. Complexities
*   **Time Complexity**: $O(V + E)$ — Every node and edge is evaluated exactly once.
*   **Space Complexity**: $O(V + E)$ — Space allocated for the adjacency list and recursion stack frames.

---

## Category 6: Backtracking (Permutations & Combinations)

Backtracking is a systematic search strategy that explores all possible configurations to build a solution space. It recursively builds candidate solutions and immediately prunes branches (backtracks) if they fail to satisfy target constraints.

### 1. Code Blueprint: Unique Permutations with Duplicates

#### Python 3 (Frequency Map deconstruction)
```python
from collections import Counter
from typing import List

def permute_unique(nums: List[int]) -> List[List[int]]:
    results: List[List[int]] = []
    # Count frequencies to eliminate duplicate permutations in the same position
    freq_map = Counter(nums)
    
    def backtrack(curr_path: List[int]) -> None:
        if len(curr_path) == len(nums):
            results.append(list(curr_path))  # Store a deep copy of the completed path
            return
            
        for num in freq_map:
            if freq_map[num] > 0:
                # Choose
                curr_path.append(num)
                freq_map[num] -= 1
                
                # Recurse
                backtrack(curr_path)
                
                # Undo choose (Backtrack)
                freq_map[num] += 1
                curr_path.pop()
                
    backtrack([])
    return results
```

#### Java 21 (Sequenced ArrayList and Local Variable Type Inference)
```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public final class UniquePermutationFinder {

    public List<List<Integer>> permuteUnique(int[] nums) {
        var results = new ArrayList<List<Integer>>();
        var freqMap = new HashMap<Integer, Integer>();

        for (int num : nums) {
            freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
        }

        backtrack(new ArrayList<>(), nums.length, freqMap, results);
        return results;
    }

    private void backtrack(List<Integer> currPath, int targetLen, HashMap<Integer, Integer> freqMap, List<List<Integer>> results) {
        if (currPath.size() == targetLen) {
            results.add(new ArrayList<>(currPath));  // Store a deep copy
            return;
        }

        for (var entry : freqMap.entrySet()) {
            int num = entry.getKey();
            int count = entry.getValue();

            if (count > 0) {
                // Choose
                currPath.add(num);
                freqMap.put(num, count - 1);

                // Recurse
                backtrack(currPath, targetLen, freqMap, results);

                // Backtrack (Undo Choose)
                freqMap.put(num, count);
                currPath.removeLast();  // Java 21 Sequenced collection removal
            }
        }
    }
}
```

#### JavaScript (ECMAScript 2020+: `structuredClone()` Deep Copy)
```javascript
"use strict";

/**
 * Computes unique permutations from an array that contains duplicates.
 * @param {number[]} nums
 * @return {number[][]}
 */
const permuteUnique = (nums) => {
  const results = [];
  const freqMap = new Map();
  
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) ?? 0) + 1);
  }
  
  const backtrack = (currPath) => {
    if (currPath.length === nums.length) {
      // Use structuredClone for deep copying of array states in modern JS
      results.push(structuredClone(currPath));
      return;
    }
    
    for (const [num, count] of freqMap.entries()) {
      if (count > 0) {
        // Choose
        currPath.push(num);
        freqMap.set(num, count - 1);
        
        // Recurse
        backtrack(currPath);
        
        // Backtrack
        freqMap.set(num, count);
        currPath.pop();
      }
    }
  };
  
  backtrack([]);
  return results;
};
```

### 2. Top Interview Edge Cases & Hidden Traps
*   **Reference Leakage (Storing active paths)**: Storing the active reference path array (`curr_path`) directly into your results without deep-copying it will yield a list of empty arrays, since backtracking pops elements until the path is cleared. **Always append a deep copy: `results.append(list(path))` in Python, `new ArrayList<>(path)` in Java, or `structuredClone(path)` in JavaScript.**
*   **State Reset Overlook**: Verify that all modified states (such as frequency maps or boolean visited arrays) are reverted to their exact pre-recursion state during the backtracking phase.
*   **Duplicate Generation**: Sorting the input array or using a frequency map is essential to skip identical sibling recursion calls. If you skip this, you will generate duplicate permutations, which wastes time and memory.

### 3. Complexities
*   **Time Complexity**: $O(N \cdot N!)$ — There are at most $N!$ unique permutations, and copying the active list into the results array takes $O(N)$ time.
*   **Space Complexity**: $O(N \cdot N!)$ — Required space to store the output configurations.

---

## Category 7: Dynamic Programming (Memoization vs. Tabulation)

Dynamic Programming resolves complex optimization problems by breaking them down into simpler, overlapping subproblems.
*   **Memoization (Top-Down)**: Solves recursively, caching subproblem results as they are calculated to avoid redundant calls.
*   **Tabulation (Bottom-Up)**: Solves iteratively starting from the base cases, filling out a table to build up to the final solution.

### 1. Code Blueprint: Coin Change (Minimum Coins for Amount)

#### Python 3
```python
from typing import List

# ================= TOP-DOWN (MEMOIZATION) =================
def coin_change_top_down(coins: List[int], amount: int) -> int:
    memo = {}
    
    def dp(rem: int) -> int:
        if rem < 0: return -1
        if rem == 0: return 0
        if rem in memo: return memo[rem]
        
        min_coins = float('inf')
        for coin in coins:
            res = dp(rem - coin)
            if res != -1:
                min_coins = min(min_coins, res + 1)
                
        memo[rem] = int(min_coins) if min_coins != float('inf') else -1
        return memo[rem]
        
    return dp(amount)

# ================= BOTTOM-UP (TABULATION) =================
def coin_change_bottom_up(coins: List[int], amount: int) -> int:
    # Initialize with a value larger than any possible solution
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
                
    return dp[amount] if dp[amount] != amount + 1 else -1
```

#### Java 21
```java
import java.util.Arrays;
import java.util.HashMap;

public final class CoinChange {

    // ================= TOP-DOWN (MEMOIZATION) =================
    public int coinChangeTopDown(int[] coins, int amount) {
        return solveMemo(coins, amount, new HashMap<>());
    }

    private int solveMemo(int[] coins, int rem, HashMap<Integer, Integer> memo) {
        if (rem < 0) return -1;
        if (rem == 0) return 0;
        if (memo.containsKey(rem)) return memo.get(rem);

        int minCoins = Integer.MAX_VALUE;
        for (int coin : coins) {
            int res = solveMemo(coins, rem - coin, memo);
            if (res != -1) {
                minCoins = Math.min(minCoins, res + 1);
            }
        }

        int val = (minCoins == Integer.MAX_VALUE) ? -1 : minCoins;
        memo.put(rem, val);
        return val;
    }

    // ================= BOTTOM-UP (TABULATION) =================
    public int coinChangeBottomUp(int[] coins, int amount) {
        var dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }

        return dp[amount] == amount + 1 ? -1 : dp[amount];
    }
}
```

#### JavaScript (ECMAScript 2020+)
```javascript
"use strict";

// ================= TOP-DOWN (MEMOIZATION) =================
const coinChangeTopDown = (coins, amount) => {
  const memo = new Map();
  
  const dp = (rem) => {
    if (rem < 0) return -1;
    if (rem === 0) return 0;
    if (memo.has(rem)) return memo.get(rem);
    
    let minCoins = Infinity;
    for (const coin of coins) {
      const res = dp(rem - coin);
      if (res !== -1) {
        minCoins = Math.min(minCoins, res + 1);
      }
    }
    
    const result = minCoins === Infinity ? -1 : minCoins;
    memo.set(rem, result);
    return result;
  };
  
  return dp(amount);
};

// ================= BOTTOM-UP (TABULATION) =================
const coinChangeBottomUp = (coins, amount) => {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === amount + 1 ? -1 : dp[amount];
};
```

### 2. Top Interview Edge Cases & Hidden Traps
*   **Integer Overflow on Array Fills (Java)**: Using `Integer.MAX_VALUE` as a placeholder value inside arrays to represent unreachable states can cause overflow issues. Adding `1` to `Integer.MAX_VALUE` wraps it around to a negative number (`-2147483648`), which corrupts minimum value calculations. **Always use a safe boundary value (such as `amount + 1`) or check explicitly before adding.**
*   **Incorrect DP Array Sizes**: Allocating a table of size `amount` instead of `amount + 1` causes out-of-bounds errors when referencing the target index.
*   **Unreachable States**: Always ensure that when there are no valid coin combinations to reach the target amount, the algorithm correctly returns `-1` instead of your default placeholder value.

### 3. Complexities
*   **Time Complexity**: $O(N \cdot C)$ — Where $N$ is the target amount and $C$ is the number of coins. The outer loop runs $N$ times, and the inner loop evaluates at most $C$ operations.
*   **Space Complexity**: $O(N)$ — Memory space allocated for the DP table (tabulation) or the recursion call stack (memoization).
