# Days 29–32: Master Tree Breadth-First Search (The Definitive Guide)

Welcome to the **Tree Breadth-First Search (BFS)** master training file. Tree BFS explores nodes level-by-level (horizontally) rather than branching deeply. In interviews, this is the premier pattern for shortest-path queries on unweighted trees or horizontal relationships.

---

### 1. Core Mechanics & State Machine Visualization

Tree BFS works like a "ripple" on a pond, starting at the center (root) and expanding outward one ring (depth level) at a time. To implement this without merging levels together, we use a **Level-By-Level Queue Snapshot** mechanism.

```
       [A]           Level 0 (Depth 1) - Queue: [A]
      /   \
    [B]   [C]        Level 1 (Depth 2) - Queue: [B, C]
    / \     \
  [D] [E]   [F]      Level 2 (Depth 3) - Queue: [D, E, F]
```

At each level:
1. Record the queue size: `level_size = len(queue)`. This size represents *exactly* the nodes residing in the current level.
2. Run a bounded loop *exactly* `level_size` times.
3. Inside the loop, pop the front node, record its value, and insert its children into the queue.
4. By using the snapshot size, nodes inserted in step 3 are shielded and won't be processed until the next outer iteration.

---

### 2. The Universal Tree BFS Template

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def tree_bfs_template(root: TreeNode):
    if not root:
        return []
        
    result = []
    queue = deque([root])  # FIFO Queue
    
    while queue:
        level_size = len(queue)  # Core Snapshot Step
        current_level_nodes = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level_nodes.append(node.val)
            
            # Push left child if present
            if node.left:
                queue.append(node.left)
            # Push right child if present
            if node.right:
                queue.append(node.right)
                
        result.append(current_level_nodes)
        
    return result
```

---

### 3. Vetted Problem Deep-Dives

#### **1. LC #104 - Maximum Depth of Binary Tree (BFS)**
* **Trigger Cue**: Find total depth/height of the tree level-by-level.
* **Python Code**:
```python
def maxDepth(root: TreeNode) -> int:
    if not root:
        return 0
    queue = deque([root])
    depth = 0
    while queue:
        depth += 1
        for _ in range(len(queue)):
            node = queue.popleft()
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
    return depth
```
* **Complexity**: Time: $O(N)$ | Space: $O(W)$ where $W$ is maximum width of tree (up to $N/2$).

#### **2. LC #111 - Minimum Depth of Binary Tree**
* **Trigger Cue**: "Shortest path" from root to leaf node. BFS is faster than DFS here because we exit as soon as we hit the first leaf node.
* **Python Code**:
```python
def minDepth(root: TreeNode) -> int:
    if not root:
        return 0
    queue = deque([(root, 1)])
    while queue:
        node, depth = queue.popleft()
        # First leaf node detected
        if not node.left and not node.right:
            return depth
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    return 0
```
* **Complexity**: Time: $O(N)$ (worst case) or $O(2^{	ext{min\_depth}})$ | Space: $O(W)$.

#### **3. LC #637 - Average of Levels in Binary Tree**
* **Trigger Cue**: Calculate averages of each level queue size.
* **Python Code**:
```python
def averageOfLevels(root: TreeNode) -> list[float]:
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        level_sum = 0
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level_sum / level_size)
    return result
```
* **Complexity**: Time: $O(N)$ | Space: $O(W)$.

#### **4. LC #102 - Binary Tree Level Order Traversal**
* **Trigger Cue**: Collect levels sequentially. (Standard BFS Template matches this perfectly).
* **Python Code**:
```python
def levelOrder(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result
```

#### **5. LC #107 - Binary Tree Level Order Traversal II**
* **Trigger Cue**: Bottom-up level order grouping.
* **Python Code**:
```python
def levelOrderBottom(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
    result = deque()
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.appendleft(level)  # Prepend levels
    return list(result)
```

#### **6. LC #103 - Binary Tree Zigzag Level Order Traversal**
* **Trigger Cue**: Group levels alternating left-to-right and right-to-left.
* **Python Code**:
```python
def zigzagLevelOrder(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
    result = []
    queue = deque([root])
    left_to_right = True
    while queue:
        level_size = len(queue)
        level = deque()
        for _ in range(level_size):
            node = queue.popleft()
            if left_to_right:
                level.append(node.val)
            else:
                level.appendleft(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(list(level))
        left_to_right = not left_to_right
    return result
```

#### **7. LC #199 - Binary Tree Right Side View**
* **Trigger Cue**: Collect the last node of each level queue.
* **Python Code**:
```python
def rightSideView(root: TreeNode) -> list[int]:
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        for i in range(level_size):
            node = queue.popleft()
            if i == level_size - 1:  # Absolute last element of current level
                result.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
    return result
```

#### **8. LC #116 - Populating Next Right Pointers in Each Node**
* **Trigger Cue**: Link adjacent horizontal nodes.
* **Python Code**:
```python
def connect(root: 'Node') -> 'Node':
    if not root:
        return root
    queue = deque([root])
    while queue:
        level_size = len(queue)
        prev = None
        for i in range(level_size):
            node = queue.popleft()
            if prev:
                prev.next = node
            prev = node
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        prev.next = None  # Last node in level points to Null
    return root
```

#### **9. LC #127 - Word Ladder (Hard)**
* **Trigger Cue**: Find shortest path of transformations from a beginWord to endWord where each transition differs by 1 character. We treat word transitions as unweighted graph edges and solve via Multi-branch BFS.
* **Python Code**:
```python
from collections import defaultdict

def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:
    if endWord not in wordList:
        return 0
        
    L = len(beginWord)
    all_combo_dict = defaultdict(list)
    for word in wordList:
        for i in range(L):
            all_combo_dict[word[:i] + "*" + word[i+1:]].append(word)
            
    queue = deque([(beginWord, 1)])
    visited = {beginWord}
    
    while queue:
        current_word, level = queue.popleft()
        for i in range(L):
            intermediate_word = current_word[:i] + "*" + current_word[i+1:]
            for word in all_combo_dict[intermediate_word]:
                if word == endWord:
                    return level + 1
                if word not in visited:
                    visited.add(word)
                    queue.append((word, level + 1))
            all_combo_dict[intermediate_word] = []  # Clear to avoid re-visiting
    return 0
```
* **Complexity**: Time: $O(M^2 	imes N)$ where $M$ is word length and $N$ is word list size | Space: $O(M^2 	imes N)$.

---

### 4. Common Interview Pitfalls

1. **Changing Queue Length**: Writing `for _ in range(len(queue))` directly in some languages if you are appending mid-loop can cause issues. Always capture `level_size = len(queue)` as a distinct variable before starting the inner loop.
2. **Infinite Loops on Circular Graphs**: Trees have no cycles, but if the problem is a graph modeled as a tree (e.g., Word Ladder), you **must** use a `visited` set to avoid infinite cycles.

---

### 5. Interview Defense Checklist
* [ ] Did I handle the `not root` empty edge case at the top?
* [ ] Is the BFS queue initialized with the root node?
* [ ] Did I snapshot the queue size before starting the horizontal level traversal?
