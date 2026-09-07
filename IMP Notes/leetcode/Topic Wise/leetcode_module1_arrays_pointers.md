# Module 1: The Core Algorithmic Patterns (Java)
## Linear Topologies, Pointer Manipulations, and Heap Bounds

Welcome to the deep-dive training for Module 1. In this module, we master the fundamental pointer techniques, sliding window states, interval management, and heap-based prioritization strategies that form the bedrock of 80% of LeetCode array and string questions [3, 22].

---

### Topic 1: Two Sum II (Input Array Is Sorted)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Two pointers moving inward from opposite ends of a sorted array to find a target sum [18]. |
| **Why** | Exploiting the sorted nature of the array allows us to discard smaller or larger element pairs systematically, reducing time complexity from $\mathcal{O}(N^2)$ to $\mathcal{O}(N)$ with constant $\mathcal{O}(1)$ space [18]. |
| **Where** | Standard screening question at Meta, Amazon, Microsoft [243]. |
| **How** | Maintain `left` at index 0 and `right` at index `n - 1`. Adjust based on comparison of `nums[left] + nums[right]` against `target` [19]. |

#### 🧠 Mental Model
Imagine a balanced seesaw. If the sum is too heavy, you must step the heavy person on the right inward to lighten the load. If the sum is too light, you step the lighter person on the left inward to increase the load.

#### 🚶 Step-by-Step Logic
1. Place pointer `left` at 0 and pointer `right` at the last index (`numbers.length - 1`).
2. Inside a `while (left < right)` loop, compute `currentSum = numbers[left] + numbers[right]`.
3. If `currentSum == target`, return 1-based indices `{left + 1, right + 1}`.
4. If `currentSum < target`, increment `left` to search for a larger value.
5. If `currentSum > target`, decrement `right` to search for a smaller value.

```java
public class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;
        while (left < right) {
            int currentSum = numbers[left] + numbers[right];
            if (currentSum == target) {
                return new int[]{left + 1, right + 1}; // 1-based indices
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[]{-1, -1};
    }
}
```

---

### Topic 2: Sliding Window - Longest Substring Without Repeating Characters
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | A dynamic-sized contiguous window tracking unique characters in a string [12, 187]. |
| **Why** | Avoids redundant nested rescans, reducing processing from $\mathcal{O}(N^2)$ to a single-pass $\mathcal{O}(N)$ [186, 189]. |
| **Where** | High frequency at Google, Apple, and Netflix [243]. |
| **How** | Move `right` pointer to expand. If a duplicate is encountered, shrink `left` until the duplicate is evicted [189, 709]. |

#### 🧠 Mental Model
Think of a flexible camera lens. As it zooms to the right, if a duplicate object enters the view, the back of the lens must contract forward until only unique objects remain within the frame.

#### 🚶 Step-by-Step Logic
1. Create an auxiliary integer array `charMap` or `HashMap` to store character frequencies or index positions [183].
2. Set `left = 0`, `maxLength = 0`.
3. Loop `right` from 0 to `s.length() - 1` [189].
4. Update the character state in the sliding window. If it is already present, contract `left` forward to maintain unique-character validity [189].
5. Update `maxLength = Math.max(maxLength, right - left + 1)`.

```java
import java.util.HashMap;

public class Solution {
    public int lengthOfLongestSubstring(String s) {
        if (s == null || s.length() == 0) return 0;
        int maxLength = 0;
        HashMap<Character, Integer> map = new HashMap<>(); // Key: Char, Value: Latest Index
        
        for (int right = 0, left = 0; right < s.length(); right++) {
            char rightChar = s.charAt(right);
            if (map.containsKey(rightChar)) {
                // Shrink window by moving left past the last duplicate occurrence
                left = Math.max(left, map.get(rightChar) + 1);
            }
            map.put(rightChar, right);
            maxLength = Math.max(maxLength, right - left + 1);
        }
        return maxLength;
    }
}
```

---

### Topic 3: Fast & Slow Pointers (Cycle Detection)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Two pointers traversing a linked list or cyclic array at different speeds (`fast = 2x`, `slow = 1x`) [185, 742]. |
| **Why** | Avoids storing visited nodes, resulting in $\mathcal{O}(N)$ runtime and $\mathcal{O}(1)$ space instead of $\mathcal{O}(N)$ space [185, 191]. |
| **Where** | Standard LinkedIn and Uber question [338]. |
| **How** | If the pointers collide, a cycle is present. If the fast pointer hits `null`, there is no cycle [185, 743]. |

#### 🧠 Mental Model
Two runners on a track. The faster runner moves at twice the speed of the slower runner. If the track is linear, the fast runner reaches the finish line and stops. If the track is circular, the fast runner will eventually overlap and lap the slow runner from behind.

```java
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) return false;
        ListNode slow = head;
        ListNode fast = head;
        
        while (fast != null && fast.next != null) {
            slow = slow.next;        // 1 step
            fast = fast.next.next;   // 2 steps
            if (slow == fast) {      // Lapped collision detected!
                return true;
            }
        }
        return false;
    }
}
```

---

### Topic 4: Merge Intervals
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Grouping overlapping numeric segments by sorting their boundaries [746]. |
| **Why** | Sort guarantees contiguous overlap checks, solving interval unions in $\mathcal{O}(N \log N)$ time [747]. |
| **Where** | Prime Microsoft and Meta screening question [243]. |
| **How** | Sort intervals by start time. Iterate and merge with the last added interval if `current.start <= last.end` [747]. |

```java
import java.util.Arrays;
import java.util.LinkedList;

public class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        
        // Sort intervals by start time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        
        LinkedList<int[]> merged = new LinkedList<>();
        for (int[] interval : intervals) {
            // If empty or no overlap, add current directly
            if (merged.isEmpty() || merged.getLast()[1] < interval[0]) {
                merged.add(interval);
            } else {
                // There is overlap, merge boundaries
                merged.getLast()[1] = Math.max(merged.getLast()[1], interval[1]);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}
```

---

### Topic 5: Top-K Elements (Heap / Priority Queue)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Extracting the K largest or smallest elements from an unsorted stream or array [14, 759]. |
| **Why** | Using a min-heap maintains a size of K, lowering time from $\mathcal{O}(N \log N)$ sorting to $\mathcal{O}(N \log K)$ [759]. |
| **Where** | Standard FAANG requirement for high-throughput streaming pipelines [14, 33]. |
| **How** | Add items to Min-Heap. If size exceeds K, pop the smallest. The remaining K are your top elements [15, 759]. |

```java
import java.util.PriorityQueue;

public class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Min Heap
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.add(num);
            if (minHeap.size() > k) {
                minHeap.poll(); // Keep only the largest k elements seen so far
            }
        }
        return minHeap.peek(); // The top of the heap is the kth largest
    }
}
```

---

### Topic 6: K-Way Merge
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Merging $K$ pre-sorted streams or lists into a single consolidated sorted list [238]. |
| **Why** | Priority Queue tracks the smallest current element of each stream, achieving $\mathcal{O}(N \log K)$ runtime [238]. |
| **Where** | Common SRE and Database storage engine loop questions [246]. |
| **How** | Insert first element of each $K$ list into min-heap. Pop smallest, add to result, and insert next node from same list [238]. |

```java
import java.util.PriorityQueue;

public class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (headIsEmpty(lists)) return null;
        
        PriorityQueue<ListNode> minHeap = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
        
        for (ListNode node : lists) {
            if (node != null) {
                minHeap.add(node);
            }
        }
        
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        
        while (!minHeap.isEmpty()) {
            ListNode smallest = minHeap.poll();
            curr.next = smallest;
            curr = curr.next;
            
            if (smallest.next != null) {
                minHeap.add(smallest.next);
            }
        }
        return dummy.next;
    }
    
    private boolean headIsEmpty(ListNode[] lists) {
        return lists == null || lists.length == 0;
    }
}
```

---

### Topic 7: Monotonic Stack (Next Greater Element)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | A stack maintaining elements in a strictly increasing or decreasing order to resolve nearest-boundary indices [744, 767]. |
| **Why** | Solves next-greater problems in $\mathcal{O}(N)$ time by visiting each element at most twice (push/pop) instead of brute-force $\mathcal{O}(N^2)$ [745, 768]. |
| **Where** | Frequently asked in financial market analysis and histogram metrics at Meta [745]. |
| **How** | Loop through elements. While current element is larger than stack top, pop from stack and assign current as their Next Greater Element [745, 767]. |

```java
import java.util.Arrays;
import java.util.Stack;

public class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        java.util.HashMap<Integer, Integer> map = new java.util.HashMap<>();
        Stack<Integer> stack = new Stack<>();
        
        // Loop through nums2 (where lookup happens)
        for (int num : nums2) {
            // While current is greater than stack's top, map the association
            while (!stack.isEmpty() && stack.peek() < num) {
                map.put(stack.pop(), num);
            }
            stack.push(num);
        }
        
        int[] result = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) {
            result[i] = map.getOrDefault(nums1[i], -1);
        }
        return result;
    }
}
```

---

### Topic 8: Cyclic Sort (In-Place Missing Elements)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Sorting an array in $\mathcal{O}(N)$ time without extra space when values are bounded in a contiguous range [254, 260]. |
| **Why** | Places each element at its corresponding index in a single pass, enabling $\mathcal{O}(1)$ auxiliary space complexity [254]. |
| **Where** | High frequency at Apple and Google [254]. |
| **How** | Iterate. If current item is not at its correct index (i.e. `nums[i] != i + 1`), swap it with the element at its correct index [254]. |

```java
public class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        int i = 0;
        while (i < n) {
            int correctIdx = nums[i] - 1;
            // Check if within bounds and not already in correct position
            if (nums[i] > 0 && nums[i] <= n && nums[i] != nums[correctIdx]) {
                swap(nums, i, correctIdx);
            } else {
                i++;
            }
        }
        
        // Find first mismatch
        for (int j = 0; j < n; j++) {
            if (nums[j] != j + 1) {
                return j + 1;
            }
        }
        return n + 1;
    }
    
    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```
