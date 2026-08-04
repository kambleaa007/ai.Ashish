# The Ultimate LeetCode & Coding Interview Java Flashcards
## Master 25 Key Algorithmic, System Design, AI Comprehension, and Behavioral Strategy Cards for FAANG+ Onsites

This printable and downloadable deck of flashcards is designed to bridge the gap between rote memorization and **true pattern transfer** [cite: 20]. Each card is built around the **W3H** framework (What, Why, Where, How) and features production-ready Java code templates, real-world analogies, and systematic execution paths [cite: 22].

---

## 🗂️ Category 1: Core Array & String Patterns

### Card 01: Two Sum II (Opposite Direction Pointers)
*   **ID & Category:** Card 01 | Linear Topologies [cite: 707]
*   **Trigger Condition (When & Where):** Handled a **sorted** array or string, and need to find a pair of elements that meet a target condition (e.g., sum, product, binary target) [cite: 20, 238]. Frequently asked at Amazon, Meta, and Microsoft [cite: 236].
*   **Mental Model (Why):** Imagine two friends walking from opposite ends of a bench toward the middle. If their combined weight is too heavy, the heavier person (right) walks inward to decrease the sum; if too light, the lighter person (left) moves inward [cite: 194, 707].
*   **Implementation Strategy (How):**
    1. Initialize `left = 0` and `right = nums.length - 1` [cite: 707].
    2. Loop while `left < right` [cite: 707].
    3. If `nums[left] + nums[right] == target`, return indices [cite: 199].
    4. If the sum is less than target, increment `left` to increase the next sum [cite: 199].
    5. If the sum is greater than target, decrement `right` to decrease the next sum [cite: 199].
*   **Java Template:**
    ```java
    public int[] solveTwoPointers(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int currentSum = nums[left] + nums[nums.length - 1]; // Or any logic
            if (currentSum == target) {
                return new int[]{left, right};
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[]{-1, -1};
    }
    ```

---

### Card 02: Linked List Cycle (Fast & Slow Pointers)
*   **ID & Category:** Card 02 | Linear Topologies [cite: 707]
*   **Trigger Condition (When & Where):** Need to detect loops or cycles in a Linked List, find the start of a loop, or locate the exact middle node of a list [cite: 742, 747].
*   **Mental Model (Why):** Imagine two runners on a circular track. Runner A (Fast) runs at twice the speed of Runner B (Slow). Even if they start at different times, the fast runner will eventually overlap and pass the slow runner from behind [cite: 742].
*   **Implementation Strategy (How):**
    1. Place both `slow` and `fast` pointers at the `head` of the list [cite: 742].
    2. In a loop, advance `slow` by 1 node and `fast` by 2 nodes [cite: 742].
    3. If `slow == fast` at any point, a cycle exists [cite: 742].
    4. To find the middle of the list: when `fast` reaches the end, `slow` is guaranteed to be at the exact middle [cite: 742, 747].
*   **Java Template:**
    ```java
    public boolean hasCycle(ListNode head) {
        if (head == null) return false;
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                return true; // Cycle detected
            }
        }
        return false;
    }
    ```

---

### Card 03: Fixed Sliding Window
*   **ID & Category:** Card 03 | Linear Topologies [cite: 707]
*   **Trigger Condition (When & Where):** Asked to compute some statistic (max, sum, distinct counts) of a **contiguous subarray** of a **fixed size K** [cite: 747, 783].
*   **Mental Model (Why):** Imagine a camera lens with a fixed focal length sliding across a horizontal panoramic landscape. As the frame moves one step to the right, you only need to process the new pixel entering on the right, and subtract the old pixel exiting on the left [cite: 194, 747].
*   **Implementation Strategy (How):**
    1. Loop through the array, accumulating values for the first `K` elements to establish the initial window.
    2. Continue the loop from index `K` to `nums.length - 1`.
    3. Add the incoming element `nums[i]` and remove the outgoing element `nums[i - K]`.
    4. Update your running max/global statistic at each slide step.
*   **Java Template:**
    ```java
    public int maxSubarraySumOfSizeK(int[] nums, int k) {
        int windowSum = 0, maxSum = 0;
        for (int i = 0; i < nums.length; i++) {
            windowSum += nums[i];
            if (i >= k - 1) {
                maxSum = Math.max(maxSum, windowSum);
                windowSum -= nums[i - (k - 1)]; // Remove exiting element
            }
        }
        return maxSum;
    }
    ```

---

### Card 04: Variable Sliding Window
*   **ID & Category:** Card 04 | Linear Topologies [cite: 707]
*   **Trigger Condition (When & Where):** Need to find the **longest or shortest contiguous subarray** that satisfies a specific dynamic constraint (e.g., sum $\ge$ target, at most K distinct characters) [cite: 151, 747].
*   **Mental Model (Why):** Think of an accordion. You stretch the right side out (expand window) to take in more data. Once your constraint is violated, you compress the left side in (shrink window) until the conditions are valid again [cite: 194, 747].
*   **Implementation Strategy (How):**
    1. Initialize `left = 0`, and a global variable for length/result [cite: 747].
    2. Expand the window by iterating `right` from `0` to `nums.length - 1` [cite: 747].
    3. Add `nums[right]` to your active state (hashmap, frequency table, or sum) [cite: 197].
    4. While the constraint is violated, shrink from the `left` by updating state and incrementing `left` [cite: 747].
    5. Update your global answer (max or min length) at each valid window state [cite: 747].
*   **Java Template:**
    ```java
    public int shortestSubarray(int[] nums, int target) {
        int left = 0, minLength = Integer.MAX_VALUE, currentSum = 0;
        for (int right = 0; right < nums.length; right++) {
            currentSum += nums[right];
            while (currentSum >= target) {
                minLength = Math.min(minLength, right - left + 1);
                currentSum -= nums[left];
                left++;
            }
        }
        return minLength == Integer.MAX_VALUE ? 0 : minLength;
    }
    ```

---

### Card 05: Monotonic Stack
*   **ID & Category:** Card 05 | Stack Patterns [cite: 743]
*   **Trigger Condition (When & Where):** Asked to search for the "Next Greater Element," "Next Smaller Element," or temperature spans in an array under $\mathcal{O}(N)$ time complexity constraints [cite: 743].
*   **Mental Model (Why):** Imagine line-of-sight view from a mountain peak. If you are standing in a line of people of varying heights, your view of the horizon is blocked only by the next person who is strictly taller than you. Anyone shorter is hidden in your "shadow" [cite: 743].
*   **Implementation Strategy (How):**
    1. Initialize an empty Stack to hold array indices [cite: 743].
    2. Iterate through the array.
    3. While the stack is not empty and the current element `nums[i]` is greater than (or smaller than) the element at the index stored at the top of the stack: pop the index, update its next-greater-element in the result array to `nums[i]` [cite: 743].
    4. Push the current index `i` onto the stack [cite: 743].
*   **Java Template:**
    ```java
    public int[] nextGreaterElement(int[] nums) {
        int[] result = new int[nums.length];
        java.util.Stack<Integer> stack = new java.util.Stack<>();
        java.util.Arrays.fill(result, -1);
        for (int i = 0; i < nums.length; i++) {
            while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
                result[stack.pop()] = nums[i];
            }
            stack.push(i);
        }
        return result;
    }
    ```

---

### Card 06: Merge Intervals
*   **ID & Category:** Card 06 | Interval Manipulation [cite: 744]
*   **Trigger Condition (When & Where):** Handled list of ranges or intervals, and asked to merge overlapping boundaries, insert a new range, or calculate free/busy calendar times [cite: 147, 744].
*   **Mental Model (Why):** Think of a timeline of events. If Event A ends at 5:00 PM and Event B starts at 4:30 PM, their times overlap. You collapse them into a single continuous meeting block from A's start time to the maximum of A's or B's end times [cite: 147, 744].
*   **Implementation Strategy (How):**
    1. **Sort** the intervals based on their start times first [cite: 744].
    2. Create a list to hold merged intervals [cite: 744].
    3. Iterate through intervals. For each interval:
       - If it doesn't overlap with the last merged interval (start > end of last), append it directly [cite: 744].
       - If it overlaps (start $\le$ end of last), merge them by updating the end of the last interval to `Math.max(last.end, current.end)` [cite: 744].
*   **Java Template:**
    ```java
    public int[][] mergeIntervals(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        java.util.Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        java.util.List<int[]> merged = new java.util.ArrayList<>();
        int[] current = intervals[0];
        merged.add(current);
        for (int[] interval : intervals) {
            if (interval[0] <= current[1]) {
                current[1] = Math.max(current[1], interval[1]); // Expand end
            } else {
                current = interval;
                merged.add(current);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
    ```

---

### Card 07: Top-K Elements (Priority Queue / Heap)
*   **ID & Category:** Card 07 | Heap Patterns [cite: 203]
*   **Trigger Condition (When & Where):** Asked to find the `K` largest, `K` smallest, or `K` most frequent elements from an unsorted stream of data [cite: 10, 711, 750].
*   **Mental Model (Why):** Think of an VIP guest list at a club door capped at size K. When a new guest arrives, if they have higher status (larger value) than the lowest-status person on the VIP list, the lowest is kicked out, keeping only the elite K inside [cite: 10, 750].
*   **Implementation Strategy (How):**
    1. Initialize a **Min Heap** (for K largest elements) of size K [cite: 203, 750].
    2. Add the first `K` elements to the heap [cite: 750].
    3. For subsequent elements: if the element is strictly greater than the top of the Min Heap (the smallest VIP), pop the top and insert the new element [cite: 750].
    4. This reduces time complexity from $\mathcal{O}(N \log N)$ (sorting) to $\mathcal{O}(N \log K)$ [cite: 750].
*   **Java Template:**
    ```java
    public int[] topKElements(int[] nums, int k) {
        java.util.PriorityQueue<Integer> minHeap = new java.util.PriorityQueue<>();
        for (int num : nums) {
            minHeap.add(num);
            if (minHeap.size() > k) {
                minHeap.poll(); // Evict smallest element
            }
        }
        int[] result = new int[k];
        for (int i = 0; i < k; i++) result[i] = minHeap.poll();
        return result;
    }
    ```

---

### Card 08: K-Way Merge
*   **ID & Category:** Card 08 | Heap Patterns [cite: 203]
*   **Trigger Condition (When & Where):** You are given `K` sorted arrays, lists, or database streams, and need to merge them into a single, contiguous sorted output [cite: 147].
*   **Mental Model (Why):** Think of K queues at supermarket cash registers. To check out customers in chronological order, you look only at the person standing at the absolute front of each of the K queues. The customer with the earliest arrival checks out, and the next person behind them steps forward [cite: 147, 203].
*   **Implementation Strategy (How):**
    1. Initialize a Min Heap containing the first element of each of the `K` lists [cite: 203].
    2. Pop the smallest node/element from the heap, and write it to your result list.
    3. If the popped element had a successor node in its original list, insert that successor into the heap.
    4. Repeat until the Heap is completely empty.
*   **Java Template:**
    ```java
    public ListNode mergeKLists(ListNode[] lists) {
        java.util.PriorityQueue<ListNode> minHeap = new java.util.PriorityQueue<>((a, b) -> a.val - b.val);
        for (ListNode node : lists) {
            if (node != null) minHeap.add(node);
        }
        ListNode dummy = new ListNode(0), tail = dummy;
        while (!minHeap.isEmpty()) {
            ListNode curr = minHeap.poll();
            tail.next = curr;
            tail = tail.next;
            if (curr.next != null) minHeap.add(curr.next);
        }
        return dummy.next;
    }
    ```

---

### Card 09: Cyclic Sort
*   **ID & Category:** Card 09 | Array Sorting [cite: 147]
*   **Trigger Condition (When & Where):** Given an array containing numbers in a strictly bounded range (e.g., `1 to N` or `0 to N`), and asked to locate missing, duplicated, or corrupted elements in $\mathcal{O}(N)$ time and $\mathcal{O}(1)$ auxiliary space [cite: 147, 154].
*   **Mental Model (Why):** Imagine a classroom of N students assigned seats numbered 1 to N. Instead of sorting them alphabetically, you walk down the rows. If you find a student sitting in the wrong seat, you tap them on the shoulder and swap them with whoever is currently sitting in their correct seat. You repeat this swap chain until the row is perfectly correct [cite: 154].
*   **Implementation Strategy (How):**
    1. Initialize `i = 0`.
    2. At index `i`, check if the element `nums[i]` is in its correct index slot (i.e., `nums[i] == nums[nums[i] - 1]` for 1-based indexing).
    3. If yes, increment `i++`.
    4. If no, swap `nums[i]` with the element at its correct target index (`nums[nums[i] - 1]`). Do not increment `i` yet, as the newly swapped element needs to be checked.
*   **Java Template:**
    ```java
    public void cyclicSort(int[] nums) {
        int i = 0;
        while (i < nums.length) {
            int correctIndex = nums[i] - 1; // For 1-based numbers
            if (nums[i] > 0 && nums[i] <= nums.length && nums[i] != nums[correctIndex]) {
                int temp = nums[i];
                nums[i] = nums[correctIndex];
                nums[correctIndex] = temp;
            } else {
                i++;
            }
        }
    }
    ```

---

## 🗂️ Category 2: Non-Linear & Dynamic Programming

### Card 10: Binary Tree Level-Order Traversal (BFS)
*   **ID & Category:** Card 10 | Tree & Graph BFS [cite: 11, 200]
*   **Trigger Condition (When & Where):** Asked to traverse a binary tree or graph layer by layer, level by level, or find the shortest path in an unweighted grid [cite: 11, 200, 745].
*   **Mental Model (Why):** Think of ripples spreading across a pond when a stone is thrown in. The water moves outward in perfect, concentric rings, exploring every coordinate at distance 1, then distance 2, before reaching distance 3 [cite: 11, 200].
*   **Implementation Strategy (How):**
    1. Initialize a **Queue** and add the `root` node [cite: 11, 200].
    2. Loop while the Queue is not empty [cite: 200].
    3. Capture the current size of the Queue (`levelSize = queue.size()`). This step is critical; it seals the boundaries of the current layer before processing [cite: 11, 709].
    4. Dequeue and process exactly `levelSize` elements, pushing their left/right children into the queue [cite: 11, 709].
*   **Java Template:**
    ```java
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new java.util.ArrayList<>();
        if (root == null) return result;
        java.util.Queue<TreeNode> queue = new java.util.LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> currentLevel = new java.util.ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode curr = queue.poll();
                currentLevel.add(curr.val);
                if (curr.left != null) queue.add(curr.left);
                if (curr.right != null) queue.add(curr.right);
            }
            result.add(currentLevel);
        }
        return result;
    }
    ```

---

### Card 11: Tree Depth-First Search (DFS)
*   **ID & Category:** Card 11 | Non-Linear DFS [cite: 11, 710]
*   **Trigger Condition (When & Where):** Asked to analyze leaf-to-root paths, find tree heights/depths, check tree symmetry, or find structural properties recursively [cite: 11, 147].
*   **Mental Model (Why):** Think of a maze crawler. Instead of looking at every path near the entrance, you walk completely down one hallway until you hit a dead-end wall, backtrack one step, and try the next deepest split [cite: 11, 710].
*   **Implementation Strategy (How):**
    1. Define base cases (e.g., if node is `null`, return default) [cite: 201].
    2. Recurse deep into the left subtree [cite: 201].
    3. Recurse deep into the right subtree [cite: 201].
    4. Combine child answers at the root and bubble the result up the recursion stack [cite: 201].
*   **Java Template:**
    ```java
    public int maxDepth(TreeNode root) {
        if (root == null) return 0; // Base Case
        int leftDepth = maxDepth(root.left);
        int rightDepth = maxDepth(root.right);
        return Math.max(leftDepth, rightDepth) + 1; // Backtracking bubble up
    }
    ```

---

### Card 12: Topological Sort (Dependency Resolution)
*   **ID & Category:** Card 12 | Graph Connectivity [cite: 11, 154]
*   **Trigger Condition (When & Where):** Given a set of tasks or classes with strict pre-requisites (Directed Acyclic Graphs), and asked to find a valid ordering to execute all items [cite: 11, 751].
*   **Mental Model (Why):** Think of a college course catalog. You cannot take Advanced Databases until you complete Database Systems, and you cannot take that until you finish Intro to CS. You build a pipeline where each prerequisite is scheduled strictly first [cite: 11, 751].
*   **Implementation Strategy (How):**
    1. Build an adjacency list of the graph and calculate the **in-degree** of every node (number of incoming dependency arrows) [cite: 11, 240].
    2. Add all nodes with `in-degree == 0` (no pre-requisites) to a Queue [cite: 11].
    3. While the queue is not empty, pop a node, write it to your result list, and decrement the in-degree of all its connected neighbors [cite: 11].
    4. If any neighbor's in-degree drops to `0`, add it to the queue [cite: 11].
*   **Java Template:**
    ```java
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        java.util.List<List<Integer>> adj = new java.util.ArrayList<>();
        int[] inDegree = new int[numCourses];
        for (int i = 0; i < numCourses; i++) adj.add(new java.util.ArrayList<>());
        for (int[] pre : prerequisites) {
            adj.get(pre[1]).add(pre[0]);
            inDegree[pre[0]]++;
        }
        java.util.Queue<Integer> queue = new java.util.LinkedList<>();
        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) queue.add(i);
        int[] result = new int[numCourses];
        int index = 0;
        while (!queue.isEmpty()) {
            int curr = queue.poll();
            result[index++] = curr;
            for (int neighbor : adj.get(curr)) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) queue.add(neighbor);
            }
        }
        return index == numCourses ? result : new int[0]; // Empty if cycle exists
    }
    ```

---

### Card 13: Disjoint Set Union (Union-Find)
*   **ID & Category:** Card 13 | Graph Connectivity [cite: 154, 251]
*   **Trigger Condition (When & Where):** Asked to track connected components in a network, merge social groups dynamically, or check for cycles in an undirected graph [cite: 154, 251].
*   **Mental Model (Why):** Imagine a group of scattered tribes. Every time two tribes meet, they merge. To make this efficient, each tribe nominates one "Chief." When you want to check if two people belong to the same tribe, you only check if they answer to the exact same Chief [cite: 154].
*   **Implementation Strategy (How):**
    1. Maintain a parent array where `parent[i]` is initialized to `i`.
    2. Implement `find(i)`: recursively traverse up to find the root/Chief. Use **Path Compression** (`parent[i] = find(parent[i])`) to point nodes directly to the root for future $\mathcal{O}(1)$ lookups.
    3. Implement `union(i, j)`: find the roots of both. If different, set the parent of one root to the other (optionally using Rank to keep the tree balanced).
*   **Java Template:**
    ```java
    class UnionFind {
        private int[] parent;
        public UnionFind(int size) {
            parent = new int[size];
            for (int i = 0; i < size; i++) parent[i] = i;
        }
        public int find(int i) {
            if (parent[i] == i) return i;
            return parent[i] = find(parent[i]); // Path Compression
        }
        public boolean union(int i, int j) {
            int rootI = find(i), rootJ = find(j);
            if (rootI != rootJ) {
                parent[rootI] = rootJ; // Merge groups
                return true;
            }
            return false; // Already connected (loop/cycle)
        }
    }
    ```

---

### Card 14: Backtracking
*   **ID & Category:** Card 14 | Combinatorics [cite: 147, 752]
*   **Trigger Condition (When & Where):** Asked to generate all possible valid subsets, combinations, permutations, or configurations (e.g., N-Queens, Sudoku solver) [cite: 21, 202, 752].
*   **Mental Model (Why):** Think of a combo lock. You try the first number, then the second, then the third. If a partial combination is invalid, you immediately stop, wipe that last step, and try the next number on the previous dial [cite: 202, 711, 752].
*   **Implementation Strategy (How):**
    1. Define a recursive helper with an active state path and a starting point [cite: 202, 711].
    2. **Base Case:** If path meets target length/condition, copy and add to global results [cite: 202, 711].
    3. Loop through choices: if valid, make choice (add to path) [cite: 202, 203].
    4. Recurse [cite: 202, 203].
    5. Undo choice (remove from path) to restore state for parallel branches [cite: 202, 203, 711].
*   **Java Template:**
    ```java
    public void backtrack(List<List<Integer>> result, List<Integer> path, int[] nums, int start) {
        result.add(new java.util.ArrayList<>(path)); // Save current subset
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]); // Make choice
            backtrack(result, path, nums, i + 1); // Recurse
            path.remove(path.size() - 1); // Undo choice (backtrack)
        }
    }
    ```

---

### Card 15: 0/1 Knapsack (Dynamic Programming)
*   **ID & Category:** Card 15 | Dynamic Programming [cite: 147, 712]
*   **Trigger Condition (When & Where):** Given a set of items with weights and values, and a maximum capacity, asked to find the maximum value you can pack without exceeding weight [cite: 147, 712].
*   **Mental Model (Why):** Imagine you are packing a backpack for a hike. For each item, you must make a binary decision: pack it or leave it. You write down the optimal decisions in a logbook so that if you have the same remaining weight later, you don't calculate it from scratch [cite: 712].
*   **Implementation Strategy (How):**
    1. Create a 2D grid `dp[i][w]` where rows represent items and columns represent target capacities [cite: 712].
    2. **Base Case:** Initialize first row/column to `0`.
    3. For each item `i` and weight `w`:
       - If weight of item $i > w$, inherit the previous value: `dp[i][w] = dp[i-1][w]`.
       - If item fits, choose the max of: **leaving it** (`dp[i-1][w]`) versus **taking it** (`value[i] + dp[i-1][w - weight[i]]`).
*   **Java Template:**
    ```java
    public int knapsack(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][capacity];
    }
    ```

---

### Card 16: Longest Common Subsequence (LCS DP)
*   **ID & Category:** Card 16 | Dynamic Programming [cite: 147, 712]
*   **Trigger Condition (When & Where):** Asked to find the longest shared subsequence between two distinct strings or arrays (e.g., git diff calculations) [cite: 147, 433].
*   **Mental Model (Why):** Think of two puzzle patterns. You align them from left to right. If characters match, your shared chain length grows. If they don't, you try sliding string A by one character, then string B by one, taking the best result [cite: 147].
*   **Implementation Strategy (How):**
    1. Create a 2D array `dp[s1.length() + 1][s2.length() + 1]` [cite: 712].
    2. Iterate through characters of both strings.
    3. If `s1.charAt(i - 1) == s2.charAt(j - 1)`, set `dp[i][j] = dp[i - 1][j - 1] + 1` (grow chain).
    4. If they don't match, set `dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])` (try both slide paths).
*   **Java Template:**
    ```java
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
    ```

---

## 🗂️ Category 3: Modern 2026 AI-Native Loops & Comprehension

### Card 17: Multi-File Codebase Navigation
*   **ID & Category:** Card 17 | Code Comprehension [cite: 6, 792]
*   **Trigger Condition (When & Where):** Encountering Google's **Code Comprehension** format where you are handed an unfamiliar, multi-file repository with an existing bug or feature to implement [cite: 6, 792].
*   **Mental Model (Why):** Instead of writing raw algorithms in a blank text file, you are a digital detective investigating a sprawling machinery [cite: 226, 446]. You cannot code blindly; you must trace how wires connect (call graphs) and check data flow before picking up a wrench [cite: 6, 226, 792].
*   **Implementation Strategy (How):**
    1. **Identify the Entry Point:** Locate the main class, configuration file, or system router to see where execution starts [cite: 226].
    2. **Trace the Call Graph:** Follow function calls from client routes down to database adapters, noting where side-effects happen [cite: 226].
    3. **Discuss Requirements and Trade-offs:** Speak out loud about how modifying Class A affects dependency Class B [cite: 227].
*   **Java Actionable Steps:**
    - Use IDE shortcuts (e.g., `Ctrl+B` or `Cmd+B` in IntelliJ) to immediately find class definitions [cite: 454].
    - Leverage your integrated AI chat window (in 2026 loops) strictly for trace assistance: *"Trace the caller path of `evictNode` in this package"* [cite: 6, 792].

---

### Card 18: AI-Collaborative Debugging
*   **ID & Category:** Card 18 | Code Comprehension [cite: 6, 792]
*   **Trigger Condition (When & Where):** Working alongside an LLM partner in technical assessments to find edge cases or compile-time failures [cite: 6, 100, 792].
*   **Mental Model (Why):** Think of paired programming. The AI is a junior engineer with access to all stack libraries, but lacks foresight and safety awareness [cite: 9, 13, 100]. Your job is to act as the senior architect who reviews, edits, and guides their outputs [cite: 13, 100].
*   **Implementation Strategy (How):**
    1. Never let the AI code the core logic autonomously; write the skeleton and ask the AI to complete boilerplate [cite: 100, 101].
    2. If a bug surfaces, isolate the failing class and present the specific code block to the AI alongside the stack trace.
    3. Ask targeted debugging prompts instead of generic queries: *"Explain the concurrency edge case of this `HashMap` insertion under heavy parallel thread load"* [cite: 100, 101].
*   **Java Safety Check:**
    Always check AI-generated code for:
    - Thread-safety (e.g., using `ConcurrentHashMap` vs standard `HashMap`).
    - Potential resource leaks (e.g., not closing database connections or streams).

---

### Card 19: Prompt Engineering for Code Auditing
*   **ID & Category:** Card 19 | Code Comprehension [cite: 6, 792]
*   **Trigger Condition (When & Where):** Interview rounds that allow or encourage AI assistant usage (e.g., CoderPad 2026 setups) [cite: 6, 792].
*   **Mental Model (Why):** The quality of a database query depends entirely on the index. Similarly, the quality of an LLM's response depends strictly on your prompt context [cite: 195]. A generic "find the bug" gets a generic answer; a structural constraint prompt yields an immediate fix [cite: 100, 101].
*   **Implementation Strategy (How):**
    - **Step 1:** Define the persona and rules: *"Act as a principal Java compiler engineer. Audit this code block for out-of-bounds errors or synchronization traps."*
    - **Step 2:** Provide execution context (JVM details, input bounds).
    - **Step 3:** Restrict outputs to specific technical criteria (e.g., zero extra heap allocations).
*   **Prompt Template:**
    ```text
    "Analyze the following Java method for edge cases involving null nodes, 
    integer overflow, and thread safety. Explain any identified issues and 
    provide only the corrected Java code within the existing class structure."
    ```

---

## 🗂️ Category 4: Practical System Design Components

### Card 20: Least Recently Used (LRU) Cache
*   **ID & Category:** Card 20 | Distributed System Design [cite: 638]
*   **Trigger Condition (When & Where):** Need to design a bounded, fast memory cache where the least recently accessed items are evicted first [cite: 49]. Frequently asked at Meta, Microsoft, and Google [cite: 236, 242].
*   **Mental Model (Why):** Think of a small desk. You can only keep K files on it. When the desk is full and you need to review a new file, you throw out the file that you haven't opened in the longest time [cite: 195, 638].
*   **Implementation Strategy (How):**
    1. To achieve **$\mathcal{O}(1)$ get and put** operations, combine a **HashMap** (for lookup) with a **Doubly LinkedList** (to maintain access order) [cite: 196, 638].
    2. When a node is accessed (`get`), detach it from its current position in the list and move it to the **head** (the most recently used position).
    3. When inserting a new item (`put`), if the cache exceeds capacity, evict the node at the **tail** (the least recently used), remove it from the HashMap, and append the new node to the head.
*   **Java Template:**
    ```java
    class LRUCache {
        class Node {
            int key, value;
            Node prev, next;
            Node(int k, int v) { this.key = k; this.value = v; }
        }
        private final int capacity;
        private final java.util.Map<Integer, Node> map;
        private final Node head, tail;

        public LRUCache(int capacity) {
            this.capacity = capacity;
            this.map = new java.util.HashMap<>();
            head = new Node(0, 0);
            tail = new Node(0, 0);
            head.next = tail;
            tail.prev = head;
        }

        private void remove(Node node) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }

        private void insertAtHead(Node node) {
            node.next = head.next;
            node.next.prev = node;
            head.next = node;
            node.prev = head;
        }

        public int get(int key) {
            if (!map.containsKey(key)) return -1;
            Node node = map.get(key);
            remove(node);
            insertAtHead(node);
            return node.value;
        }

        public void put(int key, int value) {
            if (map.containsKey(key)) {
                remove(map.get(key));
            }
            Node newNode = new Node(key, value);
            insertAtHead(newNode);
            map.put(key, newNode);
            if (map.size() > capacity) {
                Node lru = tail.prev;
                remove(lru);
                map.remove(lru.key); // Evict from lookup map
            }
        }
    }
    ```

---

### Card 21: Consistent Hashing (TreeMap Ring)
*   **ID & Category:** Card 21 | Distributed System Design [cite: 85]
*   **Trigger Condition (When & Where):** Asked to design a scalable routing mechanism to distribute database requests or web traffic across a dynamic pool of N physical servers [cite: 85].
*   **Mental Model (Why):** Imagine a round roulette wheel numbered 0 to 360 degrees. Both servers and incoming request keys are hashed to a degree position on this circle. To find which server handles a request, you drop a ball on the request key's degree and walk clockwise until you hit the very first server on the circle [cite: 85, 88].
*   **Implementation Strategy (How):**
    1. Use a Java **`TreeMap`** to represent the hash ring [cite: 819].
    2. Hash each server name (and its virtual node replicas) to an integer on the ring, and put it in the `TreeMap` [cite: 819].
    3. To route a key: calculate its hash.
    4. Use `TreeMap.tailMap(hash)` to get all servers clockwise of this position [cite: 819].
    5. If the tailMap is empty, route to the absolute first server in the ring (wrap around) [cite: 819].
*   **Java Template:**
    ```java
    public class ConsistentHashRing {
        private final java.util.TreeMap<Integer, String> ring = new java.util.TreeMap<>();
        private final int numberOfReplicas;

        public ConsistentHashRing(int numberOfReplicas) {
            this.numberOfReplicas = numberOfReplicas;
        }

        public void addServer(String server) {
            for (int i = 0; i < numberOfReplicas; i++) {
                int hash = (server + "-" + i).hashCode();
                ring.put(hash, server);
            }
        }

        public String routeKey(String key) {
            if (ring.isEmpty()) return null;
            int hash = key.hashCode();
            if (!ring.containsKey(hash)) {
                java.util.SortedMap<Integer, String> tailMap = ring.tailMap(hash);
                hash = tailMap.isEmpty() ? ring.firstKey() : tailMap.firstKey();
            }
            return ring.get(hash);
        }
    }
    ```

---

### Card 22: Token Bucket Rate Limiter
*   **ID & Category:** Card 22 | Distributed System Design [cite: 85]
*   **Trigger Condition (When & Where):** Need to design a system-level component that rate-limits incoming API requests to prevent server overload [cite: 85, 603].
*   **Mental Model (Why):** Think of a token dispenser. Tokens drip into a bucket at a steady rate. Every incoming API request must consume exactly 1 token to pass. If the bucket is empty, the request is instantly rejected. The maximum burst size is limited by the bucket's capacity [cite: 85].
*   **Implementation Strategy (How):**
    1. Track `tokens` (active count) and `lastRefillTimestamp`.
    2. On each incoming request, dynamically calculate how many tokens should have been refilled based on elapsed time: `elapsedTime * refillRate`. This avoids running a background thread!
    3. If tokens are added, update `lastRefillTimestamp`.
    4. If `tokens >= 1`, decrement by 1 and return `true` (allow request); else, return `false` (rate limit).
*   **Java Template:**
    ```java
    public class TokenBucket {
        private final long capacity;
        private final double refillRatePerSecond;
        private double tokens;
        private long lastRefillTimestamp;

        public TokenBucket(long capacity, double refillRatePerSecond) {
            this.capacity = capacity;
            this.refillRatePerSecond = refillRatePerSecond;
            this.tokens = capacity;
            this.lastRefillTimestamp = System.nanoTime();
        }

        public synchronized boolean allowRequest() {
            long now = System.nanoTime();
            double elapsedSeconds = (now - lastRefillTimestamp) / 1e9;
            lastRefillTimestamp = now;

            // Refill tokens based on time
            tokens = Math.min(capacity, tokens + (elapsedSeconds * refillRatePerSecond));

            if (tokens >= 1.0) {
                tokens -= 1.0;
                return true; // Allow API request
            }
            return false; // Rate limited
        }
    }
    ```

---

## 🗂️ Category 5: Behavioral Strategy & Interview Execution

### Card 23: UMPIRE Coding Method
*   **ID & Category:** Card 23 | Live Coding Strategy [cite: 90, 163]
*   **Trigger Condition (When & Where):** The absolute default strategy to execute during the 45-minute live coding round at any top-tier tech firm [cite: 90, 163, 603].
*   **Mental Model (Why):** Writing code instantly on a whiteboard when a question is asked is a massive trap [cite: 22, 150]. UMPIRE ensures you communicate, scope the problem, design the algorithm, and dry-run with test cases before writing a single line of production code [cite: 22, 163, 427].
*   **Implementation Strategy (How):**
    - **U - Understand:** Ask clarifying questions on bounds, types, size, and constraints [cite: 163].
    - **M - Match:** Name the patterns that apply (e.g., "This contiguous subarray constraint matches Sliding Window") [cite: 158, 163, 783].
    - **P - Plan:** Write out step-by-step logic in plain English or pseudocode, and state big-O complexities [cite: 22, 163].
    - **I - Implement:** Write syntactically clean, structured code [cite: 163].
    - **R - Review:** Walk the interviewer through your code line-by-line using a dry-run test case [cite: 163].
    - **E - Evaluate:** Discuss optimization vectors, memory trade-offs, and edge cases [cite: 163].

---

### Card 24: STAR Method for Behavioral Loops
*   **ID & Category:** Card 24 | Behavioral Strategy [cite: 90, 103]
*   **Trigger Condition (When & Where):** Handled open-ended behavioral questions like *"Tell me about a time you had a technical disagreement with a peer"* [cite: 90, 91]. Essential for Amazon and Google loops [cite: 90, 91].
*   **Mental Model (Why):** Interviewers don't want a rambling, unstructured story. STAR structures your response like a compelling movie arc: you set the stage, introduce the obstacle, describe your heroic actions, and present the quantifiable happy ending [cite: 90].
*   **Implementation Strategy (How):**
    - **S - Situation:** Describe the background and context in 2-3 sentences [cite: 90].
    - **T - Task:** State the specific challenge or goal you needed to accomplish [cite: 90].
    - **A - Action:** Detail what **you** specifically did, focusing on technical decisions, collaboration, and individual contribution [cite: 90].
    - **R - Result:** Share the outcome. Always try to provide quantifiable metrics (e.g., *"reduced query latency by 45%," "saved 12 engineering hours weekly"*) [cite: 90].

---

### Card 25: High-Leverage Salary Negotiation
*   **ID & Category:** Card 25 | Career Strategy [cite: 90, 684]
*   **Trigger Condition (When & Where):** Once you receive an offer from a top-tier tech firm and need to maximize your compensation package [cite: 90, 683].
*   **Mental Model (Why):** Recruiters represent the company's budget, not your financial interests. Your leverage does not come from complaining about cost of living, but from **competing market alternatives**, specialized skill value, and professional scripting [cite: 673, 684].
*   **Implementation Strategy (How):**
    1. **Never Share Your Number First:** Let the recruiter make the initial offer. Sharing a number first caps your potential upside [cite: 683].
    2. **Leverage Alternates:** Use active conversations or offers at parallel firms as a baseline for competition: *"I am highly excited about this role, but I have a competing offer from Meta at $X level"* [cite: 684].
    3. **Focus on Total Compensation:** Negotiate across base salary, sign-on bonuses, and stock grants (RSUs).
*   **Negotiation Script:**
    ```text
    "Thank you for the offer, I am incredibly excited about the team. 
    However, I am currently in final rounds with Meta and have a strong 
    competing offer from Amazon. If we can adjust the equity target 
    to $Y, I am ready to sign the offer today."
    ```
