# Days 41–44: Master Subsets & Combinatorial Backtracking (The Definitive Guide)

Welcome to the **Subsets & Combinatorial Backtracking Pattern** Deep Dive. This guide equips you with the mental frameworks, templates, and walk-throughs to systematically solve combinatorial search problems.

---

### 1. Conceptual Deep Dive: The Recursion Tree as a State Machine

Backtracking is a search algorithm that models the solution space as a **directed acyclic graph (DAG) or recursion tree** and explores it using Depth-First Search (DFS). When the search path hits a dead-end or completes a state, the algorithm **backtracks** (undoes the last action) to explore alternative choices.

The state of a backtracking algorithm can be modeled as:
$$\text{State} = (\text{current\_path}, \text{remaining\_options}, \text{visited\_records})$$

#### Key Mechanics:
1. **Decision Decision (Branching):** At any node in the recursion tree, you have multiple candidates.
2. **State Modification (Choosing):** Append a candidate to the `current_path`, mark it as visited, and advance the recursion level.
3. **State Restoration (Backtracking):** Upon return from the recursive child, you *must* undo the choice: pop the candidate from `current_path`, unmark it from `visited_records`, and continue the loop to the next candidate.

```
                  [Root: empty path []]
                /          |          \
            Pick 1       Pick 2       Pick 3
            /              |              \
         [1]              [2]             [3]
       /     \          /     \         /     \
    Pick 2  Pick 3   Pick 1  Pick 3   Pick 1  Pick 2
     /         \      /         \      /         \
  [1, 2]     [1, 3] [2, 1]     [2, 3] [3, 1]     [3, 2]
```

---

### 2. The Universal Backtracking Skeletons

#### A. Standard Subset Generation (Pick / Not Pick)
Used when sequence ordering does not matter and choices are binary (either element $i$ is included or excluded).

```python
from typing import List

def generate_subsets(nums: List[int]) -> List[List[int]]:
    results = []
    
    def backtrack(index: int, current_path: List[int]):
        # Base case: We processed all elements
        if index == len(nums):
            results.append(list(current_path))  # Store a deep copy
            return
            
        # Path Choice 1: Include nums[index]
        current_path.append(nums[index])
        backtrack(index + 1, current_path)
        current_path.pop()  # Backtrack step: Undo the choice
        
        # Path Choice 2: Exclude nums[index]
        backtrack(index + 1, current_path)
        
    backtrack(0, [])
    return results
```

#### B. Permutations & Combinations (Loop-Based State Machine)
Used when looking for permutations (order matters) or combinations of size $k$.

```python
def permute(nums: List[int]) -> List[List[int]]:
    results = []
    visited = [False] * len(nums)
    
    def backtrack(current_path: List[int]):
        # Base case: path is complete
        if len(current_path) == len(nums):
            results.append(list(current_path))
            return
            
        for i in range(len(nums)):
            if visited[i]:
                continue  # Skip already selected elements
                
            # Choose
            visited[i] = True
            current_path.append(nums[i])
            
            # Recurse
            backtrack(current_path)
            
            # Un-choose (Backtrack)
            current_path.pop()
            visited[i] = False
            
    backtrack([])
    return results
```

---

### 3. Instant Pattern Recognition (Trigger Cues)

* • **"Find all..."** combinations, subsets, arrangements, or paths.
* • **"Generate all permutations of size $k$..."**
* • **Input constraints are extremely small:** $n \le 20$ (often signals $O(2^n)$ or $O(n!)$ complexity bounds).
* • **Requires structural validation**: Sudoku, crossword, or N-Queens puzzle validation states.

---

### 4. 9 Vetted LeetCode Drills: Fleshed Out

#### LC #257: Binary Tree Paths (Easy)
* **Trigger:** Traverse tree from root to all leaves, recording string representations of paths.
* **Trace:** Depth-First traversal; build path string step-by-step; append to results upon hitting leaf.
* **Code:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def binaryTreePaths(root: TreeNode) -> List[str]:
    paths = []
    if not root:
        return paths
        
    def backtrack(node: TreeNode, current_path: List[str]):
        current_path.append(str(node.val))
        # If it's a leaf node, save path
        if not node.left and not node.right:
            paths.append("->".join(current_path))
        else:
            if node.left:
                backtrack(node.left, current_path)
            if node.right:
                backtrack(node.right, current_path)
        current_path.pop()  # Backtrack
        
    backtrack(root, [])
    return paths
```
* **Complexity:** Time: $O(n)$ where $n$ is the number of nodes. Space: $O(h)$ where $h$ is tree height (recursion stack).

#### LC #1863: Sum of All Subset XOR Totals (Easy)
* **Trigger:** Construct all subsets, compute XOR total for each, and sum them.
* **Trace:** Use Pick / Not Pick choice structure to recursively accumulate XOR state.
* **Code:**
```python
def subsetXORSum(nums: List[int]) -> int:
    def backtrack(index: int, current_xor: int) -> int:
        if index == len(nums):
            return current_xor
        # Pick the current element OR Do Not Pick
        pick = backtrack(index + 1, current_xor ^ nums[index])
        no_pick = backtrack(index + 1, current_xor)
        return pick + no_pick
        
    return backtrack(0, 0)
```
* **Complexity:** Time: $O(2^n)$ | Space: $O(n)$ stack depth.

#### LC #401: Binary Watch (Easy)
* **Trigger:** Read an active LED count to generate possible hour/minute settings.
* **Trace:** 10 LEDs total (4 for hours, 6 for minutes). Choose $k$ LEDs to be active and validate sums.
* **Code:**
```python
def readBinaryWatch(turnedOn: int) -> List[str]:
    results = []
    # Hour LEDs (1, 2, 4, 8) and Minute LEDs (1, 2, 4, 8, 16, 32)
    leds = [1, 2, 4, 8, 1, 2, 4, 8, 16, 32]
    
    def backtrack(idx: int, num_on: int, hr: int, mnt: int):
        if hr >= 12 or mnt >= 60:
            return
        if num_on == turnedOn:
            results.append(f"{hr}:{mnt:02d}")
            return
        for i in range(idx, len(leds)):
            if i < 4:
                backtrack(i + 1, num_on + 1, hr + leds[i], mnt)
            else:
                backtrack(i + 1, num_on + 1, hr, mnt + leds[i - 4])
                
    backtrack(0, 0, 0, 0)
    return results
```
* **Complexity:** Time: $O(1)$ (bounded by constant 10 slots) | Space: $O(1)$.

#### LC #78: Subsets (Medium)
* **Trigger:** Generate all possible power sets of unique integers.
* **Trace:** Build combination arrays, saving path snapshots at every node level.
* **Code:**
```python
def subsets(nums: List[int]) -> List[List[int]]:
    results = []
    
    def backtrack(start: int, path: List[int]):
        results.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()  # Backtrack
            
    backtrack(0, [])
    return results
```
* **Complexity:** Time: $O(n \cdot 2^n)$ | Space: $O(n)$ space for path storage.

#### LC #46: Permutations (Medium)
* **Trigger:** Produce all ordered permutations of a list of unique numbers.
* **Trace:** Keep a visited map, try each unselected value, recurse, and unmark.
* **Code:**
```python
def permute(nums: List[int]) -> List[List[int]]:
    results = []
    visited = [False] * len(nums)
    
    def backtrack(path: List[int]):
        if len(path) == len(nums):
            results.append(list(path))
            return
        for i in range(len(nums)):
            if not visited[i]:
                visited[i] = True
                path.append(nums[i])
                backtrack(path)
                path.pop()
                visited[i] = False
                
    backtrack([])
    return results
```
* **Complexity:** Time: $O(n \cdot n!)$ | Space: $O(n)$ recursion stack.

#### LC #39: Combination Sum (Medium)
* **Trigger:** Find all unique combinations of candidates that sum to a target. Can reuse candidates indefinitely.
* **Trace:** Allow duplicate recursion calls on index $i$ while reducing targets.
* **Code:**
```python
def combinationSum(candidates: List[int], target: int) -> List[List[int]]:
    results = []
    
    def backtrack(start: int, path: List[int], current_sum: int):
        if current_sum == target:
            results.append(list(path))
            return
        if current_sum > target:
            return
            
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            # Reuse same index 'i' to allow dynamic infinite choices
            backtrack(i, path, current_sum + candidates[i])
            path.pop()
            
    backtrack(0, [], 0)
    return results
```
* **Complexity:** Time: $O(k^{T/M})$ where $k$ is candidate size, $T$ is target, $M$ is minimum element value | Space: $O(T/M)$ path height.

#### LC #77: Combinations (Medium)
* **Trigger:** Return all possible combinations of $k$ numbers chosen from $1 \dots n$.
* **Trace:** Recursively pick values, stopping when path size equals $k$.
* **Code:**
```python
def combine(n: int, k: int) -> List[List[int]]:
    results = []
    
    def backtrack(start: int, path: List[int]):
        if len(path) == k:
            results.append(list(path))
            return
        # Optimization: Prune search if remaining choices are insufficient
        for i in range(start, n + 1 - (k - len(path)) + 1):
            path.append(i)
            backtrack(i + 1, path)
            path.pop()
            
    backtrack(1, [])
    return results
```
* **Complexity:** Time: $O(inom{n}{k})$ | Space: $O(k)$ active call stack.

#### LC #79: Word Search (Medium)
* **Trigger:** Locate word matches in a 2D grid of letters using adjacent coordinates.
* **Trace:** DFS grid walk. Mark characters to prevent backtracking loops, then restore states.
* **Code:**
```python
def exist(board: List[List[str]], word: str) -> bool:
    rows, cols = len(board), len(board[0])
    
    def backtrack(r: int, c: int, idx: int) -> bool:
        if idx == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[idx]:
            return False
            
        # Temporarily mark coordinate as visited
        temp = board[r][c]
        board[r][c] = "#"
        
        # Walk 4 directions
        found = (backtrack(r + 1, c, idx + 1) or
                 backtrack(r - 1, c, idx + 1) or
                 backtrack(r, c + 1, idx + 1) or
                 backtrack(r, c - 1, idx + 1))
                 
        # Backtrack: Restore state
        board[r][c] = temp
        return found
        
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0] and backtrack(r, c, 0):
                return True
    return False
```
* **Complexity:** Time: $O(R \cdot C \cdot 3^L)$ where $L$ is word length | Space: $O(L)$ recursion height.

#### LC #51: N-Queens (Hard)
* **Trigger:** Place $N$ non-attacking queens on an $N 	imes N$ chessboard.
* **Trace:** Track blocked columns, positive diagonals ($r + c$), and negative diagonals ($r - c$).
* **Code:**
```python
def solveNQueens(n: int) -> List[List[str]]:
    results = []
    board = [["."] * n for _ in range(n)]
    
    cols = set()
    pos_diag = set()  # r + c
    neg_diag = set()  # r - c
    
    def backtrack(r: int):
        if r == n:
            copy = ["".join(row) for row in board]
            results.append(copy)
            return
            
        for c in range(n):
            if c in cols or (r + c) in pos_diag or (r - c) in neg_diag:
                continue
                
            # Place Queen
            board[r][c] = "Q"
            cols.add(c)
            pos_diag.add(r + c)
            neg_diag.add(r - c)
            
            # Recurse
            backtrack(r + 1)
            
            # Backtrack (Undo block states)
            board[r][c] = "."
            cols.remove(c)
            pos_diag.remove(r + c)
            neg_diag.remove(r - c)
            
    backtrack(0)
    return results
```
* **Complexity:** Time: $O(n!)$ | Space: $O(n)$ storage sets and call depth.

---

### 5. Common Interview Pitfalls

1. **Forgetting to Deep Copy Path Arrays:** Passing `results.append(path)` instead of `results.append(list(path))` or `results.append(path[:])`. The variable `path` is passed by reference, meaning modifications in later recursion branches will rewrite already recorded values, resulting in an output of empty arrays.
2. **Infinite Recursion / Lack of Base Case:** Forgetting to return upon hitting valid paths or targets, resulting in `RecursionError` or infinite execution.
3. **Leaving Blocked States Active:** Neglecting to clear visited states or coordinates on backtracking paths, leading to missing correct subsets.

---

### 6. Whiteboard Defense Checklist

- [ ] Does your algorithm **make a copy** of the accumulator array before saving it to your global results list?
- [ ] Have you verified your **state restoration step (backtrack)** clears every change made in the corresponding **state selection step**?
- [ ] If sorting input is allowed, did you prune duplicate branches by comparing `arr[i] == arr[i - 1]` to reduce search-space sizes?
- [ ] Does your recursion tree have a explicit, bounded exit condition preventing index overflows?
