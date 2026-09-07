# Days 01–04: Master Sliding Window (The Definitive Guide)

Welcome to your **definitive, bulletproof study guide** for the Sliding Window pattern. This guide is crafted to transform you from memorizing code to developing **instant, high-fidelity pattern recognition and structural implementation skills**. 

---

## 1. Grounding Core Concepts

### What is a Sliding Window?
The sliding window technique is an optimization pattern applied to linear data structures (arrays, strings, and linked lists). It is used to convert expensive **$O(n^2)$** nested loops into highly efficient **$O(n)$** single-pass linear scans [6, 120, 121].

Instead of reconstructing subsets from scratch at every step, a sliding window maintains a dynamic "frame" defined by two pointers (`left` and `right`) [6, 100, 120]. As the right boundary expands to ingest new data, the left boundary contracts to discard obsolete elements, retaining and adjusting the intermediate state incrementally [100, 120].

```
Brute Force O(n²):
Pass 1: [a, b, c] d, e
Pass 2: a, [b, c, d] e  <-- Recalculated 'b' and 'c' from scratch!

Sliding Window O(n):
State:  [a, b, c] d, e  --> window_sum = a + b + c
Move:   a [b, c, d] e   --> window_sum = window_sum - a + d (O(1) update!)
```

### The Two Major Sub-Patterns
1. **Fixed-Size Window**: The window width is constrained to a static size $k$ [75, 120]. The frame moves from left to right, maintaining its width exactly [35, 120].
2. **Variable-Size (Dynamic) Window**: The window boundaries expand and contract dynamically based on input-specific criteria or rule constraints [75, 100].

---

## 2. Trigger Cues & Constraints Analysis

To instantly recognize a sliding window problem, analyze the problem statement for the following structural signatures:

### 1. Keyword Indicators
*   Any request for a **contiguous substring** or **contiguous subarray** [6, 35]. *(Note: If the subset does not have to be contiguous, the sliding window is usually violated—backtracking or dynamic programming is likely required [13, 16]).*
*   Optimization descriptors: **"longest"**, **"shortest"**, **"maximum sum"**, **"minimum length"** [6, 214].
*   Cardinality criteria: **"exactly $K$ unique"**, **"at most $K$ repeating"**, **"containing all characters from"** [6, 214].

### 2. Constraint Signature Cues
*   Look at the bottom of the LeetCode screen for the input boundaries ($n$):
    *   If $n \ge 10^5$, an $O(n^2)$ algorithm will trigger a **Time Limit Exceeded (TLE)** error [63, 64]. You are being guided toward an $O(n)$ linear time solution, which strongly indicates a Sliding Window or Two Pointers pattern [64, 172].

---

## 3. The Ultimate Sliding Window Skeletons

Memorize these two structural frames. They act as state-machine skeletons that you can easily adapt to any constraint during an interview.

### Pattern A: Variable-Size (Dynamic) Window Blueprint

```python
def sliding_window_dynamic(arr):
    left = 0
    max_len = 0
    state_tracker = {}  # Tracks element frequencies or uniqueness inside the window
    
    for right in range(len(arr)):
        # 1. Expand the window by ingesting the rightmost element
        right_char = arr[right]
        state_tracker[right_char] = state_tracker.get(right_char, 0) + 1
        
        # 2. Shrink the window from the left while the constraint is violated
        while constraint_violated(state_tracker):
            left_char = arr[left]
            state_tracker[left_char] -= 1
            if state_tracker[left_char] == 0:
                del state_tracker[left_char]  # Completely prune to keep length checks clean
            left += 1  # Shift window left boundary
            
        # 3. Once valid, record the optimum state (e.g., max window length)
        max_len = max(max_len, right - left + 1)
        
    return max_len
```

### Pattern B: Fixed-Size Window Blueprint

```python
def sliding_window_fixed(arr, k):
    window_sum = 0
    left = 0
    max_result = float('-inf')
    
    for right in range(len(arr)):
        # 1. Ingest the element at 'right' into the running state
        window_sum += arr[right]
        
        # 2. When the right boundary reaches the window size threshold (k - 1)
        if right >= k - 1:
            # Update the global tracker with the valid window state
            max_result = max(max_result, window_sum)
            
            # 3. Discard the element at 'left' from state and slide left pointer forward
            window_sum -= arr[left]
            left += 1
            
    return max_result
```

---

## 4. Deep-Dive Problems (Complete Solved Suite)

We will now perform a vertical deep-dive into **9 curated sliding window problems** [6, 137, 139]. For each problem, we provide a complete conceptual analysis, pointer visual trace, clean Python solution, complexity breakdown, and interview pitfall warnings.

---

### Problem 1: Maximum Average Subarray I (LeetCode #643)
*Difficulty: Easy* [140]

#### A. Recognition Cue
*   **Contiguous subarray** + **fixed size $k$** + finding the **maximum average** [75, 76]. Fits the **Fixed-Size Window Pattern** perfectly.

#### B. Hand-Traced Visual Map
Input: `nums = [1, 12, -5, -6, 50, 3]`, `k = 4`

```
Step 1: right = 0..3 -> Window = [1, 12, -5, -6] -> sum = 2
        right >= 3 -> max_sum = 2. Evict left (nums[0]=1), left becomes 1.
Step 2: right = 4 -> Window = [12, -5, -6, 50] (sum = 2 + 50 = 51) -> max_sum = 51.
        Evict left (nums[1]=12), left becomes 2.
Step 3: right = 5 -> Window = [-5, -6, 50, 3] (sum = 51 - 12 + 3 = 42) -> max_sum = max(51, 42) = 51.
        Evict left (nums[2]=-5), left becomes 3.

Result = 51 / 4 = 12.75
```

#### C. Python Solution
```python
def findMaxAverage(nums: list[int], k: int) -> float:
    window_sum = 0
    max_sum = float('-inf')
    left = 0
    
    for right in range(len(nums)):
        window_sum += nums[right]
        
        if right >= k - 1:
            max_sum = max(max_sum, window_sum)
            window_sum -= nums[left]
            left += 1
            
    return max_sum / k
```

#### D. Complexity Parameters
*   **Time Complexity:** $\mathcal{O}(n)$ — We process each element of the array at most twice (once by right, once by left) [121].
*   **Space Complexity:** $\mathcal{O}(1)$ — No extra data structures are allocated.

#### E. Crucial Pitfall
*   *The Negative Max Bug:* Avoid initializing `max_sum = 0` or `max_sum = float('inf')`. If all numbers inside `nums` are negative, initializing to `0` will mask the true negative maximum average. Always use `float('-inf')` or initialize to the first window sum.

---

### Problem 2: Contains Duplicate II (LeetCode #219)
*Difficulty: Easy*

#### A. Recognition Cue
*   Checking for duplicate elements within a **maximum distance of $k$**. This translates to managing a moving window of size at most $k + 1$ containing unique values.

#### B. Hand-Traced Visual Map
Input: `nums = [1, 2, 3, 1]`, `k = 3`

```
Step 1: right = 0 -> Set = {1}
Step 2: right = 1 -> Set = {1, 2}
Step 3: right = 2 -> Set = {1, 2, 3}
Step 4: right = 3 -> nums[3] = 1 is already in Set! Return True.
```

#### C. Python Solution
```python
def containsNearbyDuplicate(nums: list[int], k: int) -> bool:
    seen = set()
    left = 0
    
    for right in range(len(nums)):
        # Maintain window size constraint: size cannot exceed k
        if right - left > k:
            seen.remove(nums[left])
            left += 1
            
        # Uniqueness Check
        if nums[right] in seen:
            return True
        seen.add(nums[right])
        
    return False
```

#### D. Complexity Parameters
*   **Time Complexity:** $\mathcal{O}(n)$ — Hash set lookups and insertions operate in $\mathcal{O}(1)$ amortized time.
*   **Space Complexity:** $\mathcal{O}(\min(n, k))$ — The hash set holds at most $k$ elements at any given moment.

#### E. Crucial Pitfall
*   *Window Boundary Off-By-One:* The problem specifies the index difference `abs(i - j) <= k`. This means the max window size (number of elements) is $k + 1$. Thus, we only evict elements when the distance `right - left` strictly exceeds $k$.

---

### Problem 3: Substrings of Size Three with Distinct Characters (LeetCode #1876)
*Difficulty: Easy*

#### A. Recognition Cue
*   **Substring** + **fixed size of exactly 3** + counting substrings with **distinct characters**.

#### B. Hand-Traced Visual Map
Input: `s = "xyzzaz"`

```
Window 1: "xyz" -> distinct characters? Yes. Count = 1.
Window 2: "yzz" -> distinct characters? No ('z' repeated).
Window 3: "zza" -> distinct characters? No ('z' repeated).
Window 4: "zaz" -> distinct characters? No ('z' repeated).

Result = 1
```

#### C. Python Solution
```python
def countGoodSubstrings(s: str) -> int:
    good_count = 0
    char_freq = {}
    left = 0
    
    for right in range(len(s)):
        char_freq[s[right]] = char_freq.get(s[right], 0) + 1
        
        if right >= 2:  # Once window reaches size 3
            if len(char_freq) == 3:
                good_count += 1
                
            # Evict left
            left_char = s[left]
            char_freq[left_char] -= 1
            if char_freq[left_char] == 0:
                del char_freq[left_char]
            left += 1
            
    return good_count
```

#### D. Complexity Parameters
*   **Time Complexity:** $\mathcal{O}(n)$ — Single pass linear traversal.
*   **Space Complexity:** $\mathcal{O}(1)$ — The dictionary holds a maximum of 3 character entries.

#### E. Crucial Pitfall
*   *Failing to Prune Empty Keys:* In Python, if `char_freq[left_char]` drops to `0`, simply setting it to `0` does not change `len(char_freq)`. You must explicitly run `del char_freq[left_char]` to keep dictionary size checks accurate.

---

### Problem 4: Longest Substring Without Repeating Characters (LeetCode #3)
*Difficulty: Medium* [6]

#### A. Recognition Cue
*   **Substring** + optimization for **longest** + constraint of **no repeating characters** [6, 216].

#### B. Hand-Traced Visual Map
Input: `s = "abcabcbb"`

```
R=0: 'a' -> Window = ["a"], valid. max_len = 1
R=1: 'b' -> Window = ["a", "b"], valid. max_len = 2
R=2: 'c' -> Window = ["a", "b", "c"], valid. max_len = 3
R=3: 'a' -> Duplicate 'a'! Contract left.
            L=0: Remove 'a', L becomes 1. Window = ["b", "c", "a"]. valid. max_len = 3
R=4: 'b' -> Duplicate 'b'! Contract left.
            L=1: Remove 'b', L becomes 2. Window = ["c", "a", "b"]. valid. max_len = 3
...
```

#### C. Python Solution
```python
def lengthOfLongestSubstring(s: str) -> int:
    char_set = set()
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        # Shrink window until duplicate of s[right] is evicted
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
            
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
        
    return max_len
```

#### D. Complexity Parameters
*   **Time Complexity:** $\mathcal{O}(n)$ — Each character is visited at most twice (inserted once and deleted once from the set) [216].
*   **Space Complexity:** $\mathcal{O}(\min(s, \Sigma))$ — $\Sigma$ is the alphabet size (character set size).

#### E. Crucial Pitfall
*   *Inner While Loop Misconception:* Candidates often think the nested `while` loop makes this $\mathcal{O}(n^2)$. This is incorrect. The `left` pointer can only travel forward and never retreats. The inner code executes at most $n$ times total across the entire lifetime of the process.

---

### Problem 5: Fruit Into Baskets (LeetCode #904)
*Difficulty: Medium*

#### A. Recognition Cue
*   **Contiguous subarray** + finding the **maximum length** + having **at most 2 unique** values (baskets).

#### B. Hand-Traced Visual Map
Input: `fruits = [1, 2, 1, 2, 3]`

```
R=0: State = {1: 1}, Distinct = 1, Max = 1
R=1: State = {1: 1, 2: 1}, Distinct = 2, Max = 2
R=2: State = {1: 2, 2: 1}, Distinct = 2, Max = 3
R=3: State = {1: 2, 2: 2}, Distinct = 2, Max = 4
R=4: State = {1: 2, 2: 2, 3: 1}, Distinct = 3! Constraint Violated!
     Shrink from left:
     L=0: Evict 1. State = {1: 1, 2: 2, 3: 1}, Distinct = 3
     L=1: Evict 2. State = {1: 1, 2: 1, 3: 1}, Distinct = 3
     L=2: Evict 1. State = {2: 1, 3: 1}, Distinct = 2! Valid again.
     Window = [2, 3], length = 2. Max remains 4.
```

#### C. Python Solution
```python
def totalFruit(fruits: list[int]) -> int:
    basket = {}
    left = 0
    max_fruits = 0
    
    for right in range(len(fruits)):
        basket[fruits[right]] = basket.get(fruits[right], 0) + 1
        
        # Violating condition: More than 2 types of fruits
        while len(basket) > 2:
            left_fruit = fruits[left]
            basket[left_fruit] -= 1
            if basket[left_fruit] == 0:
                del basket[left_fruit]
            left += 1
            
        max_fruits = max(max_fruits, right - left + 1)
        
    return max_fruits
```

#### D. Complexity Parameters
*   **Time Complexity:** $\mathcal{O}(n)$ — Single pass scan.
*   **Space Complexity:** $\mathcal{O}(1)$ — The map size is strictly bound to at most 3 elements.

#### E. Crucial Pitfall
*   *Confusing element count with unique count:* Be sure to track the number of keys in the dictionary (`len(basket)`), not the sum of values. The sum of values represents the total fruits, while the number of keys represents unique types.

---

### Problem 6: Longest Repeating Character Replacement (LeetCode #424)
*Difficulty: Medium* [76]

#### A. Recognition Cue
*   **Substring** + **maximum length** + checking if we can replace up to $k$ characters to make all characters in the substring identical [76].

#### B. Hand-Traced Visual Map
Input: `s = "AABABBA"`, `k = 1`

```
Window validation condition:
Length of window - Count of most frequent character in window <= k
If this is True, we can convert all other characters to the most frequent one within k edits.

R=0: 'A' -> Freq = {'A': 1}, Max_Freq = 1. Window="A" (1 - 1 <= 1). Valid. Max=1
R=1: 'A' -> Freq = {'A': 2}, Max_Freq = 2. Window="AA" (2 - 2 <= 1). Valid. Max=2
R=2: 'B' -> Freq = {'A': 2, 'B': 1}, Max_Freq = 2. Window="AAB" (3 - 2 <= 1). Valid. Max=3
R=3: 'A' -> Freq = {'A': 3, 'B': 1}, Max_Freq = 3. Window="AABA" (4 - 3 <= 1). Valid. Max=4
R=4: 'B' -> Freq = {'A': 3, 'B': 2}, Max_Freq = 3. Window="AABAB" (5 - 3 = 2 > 1). Invalid!
     Shrink left: L=0 -> Evict 'A'. Freq = {'A': 2, 'B': 2}, Window="ABAB", invalid.
     L=1 -> Evict 'A'. Freq = {'A': 1, 'B': 2}, Window="BAB", valid. Max = 4.
```

#### C. Python Solution
```python
def characterReplacement(s: str, k: int) -> int:
    char_freq = {}
    left = 0
    max_len = 0
    max_freq = 0  # Tracks the frequency of the most common character seen in the current/past windows
    
    for right in range(len(s)):
        char_freq[s[right]] = char_freq.get(s[right], 0) + 1
        max_freq = max(max_freq, char_freq[s[right]])
        
        # Window size = right - left + 1. 
        # Number of replacement operations needed = window_size - max_freq.
        # If operations needed > k, shrink.
        while (right - left + 1) - max_freq > k:
            char_freq[s[left]] -= 1
            left += 1
            
        max_len = max(max_len, right - left + 1)
        
    return max_len
```

#### D. Complexity Parameters
*   **Time Complexity:** $\mathcal{O}(n)$ — Linear time scan.
*   **Space Complexity:** $\mathcal{O}(1)$ — The dictionary size is bounded by the uppercase English alphabet size (max 26 entries).

#### E. Crucial Pitfall
*   *Do We Need to Decrease `max_freq` on Eviction?* This is the most common follow-up question in FAANG interviews. **No**, you do not need to decrement `max_freq` when evicting elements. Since we are seeking the *maximum* possible window, we only care when a new window beats the historical `max_freq` record. Decreasing it doesn't affect correctness and skipping the decrease allows us to avoid scanning the entire map of size 26 on every contraction, keeping execution fast.

---

### Problem 7: Permutation in String (LeetCode #567)
*Difficulty: Medium*

#### A. Recognition Cue
*   Checking if a string $s_2$ contains a **permutation** of $s_1$ as a **substring**. Since a permutation must be identical in length and character frequencies, we are dealing with a **Fixed-Size Window Pattern** of size `len(s1)`.

#### B. Hand-Traced Visual Map
Input: `s1 = "ab"`, `s2 = "eidbaooo"`

```
s1_freq = {'a': 1, 'b': 1}, Window Size = 2
R=0: 'e' -> Window="e"
R=1: 'i' -> Window="ei", not matching. Evict 'e'.
R=2: 'd' -> Window="id", not matching. Evict 'i'.
R=3: 'b' -> Window="db", not matching. Evict 'd'.
R=4: 'a' -> Window="ba", Matches character frequencies! Return True.
```

#### C. Python Solution
```python
def checkInclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2):
        return False
        
    s1_count = [0] * 26
    s2_count = [0] * 26
    
    # Initialize the frequency lists for the first len(s1) elements
    for i in range(len(s1)):
        s1_count[ord(s1[i]) - ord('a')] += 1
        s2_count[ord(s2[i]) - ord('a')] += 1
        
    if s1_count == s2_count:
        return True
        
    left = 0
    # Slide across the remaining elements of s2
    for right in range(len(s1), len(s2)):
        s2_count[ord(s2[right]) - ord('a')] += 1
        s2_count[ord(s2[left]) - ord('a')] -= 1
        left += 1
        
        if s1_count == s2_count:
            return True
            
    return False
```

#### D. Complexity Parameters
*   **Time Complexity:** $\mathcal{O}(n)$ — Where $n$ is `len(s2)`. We traverse the strings once.
*   **Space Complexity:** $\mathcal{O}(1)$ — Array counts are fixed at size 26.

#### E. Crucial Pitfall
*   *Edge Case Crash:* Always verify if `len(s1) > len(s2)` immediately. If you skip this check, your initial indexing loops will trigger an out-of-bounds error on $s_2$.

---

### Problem 8: Find All Anagrams in a String (LeetCode #438)
*Difficulty: Medium*

#### A. Recognition Cue
*   Finding all occurrences of $p$'s anagrams in $s$. An anagram is a permutation, meaning this is a direct variation of the **Fixed-Size Window Pattern** of size `len(p)` where we record starting indices.

#### B. Hand-Traced Visual Map
Input: `s = "cbaebabacd"`, `p = "abc"`

```
Target frequencies: {'a': 1, 'b': 1, 'c': 1}, Window Size = 3
Index 0: "cba" -> Match! Add index 0 to result.
Index 1: "bae" -> No match.
Index 2: "aeb" -> No match.
...
Index 6: "bac" -> Match! Add index 6 to result.
```

#### C. Python Solution
```python
def findAnagrams(s: str, p: str) -> list[int]:
    if len(p) > len(s):
        return []
        
    p_count = [0] * 26
    s_count = [0] * 26
    result = []
    
    for i in range(len(p)):
        p_count[ord(p[i]) - ord('a')] += 1
        s_count[ord(s[i]) - ord('a')] += 1
        
    if p_count == s_count:
        result.append(0)
        
    left = 0
    for right in range(len(p), len(s)):
        s_count[ord(s[right]) - ord('a')] += 1
        s_count[ord(s[left]) - ord('a')] -= 1
        left += 1
        
        if p_count == s_count:
            result.append(left)
            
    return result
```

#### D. Complexity Parameters
*   **Time Complexity:** $\mathcal{O}(n)$ — Single pass traversing string $s$.
*   **Space Complexity:** $\mathcal{O}(1)$ — Count arrays remain size 26.

#### E. Crucial Pitfall
*   *Inefficient String Comparison:* Never use `sorted(substring) == sorted(p)` inside your loop. Sorting a string of size $k$ takes $\mathcal{O}(k \log k)$ time, which pushes the overall time complexity to $\mathcal{O}(n \cdot k \log k)$, triggering TLE. Direct array value equality checks on size-26 lists take $\mathcal{O}(26) = \mathcal{O}(1)$ constant operations.

---

### Problem 9: Minimum Window Substring (LeetCode #76)
*Difficulty: Hard* [6]

#### A. Recognition Cue
*   Finding the **shortest substring** in $s$ that contains **all characters** of $t$. Since the size of the target substring is variable and we seek to minimize it, we apply the **Variable-Size Window Pattern** with dynamic contraction [6, 217].

#### B. Hand-Traced Visual Map
Input: `s = "ADOBECODEBANC"`, `t = "ABC"`

```
Step 1: Expand Right until we have 'A', 'B', 'C'.
        Hits valid state at right = 5 (Window: "ADOBEC").
Step 2: Shrink Left to minimize window.
        L=0: Evicts 'A', invalidates window ("DOBEC" misses 'A').
Step 3: Expand Right again to find 'A' again.
        Hits valid state at right = 10 (Window: "DOBEC_ODEBA").
Step 4: Shrink Left to minimize:
        L=1..5: Evicts 'D', 'O', 'B', 'E', 'C'.
        At L=6, window becomes "CODEBA", valid! Max length shrinks.
Step 5: Continue to end... optimum is found at the very end: "BANC".
```

#### C. Python Solution
```python
def minWindow(s: str, t: str) -> str:
    if not s or not t or len(s) < len(t):
        return ""
        
    target_counts = {}
    for char in t:
        target_counts[char] = target_counts.get(char, 0) + 1
        
    window_counts = {}
    left = 0
    
    # 'have' tracks how many unique characters in t have met their required counts inside the window
    # 'need' tracks the total unique characters we need to satisfy
    have = 0
    need = len(target_counts)
    
    # Store result coordinates: (length, left_index, right_index)
    ans = (float('inf'), None, None)
    
    for right in range(len(s)):
        char = s[right]
        window_counts[char] = window_counts.get(char, 0) + 1
        
        if char in target_counts and window_counts[char] == target_counts[char]:
            have += 1
            
        # Shrink phase: while the window is valid, attempt to contract from left
        while have == need:
            # Update best coordinates if current window is smaller
            if (right - left + 1) < ans[0]:
                ans = (right - left + 1, left, right)
                
            left_char = s[left]
            window_counts[left_char] -= 1
            
            # If a character count drops below target requirements, decrement 'have'
            if left_char in target_counts and window_counts[left_char] < target_counts[left_char]:
                have -= 1
                
            left += 1
            
    return "" if ans[0] == float('inf') else s[ans[1]:ans[2] + 1]
```

#### D. Complexity Parameters
*   **Time Complexity:** $\mathcal{O}(s + t)$ — Linear time scan proportional to the size of both strings.
*   **Space Complexity:** $\mathcal{O}(s + t)$ — Space to hold character counts in the worst case where strings contain all unique characters.

#### E. Crucial Pitfall
*   *The Value Count Collision:* In Python, make sure you compare integer counts using `==` rather than structural hashes, and remember that when decrementing character counts, you should check `window_counts[left_char] < target_counts[left_char]` only. A very common bug is comparing entire dict objects, which contains extra non-target characters and leads to incorrect logic.

---

## 5. Spaced Repetition Practice Schedule

| Day | Task | Goal |
| :--- | :--- | :--- |
| **Day 1** | • Implement Fixed Window templates from memory.<br>• Solve **LC #643**, **LC #219**, and **LC #1876** [140]. | Build basic pointer movement and hashing muscle memory. |
| **Day 2** | • Implement Dynamic Window templates from memory.<br>• Solve **LC #3** and **LC #904** [140, 191]. | Practice tracking state variables and shrinking conditions dynamically [100]. |
| **Day 3** | • Review Day 1 & 2 struggles.<br>• Solve **LC #424**, **LC #567**, and **LC #438** [76, 140]. | Master count-replacement checking and permutations inside windows. |
| **Day 4** | • Solve Peak Challenge **LC #76** [140].<br>• Write down any "aha!" moments in your study log. | Bridge the gap between standard medium solutions and complex hard optimization. |

---

## 6. Interview Defense Tactics & Anti-Bugs

Before you declare your solution complete during an interview, perform this conceptual sanity pass:

1.  **Empty Input Guard:** How does your solution behave if `len(nums) == 0` or string `s` is empty? Add guard clauses.
2.  **K-Boundary Overreach:** If $k$ is greater than the array size, does your solution throw an Index Error?
3.  **Frequency Dictionary Cleanup:** If you decrement a count to $0$ inside your map, did you call `del map[key]`?
4.  **Off-by-One Math:** Remember that a window bounded by `left` and `right` (inclusive of both indices) has a length of **`right - left + 1`**.
