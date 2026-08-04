# The Ultimate 100-Topic LeetCode Coding Interview Master Guide (Java)
## Your Comprehensive Strategic Roadmap to Pattern Mastery, System Design, AI Fluency, and Behavioral Strategy

### Introduction: The Multiplier Effect of Pattern-Based Preparation
Securing a premier software engineering role at a top-tier tech firm (like FAANG, Microsoft, or high-growth unicorns) is one of the highest-leverage career moves you can make. The compensation premium at these firms represents a **$50,000 to over $100,000 annual uplift** compared to standard market rates, compounding to millions over a career.

This master guide is designed to move you past the **"memorization trap"** (grinding hundreds of disconnected questions) and transition you to **"systematic pattern mastery"** and **AI-native engineering fluency**. By learning the underlying templates, mental models, and trade-offs of the 100 most critical algorithmic, system design, code comprehension, and behavioral topics, you build the transferable skills needed to solve any unseen interview variation with absolute confidence.

---

## Module 1: The Core Algorithmic Patterns (Topics 1–35)

This module focuses on linear data structures, pointer manipulations, and boundary search spaces. It covers the foundation of technical problem-solving.

![Sliding Window Pattern](sliding_window_visual.jpg)

### Topics 1–8: Two Pointers & Opposite Direction

#### Topic 1: Two Sum II (Input Array Is Sorted)
| Dimension | Details |
| --- | --- |
| **What** | Using two pointers starting at opposite ends of a sorted array to find a target sum. |
| **Why** | Sorting allows us to eliminate elements systematically, reducing time complexity from $\mathcal{O}(N^2)$ to $\mathcal{O}(N)$ without extra space. |
| **Where** | Frequently asked at Amazon, Meta, Microsoft. |
| **How** | Move `left` pointer inward if sum is too low; move `right` pointer inward if sum is too high. |

*   **Mental Model:** Imagine two people on opposite ends of a bench walking towards the middle. If their combined weight is too heavy, the heavier person moves inward; if too light, the lighter person moves inward.
*   **Step-by-Step Logic:**
    1. Initialize `left = 0` and `right = nums.length - 1`.
    2. Loop while `left < right`.
    3. Calculate `sum = nums[left] + nums[right]`.
    4. If `sum == target`, return indices `{left + 1, right + 1}`.
    5. If `sum < target`, increment `left`.
    6. If `sum > target`, decrement `right`.
*   **Java Code:**
    ```java
    public class Solution {
        public int[] twoSum(int[] numbers, int target) {
            int left = 0, right = numbers.length - 1;
            while (left < right) {
                int sum = numbers[left] + numbers[right];
                if (sum == target) {
                    return new int[]{left + 1, right + 1};
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
            return new int[]{-1, -1};
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 2: 3Sum
| Dimension | Details |
| --- | --- |
| **What** | Finding all unique triplets in an array that sum to zero. |
| **Why** | Extends Two Sum II by fixing one element and using opposite-direction pointers on the remaining sorted sub-array. |
| **Where** | Google, Apple, Microsoft. |
| **How** | Sort array, loop through and fix `nums[i]`, then run opposite-direction Two Sum II on range `[i + 1, n - 1]`. Skip duplicates to prevent duplicate triplets. |

*   **Mental Model:** Fix one leg of a tripod (the outer loop index) and rotate the other two legs (left and right pointers) until the tripod stands balanced at zero.
*   **Step-by-Step Logic:**
    1. Sort the input array.
    2. Loop through `0` to `n - 3`. If current element matches previous, skip (avoid duplicates).
    3. Initialize `left = i + 1` and `right = n - 1`.
    4. Check sum: `sum = nums[i] + nums[left] + nums[right]`.
    5. If `sum == 0`, add to results, then shift both pointers past duplicates.
    6. Else shift left/right depending on whether `sum` is negative or positive.
*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public List<List<Integer>> threeSum(int[] nums) {
            List<List<Integer>> res = new ArrayList<>();
            Arrays.sort(nums);
            for (int i = 0; i < nums.length - 2; i++) {
                if (i > 0 && nums[i] == nums[i - 1]) continue; // skip duplicate anchors
                int left = i + 1, right = nums.length - 1;
                while (left < right) {
                    int sum = nums[i] + nums[left] + nums[right];
                    if (sum == 0) {
                        res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                        while (left < right && nums[left] == nums[left + 1]) left++; // skip duplicate left
                        while (left < right && nums[right] == nums[right - 1]) right--; // skip duplicate right
                        left++; right--;
                    } else if (sum < 0) {
                        left++;
                    } else {
                        right--;
                    }
                }
            }
            return res;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N^2)$, Space: $\mathcal{O}(\log N)$ or $\mathcal{O}(N)$ depending on sorting algorithm auxiliary space.

#### Topic 3: Container With Most Water
| Dimension | Details |
| --- | --- |
| **What** | Finding two lines in an array that together with the x-axis forms a container containing the most water. |
| **Why** | Greedily moving pointers inward to maximize area, since width decreases with every step, so we must search for taller lines. |
| **Where** | Meta, Amazon, Netflix. |
| **How** | Place pointers at both ends. Compute area, update max area, then shift the pointer with the shorter height. |

*   **Mental Model:** A container's volume is bottlenecked by its shortest wall. To find a larger volume as the container gets narrower, you must discard the shorter wall.
*   **Step-by-Step Logic:**
    1. Initialize `left = 0`, `right = height.length - 1`, and `maxArea = 0`.
    2. Compute current area: `width = right - left`, `h = Math.min(height[left], height[right])`, `area = width * h`.
    3. Update `maxArea = Math.max(maxArea, area)`.
    4. Move pointer: if `height[left] < height[right]`, `left++`, else `right--`.
*   **Java Code:**
    ```java
    public class Solution {
        public int maxArea(int[] height) {
            int left = 0, right = height.length - 1;
            int maxArea = 0;
            while (left < right) {
                int h = Math.min(height[left], height[right]);
                maxArea = Math.max(maxArea, h * (right - left));
                if (height[left] < height[right]) {
                    left++;
                } else {
                    right--;
                }
            }
            return maxArea;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 4: Trapping Rain Water
| Dimension | Details |
| --- | --- |
| **What** | Calculating how much rainwater can be trapped within an elevation map. |
| **Why** | Water level at any point is bounded by the minimum of the maximum height on its left and the maximum height on its right. |
| **Where** | Google, Amazon, Microsoft (Very Popular Hard). |
| **How** | Use two pointers moving inward, tracking running `leftMax` and `rightMax`. Shift the smaller side. |

*   **Mental Model:** Rainwater accumulates in valleys. The water level at index `i` is determined by the lower of the two giant mountains on either side.
*   **Step-by-Step Logic:**
    1. Initialize `left = 0`, `right = height.length - 1`, `leftMax = 0`, `rightMax = 0`, and `water = 0`.
    2. Loop while `left < right`.
    3. If `height[left] < height[right]`:
       - If `height[left] >= leftMax`, update `leftMax = height[left]`.
       - Else add `leftMax - height[left]` to `water`.
       - Increment `left`.
    4. Else (when `height[right] <= height[left]`):
       - If `height[right] >= rightMax`, update `rightMax = height[right]`.
       - Else add `rightMax - height[right]` to `water`.
       - Decrement `right`.
*   **Java Code:**
    ```java
    public class Solution {
        public int trap(int[] height) {
            if (height == null || height.length == 0) return 0;
            int left = 0, right = height.length - 1;
            int leftMax = 0, rightMax = 0;
            int totalWater = 0;
            while (left < right) {
                if (height[left] < height[right]) {
                    if (height[left] >= leftMax) {
                        leftMax = height[left];
                    } else {
                        totalWater += leftMax - height[left];
                    }
                    left++;
                } else {
                    if (height[right] >= rightMax) {
                        rightMax = height[right];
                    } else {
                        totalWater += rightMax - height[right];
                    }
                    right--;
                }
            }
            return totalWater;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 5: Valid Palindrome
| Dimension | Details |
| --- | --- |
| **What** | Checking if a string reads the same forwards and backwards, ignoring non-alphanumeric characters and casing. |
| **Why** | Avoids string copying or allocation by validating and skipping invalid characters in place. |
| **Where** | Microsoft, Apple, Meta. |
| **How** | Use `left` and `right` pointers, skip invalid characters using `Character.isLetterOrDigit()`, compare lowered characters. |

*   **Mental Model:** Scanning a mirror image inward from both edges, ignoring background speckles (non-alphanumeric).
*   **Step-by-Step Logic:**
    1. Initialize `left = 0`, `right = s.length() - 1`.
    2. Skip non-alphanumeric characters from left and right.
    3. Compare `Character.toLowerCase(s.charAt(left))` and `Character.toLowerCase(s.charAt(right))`.
    4. If not equal, return `false`.
    5. Shift both pointers inward and repeat until they meet.
*   **Java Code:**
    ```java
    public class Solution {
        public boolean isPalindrome(String s) {
            int left = 0, right = s.length() - 1;
            while (left < right) {
                while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                    left++;
                }
                while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                    right--;
                }
                if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                    return false;
                }
                left++;
                right--;
            }
            return true;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 6: Two Sum - Unique Pairs
| Dimension | Details |
| --- | --- |
| **What** | Finding all unique pairs of numbers in an array that sum to a target. |
| **Why** | Sorting and skipping duplicates during pointer movements prevents duplicate pairs from being collected. |
| **Where** | Amazon, Microsoft. |
| **How** | Sort array, run Two Sum opposite pointers, but skip duplicates for both left and right whenever a matching pair is found. |

*   **Mental Model:** Running Two Sum II but stepping over elements we've already matched to ensure we don't output duplicate coordinate sets.
*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public List<List<Integer>> findUniquePairs(int[] nums, int target) {
            List<List<Integer>> res = new ArrayList<>();
            Arrays.sort(nums);
            int left = 0, right = nums.length - 1;
            while (left < right) {
                int sum = nums[left] + nums[right];
                if (sum == target) {
                    res.add(Arrays.asList(nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++; right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
            return res;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N \log N)$ (due to sorting), Space: $\mathcal{O}(1)$ or sorting recursive stack space.

#### Topic 7: 3Sum Closest
| Dimension | Details |
| --- | --- |
| **What** | Finding three integers in an array whose sum is closest to a target. |
| **Why** | Similar to 3Sum, we sort the array and use Two Pointers to adjust the sum systematically. |
| **Where** | Meta, Apple, Google. |
| **How** | Sort array, fix anchor `nums[i]`, run Two Pointers, record the absolute difference, and update the closest sum. |

*   **Java Code:**
    ```java
    import java.util.Arrays;
    public class Solution {
        public int threeSumClosest(int[] nums, int target) {
            Arrays.sort(nums);
            int closestSum = nums[0] + nums[1] + nums[2];
            for (int i = 0; i < nums.length - 2; i++) {
                int left = i + 1, right = nums.length - 1;
                while (left < right) {
                    int currentSum = nums[i] + nums[left] + nums[right];
                    if (Math.abs(target - currentSum) < Math.abs(target - closestSum)) {
                        closestSum = currentSum;
                    }
                    if (currentSum < target) {
                        left++;
                    } else if (currentSum > target) {
                        right--;
                    } else {
                        return currentSum; // Perfect match
                    }
                }
            }
            return closestSum;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N^2)$, Space: $\mathcal{O}(1)$.

#### Topic 8: 4Sum
| Dimension | Details |
| --- | --- |
| **What** | Finding all unique quadruplets in an array that sum up to a target. |
| **Why** | Reducible to 3Sum by fixing a second anchor, allowing the general n-Sum recursion to solve the problem. |
| **Where** | Microsoft, Netflix. |
| **How** | Double nested loop to fix `nums[i]` and `nums[j]`, then execute opposite pointers Two Sum on the range `[j + 1, n - 1]`. Skip duplicates at all levels. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public List<List<Integer>> fourSum(int[] nums, int target) {
            List<List<Integer>> res = new ArrayList<>();
            Arrays.sort(nums);
            int n = nums.length;
            for (int i = 0; i < n - 3; i++) {
                if (i > 0 && nums[i] == nums[i - 1]) continue;
                for (int j = i + 1; j < n - 2; j++) {
                    if (j > i + 1 && nums[j] == nums[j - 1]) continue;
                    int left = j + 1, right = n - 1;
                    while (left < right) {
                        long sum = (long) nums[i] + nums[j] + nums[left] + nums[right];
                        if (sum == target) {
                            res.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));
                            while (left < right && nums[left] == nums[left + 1]) left++;
                            while (left < right && nums[right] == nums[right - 1]) right--;
                            left++; right--;
                        } else if (sum < target) {
                            left++;
                        } else {
                            right--;
                        }
                    }
                }
            }
            return res;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N^3)$, Space: $\mathcal{O}(1)$.

---

### Topics 9–16: Sliding Window (Fixed vs. Dynamic)

#### Topic 9: Longest Substring Without Repeating Characters
| Dimension | Details |
| --- | --- |
| **What** | Finding the length of the longest substring containing only unique characters. |
| **Why** | A dynamic sliding window expands right to include elements, and contracts left when a duplicate is found. |
| **Where** | Google, Amazon, Microsoft. |
| **How** | Maintain character frequency counts or a set of active characters. Shrink window from the left until the duplicate character is evicted. |

*   **Mental Model:** A camera zoom window that widens as long as the landscape is uniform, but must crop/pan from the left when a duplicate landmark pollutes the frame.
*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public int lengthOfLongestSubstring(String s) {
            int left = 0, maxLength = 0;
            Set<Character> seen = new HashSet<>();
            for (int right = 0; right < s.length(); right++) {
                char rightChar = s.charAt(right);
                while (seen.contains(rightChar)) {
                    seen.remove(s.charAt(left));
                    left++;
                }
                seen.add(rightChar);
                maxLength = Math.max(maxLength, right - left + 1);
            }
            return maxLength;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(\min(N, M))$ where $M$ is the character alphabet size.

#### Topic 10: Minimum Window Substring
| Dimension | Details |
| --- | --- |
| **What** | Finding the shortest substring of $S$ that contains all characters of $T$. |
| **Why** | Uses a sliding window with a character frequency map. Once a valid window is found, we greedily shrink it from the left to find the absolute minimum. |
| **Where** | Meta, Apple, Google (Classic Hard). |
| **How** | Increment right until window contains all required characters. Then increment left as long as the window remains valid, updating the minimum length. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public String minWindow(String s, String t) {
            if (s.length() < t.length()) return "";
            Map<Character, Integer> targetMap = new HashMap<>();
            for (char c : t.toCharArray()) targetMap.put(c, targetMap.getOrDefault(c, 0) + 1);
            
            Map<Character, Integer> windowMap = new HashMap<>();
            int left = 0, minLen = Integer.MAX_VALUE, startIdx = -1;
            int formed = 0, required = targetMap.size();
            
            for (int right = 0; right < s.length(); right++) {
                char c = s.charAt(right);
                if (targetMap.containsKey(c)) {
                    windowMap.put(c, windowMap.getOrDefault(c, 0) + 1);
                    if (windowMap.get(c).equals(targetMap.get(c))) {
                        formed++;
                    }
                }
                while (formed == required) {
                    if (right - left + 1 < minLen) {
                        minLen = right - left + 1;
                        startIdx = left;
                    }
                    char leftChar = s.charAt(left);
                    if (targetMap.containsKey(leftChar)) {
                        if (windowMap.get(leftChar).equals(targetMap.get(leftChar))) {
                            formed--;
                        }
                        windowMap.put(leftChar, windowMap.get(leftChar) - 1);
                    }
                    left++;
                }
            }
            return startIdx == -1 ? "" : s.substring(startIdx, startIdx + minLen);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(|S| + |T|)$, Space: $\mathcal{O}(|S| + |T|)$.

#### Topic 11: Longest Repeating Character Replacement
| Dimension | Details |
| --- | --- |
| **What** | Finding the longest substring of same characters after replacing at most $k$ characters. |
| **Why** | Window size minus max character frequency in the window represents how many characters must be changed. If this exceeds $k$, contract the window. |
| **Where** | Amazon, Microsoft. |
| **How** | Track running char frequency. Maintain `maxFreq` (max frequency of any single char in the current window). |

*   **Java Code:**
    ```java
    public class Solution {
        public int characterReplacement(String s, int k) {
            int[] count = new int[26];
            int left = 0, maxCount = 0, maxLength = 0;
            for (int right = 0; right < s.length(); right++) {
                maxCount = Math.max(maxCount, ++count[s.charAt(right) - 'A']);
                while (right - left + 1 - maxCount > k) {
                    count[s.charAt(left) - 'A']--;
                    left++;
                }
                maxLength = Math.max(maxLength, right - left + 1);
            }
            return maxLength;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$ auxiliary array of size 26.

#### Topic 12: Permutation in String
| Dimension | Details |
| --- | --- |
| **What** | Checking if a string $s_2$ contains a permutation of $s_1$. |
| **Why** | A fixed sliding window of size `s1.length()`. We keep a running character match frequency counter. |
| **Where** | Meta, Apple. |
| **How** | Maintain arrays for $s_1$ frequencies and the sliding window in $s_2$. Slide window and check equality. |

*   **Java Code:**
    ```java
    import java.util.Arrays;
    public class Solution {
        public boolean checkInclusion(String s1, String s2) {
            if (s1.length() > s2.length()) return false;
            int[] s1Counts = new int[26];
            int[] s2Counts = new int[26];
            for (int i = 0; i < s1.length(); i++) {
                s1Counts[s1.charAt(i) - 'a']++;
                s2Counts[s2.charAt(i) - 'a']++;
            }
            if (Arrays.equals(s1Counts, s2Counts)) return true;
            for (int right = s1.length(); right < s2.length(); right++) {
                s2Counts[s2.charAt(right) - 'a']++;
                s2Counts[s2.charAt(right - s1.length()) - 'a']--;
                if (Arrays.equals(s1Counts, s2Counts)) return true;
            }
            return false;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(|s_1| + |s_2|)$, Space: $\mathcal{O}(1)$ space for fixed size frequency counts (size 26).

#### Topic 13: Maximum Sum Subarray of Size K (Fixed Window)
| Dimension | Details |
| --- | --- |
| **What** | Finding the maximum sum among all subarrays of fixed size $K$. |
| **Why** | Avoids nested loops by subtracting the element exiting the left boundary and adding the element entering the right boundary. |
| **Where** | Amazon. |
| **How** | Compute sum of first $K$ elements. Slide window from $K$ to $N$, updating running sum in $\mathcal{O}(1)$ step. |

*   **Java Code:**
    ```java
    public class Solution {
        public int maxSubarraySumOfSizeK(int[] nums, int k) {
            int windowSum = 0;
            for (int i = 0; i < k; i++) windowSum += nums[i];
            int maxSum = windowSum;
            for (int right = k; right < nums.length; right++) {
                windowSum += nums[right] - nums[right - k];
                maxSum = Math.max(maxSum, windowSum);
            }
            return maxSum;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 14: Subarray Product Less Than K
| Dimension | Details |
| --- | --- |
| **What** | Counting contiguous subarrays where the product of elements is strictly less than $K$. |
| **Why** | Number of valid subarrays ending at `right` is `right - left + 1`. We use dynamic sliding window. |
| **Where** | Meta, Apple. |
| **How** | Expand `right`, multiply product. If product $\ge K$, divide out `nums[left]` and increment `left`. Add `right - left + 1` to count. |

*   **Java Code:**
    ```java
    public class Solution {
        public int numSubarrayProductLessThanK(int[] nums, int k) {
            if (k <= 1) return 0;
            int product = 1, count = 0, left = 0;
            for (int right = 0; right < nums.length; right++) {
                product *= nums[right];
                while (product >= k) {
                    product /= nums[left];
                    left++;
                }
                count += right - left + 1;
            }
            return count;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 15: Fruit Into Baskets
| Dimension | Details |
| --- | --- |
| **What** | Finding the maximum length of a contiguous subarray containing at most 2 unique numbers. |
| **Why** | Equivalent to "longest substring with at most 2 unique characters" using a map/frequency table. |
| **Where** | Google, Amazon. |
| **How** | Expand right, add to map. If map size > 2, decrement frequency of `nums[left]`, remove if 0, increment `left`. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public int totalFruit(int[] fruits) {
            Map<Integer, Integer> counts = new HashMap<>();
            int left = 0, maxFruits = 0;
            for (int right = 0; right < fruits.length; right++) {
                counts.put(fruits[right], counts.getOrDefault(fruits[right], 0) + 1);
                while (counts.size() > 2) {
                    counts.put(fruits[left], counts.get(fruits[left]) - 1);
                    if (counts.get(fruits[left]) == 0) counts.remove(fruits[left]);
                    left++;
                }
                maxFruits = Math.max(maxFruits, right - left + 1);
            }
            return maxFruits;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$ since map size is bounded by 3.

#### Topic 16: Minimum Size Subarray Sum
| Dimension | Details |
| --- | --- |
| **What** | Finding the minimal length of a contiguous subarray whose sum is $\ge$ a target. |
| **Why** | A dynamic sliding window shrinks as long as the running sum remains $\ge$ target. |
| **Where** | Microsoft, Netflix. |
| **How** | Add element at `right`. While sum $\ge$ target, record minimal length, subtract `nums[left]`, and increment `left`. |

*   **Java Code:**
    ```java
    public class Solution {
        public int minSubArrayLen(int target, int[] nums) {
            int left = 0, sum = 0, minLength = Integer.MAX_VALUE;
            for (int right = 0; right < nums.length; right++) {
                sum += nums[right];
                while (sum >= target) {
                    minLength = Math.min(minLength, right - left + 1);
                    sum -= nums[left];
                    left++;
                }
            }
            return minLength == Integer.MAX_VALUE ? 0 : minLength;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

---

### Topics 17–22: Fast & Slow Pointers (Cycle Detection & Middle-Finding)

#### Topic 17: Linked List Cycle
| Dimension | Details |
| --- | --- |
| **What** | Checking if a linked list contains a cycle. |
| **Why** | Floyd's Cycle-Finding Algorithm (Tortoise and Hare). Avoids auxiliary HashSets by using $\mathcal{O}(1)$ space. |
| **Where** | Meta, Apple, Google. |
| **How** | Initialize slow and fast pointers. If they overlap, a cycle exists. If fast reaches `null`, no cycle. |

*   **Mental Model:** Two runners on a track. The faster runner (hare) will eventually lap and intersect with the slower runner (tortoise) if the track is circular.
*   **Java Code:**
    ```java
    class ListNode {
        int val;
        ListNode next;
        ListNode(int x) { val = x; next = null; }
    }
    public class Solution {
        public boolean hasCycle(ListNode head) {
            if (head == null || head.next == null) return false;
            ListNode slow = head, fast = head;
            while (fast != null && fast.next != null) {
                slow = slow.next;
                fast = fast.next.next;
                if (slow == fast) return true;
            }
            return false;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 18: Linked List Cycle II
| Dimension | Details |
| --- | --- |
| **What** | Finding the exact starting node where the linked list cycle begins. |
| **Why** | Mathematical property of cycle paths: distance from head to cycle entrance equals distance from intersection point to cycle entrance. |
| **Where** | Microsoft, Netflix. |
| **How** | Run cycle detection. Once they meet, place another pointer at head. Move both slow and the new pointer one step at a time until they meet. |

*   **Java Code:**
    ```java
    public class Solution {
        public ListNode detectCycle(ListNode head) {
            ListNode slow = head, fast = head;
            while (fast != null && fast.next != null) {
                slow = slow.next;
                fast = fast.next.next;
                if (slow == fast) {
                    ListNode pointer = head;
                    while (pointer != slow) {
                        pointer = pointer.next;
                        slow = slow.next;
                    }
                    return pointer;
                }
            }
            return null;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 19: Happy Number
| Dimension | Details |
| --- | --- |
| **What** | Checking if a number's digit-square sum sequence converges to 1. |
| **Why** | A sequence that does not land on 1 will eventually enter a cycle (which can be caught using slow and fast pointers). |
| **Where** | Amazon. |
| **How** | Treat digit-squared sum as the transition function `next(x)`. Run Floyd's on the sequence. |

*   **Java Code:**
    ```java
    public class Solution {
        private int getNext(int n) {
            int totalSum = 0;
            while (n > 0) {
                int d = n % 10;
                n = n / 10;
                totalSum += d * d;
            }
            return totalSum;
        }
        public boolean isHappy(int n) {
            int slow = n;
            int fast = getNext(n);
            while (fast != 1 && slow != fast) {
                slow = getNext(slow);
                fast = getNext(getNext(fast));
            }
            return fast == 1;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(\log N)$, Space: $\mathcal{O}(1)$.

#### Topic 20: Middle of the Linked List
| Dimension | Details |
| --- | --- |
| **What** | Finding the middle node of a linked list in a single pass. |
| **Why** | For every two steps the fast pointer takes, the slow pointer takes one. When the fast pointer hits the end, the slow pointer is at the middle. |
| **Where** | Meta, Amazon, Microsoft. |
| **How** | Initialize slow and fast at head, run loop while `fast != null && fast.next != null`. |

*   **Java Code:**
    ```java
    public class Solution {
        public ListNode middleNode(ListNode head) {
            ListNode slow = head, fast = head;
            while (fast != null && fast.next != null) {
                slow = slow.next;
                fast = fast.next.next;
            }
            return slow;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 21: Palindrome Linked List
| Dimension | Details |
| --- | --- |
| **What** | Checking if a linked list reads the same forwards and backwards. |
| **Why** | Avoids extra storage space by finding the middle, reversing the second half in place, and running pointer comparisons. |
| **Where** | Google, Amazon. |
| **How** | Find middle with fast/slow pointers. Reverse second half. Compare first half and reversed second half. Restore tree/list if needed. |

*   **Java Code:**
    ```java
    public class Solution {
        public boolean isPalindrome(ListNode head) {
            if (head == null || head.next == null) return true;
            ListNode slow = head, fast = head;
            while (fast != null && fast.next != null) {
                slow = slow.next;
                fast = fast.next.next;
            }
            ListNode secondHalfHeader = reverseList(slow);
            ListNode firstHalfPointer = head;
            ListNode secondHalfPointer = secondHalfHeader;
            boolean isPal = true;
            while (secondHalfPointer != null) {
                if (firstHalfPointer.val != secondHalfPointer.val) {
                    isPal = false;
                    break;
                }
                firstHalfPointer = firstHalfPointer.next;
                secondHalfPointer = secondHalfPointer.next;
            }
            return isPal;
        }
        private ListNode reverseList(ListNode node) {
            ListNode prev = null, curr = node;
            while (curr != null) {
                ListNode nextTemp = curr.next;
                curr.next = prev;
                prev = curr;
                curr = nextTemp;
            }
            return prev;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 22: Reorder List
| Dimension | Details |
| --- | --- |
| **What** | Reordering a linked list as $L_0 ightarrow L_N ightarrow L_1 ightarrow L_{N-1} \dots$ in place. |
| **Why** | Uses a combination of middle-finding, list reversal, and list interleaving to solve the problem without extra space. |
| **Where** | Meta, Microsoft. |
| **How** | 1. Find middle node. 2. Disconnect and reverse the second half. 3. Merge the two halves. |

*   **Java Code:**
    ```java
    public class Solution {
        public void reorderList(ListNode head) {
            if (head == null || head.next == null) return;
            ListNode slow = head, fast = head;
            while (fast != null && fast.next != null) {
                slow = slow.next;
                fast = fast.next.next;
            }
            ListNode l2 = reverse(slow.next);
            slow.next = null; // Disconnect first and second half
            ListNode l1 = head;
            while (l1 != null && l2 != null) {
                ListNode next1 = l1.next;
                ListNode next2 = l2.next;
                l1.next = l2;
                l2.next = next1;
                l1 = next1;
                l2 = next2;
            }
        }
        private ListNode reverse(ListNode head) {
            ListNode prev = null, curr = head;
            while (curr != null) {
                ListNode nextTemp = curr.next;
                curr.next = prev;
                prev = curr;
                curr = nextTemp;
            }
            return prev;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

---

### Topics 23–27: Merge Intervals (Conflict Management)

#### Topic 23: Merge Intervals
| Dimension | Details |
| --- | --- |
| **What** | Merging all overlapping contiguous interval blocks. |
| **Why** | Sorting by start times guarantees that overlapping intervals are adjacent, enabling a single pass linear merge. |
| **Where** | Meta, Apple, Google, Microsoft. |
| **How** | Sort intervals by `start`. Iterate and check if `current.start <= prev.end`. If so, update `prev.end = max(prev.end, current.end)`. |

*   **Mental Model:** Merging conflicting calendar slots. If a new meeting starts before the previous one ends, you extend the previous meeting's end time to cover both.
*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public int[][] merge(int[][] intervals) {
            if (intervals.length <= 1) return intervals;
            Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
            List<int[]> merged = new ArrayList<>();
            int[] currentInterval = intervals[0];
            merged.add(currentInterval);
            for (int[] interval : intervals) {
                if (interval[0] <= currentInterval[1]) {
                    currentInterval[1] = Math.max(currentInterval[1], interval[1]);
                } else {
                    currentInterval = interval;
                    merged.add(currentInterval);
                }
            }
            return merged.toArray(new int[merged.size()][]);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N \log N)$ (due to sorting), Space: $\mathcal{O}(N)$ or $\mathcal{O}(\log N)$ depending on sorting algorithm auxiliary space.

#### Topic 24: Insert Interval
| Dimension | Details |
| --- | --- |
| **What** | Inserting a new interval block into a sorted, non-overlapping interval list, merging if needed. |
| **Why** | Since list is already sorted, we can complete this in a single pass in linear time without re-sorting the whole list. |
| **Where** | Amazon, Microsoft, Apple. |
| **How** | 1. Add all intervals ending before `newInterval` starts. 2. Merge all overlapping intervals. 3. Add remaining. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public int[][] insert(int[][] intervals, int[] newInterval) {
            List<int[]> res = new ArrayList<>();
            int i = 0, n = intervals.length;
            while (i < n && intervals[i][1] < newInterval[0]) {
                res.add(intervals[i]);
                i++;
            }
            while (i < n && intervals[i][0] <= newInterval[1]) {
                newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
                newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
                i++;
            }
            res.add(newInterval);
            while (i < n) {
                res.add(intervals[i]);
                i++;
            }
            return res.toArray(new int[res.size()][]);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(N)$ to store the result list.

#### Topic 25: Non-overlapping Intervals
| Dimension | Details |
| --- | --- |
| **What** | Finding the minimum number of intervals to remove to make the rest non-overlapping. |
| **Why** | A greedy approach sorting by end times maximizes the number of non-overlapping intervals (the Interval Scheduling Problem). |
| **Where** | Meta, Apple. |
| **How** | Sort intervals by `end`. Keep track of the end time of the last non-overlapping interval. If current overlaps, increment removal count. |

*   **Java Code:**
    ```java
    import java.util.Arrays;
    public class Solution {
        public int eraseOverlapIntervals(int[][] intervals) {
            if (intervals.length == 0) return 0;
            Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
            int count = 0;
            int end = intervals[0][1];
            for (int i = 1; i < intervals.length; i++) {
                if (intervals[i][0] < end) {
                    count++;
                } else {
                    end = intervals[i][1];
                }
            }
            return count;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N \log N)$, Space: $\mathcal{O}(1)$.

#### Topic 26: Meeting Rooms (Interval Overlap)
| Dimension | Details |
| --- | --- |
| **What** | Checking if a person can attend all meetings (i.e. no intervals overlap). |
| **Why** | If we sort by start times, any overlap must happen between adjacent meetings. |
| **Where** | Microsoft, Netflix. |
| **How** | Sort meetings by `start`. Loop through 1 to $N-1$ and check if `meetings[i][0] < meetings[i-1][1]`. |

*   **Java Code:**
    ```java
    import java.util.Arrays;
    public class Solution {
        public boolean canAttendMeetings(int[][] intervals) {
            Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
            for (int i = 1; i < intervals.length; i++) {
                if (intervals[i][0] < intervals[i - 1][1]) {
                    return false;
                }
            }
            return true;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N \log N)$, Space: $\mathcal{O}(1)$.

#### Topic 27: Meeting Rooms II (Minimum Meeting Rooms)
| Dimension | Details |
| --- | --- |
| **What** | Finding the minimum number of meeting rooms required to schedule all meetings. |
| **Why** | Finding the max number of concurrent overlapping intervals at any point in time. |
| **Where** | Microsoft, Amazon, Google. |
| **How** | Use a Min-Heap/PriorityQueue tracking meeting end times. If current meeting starts after the earliest end time, reuse room (pop). |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public int minMeetingRooms(int[][] intervals) {
            if (intervals == null || intervals.length == 0) return 0;
            Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
            PriorityQueue<Integer> allocator = new PriorityQueue<>();
            allocator.add(intervals[0][1]);
            for (int i = 1; i < intervals.length; i++) {
                if (intervals[i][0] >= allocator.peek()) {
                    allocator.poll(); // Free room
                }
                allocator.add(intervals[i][1]); // Allocate room
            }
            return allocator.size();
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N \log N)$ (due to sorting), Space: $\mathcal{O}(N)$ for Heap.

---

### Topics 28–35: Modified Binary Search (Monotonic Decisions)

![Binary Search Pattern](binary_search_visual.jpg)

#### Topic 28: Search in Rotated Sorted Array
| Dimension | Details |
| --- | --- |
| **What** | Searching for a target value in a sorted array that has been rotated. |
| **Why** | At least one half of a rotated sorted array is always perfectly sorted, enabling standard binary search inside that half. |
| **Where** | Google, Amazon, Microsoft, Meta. |
| **How** | Find `mid`. Determine if left or right half is sorted. Check if target lies within the boundaries of the sorted half. |

*   **Mental Model:** Imagine a slide that has been split and shifted. If you cut it in the middle, one of the two pieces is guaranteed to be a continuous, unbroken ramp.
*   **Java Code:**
    ```java
    public class Solution {
        public int search(int[] nums, int target) {
            int left = 0, right = nums.length - 1;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (nums[mid] == target) return mid;
                if (nums[left] <= nums[mid]) { // Left half is sorted
                    if (nums[left] <= target && target < nums[mid]) {
                        right = mid - 1;
                    } else {
                        left = mid + 1;
                    }
                } else { // Right half is sorted
                    if (nums[mid] < target && target <= nums[right]) {
                        left = mid + 1;
                    } else {
                        right = mid - 1;
                    }
                }
            }
            return -1;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(\log N)$, Space: $\mathcal{O}(1)$.

#### Topic 29: Find Minimum in Rotated Sorted Array
| Dimension | Details |
| --- | --- |
| **What** | Finding the absolute minimum element in a rotated sorted array. |
| **Why** | Monotonic check: if `nums[mid] <= nums[right]`, minimum must be at or to the left of `mid`. Otherwise, it must be to the right of `mid`. |
| **Where** | Microsoft, Netflix. |
| **How** | Use binary search. Check inequality against `nums[right]` at each step, adjusting left and right boundaries inward. |

*   **Java Code:**
    ```java
    public class Solution {
        public int findMin(int[] nums) {
            int left = 0, right = nums.length - 1;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (nums[mid] <= nums[right]) {
                    right = mid; // Minimum could be mid
                } else {
                    left = mid + 1; // Minimum must be in right half
                }
            }
            return nums[left];
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(\log N)$, Space: $\mathcal{O}(1)$.

#### Topic 30: Find Peak Element
| Dimension | Details |
| --- | --- |
| **What** | Finding a local peak element (strictly greater than its neighbors) in an unsorted array. |
| **Why** | Binary search works because if `nums[mid] < nums[mid + 1]`, there must be a peak in the increasing right direction. |
| **Where** | Google, Apple, Microsoft. |
| **How** | Find `mid`. If `nums[mid] < nums[mid + 1]`, search right half (`left = mid + 1`). Otherwise, search left half (`right = mid`). |

*   **Java Code:**
    ```java
    public class Solution {
        public int findPeakElement(int[] nums) {
            int left = 0, right = nums.length - 1;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (nums[mid] < nums[mid + 1]) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            return left;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(\log N)$, Space: $\mathcal{O}(1)$.

#### Topic 31: Search in Rotated Sorted Array II (with duplicates)
| Dimension | Details |
| --- | --- |
| **What** | Rotated sorted array search where duplicates are allowed. |
| **Why** | Duplicates like `nums[left] == nums[mid] == nums[right]` prevent us from determining which half is sorted, forcing us to shrink boundaries by one. |
| **Where** | Amazon. |
| **How** | If duplicates confuse the sorted condition, increment `left` and decrement `right`. Otherwise, run standard rotated search. |

*   **Java Code:**
    ```java
    public class Solution {
        public boolean search(int[] nums, int target) {
            int left = 0, right = nums.length - 1;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (nums[mid] == target) return true;
                if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
                    left++; right--; // Shrink boundary when duplicates confuse direction
                } else if (nums[left] <= nums[mid]) {
                    if (nums[left] <= target && target < nums[mid]) {
                        right = mid - 1;
                    } else {
                        left = mid + 1;
                    }
                } else {
                    if (nums[mid] < target && target <= nums[right]) {
                        left = mid + 1;
                    } else {
                        right = mid - 1;
                    }
                }
            }
            return false;
        }
    }
    ```
*   **Complexity:** Time: Worst-case $\mathcal{O}(N)$ (when all elements are duplicates), Average-case $\mathcal{O}(\log N)$. Space: $\mathcal{O}(1)$.

#### Topic 32: First and Last Position of Element in Sorted Array
| Dimension | Details |
| --- | --- |
| **What** | Finding the starting and ending index of a target value in a sorted array containing duplicates. |
| **Why** | Modified binary search that records candidates and continues searching to the left/right respectively to find the exact boundaries. |
| **Where** | Meta, Google. |
| **How** | Run binary search twice: once with `right = mid - 1` to find leftmost candidate; once with `left = mid + 1` to find rightmost. |

*   **Java Code:**
    ```java
    public class Solution {
        public int[] searchRange(int[] nums, int target) {
            int[] result = new int[]{-1, -1};
            result[0] = findBound(nums, target, true);
            result[1] = findBound(nums, target, false);
            return result;
        }
        private int findBound(int[] nums, int target, boolean isFirst) {
            int left = 0, right = nums.length - 1;
            int boundIdx = -1;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (nums[mid] == target) {
                    boundIdx = mid;
                    if (isFirst) {
                        right = mid - 1; // Greedily search left for earlier occurrence
                    } else {
                        left = mid + 1; // Greedily search right for later occurrence
                    }
                } else if (nums[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            return boundIdx;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(\log N)$, Space: $\mathcal{O}(1)$.

#### Topic 33: Search Insert Position
| Dimension | Details |
| --- | --- |
| **What** | Finding the target's index if found, or the index where it would be inserted in sorted order. |
| **Why** | Standard binary search. When the search space is exhausted, `left` lands exactly on the correct insert index. |
| **Where** | Microsoft. |
| **How** | Run binary search loop. If target not found, return `left` pointer index. |

*   **Java Code:**
    ```java
    public class Solution {
        public int searchInsert(int[] nums, int target) {
            int left = 0, right = nums.length - 1;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (nums[mid] == target) return mid;
                else if (nums[mid] < target) left = mid + 1;
                else right = mid - 1;
            }
            return left;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(\log N)$, Space: $\mathcal{O}(1)$.

#### Topic 34: Single Element in a Sorted Array
| Dimension | Details |
| --- | --- |
| **What** | Finding the single element that appears only once in a sorted array of duplicates. |
| **Why** | Index parity rule: before single element, pairs start on even indices and end on odd indices. After, they start on odd and end on even. |
| **Where** | Google, Amazon. |
| **How** | Find `mid`. Ensure `mid` is even (if odd, decrement by 1). If `nums[mid] == nums[mid + 1]`, search right half, else left. |

*   **Java Code:**
    ```java
    public class Solution {
        public int singleNonDuplicate(int[] nums) {
            int left = 0, right = nums.length - 1;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (mid % 2 == 1) mid--; // Make sure mid index is even
                if (nums[mid] == nums[mid + 1]) {
                    left = mid + 2; // Pair is complete, single element is on the right
                } else {
                    right = mid; // Pair is broken, single element is on the left
                }
            }
            return nums[left];
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(\log N)$, Space: $\mathcal{O}(1)$.

#### Topic 35: Koko Eating Bananas
| Dimension | Details |
| --- | --- |
| **What** | Finding the minimum eating speed $K$ to eat all bananas within $H$ hours. |
| **Why** | Monotonic search space optimization. Once a speed $K$ is fast enough to finish on time, any speed $> K$ is also fast enough. |
| **Where** | Google, Netflix. |
| **How** | Binary search over speed range `[1, max(piles)]`. For each speed, calculate hours needed and adjust boundaries. |

*   **Java Code:**
    ```java
    public class Solution {
        public int minEatingSpeed(int[] piles, int h) {
            int left = 1, right = 0;
            for (int pile : piles) right = Math.max(right, pile);
            int k = right;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                long hoursNeeded = 0;
                for (int pile : piles) {
                    hoursNeeded += (pile + mid - 1) / mid; // fast integer division for ceiling
                }
                if (hoursNeeded <= h) {
                    k = mid; // Candidate found, try to minimize speed
                    right = mid - 1;
                } else {
                    left = mid + 1; // Speed too slow, must increase
                }
            }
            return k;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N \log M)$ where $M$ is the maximum pile size, Space: $\mathcal{O}(1)$.

---

## Module 2: Non-Linear & Dynamic Programming Subproblems (Topics 36–65)

This module dives deep into tree traversals, graphs, union-find algorithms, and optimization state-transitions.

![Tree Traversals Diagram](tree_dfs_bfs_visual.jpg)

### Topics 36–48: Trees & Traversals

#### Topic 36: Binary Tree Preorder Traversal (Iterative & Recursive)
| Dimension | Details |
| --- | --- |
| **What** | Visiting a binary tree in Root $ightarrow$ Left $ightarrow$ Right order. |
| **Why** | Root is processed before children, which is useful for serializing, cloning, or duplicating structured relationships. |
| **Where** | Amazon. |
| **How** | Recursive calls or using an explicit Stack (pushing right child before left child to preserve FIFO order). |

*   **Mental Model:** A top-down outline. You note down the chapter title (Root) before digging down into its sections and subsections.
*   **Java Code:**
    ```java
    import java.util.*;
    class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode(int x) { val = x; }
    }
    public class Solution {
        public List<Integer> preorderTraversal(TreeNode root) {
            List<Integer> res = new ArrayList<>();
            if (root == null) return res;
            Stack<TreeNode> stack = new Stack<>();
            stack.push(root);
            while (!stack.isEmpty()) {
                TreeNode curr = stack.pop();
                res.add(curr.val);
                if (curr.right != null) stack.push(curr.right); // push right first so left pop first
                if (curr.left != null) stack.push(curr.left);
            }
            return res;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(N)$ stack space.

#### Topic 37: Binary Tree Inorder Traversal
| Dimension | Details |
| --- | --- |
| **What** | Visiting a tree in Left $ightarrow$ Root $ightarrow$ Right order. |
| **Why** | For a Binary Search Tree (BST), inorder traversal retrieves and visits all elements in strictly sorted ascending order. |
| **Where** | Google. |
| **How** | Move down left branch, push nodes to stack. When hitting `null`, pop, record value, and go right. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public List<Integer> inorderTraversal(TreeNode root) {
            List<Integer> res = new ArrayList<>();
            Stack<TreeNode> stack = new Stack<>();
            TreeNode curr = root;
            while (curr != null || !stack.isEmpty()) {
                while (curr != null) {
                    stack.push(curr);
                    curr = curr.left;
                }
                curr = stack.pop();
                res.add(curr.val);
                curr = curr.right;
            }
            return res;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(N)$.

#### Topic 38: Binary Tree Postorder Traversal
| Dimension | Details |
| --- | --- |
| **What** | Visiting a tree in Left $ightarrow$ Right $ightarrow$ Root order. |
| **Why** | Children are processed before root. Crucial for bottom-up operations (e.g. deleting tree, evaluating math expressions). |
| **Where** | Microsoft. |
| **How** | Run recursion or double stacks. Alternatively, modify preorder (Root-Right-Left) and reverse the output. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public List<Integer> postorderTraversal(TreeNode root) {
            LinkedList<Integer> res = new LinkedList<>();
            if (root == null) return res;
            Stack<TreeNode> stack = new Stack<>();
            stack.push(root);
            while (!stack.isEmpty()) {
                TreeNode curr = stack.pop();
                res.addFirst(curr.val); // Prepends to effectively reverse
                if (curr.left != null) stack.push(curr.left);
                if (curr.right != null) stack.push(curr.right);
            }
            return res;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(N)$.

#### Topic 39: Binary Tree Level Order Traversal (BFS)
| Dimension | Details |
| --- | --- |
| **What** | Visiting binary tree nodes level by level (horizontal bands). |
| **Why** | Naturally calculates layer structures, distance, and shortest paths in trees/graphs. |
| **Where** | Meta, Apple, Google. |
| **How** | Use a Queue. In each iteration, capture size of the queue to process exactly one level. |

*   **Mental Model:** Expanding ripples in a pond. The wave expands uniformly to touch all adjacent nodes on level 1, then level 2, etc.
*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public List<List<Integer>> levelOrder(TreeNode root) {
            List<List<Integer>> res = new ArrayList<>();
            if (root == null) return res;
            Queue<TreeNode> queue = new LinkedList<>();
            queue.add(root);
            while (!queue.isEmpty()) {
                int levelSize = queue.size();
                List<Integer> currentLevel = new ArrayList<>();
                for (int i = 0; i < levelSize; i++) {
                    TreeNode node = queue.poll();
                    currentLevel.add(node.val);
                    if (node.left != null) queue.add(node.left);
                    if (node.right != null) queue.add(node.right);
                }
                res.add(currentLevel);
            }
            return res;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(N)$ queue space (at most $N/2$ leaf nodes at the bottom level).

#### Topic 40: Invert Binary Tree
| Dimension | Details |
| --- | --- |
| **What** | Flipping a binary tree so that left and right children are swapped recursively. |
| **Why** | Classic tree recursion. Shows standard structural transformations on non-linear topologies. |
| **Where** | Google (Famous Homebrew creator reference). |
| **How** | Swap left and right children of current node, then recursively call invert on both children. |

*   **Java Code:**
    ```java
    public class Solution {
        public TreeNode invertTree(TreeNode root) {
            if (root == null) return null;
            TreeNode temp = root.left;
            root.left = root.right;
            root.right = temp;
            invertTree(root.left);
            invertTree(root.right);
            return root;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(H)$ call stack space (where $H$ is the tree height).

#### Topic 41: Maximum Depth of Binary Tree
| Dimension | Details |
| --- | --- |
| **What** | Finding the length of the longest path from root down to furthest leaf. |
| **Why** | Bottom-up depth calculation: depth of a node is $1 + \max(	ext{leftDepth}, 	ext{rightDepth})$. |
| **Where** | Microsoft. |
| **How** | Post-order recursion or BFS queue recording levels. |

*   **Java Code:**
    ```java
    public class Solution {
        public int maxDepth(TreeNode root) {
            if (root == null) return 0;
            return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(H)$.

#### Topic 42: Diameter of Binary Tree
| Dimension | Details |
| --- | --- |
| **What** | Finding the length of the longest path between any two nodes in a tree. |
| **Why** | The longest path through node `root` is `maxDepth(root.left) + maxDepth(root.right)`. |
| **Where** | Amazon, Microsoft. |
| **How** | Bottom-up DFS. At each node, calculate left and right depth, update running global diameter, return node depth. |

*   **Java Code:**
    ```java
    public class Solution {
        private int maxDiameter = 0;
        public int diameterOfBinaryTree(TreeNode root) {
            calculateDepth(root);
            return maxDiameter;
        }
        private int calculateDepth(TreeNode node) {
            if (node == null) return 0;
            int leftDepth = calculateDepth(node.left);
            int rightDepth = calculateDepth(node.right);
            maxDiameter = Math.max(maxDiameter, leftDepth + rightDepth);
            return 1 + Math.max(leftDepth, rightDepth);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(H)$.

#### Topic 43: Balanced Binary Tree
| Dimension | Details |
| --- | --- |
| **What** | Checking if depth of two subtrees of every node never differs by more than 1. |
| **Why** | An unbalanced tree degrades operations to linear time. Checking balanced topology ensures stable lookup performances. |
| **Where** | Meta, Apple. |
| **How** | DFS returning -1 if a subtree is unbalanced, or the actual height if balanced. |

*   **Java Code:**
    ```java
    public class Solution {
        public boolean isBalanced(TreeNode root) {
            return checkHeight(root) != -1;
        }
        private int checkHeight(TreeNode node) {
            if (node == null) return 0;
            int leftH = checkHeight(node.left);
            if (leftH == -1) return -1;
            int rightH = checkHeight(node.right);
            if (rightH == -1) return -1;
            if (Math.abs(leftH - rightH) > 1) return -1;
            return 1 + Math.max(leftH, rightH);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(H)$.

#### Topic 44: Lowest Common Ancestor of a Binary Tree
| Dimension | Details |
| --- | --- |
| **What** | Finding the lowest shared ancestor node of two target nodes $p$ and $q$. |
| **Why** | Post-order traversal bubbles up search results. If node receives valid references from both subtrees, it is the LCA. |
| **Where** | Meta, Google (Highly Asked). |
| **How** | Search left and right recursively. Return node if node is $p$ or $q$. If left and right return values are non-null, return node. |

*   **Java Code:**
    ```java
    public class Solution {
        public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
            if (root == null || root == p || root == q) return root;
            TreeNode left = lowestCommonAncestor(root.left, p, q);
            TreeNode right = lowestCommonAncestor(root.right, p, q);
            if (left != null && right != null) return root;
            return left != null ? left : right;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(H)$.

#### Topic 45: Path Sum
| Dimension | Details |
| --- | --- |
| **What** | Checking if a tree has a root-to-leaf path whose sum matches a target. |
| **Why** | Subtracting node's value from target sum on recursive calls delegates the remaining sum constraint to child branches. |
| **Where** | Amazon. |
| **How** | Base cases: if root is leaf, check if target sum matches leaf value. Otherwise, recursively search subtrees. |

*   **Java Code:**
    ```java
    public class Solution {
        public boolean hasPathSum(TreeNode root, int targetSum) {
            if (root == null) return false;
            if (root.left == null && root.right == null) {
                return targetSum == root.val;
            }
            return hasPathSum(root.left, targetSum - root.val) || 
                   hasPathSum(root.right, targetSum - root.val);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(H)$.

#### Topic 46: Path Sum III
| Dimension | Details |
| --- | --- |
| **What** | Counting paths that sum to a target (paths do not need to start at root or end at leaf). |
| **Why** | Equivalent to "Two Sum / Subarray Sum Equals K" running on tree branches. Uses prefix sum map in DFS to solve in $\mathcal{O}(N)$. |
| **Where** | Google, Amazon. |
| **How** | Run DFS, maintain running sum. Query prefix sums map to find path matches. Backtrack map on return. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public int pathSum(TreeNode root, int targetSum) {
            Map<Long, Integer> prefixSums = new HashMap<>();
            prefixSums.put(0L, 1);
            return dfs(root, 0L, targetSum, prefixSums);
        }
        private int dfs(TreeNode node, long currSum, int target, Map<Long, Integer> prefixSums) {
            if (node == null) return 0;
            currSum += node.val;
            int paths = prefixSums.getOrDefault(currSum - target, 0);
            prefixSums.put(currSum, prefixSums.getOrDefault(currSum, 0) + 1);
            paths += dfs(node.left, currSum, target, prefixSums);
            paths += dfs(node.right, currSum, target, prefixSums);
            prefixSums.put(currSum, prefixSums.get(currSum) - 1); // backtrack
            return paths;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(H)$ map state stack.

#### Topic 47: Validate Binary Search Tree
| Dimension | Details |
| --- | --- |
| **What** | Verifying if a binary tree is a valid BST. |
| **Why** | BST validation requires children to reside within bounds $(	ext{low}, 	ext{high})$, not just comparison against immediate parent. |
| **Where** | Amazon, Microsoft. |
| **How** | Run DFS helper passing bounds `(Long.MIN_VALUE, Long.MAX_VALUE)`. Update bounds recursively. |

*   **Java Code:**
    ```java
    public class Solution {
        public boolean isValidBST(TreeNode root) {
            return validate(root, null, null);
        }
        private boolean validate(TreeNode node, Integer low, Integer high) {
            if (node == null) return true;
            if ((low != null && node.val <= low) || (high != null && node.val >= high)) {
                return false;
            }
            return validate(node.left, low, node.val) && validate(node.right, node.val, high);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(H)$.

#### Topic 48: Binary Tree Right Side View
| Dimension | Details |
| --- | --- |
| **What** | Retrieving the values of nodes visible from looking at the tree's right side. |
| **Why** | Level-by-level retrieval. The rightmost element on each level of a BFS traversal is the visible node. |
| **Where** | Meta, Google. |
| **How** | Run BFS. At the end of processing each level loop, add the last element to results list. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public List<Integer> rightSideView(TreeNode root) {
            List<Integer> result = new ArrayList<>();
            if (root == null) return result;
            Queue<TreeNode> queue = new LinkedList<>();
            queue.add(root);
            while (!queue.isEmpty()) {
                int levelSize = queue.size();
                for (int i = 0; i < levelSize; i++) {
                    TreeNode node = queue.poll();
                    if (i == levelSize - 1) {
                        result.add(node.val); // last element on this level
                    }
                    if (node.left != null) queue.add(node.left);
                    if (node.right != null) queue.add(node.right);
                }
            }
            return result;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(N)$ queue space.

---

### Topics 49–57: Graphs, Matrix, Flood Fill, Union-Find

#### Topic 49: Flood Fill
| Dimension | Details |
| --- | --- |
| **What** | Simulating the paint bucket tool on a 2D image matrix. |
| **Why** | Classic 2D Grid DFS or BFS. Avoids re-processing nodes by modifying matrix colors in place (serving as visited indicators). |
| **Where** | Microsoft. |
| **How** | Check target coordinate color. If matches starting color, swap color, recursively call flood fill in 4 cardinal directions. |

*   **Mental Model:** Spreading ripples of water. Ink spills from starting coordinate and flows seamlessly to all adjacent spaces with the same paper texture.
*   **Java Code:**
    ```java
    public class Solution {
        public int[][] floodFill(int[][] image, int sr, int sc, int color) {
            int originalColor = image[sr][sc];
            if (originalColor != color) {
                dfs(image, sr, sc, originalColor, color);
            }
            return image;
        }
        private void dfs(int[][] image, int r, int c, int source, int color) {
            if (r < 0 || r >= image.length || c < 0 || c >= image[0].length || image[r][c] != source) {
                return;
            }
            image[r][c] = color;
            dfs(image, r + 1, c, source, color);
            dfs(image, r - 1, c, source, color);
            dfs(image, r, c + 1, source, color);
            dfs(image, r, c - 1, source, color);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N 	imes M)$, Space: $\mathcal{O}(N 	imes M)$ recursion stack space.

#### Topic 50: Number of Islands
| Dimension | Details |
| --- | --- |
| **What** | Counting isolated groups of '1's (land) in a 2D matrix of '0's (water). |
| **Why** | Finding connected components on an implicit graph where matrix cells are nodes and adjacent cells are edges. |
| **Where** | Meta, Apple, Microsoft, Amazon. |
| **How** | Loop through every cell. If '1' is found, run DFS to recursively swap all connected '1's to '0's (sink island) and increment island count. |

*   **Java Code:**
    ```java
    public class Solution {
        public int numIslands(char[][] grid) {
            if (grid == null || grid.length == 0) return 0;
            int count = 0;
            for (int r = 0; r < grid.length; r++) {
                for (int c = 0; c < grid[0].length; c++) {
                    if (grid[r][c] == '1') {
                        count++;
                        sinkIsland(grid, r, c);
                    }
                }
            }
            return count;
        }
        private void sinkIsland(char[][] grid, int r, int c) {
            if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') {
                return;
            }
            grid[r][c] = '0'; // mark as visited
            sinkIsland(grid, r + 1, c);
            sinkIsland(grid, r - 1, c);
            sinkIsland(grid, r, c + 1);
            sinkIsland(grid, r, c - 1);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N 	imes M)$, Space: $\mathcal{O}(N 	imes M)$ recursion stack space.

#### Topic 51: Max Area of Island
| Dimension | Details |
| --- | --- |
| **What** | Finding the maximum area (number of connected cells) of any island. |
| **Why** | Modification of Number of Islands DFS to return values from recursive steps. Sum is accumulated bottom up. |
| **Where** | Google, Amazon. |
| **How** | DFS returns $1 + 	ext{sum of DFS in 4 directions}$. Record maximum sum. |

*   **Java Code:**
    ```java
    public class Solution {
        public int maxAreaOfIsland(int[][] grid) {
            int maxArea = 0;
            for (int r = 0; r < grid.length; r++) {
                for (int c = 0; c < grid[0].length; c++) {
                    if (grid[r][c] == 1) {
                        maxArea = Math.max(maxArea, getArea(grid, r, c));
                    }
                }
            }
            return maxArea;
        }
        private int getArea(int[][] grid, int r, int c) {
            if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != 1) {
                return 0;
            }
            grid[r][c] = 0; // visited
            return 1 + getArea(grid, r + 1, c) + 
                       getArea(grid, r - 1, c) + 
                       getArea(grid, r, c + 1) + 
                       getArea(grid, r, c - 1);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N 	imes M)$, Space: $\mathcal{O}(N 	imes M)$.

#### Topic 52: Rotting Oranges
| Dimension | Details |
| --- | --- |
| **What** | Finding the minimum minutes to rot all fresh oranges, or returning -1 if impossible. |
| **Why** | Multi-source BFS. Shortest path propagation. Level order BFS spreads rot outwards in equal time-steps. |
| **Where** | Amazon, Microsoft. |
| **How** | Put all initial rotten oranges in a Queue. Keep track of fresh orange count. Run BFS, decrement fresh count on rot. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public int orangesRotting(int[][] grid) {
            Queue<int[]> queue = new LinkedList<>();
            int freshCount = 0;
            int rows = grid.length, cols = grid[0].length;
            for (int r = 0; r < rows; r++) {
                for (int c = 0; c < cols; c++) {
                    if (grid[r][c] == 2) queue.add(new int[]{r, c});
                    else if (grid[r][c] == 1) freshCount++;
                }
            }
            if (freshCount == 0) return 0;
            int minutes = 0;
            int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
            while (!queue.isEmpty() && freshCount > 0) {
                minutes++;
                int size = queue.size();
                for (int i = 0; i < size; i++) {
                    int[] curr = queue.poll();
                    for (int[] dir : directions) {
                        int nr = curr[0] + dir[0];
                        int nc = curr[1] + dir[1];
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                            grid[nr][nc] = 2; // rot
                            freshCount--;
                            queue.add(new int[]{nr, nc});
                        }
                    }
                }
            }
            return freshCount == 0 ? minutes : -1;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N 	imes M)$, Space: $\mathcal{O}(N 	imes M)$.

#### Topic 53: Clone Graph
| Dimension | Details |
| --- | --- |
| **What** | Deep-copying an undirected graph. |
| **Why** | Avoids infinite recursion loops caused by graph cycles by tracking copies in a Map (serving as visited tracking). |
| **Where** | Meta, Microsoft. |
| **How** | Use a Map `nodeToCopy`. Run DFS/BFS. If node's copy exists, return it, else create copy, insert in map, clone neighbors. |

*   **Java Code:**
    ```java
    import java.util.*;
    class Node {
        public int val;
        public List<Node> neighbors;
        public Node() { val = 0; neighbors = new ArrayList<Node>(); }
        public Node(int _val) { val = _val; neighbors = new ArrayList<Node>(); }
    }
    public class Solution {
        private Map<Node, Node> visited = new HashMap<>();
        public Node cloneGraph(Node node) {
            if (node == null) return null;
            if (visited.containsKey(node)) {
                return visited.get(node);
            }
            Node clone = new Node(node.val);
            visited.put(node, clone);
            for (Node neighbor : node.neighbors) {
                clone.neighbors.add(cloneGraph(neighbor));
            }
            return clone;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(V + E)$ where $V$ is vertices and $E$ is edges, Space: $\mathcal{O}(V)$ stack and map space.

#### Topic 54: Course Schedule (Topological Sort / Cycle Detection)
| Dimension | Details |
| --- | --- |
| **What** | Deciding if a course sequence prerequisites can be finished (i.e. check if dependency graph has cycles). |
| **Why** | Detects cycles in Directed Acyclic Graphs (DAG) using topological sort concepts (Kahn's BFS or DFS path marking). |
| **Where** | Google, Amazon. |
| **How** | Maintain dependency adjacency lists. Track `indegree` (prerequisites needed for each course). Run Kahn's BFS queue. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public boolean canFinish(int numCourses, int[][] prerequisites) {
            List<List<Integer>> adj = new ArrayList<>();
            for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
            int[] indegree = new int[numCourses];
            for (int[] pre : prerequisites) {
                adj.get(pre[1]).add(pre[0]);
                indegree[pre[0]]++;
            }
            Queue<Integer> queue = new LinkedList<>();
            for (int i = 0; i < numCourses; i++) {
                if (indegree[i] == 0) queue.add(i);
            }
            int visitedCourses = 0;
            while (!queue.isEmpty()) {
                int curr = queue.poll();
                visitedCourses++;
                for (int nextCourse : adj.get(curr)) {
                    indegree[nextCourse]--;
                    if (indegree[nextCourse] == 0) {
                        queue.add(nextCourse);
                    }
                }
            }
            return visitedCourses == numCourses;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(V + E)$, Space: $\mathcal{O}(V + E)$ adjacency structure space.

#### Topic 55: Course Schedule II
| Dimension | Details |
| --- | --- |
| **What** | Finding the exact topological ordering path of courses to take. |
| **Why** | Kahn's Algorithm BFS queue systematically visits and records nodes once their prerequisite dependencies are met (indegree is 0). |
| **Where** | Google, Microsoft. |
| **How** | Run Kahn's. Record courses in array as they are popped from the queue. If final count doesn't match total, return empty array. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public int[] findOrder(int numCourses, int[][] prerequisites) {
            List<List<Integer>> adj = new ArrayList<>();
            for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
            int[] indegree = new int[numCourses];
            for (int[] pre : prerequisites) {
                adj.get(pre[1]).add(pre[0]);
                indegree[pre[0]]++;
            }
            Queue<Integer> queue = new LinkedList<>();
            for (int i = 0; i < numCourses; i++) {
                if (indegree[i] == 0) queue.add(i);
            }
            int[] order = new int[numCourses];
            int idx = 0;
            while (!queue.isEmpty()) {
                int curr = queue.poll();
                order[idx++] = curr;
                for (int nextCourse : adj.get(curr)) {
                    indegree[nextCourse]--;
                    if (indegree[nextCourse] == 0) {
                        queue.add(nextCourse);
                    }
                }
            }
            return idx == numCourses ? order : new int[0];
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(V + E)$, Space: $\mathcal{O}(V + E)$.

#### Topic 56: Number of Connected Components (Union-Find)
| Dimension | Details |
| --- | --- |
| **What** | Finding the number of connected components in an undirected graph. |
| **Why** | Union-Find (Disjoint Set Union) manages group relationships in almost constant time $\mathcal{O}(lpha(N))$ using path compression. |
| **Where** | Amazon, Apple. |
| **How** | Initialize $N$ disjoint sets. For each edge, union the endpoints. Successful unions reduce the connected component count by 1. |

*   **Java Code:**
    ```java
    public class Solution {
        class UnionFind {
            int[] parent;
            int count;
            UnionFind(int n) {
                parent = new int[n];
                for (int i = 0; i < n; i++) parent[i] = i;
                count = n;
            }
            int find(int i) {
                if (parent[i] == i) return i;
                return parent[i] = find(parent[i]); // path compression
            }
            boolean union(int i, int j) {
                int rootI = find(i);
                int rootJ = find(j);
                if (rootI != rootJ) {
                    parent[rootI] = rootJ;
                    count--;
                    return true;
                }
                return false;
            }
        }
        public int countComponents(int n, int[][] edges) {
            UnionFind uf = new UnionFind(n);
            for (int[] edge : edges) {
                uf.union(edge[0], edge[1]);
            }
            return uf.count;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N + E \cdot lpha(N))$ where $lpha$ is Inverse Ackermann (constant for all practical inputs), Space: $\mathcal{O}(N)$ parent array.

#### Topic 57: Redundant Connection
| Dimension | Details |
| --- | --- |
| **What** | Finding an edge in a graph that can be removed so the remaining graph is a tree. |
| **Why** | An edge that connects two nodes already belonging to the same union set completes a cycle. |
| **Where** | Google, Amazon. |
| **How** | Run Union-Find on edges. The first edge where `union(edge[0], edge[1])` is false is the redundant connection. |

*   **Java Code:**
    ```java
    public class Solution {
        public int[] findRedundantConnection(int[][] edges) {
            int n = edges.length;
            int[] parent = new int[n + 1];
            for (int i = 0; i <= n; i++) parent[i] = i;
            for (int[] edge : edges) {
                int rootU = find(parent, edge[0]);
                int rootV = find(parent, edge[1]);
                if (rootU == rootV) {
                    return edge; // cycle detected
                }
                parent[rootU] = rootV;
            }
            return new int[0];
        }
        private int find(int[] parent, int i) {
            if (parent[i] == i) return i;
            return parent[i] = find(parent, parent[i]);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N \cdot lpha(N))$, Space: $\mathcal{O}(N)$.

---

### Topics 58–65: Dynamic Programming (States & Transitions)

#### Topic 58: Climbing Stairs (Fibonacci Variant)
| Dimension | Details |
| --- | --- |
| **What** | Finding number of ways to climb $N$ stairs (climbing 1 or 2 steps at a time). |
| **Why** | Number of ways to reach stair $N$ is sum of ways to reach $N-1$ and $N-2$. Reducible to Fibonacci sequence. |
| **Where** | Microsoft, Apple (Highly asked). |
| **How** | Solve iteratively using two variables tracking ways of previous two steps to optimize space to $\mathcal{O}(1)$. |

*   **Java Code:**
    ```java
    public class Solution {
        public int climbStairs(int n) {
            if (n <= 2) return n;
            int first = 1, second = 2;
            for (int i = 3; i <= n; i++) {
                int third = first + second;
                first = second;
                second = third;
            }
            return second;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 59: House Robber
| Dimension | Details |
| --- | --- |
| **What** | Finding the maximum money that can be robbed from adjacent houses (cannot rob adjacent houses). |
| **Why** | State transition: max profit at house `i` is $\max(	ext{rob current} + 	ext{profit at } i-2, 	ext{skip current} + 	ext{profit at } i-1)$. |
| **Where** | Meta, Apple, Google, Microsoft. |
| **How** | Maintain two running variables tracking optimal profits of step $i-1$ and $i-2$. |

*   **Mental Model:** A sliding budget. At each house, we weigh the immediate cash pay-out (robbing now) against the stability of our current accrued wealth (skipping now).
*   **Java Code:**
    ```java
    public class Solution {
        public int rob(int[] nums) {
            if (nums == null || nums.length == 0) return 0;
            if (nums.length == 1) return nums[0];
            int prev2 = 0;
            int prev1 = 0;
            for (int num : nums) {
                int temp = Math.max(num + prev2, prev1);
                prev2 = prev1;
                prev1 = temp;
            }
            return prev1;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 60: House Robber II
| Dimension | Details |
| --- | --- |
| **What** | House robber where houses are arranged in a circle (first and last are adjacent). |
| **Why** | Splitting circular dependency: we can either rob range `[0, n-2]` or range `[1, n-1]`. |
| **Where** | Microsoft. |
| **How** | Run standard House Robber twice (once for first $N-1$ elements, once for last $N-1$ elements). Return max. |

*   **Java Code:**
    ```java
    public class Solution {
        public int rob(int[] nums) {
            if (nums.length == 1) return nums[0];
            return Math.max(robHelper(nums, 0, nums.length - 2), 
                            robHelper(nums, 1, nums.length - 1));
        }
        private int robHelper(int[] nums, int start, int end) {
            int prev2 = 0, prev1 = 0;
            for (int i = start; i <= end; i++) {
                int temp = Math.max(nums[i] + prev2, prev1);
                prev2 = prev1;
                prev1 = temp;
            }
            return prev1;
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N)$, Space: $\mathcal{O}(1)$.

#### Topic 61: Longest Common Subsequence
| Dimension | Details |
| --- | --- |
| **What** | Finding the length of the longest subsequence common to two strings. |
| **Why** | 2D dynamic programming grid. If characters match, $dp[i][j] = 1 + dp[i-1][j-1]$. Else, $\max(dp[i-1][j], dp[i][j-1])$. |
| **Where** | Amazon, Microsoft. |
| **How** | Fill out a 2D integer table of sizes $(|S_1|+1) 	imes (|S_2|+1)$. |

*   **Java Code:**
    ```java
    public class Solution {
        public int longestCommonSubsequence(String text1, String s2) {
            int m = text1.length(), n = s2.length();
            int[][] dp = new int[m + 1][n + 1];
            for (int i = 1; i <= m; i++) {
                for (int j = 1; j <= n; j++) {
                    if (text1.charAt(i - 1) == s2.charAt(j - 1)) {
                        dp[i][j] = 1 + dp[i - 1][j - 1];
                    } else {
                        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    }
                }
            }
            return dp[m][n];
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(M 	imes N)$, Space: $\mathcal{O}(M 	imes N)$.

#### Topic 62: Longest Increasing Subsequence
| Dimension | Details |
| --- | --- |
| **What** | Finding the length of the longest strictly increasing subsequence in an array. |
| **Why** | Binary search speedup (Patience Sorting): maintaining a list of active increasing runs allows us to find insert locations in $\mathcal{O}(\log N)$. |
| **Where** | Google, Amazon. |
| **How** | Maintain list of active tails. If current number is larger than tail, append. Otherwise, binary search and replace tail. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class Solution {
        public int lengthOfLIS(int[] nums) {
            List<Integer> sub = new ArrayList<>();
            for (int num : nums) {
                int idx = Collections.binarySearch(sub, num);
                if (idx < 0) idx = -(idx + 1); // calculate insert point
                if (idx == sub.size()) {
                    sub.add(num);
                } else {
                    sub.set(idx, num);
                }
            }
            return sub.size();
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N \log N)$, Space: $\mathcal{O}(N)$ subsequence list.

#### Topic 63: Coin Change
| Dimension | Details |
| --- | --- |
| **What** | Finding the minimum coins needed to make up a target amount. |
| **Why** | State transition: min coins for `amount` is $1 + \min(	ext{minCoins}(amount - 	ext{coin}))$. |
| **Where** | Amazon, Microsoft, Apple. |
| **How** | Iterate and fill 1D DP table up to target amount. Initialize table with `amount + 1` representing unreachable infinity. |

*   **Java Code:**
    ```java
    import java.util.Arrays;
    public class Solution {
        public int coinChange(int[] coins, int amount) {
            int[] dp = new int[amount + 1];
            Arrays.fill(dp, amount + 1);
            dp[0] = 0;
            for (int i = 1; i <= amount; i++) {
                for (int coin : coins) {
                    if (i - coin >= 0) {
                        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
                    }
                }
            }
            return dp[amount] > amount ? -1 : dp[amount];
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N 	imes 	ext{amount})$ where $N$ is coin variants, Space: $\mathcal{O}(	ext{amount})$.

#### Topic 64: Partition Equal Subset Sum (0/1 Knapsack)
| Dimension | Details |
| --- | --- |
| **What** | Checking if an array can be partitioned into two subsets with equal sum. |
| **Why** | Equivalently: finding if there exists a subset whose sum matches exactly `totalSum / 2` (Knapsack check). |
| **Where** | Microsoft, Netflix. |
| **How** | Run bottom-up boolean table. Optimize space to 1D boolean array processed from right-to-left to avoid self-overwrite. |

*   **Java Code:**
    ```java
    public class Solution {
        public boolean canPartition(int[] nums) {
            int totalSum = 0;
            for (int num : nums) totalSum += num;
            if (totalSum % 2 == 1) return false;
            int target = totalSum / 2;
            boolean[] dp = new boolean[target + 1];
            dp[0] = true;
            for (int num : nums) {
                for (int j = target; j >= num; j--) {
                    if (dp[j - num]) {
                        dp[j] = true;
                    }
                }
            }
            return dp[target];
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(N 	imes 	ext{target})$ where $target = 	ext{totalSum} / 2$, Space: $\mathcal{O}(	ext{target})$.

#### Topic 65: Unique Paths
| Dimension | Details |
| --- | --- |
| **What** | Calculating number of unique paths from top-left to bottom-right in an $M 	imes N$ matrix. |
| **Why** | Combinatorial state: path options to cell `(i, j)` is sum of path options of its top cell and left cell. |
| **Where** | Amazon, Microsoft. |
| **How** | Fill 2D DP matrix. Or optimize to 1D space using running row totals. |

*   **Java Code:**
    ```java
    import java.util.Arrays;
    public class Solution {
        public int uniquePaths(int m, int n) {
            int[] dp = new int[n];
            Arrays.fill(dp, 1);
            for (int r = 1; r < m; r++) {
                for (int c = 1; c < n; c++) {
                    dp[c] += dp[c - 1]; // running prefix sum
                }
            }
            return dp[n - 1];
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(M 	imes N)$, Space: $\mathcal{O}(N)$.

---

## Module 3: 2026 AI Fluency & Code Comprehension (Topics 66–75)

In 2026, tech giants evaluate your ability to navigate, debug, and optimize multi-file codebases, often alongside an AI assistant (Google Code Comprehension format).

### Topics 66–70: Code Comprehension & Debugging

#### Topic 66: Trace & Debug: Finding Memory Leaks in Large Collections
| Dimension | Details |
| --- | --- |
| **What** | Locating silent memory leaks caused by static collections, missing hashcodes, or dangling listeners. |
| **Why** | Strong code comprehension ensures you identify why references aren't garbage collected, avoiding catastrophic OutOfMemoryErrors in production. |
| **Where** | Google Code Comprehension loops. |
| **How** | Inspect class hierarchies, identify long-lived collections holding short-lived objects. |

*   **Step-by-Step Logic:**
    1. Look for `static` lists or maps. Because static collections survive for the app's entire lifespan, objects added to them are never garbage collected unless explicitly removed.
    2. Check custom keys used in `HashMap`. If the key class implements `equals()` but lacks `hashCode()`, lookups will fail to match existing keys, causing duplicate insertions and linear memory growth.
    3. Ensure clean listener unsubscribing or use `WeakReference`/`WeakHashMap`.
*   **Java Code Example showing a common leak and its fix:**
    ```java
    import java.util.*;
    public class LegacyUserCache {
        // LEAK: Strong static references in a map with a key lacking a proper hashCode()
        private static final Map<UserKey, String> cache = new HashMap<>();

        public static class UserKey {
            private final int id;
            public UserKey(int id) { this.id = id; }
            @Override
            public boolean equals(Object o) {
                if (this == o) return true;
                if (!(o instanceof UserKey)) return false;
                return this.id == ((UserKey) o).id;
            }
            // MISSING hashCode()! This is the leak root.
        }

        // FIX: Implement correct hashCode() and use weak references if temporary
        public static class FixedUserKey {
            private final int id;
            public FixedUserKey(int id) { this.id = id; }
            @Override
            public boolean equals(Object o) {
                if (this == o) return true;
                if (!(o instanceof FixedUserKey)) return false;
                return this.id == ((FixedUserKey) o).id;
            }
            @Override
            public int hashCode() {
                return Objects.hash(id); // Proper hashing prevents duplicates
            }
        }
    }
    ```

#### Topic 67: Trace & Debug: ConcurrentModificationException
| Dimension | Details |
| --- | --- |
| **What** | Resolving `ConcurrentModificationException` thrown when modifying collections while iterating over them. |
| **Why** | Iterators fail-fast by checking a modification count (`modCount`). Lookups or removals inside standard loops break this contract. |
| **Where** | Microsoft, Netflix. |
| **How** | Switch to `Iterator.remove()`, use concurrent collections like `CopyOnWriteArrayList`, or queue removals for a separate step. |

*   **Java Code:**
    ```java
    import java.util.*;
    import java.util.concurrent.*;
    public class CollectionUpdater {
        // FAILS: Modifying in standard for-each loop
        public void badRemove(List<String> list) {
            for (String s : list) {
                if (s.startsWith("evict")) {
                    list.remove(s); // Throws ConcurrentModificationException!
                }
            }
        }
        // FIXED: Using Iterator explicitly
        public void goodRemove(List<String> list) {
            Iterator<String> it = list.iterator();
            while (it.hasNext()) {
                if (it.next().startsWith("evict")) {
                    it.remove(); // Safe and valid
                }
            }
        }
    }
    ```

#### Topic 68: Code Comprehension: Legacy HashMap and Custom Hashing
| Dimension | Details |
| --- | --- |
| **What** | Understanding Java's HashMap bucket structure, collisions, and tree-bin conversions. |
| **Why** | When custom objects are used as keys, knowing how hashcode collisions degrade lookup performance from $\mathcal{O}(1)$ to $\mathcal{O}(N)$ or $\mathcal{O}(\log N)$ is vital. |
| **Where** | Google, Amazon. |
| **How** | Review hashing distributions. Ensure custom keys maintain consistent values (immutability) throughout their cache lifecycle. |

*   **Java Code:**
    ```java
    public final class ImmutableKey {
        private final String accountId;
        private final int typeCode;
        public ImmutableKey(String accountId, int typeCode) {
            this.accountId = accountId;
            this.typeCode = typeCode;
        }
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof ImmutableKey)) return false;
            ImmutableKey that = (ImmutableKey) o;
            return typeCode == that.typeCode && Objects.equals(accountId, that.accountId);
        }
        @Override
        public int hashCode() {
            return Objects.hash(accountId, typeCode);
        }
    }
    ```

#### Topic 69: Code Comprehension: Refactoring O(N^3) Nested Loops using Precomputation
| Dimension | Details |
| --- | --- |
| **What** | Tracing legacy scripts and mapping redundant inner-loop computations to fast lookup data structures. |
| **Why** | Shows your ability to refactor slow legacy systems. Minimizes transaction times and costs significantly in production environments. |
| **Where** | Google Code Comprehension loop. |
| **How** | Recognize repeated search queries, precalculate prefix tables or Map lookup indexes to change search complexities. |

*   **Mental Model:** The "Index" vs "Full Scan". If a clerk is repeatedly searching through a library of 10,000 files from scratch for every single customer request, build a central ledger index.
*   **Java Code:**
    ```java
    public class RefactoringPractice {
        // SLOW: Search every pair with a nested loop - O(N^2)
        public int findOverlappingCountSlow(int[] a, int[] b) {
            int count = 0;
            for (int x : a) {
                for (int y : b) {
                    if (x == y) count++;
                }
            }
            return count;
        }
        // FAST: Precompute array a in a Set to achieve O(N + M) complexity
        public int findOverlappingCountFast(int[] a, int[] b) {
            Set<Integer> set = new HashSet<>();
            for (int x : a) set.add(x);
            int count = 0;
            for (int y : b) {
                if (set.contains(y)) count++;
            }
            return count;
        }
    }
    ```

#### Topic 70: Trace & Debug: Identifying Resource Leaks in I/O and Autocloseable
| Dimension | Details |
| --- | --- |
| **What** | Identifying hidden database, network, or file stream leaks that eventually crash server memory or exhaust OS file descriptors. |
| **Why** | Streams left open do not close on garbage collection. Leveraging Try-With-Resources guarantees file descriptor recycling. |
| **Where** | Microsoft, Netflix. |
| **How** | Locate files or socket connections initialized outside modern try-catch block setups. |

*   **Java Code:**
    ```java
    import java.io.*;
    public class FileStreamRecycler {
        // LEAKY: Exception before close() leaves file stream open
        public void badReader(String path) throws IOException {
            BufferedReader br = new BufferedReader(new FileReader(path));
            String line = br.readLine();
            System.out.println(line);
            br.close(); // If an exception is thrown on line 6, close is bypassed!
        }
        // SAFE: Try-with-resources compiles with automatic closing guarantees
        public void goodReader(String path) throws IOException {
            try (BufferedReader br = new BufferedReader(new FileReader(path))) {
                String line = br.readLine();
                System.out.println(line);
            } // AutoCloseable handles the closing regardless of exceptions
        }
    }
    ```

---

### Topics 71–75: AI-Collaborative Engineering

#### Topic 71: Verification: Auditing AI-Generated Solutions for Edge Cases and Constraints
| Dimension | Details |
| --- | --- |
| **What** | Thoroughly reviewing AI-generated code to verify correctness on boundaries (empty lists, overflow bounds, integer overflows). |
| **Why** | AI models are prone to hallucinating perfect-case execution or missing critical boundary conditions. |
| **Where** | Google Code Comprehension and AI-assisted loops. |
| **How** | Review pointer constraints, check possible overflows (using `Math.addExact()` or matching target sum casts). |

*   **Java Code:**
    ```java
    public class BigSumChecker {
        // UNPROTECTED: AI code prone to quiet integer overflow
        public int calculateSum(int a, int b) {
            return a + b; // if a = Integer.MAX_VALUE and b = 1, overflows to Integer.MIN_VALUE!
        }
        // PROTECTED: Defensive coding checks boundaries explicitly
        public int calculateSumSafe(int a, int b) {
            try {
                return Math.addExact(a, b); // throws ArithmeticException on overflow
            } catch (ArithmeticException e) {
                throw new IllegalArgumentException("Integer overflow occurred", e);
            }
        }
    }
    ```

#### Topic 72: Verification: Identifying Time-Complexity Anomalies in AI Code
| Dimension | Details |
| --- | --- |
| **What** | Finding subtle complexity errors (like using `list.contains()` inside loop which degrades a supposedly $\mathcal{O}(N)$ process to $\mathcal{O}(N^2)$). |
| **Why** | AI often generates visually clean code that hides heavy lookup costs inside native collection helper functions. |
| **Where** | High-paying engineering loops. |
| **How** | Check type definitions. Replace linear lists with constant-time set lookups. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class SubtleAnomaly {
        // ANOMALY: List.contains() operates in O(N), so loop is O(N^2)
        public List<Integer> badOverlap(int[] nums, List<Integer> filterList) {
            List<Integer> res = new ArrayList<>();
            for (int num : nums) {
                if (filterList.contains(num)) { // Linear search inside loop!
                    res.add(num);
                }
            }
            return res;
        }
        // OPTIMIZED: Set lookup operates in O(1), making overall process O(N + M)
        public List<Integer> goodOverlap(int[] nums, List<Integer> filterList) {
            Set<Integer> filterSet = new HashSet<>(filterList); // Precompute set
            List<Integer> res = new ArrayList<>();
            for (int num : nums) {
                if (filterSet.contains(num)) { // Constant time lookup
                    res.add(num);
                }
            }
            return res;
        }
    }
    ```

#### Topic 73: Prompting: Crafting Precision Prompts for Code Refactoring
| Dimension | Details |
| --- | --- |
| **What** | Providing explicit guidelines to an LLM regarding formatting, runtime boundaries, and thread-safety invariants. |
| **Why** | General prompts produce generic, poorly structured scripts. Precision prompting guarantees deterministic, production-ready outputs. |
| **Where** | Google goodness and modern AI-native loops. |
| **How** | Use structured guidelines: "Role, Task, Constraints, Context, Expected Output Schema." |

*   **Prompting Template Example:**
    > "You are an expert Java performance engineer. Optimize the following class to reduce space complexity from $\mathcal{O}(N)$ to $\mathcal{O}(1)$. Do not modify the existing public class interface. Ensure code is thread-safe using local pointer states, incorporates exception safety for file descriptor limits, and outputs standard Java 21 syntax."

#### Topic 74: Collaborative Debugging: Diagnosing Race Conditions alongside an AI Copilot
| Dimension | Details |
| --- | --- |
| **What** | Jointly auditing multi-threaded Java systems for data races and thread scheduling issues. |
| **Why** | Identifying why non-volatile flags fail to communicate state updates across threads, causing infinite polling loops. |
| **Where** | High-stakes technical assessments. |
| **How** | Add volatile qualifiers, configure locks, or use thread-safe Atomic properties. |

*   **Java Code:**
    ```java
    public class SharedStateTracker {
        // BUGGY: Other threads might never see flag change due to CPU caching
        private boolean active = true; 
        
        // SAFE: Volatile keyword guarantees cross-core cache visibility
        private volatile boolean activeSafe = true;

        public void stop() {
            active = false;
            activeSafe = false;
        }
    }
    ```

#### Topic 75: Prompting: Instructing AI to Optimize Space Complexity from O(N) to O(1)
| Dimension | Details |
| --- | --- |
| **What** | Forcing an AI assistant to refactor recursion or dynamic programming tables down to in-place variables. |
| **Why** | Standard AI suggestions typically default to comfortable but memory-heavy arrays or tables. |
| **Where** | AI-collaborative interview rounds. |
| **How** | Instruct the model: "Apply sliding variable technique to preserve state transition elements $i-1$ and $i-2$ without allocating any arrays." |

---

## Module 4: Practical System Design & Components (Topics 76–90)

This module bridges your algorithmic patterns directly to large-scale system scalability, performance trade-offs, and microservice topologies.

### Topics 76–80: Caching Strategies & Key-Value Stores

#### Topic 76: Caching Strategy: LRU Cache Design
| Dimension | Details |
| --- | --- |
| **What** | Designing a Least Recently Used (LRU) cache with $\mathcal{O}(1)$ `get` and `put` operations. |
| **Why** | Bounding memory usage of cache stores by discarding the least recently visited element when limits are exceeded. |
| **Where** | Top-tier system components interview (Highly Popular). |
| **How** | Combine a `HashMap` for constant-time lookups with a custom `Doubly Linked List` to maintain retrieval order in $\mathcal{O}(1)$. |

*   **Mental Model:** A stack of books. Whenever you read a book, you place it at the top of the stack. When the stack gets too high, you throw away the book sitting at the very bottom.
*   **Java Code:**
    ```java
    import java.util.*;
    public class LRUCache {
        class Node {
            int key, val;
            Node prev, next;
            Node(int k, int v) { this.key = k; this.val = v; }
        }
        private final Map<Integer, Node> map = new HashMap<>();
        private final Node head = new Node(0, 0);
        private final Node tail = new Node(0, 0);
        private final int capacity;

        public LRUCache(int capacity) {
            this.capacity = capacity;
            head.next = tail;
            tail.prev = head;
        }
        
        public int get(int key) {
            if (map.containsKey(key)) {
                Node node = map.get(key);
                remove(node);
                insertAtHead(node);
                return node.val;
            }
            return -1;
        }
        
        public void put(int key, int value) {
            if (map.containsKey(key)) {
                remove(map.get(key));
            }
            if (map.size() == capacity) {
                map.remove(tail.prev.key);
                remove(tail.prev);
            }
            Node newNode = new Node(key, value);
            map.put(key, newNode);
            insertAtHead(newNode);
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
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(1)$ for both get and put. Space: $\mathcal{O}(	ext{capacity})$ for map and list nodes.

#### Topic 77: Caching Strategy: LFU Cache Design
| Dimension | Details |
| --- | --- |
| **What** | Designing a Least Frequently Used (LFU) cache with $\mathcal{O}(1)$ lookup and insertion. |
| **Why** | Better eviction policy than LRU for caching static hot data, tracking retrieval frequency counts to determine evictions. |
| **Where** | Google, Amazon. |
| **How** | Multiple linked lists grouped by frequency counts. Track minimum frequency running variable to locate eviction list instantly. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class LFUCache {
        class Node {
            int key, val, freq;
            Node prev, next;
            Node(int k, int v) { this.key = k; this.val = v; this.freq = 1; }
        }
        class DoubleLinkedList {
            Node head = new Node(0, 0), tail = new Node(0, 0);
            DoubleLinkedList() { head.next = tail; tail.prev = head; }
            void add(Node node) {
                node.next = head.next;
                node.next.prev = node;
                head.next = node;
                node.prev = head;
            }
            void remove(Node node) {
                node.prev.next = node.next;
                node.next.prev = node.prev;
            }
            boolean isEmpty() { return head.next == tail; }
        }
        private final Map<Integer, Node> cache = new HashMap<>();
        private final Map<Integer, DoubleLinkedList> freqMap = new HashMap<>();
        private final int capacity;
        private int minFreq = 0;

        public LFUCache(int capacity) { this.capacity = capacity; }

        public int get(int key) {
            if (!cache.containsKey(key)) return -1;
            Node node = cache.get(key);
            updateFrequency(node);
            return node.val;
        }

        public void put(int key, int value) {
            if (capacity <= 0) return;
            if (cache.containsKey(key)) {
                Node node = cache.get(key);
                node.val = value;
                updateFrequency(node);
                return;
            }
            if (cache.size() == capacity) {
                DoubleLinkedList list = freqMap.get(minFreq);
                Node evict = list.tail.prev;
                list.remove(evict);
                cache.remove(evict.key);
            }
            Node newNode = new Node(key, value);
            cache.put(key, newNode);
            minFreq = 1;
            freqMap.computeIfAbsent(1, k -> new DoubleLinkedList()).add(newNode);
        }

        private void updateFrequency(Node node) {
            DoubleLinkedList oldList = freqMap.get(node.freq);
            oldList.remove(node);
            if (oldList.isEmpty() && node.freq == minFreq) {
                minFreq++;
            }
            node.freq++;
            freqMap.computeIfAbsent(node.freq, k -> new DoubleLinkedList()).add(node);
        }
    }
    ```
*   **Complexity:** Time: $\mathcal{O}(1)$, Space: $\mathcal{O}(	ext{capacity})$.

#### Topic 78: Cache Invalidation (Write-Through, Write-Back, Cache-Aside)
| Dimension | Details |
| --- | --- |
| **What** | Aligning data modification routes between Cache layers and the master database. |
| **Why** | Decides system consistency, transaction latency, and database write stress during massive scaling intervals. |
| **Where** | System design architectural loop. |
| **How** | 1. **Cache-Aside:** App queries cache; if miss, queries DB, updates cache. 2. **Write-Through:** App writes to cache; cache immediately writes to DB before return. 3. **Write-Back:** App writes to cache; cache writes back to DB asynchronously. |

*   **Mental Model:** Caching updates. Write-through is paying cash at a register and waiting for the clerk to update the physical ledger book immediately. Write-back is depositing a check; you get confirmation immediately, and the bank reconciles accounts later in the evening.

#### Topic 79: Key-Value Store: Design of Time-Based Key-Value Store
| Dimension | Details |
| --- | --- |
| **What** | Designing a key-value store that retrieves values at designated timestamps. |
| **Why** | Combines hashmaps with binary search over timestamped arrays to guarantee fast lookups across historical states. |
| **Where** | Netflix, Google. |
| **How** | Map keys to lists of `(timestamp, value)` pairs. Use binary search (leftmost occurrence) to query the largest timestamp $\le$ target. |

*   **Java Code:**
    ```java
    import java.util.*;
    public class TimeMap {
        class Data {
            String val;
            int timestamp;
            Data(String val, int t) { this.val = val; this.timestamp = t; }
        }
        private final Map<String, List<Data>> map = new HashMap<>();

        public void set(String key, String value, int timestamp) {
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(new Data(value, timestamp));
        }

        public String get(String key, int timestamp) {
            if (!map.containsKey(key)) return "";
            List<Data> list = map.get(key);
            int left = 0, right = list.size() - 1;
            String res = "";
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (list.get(mid).timestamp <= timestamp) {
                    res = list.get(mid).val; // candidate found, try to search right for larger
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            return res;
        }
    }
    ```
*   **Complexity:** Time: set: $\mathcal{O}(1)$, get: $\mathcal{O}(\log 	ext{versions})$. Space: $\mathcal{O}(	ext{inserts})$.

#### Topic 80: Key-Value Store: CAP Theorem Trade-offs
| Dimension | Details |
| --- | --- |
| **What** | Trade-off: distributed systems can guarantee at most two of: Consistency, Availability, and Partition Tolerance. |
| **Why** | Network partitions (P) are inevitable, so systems must choose between Consistency (C - reject writes if replicas disagree) or Availability (A - accept writes on any node immediately). |
| **Where** | Distributed system design. |
| **How** | 1. **CP Systems:** Choose consistency. Replicas reject stale requests to prevent dirty reads. 2. **AP Systems:** Choose availability. Accept read/write, rely on eventual consistency (e.g. Cassandra gossips). |

---

### Topics 81–90: Core System Components

#### Topic 81: Rate Limiter: Token Bucket Algorithm Design
| Dimension | Details |
| --- | --- |
| **What** | Limiting client request rates by processing only when tokens are available in a refillable bucket. |
| **Why** | Simple, memory-efficient, and gracefully handles occasional bursts of client requests. |
| **Where** | System design rate limiter loop. |
| **How** | Track `lastRefillTimestamp` and `tokens`. Refill tokens incrementally inside request checks instead of running static timer threads. |

*   **Java Code:**
    ```java
    public class TokenBucketRateLimiter {
        private final long capacity;
        private final double refillRatePerMs;
        private double tokens;
        private long lastRefillTimestamp;

        public TokenBucketRateLimiter(long capacity, double refillRatePerSecond) {
            this.capacity = capacity;
            this.refillRatePerMs = refillRatePerSecond / 1000.0;
            this.tokens = capacity;
            this.lastRefillTimestamp = System.currentTimeMillis();
        }

        public synchronized boolean allowRequest() {
            long now = System.currentTimeMillis();
            double generatedTokens = (now - lastRefillTimestamp) * refillRatePerMs;
            tokens = Math.min(capacity, tokens + generatedTokens);
            lastRefillTimestamp = now;
            if (tokens >= 1.0) {
                tokens -= 1.0;
                return true;
            }
            return false;
        }
    }
    ```

#### Topic 82: Rate Limiter: Leaky Bucket and Sliding Window Log Algorithms
| Dimension | Details |
| --- | --- |
| **What** | Alternative rate limiting algorithms: Leaky Bucket forces smooth constant outbound rate; Sliding Window Log prevents boundary bursts. |
| **Why** | Sliding Window Log ensures strict rate boundaries but consumes significant memory (stores every request timestamp in a SortedSet). |
| **Where** | Rate Limiter deep-dives. |
| **How** | 1. **Leaky Bucket:** Queue requests, poll at constant rates. 2. **Sliding Window:** Store timestamps in Redis sorted sets, remove outdated stamps, count elements. |

#### Topic 83: Consistent Hashing Ring
| Dimension | Details |
| --- | --- |
| **What** | Distributing requests across servers dynamically to prevent massive re-allocations when nodes scale out/in. |
| **Why** | Standard modulo hashing ($Hash(key) \% N$) causes 99% cache misses when $N$ changes. Consistent hashing re-allocates at most $1/N$ keys. |
| **Where** | Database sharding & distributed cache topologies. |
| **How** | Map keys and nodes onto a circular ring (0 to $2^{32}-1$). Route a key's request to the first node encountered clockwise. |

*   **Mental Model:** A circular table with chairs (Servers). Keys are guests sitting randomly. Each guest walks clockwise until they find the closest chair.

#### Topic 84: URL Shortener Design
| Dimension | Details |
| --- | --- |
| **What** | Designing tinyurl hashing, generation, and redirection pipelines. |
| **Why** | Encodes auto-incrementing integer IDs into base62 strings (`[a-zA-Z0-9]`) to represent millions of unique combinations in 7 characters. |
| **Where** | Classic System Design round. |
| **How** | ID database allocation, base62 encoding conversion, and caching redirects on memory caches to avoid database queries. |

*   **Base62 Conversion helper logic in Java:**
    ```java
    public class Base62Encoder {
        private static final String BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        public static String encode(long id) {
            StringBuilder sb = new StringBuilder();
            while (id > 0) {
                sb.append(BASE62.charAt((int) (id % 62)));
                id /= 62;
            }
            return sb.reverse().toString();
        }
    }
    ```

#### Topic 85: Distributed Messaging: Designing Pub/Sub queues with partitions
| Dimension | Details |
| --- | --- |
| **What** | Designing highly scalable messaging queues (like Kafka). |
| **Why** | Partitioning breaks a central message queue into isolated append-only logs, allowing concurrent consumer groups to read offsets in parallel. |
| **Where** | High throughput system designs. |
| **How** | Map message keys to partitions using consistent hashing. Track read progress using offset integers. |

#### Topic 86: Redis vs Local Memory Cache
| Dimension | Details |
| --- | --- |
| **What** | Comparing in-memory caches (Guava, Caffeine) against distributed caches (Redis). |
| **Why** | Local Cache: microsecond latencies, but duplicates data across servers and lacks global consistency. Redis: sub-millisecond network latencies, but supports global shared states. |
| **Where** | Caching layer designs. |
| **How** | Use Local Cache for immutable config data; use Redis for active session counts or distributed transaction states. |

#### Topic 87: Load Balancer Routing Strategies
| Dimension | Details |
| --- | --- |
| **What** | Distributing network traffic across server clusters. |
| **Why** | Standard round-robin fails when server states are heterogeneous. Smart routing ensures high utilization. |
| **Where** | Entry layer architectural designs. |
| **How** | 1. **Round-Robin:** Sequential distribution. 2. **Least Connections:** Shift to least utilized node. 3. **IP Hash:** Consistent routing based on caller IP. |

#### Topic 88: Database Sharding
| Dimension | Details |
| --- | --- |
| **What** | Splitting a single database into independent partitions distributed across multiple server nodes. |
| **Why** | Scales write throughput horizontally. Modulo hashing or range boundaries determine row placements. |
| **Where** | Horizontal database scaling rounds. |
| **How** | Select a high-entropy "Shard Key" (e.g. `user_id` instead of `registration_date`) to prevent data hotspots. |

#### Topic 89: Distributed Transactions (Two-Phase Commit)
| Dimension | Details |
| --- | --- |
| **What** | Coordinating transactions across independent microservice databases. |
| **Why** | Guarantees atomic all-or-nothing changes across distributed systems. |
| **Where** | Distributed consistency loops. |
| **How** | 1. **Prepare Phase:** Coordinator polls nodes if ready to write. 2. **Commit Phase:** If all agree, coordinator triggers commit. If any fail, abort. |

#### Topic 90: Cache Stampede and Cache Avalanche
| Dimension | Details |
| --- | --- |
| **What** | Preventing massive database stress when high-traffic cache keys expire. |
| **Why** | If a hot key expires, thousands of concurrent requests fall back to DB simultaneously (Stampede). If Redis crashes, all traffic hits DB (Avalanche). |
| **Where** | Caching resilience loops. |
| **How** | Use mutual exclusion locks (Mutex) for cache misses, configure randomized cache expiration jitters, and deploy circuit breakers. |

---

## Module 5: Interview Execution, Mental Models, and Behavioral Strategy (Topic 91–100)

Technical proficiency alone does not guarantee an offer. Master the communication, behavioral, and negotiation loop to secure maximum total compensation.

### Topics 91–95: The Behavioral STAR Method & Execution

#### Topic 91: STAR Narrative Method: Designing the Core Technical Story
| Dimension | Details |
| --- | --- |
| **What** | Structuring your engineering accomplishments into **Situation, Task, Action, and Result** stories. |
| **Why** | Interviewers grade you on evidence-based competence. Clear, data-driven STAR stories prevent rambling and project strong leadership. |
| **Where** | Behavioral rounds (Googleyness, Leadership). |
| **How** | Pick 3 complex projects from your past. Quantify results (e.g., "reduced latency by 40%, saved $12k/month in cloud spend"). |

*   **STAR Story Structure Schema:**
    *   **Situation:** High-level context. *"Our core payment microservice was experiencing a 5% failure rate during Black Friday spikes."*
    *   **Task:** The constraint. *"I was tasked with identifying the bottleneck and reducing latencies by 50% under a 2-week deadline."*
    *   **Action:** Your direct engineering steps. *"I traced thread pools and identified a database connection pool starvation issue. I refactored the legacy synchronization blocks to use ConcurrentHashMap and precomputed hot categories."*
    *   **Result:** Quantified metrics. *"Failure rate dropped to 0.01%, latency decreased from 400ms to 90ms, saving $14,000 in monthly compute costs."*

#### Topic 92: STAR Narrative Method: Presenting Conflict and Resolution
| Dimension | Details |
| --- | --- |
| **What** | Structuring stories where you resolved disagreement over architecture or timeline constraints. |
| **Why** | Proves you are collaborative, open to feedback, and can resolve conflict without being abrasive or combative. |
| **Where** | Behavioral "conflict" questions. |
| **How** | Frame conflict around data-driven trade-offs, not personal styles. Show how you aligned with the team's goals. |

#### Topic 93: Handling Interviewer Pushback: Defending Architecture Trade-offs
| Dimension | Details |
| --- | --- |
| **What** | Reacting constructively when an interviewer critiques your system design choices. |
| **Why** | Proves technical maturity. Architecture is defined by trade-offs, not dogmatic perfect answers. |
| **Where** | System Design loop. |
| **How** | Acknowledge their point: *"That is a highly valid concern regarding write amplification. If we choose that path, we trade partition latency for better consistency. In our current read-heavy scale, we optimized for..."*

#### Topic 94: Handling Interviewer Pushback: Refactoring Live Code Under Time Pressure
| Dimension | Details |
| --- | --- |
| **What** | Adapting calmly when an interviewer adds new constraints mid-problem (e.g., "now what if the array is circular?"). |
| **Why** | Evaluates mental flexibility. Candidates who memorize static solutions typically freeze when modifications are introduced. |
| **Where** | Live coding assessments. |
| **How** | Do not stay silent. Verbalize: *"Adding circular constraints breaks our simple boundary. To handle this, we can virtually double the array using modulo indexing ($i \% N$)..."*

#### Topic 95: Collaborative Problem Solving: Verbalizing Complex Algorithmic Logic (Thinking Aloud)
| Dimension | Details |
| --- | --- |
| **What** | Continuously narrating your thought process while writing code on a shared document or whiteboard. |
| **Why** | Avoids the "silent freeze" (where you go quiet for 90 seconds while figuring out where to start, leaving the interviewer in the dark). |
| **Where** | Live technical loops. |
| **How** | State what you're thinking even on brute force: *"I am starting with a brute force nested loop approach to guarantee a correct baseline. This will run in $\mathcal{O}(N^2)$ time. Once this is solid, we can optimize search speeds to $\mathcal{O}(N)$ using a Map..."*

---

### Topics 96–100: System Design & Negotiation Execution

#### Topic 96: System Design: Gathering Requirements & Clarifying Scope
| Dimension | Details |
| --- | --- |
| **What** | Asking clarifying questions within the first 5 minutes of a system design interview before proposing architecture. |
| **Why** | Prevents the fatal error of building the "wrong" system. Proves you understand product requirements and scaling boundaries. |
| **Where** | System Design interview opening. |
| **How** | Establish functional boundaries (features) and non-functional bounds (QPS, DAU, latency, scale). |

*   **The Clarifying Checklist:**
    1. *"What is the active Daily Active User (DAU) count we are scaling for?"*
    2. *"Are we building both write (publishing) and read (timeline) pipelines, or focusing on one?"*
    3. *"Is the system read-heavy or write-heavy?"*
    4. *"Do we prioritize consistency or availability?"*

#### Topic 97: System Design: Back-of-the-Envelope Estimation Techniques
| Dimension | Details |
| --- | --- |
| **What** | Performing quick calculations to estimate scale boundaries (QPS, storage, bandwidth). |
| **Why** | Directly guides physical database and server allocation configurations (e.g., deciding if we need 1 database or a 100-shard cluster). |
| **Where** | System Design core calculations. |
| **How** | Convert daily metrics to per-second rates: 1 million requests/day $pprox$ 12 requests/second. 100 million requests/day $pprox$ 1,200 requests/second. |

*   **Estimation Cheat Sheet:**
    *   **DAU:** 100 Million
    *   **Writes/Day:** If 10% users post 1 photo per day = 10 Million writes/day
    *   **Average Write QPS:** 10,000,000 / 86,400 seconds/day $pprox$ **115 write requests/second**
    *   **Average Read QPS:** If 100% users view 10 posts = 1 Billion views/day = 1,000,000,000 / 86,400 $pprox$ **11,500 read requests/second**
    *   **Storage calculation:** If each post is 100KB: 10 Million posts * 100KB = 1TB of storage per day.

#### Topic 98: Negotiation Strategy: Navigating FAANG Salary Conversations
| Dimension | Details |
| --- | --- |
| **What** | Discussing compensation packages with recruiters to secure maximum total compensation (TC). |
| **Why** | Recruiters represent the employer's interests and seek to hire you at minimal cost. Your biggest leverage is being prepared with data. |
| **Where** | Post-offer loop. |
| **How** | Never state your salary first. Let them make the opening offer: *"I am incredibly excited about joining. I would prefer to see your team's valuation of my skills first before discussing specific figures..."*

#### Topic 99: Negotiation Strategy: Leveraging Multiple High-Tier Offers
| Dimension | Details |
| --- | --- |
| **What** | Using competing offers from tech giants to systematically escalate compensation figures. |
| **Why** | Competing offers represent the ultimate proof of value and reduce recruiter friction instantly. |
| **Where** | Multi-offer loops. |
| **How** | Communicate competing offers politely: *"I've received an offer from Google that is highly competitive on equity. However, I prefer your team's product vision. If you can match the equity components..."*

#### Topic 100: Mindset & Stress Management: Navigating Coding Interviews Calmly
| Dimension | Details |
| --- | --- |
| **What** | Maintaining emotional composure and avoiding panic freezes during high-stakes technical calls. |
| **Why** | Anxiety impairs reasoning and working memory. Composed, methodical problem-solvers consistently score better than panicked geniuses. |
| **Where** | Live interview execution. |
| **How** | Treat the interview as a collaborative design meeting alongside a colleague. Breathe, slow down your talking pace, and take physical pauses to process. |

*   **The Composure Mantra:** The interviewer wants you to succeed. They are not looking for flawless speed-typing; they are looking for a sensible, communicative, and professional colleague who works problems systematically.

---

### Conclusion: Your Practice Formula for Absolute Readiness
To make this material truly your own, follow the **1-2-1 practice formula** [cite: 22]:
1.  **Read and Understand the Pattern:** Learn the core logic, mental model, and code template first [cite: 20].
2.  **Verify Naming before Coding:** Open a list like Blind 75, spend 60 seconds naming the correct pattern first, and score yourself on your naming accuracy [cite: 110].
3.  **Practice out loud under a 30-minute clock:** Practice verbalizing your logic as you code, explaining trade-offs as if you were in the real room [cite: 111].

With deliberate practice, you move past the stress of the grind and step into the room with absolute confidence [cite: 780]. Happy coding!
