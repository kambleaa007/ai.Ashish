# Days 33–36: Master Tree Depth-First Search (The Definitive Guide)

Welcome to the **Tree Depth-First Search (DFS)** master training file. Tree DFS explores tree nodes deeply along branch trajectories before backtracking. This pattern is highly effective for path-finding, ancestral evaluation, or bubbling up properties from sub-tree children to parent roots.

---

### 1. Core Mechanics & State Machine Visualization

Tree DFS relies on the **execution call stack** (or an explicit Stack structure) to traverse the tree. Because execution goes deep down to leaf nodes first, variables are computed bottom-up or passed top-down.

```
       [A]           DFS Path: A -> B -> D -> E -> C -> F
      /   \          
    [B]   [C]        Pre-order:  Process node, then Left, then Right.
    / \     \       Post-order: Process Left, then Right, then Bubble up to parent.
  [D] [E]   [F]      In-order:   Process Left, then Current, then Right.
```

There are two primary paradigms in Tree DFS:
1. **Top-Down (Pre-order/Pass down)**: Pass information down to children via recursive function arguments (e.g., Path Sum, Valid BST).
2. **Bottom-Up (Post-order/Bubble up)**: Collect evaluations from left and right children and combine them at the parent node (e.g., Lowest Common Ancestor, Tree Diameter, Path Sum max).

---

### 2. The Universal Tree DFS Templates

#### **Top-Down Paradigm Template**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def dfs_top_down_template(node, current_path_state):
    if not node:
        return
        
    # Phase 1: Update path state using current node's value
    new_state = update_state(current_path_state, node.val)
    
    # Phase 2: Check leaf node criteria
    if not node.left and not node.right:
        check_path_validity(new_state)
        return
        
    # Phase 3: Recurse down children
    dfs_top_down_template(node.left, new_state)
    dfs_top_down_template(node.right, new_state)
```

#### **Bottom-Up Paradigm Template**
```python
def dfs_bottom_up_template(node):
    if not node:
        return default_value  # Base Case (e.g., 0, Null, False)
        
    # Phase 1: Recurse deeply to leaf boundaries
    left_val = dfs_bottom_up_template(node.left)
    right_val = dfs_bottom_up_template(node.right)
    
    # Phase 2: Process results bubbled up from children at parent level
    merged_val = combine_subtrees(left_val, right_val, node.val)
    
    return merged_val
```

---

### 3. Vetted Problem Deep-Dives

#### **1. LC #104 - Maximum Depth of Binary Tree**
* **Trigger Cue**: Bubble up the maximum height from child nodes.
* **Python Code**:
```python
def maxDepth(root: TreeNode) -> int:
    if not root:
        return 0
    # Bottom-up depth calculation
    left_depth = maxDepth(root.left)
    right_depth = maxDepth(root.right)
    return max(left_depth, right_depth) + 1
```
* **Complexity**: Time: $O(N)$ | Space: $O(H)$ where $H$ is the tree height.

#### **2. LC #112 - Path Sum**
* **Trigger Cue**: Match target sum exactly from root to leaf by passing remaining sum downward.
* **Python Code**:
```python
def hasPathSum(root: TreeNode, targetSum: int) -> bool:
    if not root:
        return False
    # Base case: Leaf reached. Does final value match sum?
    if not root.left and not root.right:
        return targetSum == root.val
    # Pass down remainder sum
    remainder = targetSum - root.val
    return hasPathSum(root.left, remainder) or hasPathSum(root.right, remainder)
```
* **Complexity**: Time: $O(N)$ | Space: $O(H)$.

#### **3. LC #226 - Invert Binary Tree**
* **Trigger Cue**: Swap left and right child recursive tree mappings bottom-up.
* **Python Code**:
```python
def invertTree(root: TreeNode) -> TreeNode:
    if not root:
        return None
    # Bottom-up recursion
    left = invertTree(root.left)
    right = invertTree(root.right)
    root.left = right
    root.right = left
    return root
```
* **Complexity**: Time: $O(N)$ | Space: $O(H)$.

#### **4. LC #113 - Path Sum II**
* **Trigger Cue**: Track all absolute path configurations matching root-to-leaf target value.
* **Python Code**:
```python
def pathSum(root: TreeNode, targetSum: int) -> list[list[int]]:
    result = []
    
    def dfs(node, remainder, path):
        if not node:
            return
        path.append(node.val)
        if not node.left and not node.right and remainder == node.val:
            result.append(list(path))  # Create distinct copy of valid path
        else:
            dfs(node.left, remainder - node.val, path)
            dfs(node.right, remainder - node.val, path)
        path.pop()  # Backtrack step to clean stack state
        
    dfs(root, targetSum, [])
    return result
```
* **Complexity**: Time: $O(N^2)$ (due to copying paths of length $H$) | Space: $O(H)$.

#### **5. LC #129 - Sum Root to Leaf Numbers**
* **Trigger Cue**: Accumulate path digits representing base-10 coordinates.
* **Python Code**:
```python
def sumNumbers(root: TreeNode) -> int:
    def dfs(node, current_sum):
        if not node:
            return 0
        current_sum = current_sum * 10 + node.val
        if not node.left and not node.right:
            return current_sum
        return dfs(node.left, current_sum) + dfs(node.right, current_sum)
        
    return dfs(root, 0)
```

#### **6. LC #236 - Lowest Common Ancestor of a Binary Tree**
* **Trigger Cue**: Bubble up matched nodes to find common intersection points.
* **Python Code**:
```python
def lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    if not root or root == p or root == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    
    if left and right:
        return root  # Split point discovered
    return left if left else right
```

#### **7. LC #98 - Validate Binary Search Tree**
* **Trigger Cue**: Pass down valid ranges recursively to enforce BST structural properties.
* **Python Code**:
```python
def isValidBST(root: TreeNode) -> bool:
    def validate(node, min_val, max_val):
        if not node:
            return True
        if not (min_val < node.val < max_val):
            return False
        return (validate(node.left, min_val, node.val) and 
                validate(node.right, node.val, max_val))
                
    return validate(root, float('-inf'), float('inf'))
```

#### **8. LC #105 - Construct Binary Tree from Preorder and Inorder Traversal**
* **Trigger Cue**: Segment array indices to reconstruct subtree positions recursively.
* **Python Code**:
```python
def buildTree(preorder: list[int], inorder: list[int]) -> TreeNode:
    inorder_map = {val: i for i, val in enumerate(inorder)}
    pre_idx = 0
    
    def helper(left_idx, right_idx):
        nonlocal pre_idx
        if left_idx > right_idx:
            return None
            
        root_val = preorder[pre_idx]
        root = TreeNode(root_val)
        pre_idx += 1
        
        mid = inorder_map[root_val]
        root.left = helper(left_idx, mid - 1)
        root.right = helper(mid + 1, right_idx)
        return root
        
    return helper(0, len(inorder) - 1)
```

#### **9. LC #124 - Binary Tree Maximum Path Sum (Hard)**
* **Trigger Cue**: Compute local maximum branches bottom-up, updating a global tracking variable at each parent traversal.
* **Python Code**:
```python
def maxPathSum(root: TreeNode) -> int:
    max_sum = float('-inf')
    
    def dfs_max_gain(node):
        nonlocal max_sum
        if not node:
            return 0
            
        # Ignore sub-paths returning negative sum values
        left_gain = max(dfs_max_gain(node.left), 0)
        right_gain = max(dfs_max_gain(node.right), 0)
        
        # Paths can split and bridge through this node
        local_path_sum = node.val + left_gain + right_gain
        max_sum = max(max_sum, local_path_sum)
        
        # Only bubble up the single best linear path extension
        return node.val + max(left_gain, right_gain)
        
    dfs_max_gain(root)
    return max_sum
```
* **Complexity**: Time: $O(N)$ | Space: $O(H)$ for system call stack depth.

---

### 4. Common Interview Pitfalls

1. **Stack Overflow on Skewed Trees**: Skewed tree shapes (e.g., linked list trees) cause recursion depths of $O(N)$, which can exceed system recursion boundaries. Discuss this risk during interviews.
2. **Losing track of backtracks**: When finding path lists, failing to pop elements from list parameters after recursion returns (`path.pop()`) will lead to corrupted path outputs.

---

### 5. Interview Defense Checklist
* [ ] Did I define base case termination logic correctly?
* [ ] Do I understand whether my variables should pass top-down (arguments) or bottom-up (return values)?
* [ ] Have I accounted for unbalanced tree shapes in my space complexity analysis?
