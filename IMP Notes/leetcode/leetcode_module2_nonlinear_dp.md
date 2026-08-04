# Module 2: Non-Linear & Dynamic Programming Subproblems (Java)
## Graphs, Trees, Union-Find, Backtracking, and DP Transitions

Welcome to the non-linear execution space. Trees and graphs form non-linear topologies that test your recursive tracking and connectivity management. Dynamic Programming tests your ability to break complex problems into overlapping subproblems, using state tables to avoid repetitive calculation [720, 753].

---

### Topic 9: Binary Tree DFS (Depth-First Search)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Recursive traversal going as deep as possible down each branch before backtracking [197, 713]. |
| **Why** | Efficiently tracks height or node paths using the system call stack [198, 713]. |
| **Where** | Standard initial screens at Google, Meta, and Microsoft [15, 33]. |
| **How** | Recursively call DFS on the left and right subtrees, bubbling up local computations [198, 201]. |

```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0; // Base case
        int leftDepth = maxDepth(root.left);
        int rightDepth = maxDepth(root.right);
        return Math.max(leftDepth, rightDepth) + 1; // Bubble up max height + self
    }
}
```

---

### Topic 10: Binary Tree BFS (Level-Order Traversal)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Layer-by-layer exploration of nodes using a First-In-First-Out (FIFO) Queue [190, 711]. |
| **Why** | Guarantees exploring all nodes at depth $D$ before moving to $D + 1$ [191, 711]. |
| **Where** | High frequency for tree level and boundary printing questions [191]. |
| **How** | In a loop, record queue size, iterate exactly that many times, poll nodes, and enqueue their non-null children [194, 195]. |

```java
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size(); // Freeze size of current level
            List<Integer> currentLevel = new ArrayList<>();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                currentLevel.add(node.val);
                
                if (node.left != null) queue.add(node.left);
                if (node.right != null) queue.add(node.right);
            }
            result.add(currentLevel);
        }
        return result;
    }
}
```

---

### Topic 11: Graph BFS & Grid Traversals (Number of Islands)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Exploring cardinal neighbors in a grid or graph, using visited tracking to prevent infinite loops [192, 202]. |
| **Why** | Maps perfectly to connectivity problems, ensuring optimal region expansion [192, 196]. |
| **Where** | Standard onsite question at Amazon, Meta, and Bloomberg [202, 714]. |
| **How** | Loop through grid. Upon hitting '1' (land), increment island count and initiate BFS/DFS to sink all connected land cells [204, 715]. |

```java
public class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    sinkIslandDFS(grid, r, c); // Sink the connected land
                }
            }
        }
        return count;
    }
    
    private void sinkIslandDFS(char[][] grid, int r, int c) {
        // Boundary and water checks
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == '0') {
            return;
        }
        grid[r][c] = '0'; // Sink cell
        sinkIslandDFS(grid, r + 1, c); // Down
        sinkIslandDFS(grid, r - 1, c); // Up
        sinkIslandDFS(grid, r, c + 1); // Right
        sinkIslandDFS(grid, r, c - 1); // Left
    }
}
```

---

### Topic 12: Topological Sort (Prerequisite Scheduling)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Linear ordering of directed acyclic graph (DAG) vertices based on dependency relationships [16, 761]. |
| **Why** | Detects cycles and schedules execution steps in $\mathcal{O}(V + E)$ time [16, 17]. |
| **Where** | Core backend system design and build-engine interview questions [16, 17]. |
| **How** | Track in-degrees of nodes. Enqueue nodes with in-degree 0. Process queue, decrementing in-degree of neighbors [192, 761]. |

```java
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        int[] inDegree = new int[numCourses];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        
        // Build dependency graph
        for (int[] pre : prerequisites) {
            adj.get(pre[1]).add(pre[0]);
            inDegree[pre[0]]++;
        }
        
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) {
                queue.add(i);
            }
        }
        
        int processedCount = 0;
        while (!queue.isEmpty()) {
            int course = queue.poll();
            processedCount++;
            for (int neighbor : adj.get(course)) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) {
                    queue.add(neighbor);
                }
            }
        }
        return processedCount == numCourses;
    }
}
```

---

### Topic 13: Union-Find (Disjoint Set Union)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | A highly optimized data structure tracking disjoint set partitions and set merges [136, 142]. |
| **Why** | Evaluates connectivity in near-constant $\mathcal{O}(\alpha(N))$ time using path compression and rank optimization [260]. |
| **Where** | High frequency for network connectivity and cluster merging [260]. |
| **How** | Maintain parent pointers and ranks. Perform set lookup recursively, flattening trees on the fly [260]. |

```java
public class Solution {
    class UnionFind {
        int[] parent;
        int[] rank;
        int count;
        
        public UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            count = n;
            for (int i = 0; i < n; i++) {
                parent[i] = i;
                rank[i] = 1;
            }
        }
        
        public int find(int i) {
            if (parent[i] == i) return i;
            return parent[i] = find(parent[i]); // Path compression
        }
        
        public boolean union(int i, int j) {
            int rootI = find(i);
            int rootJ = find(j);
            if (rootI != rootJ) {
                if (rank[rootI] > rank[rootJ]) {
                    parent[rootJ] = rootI;
                } else if (rank[rootI] < rank[rootJ]) {
                    parent[rootI] = rootJ;
                } else {
                    parent[rootJ] = rootI;
                    rank[rootI]++;
                }
                count--;
                return true;
            }
            return false;
        }
    }
}
```

---

### Topic 14: Backtracking Template (Subsets & Combinations)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Structured recursive exploration of a combinatoric search space, with undo actions [204, 762]. |
| **Why** | Prunes search paths early to prevent exploring impossible outcomes, reducing runtime [205, 206]. |
| **Where** | Standard onsite problem for combinations, permutations, and puzzle solver questions [13, 205]. |
| **How** | Loop through decisions. Add choice to current list, recurse, then remove choice (backtrack) [207, 718]. |

```java
import java.util.ArrayList;
import java.util.List;

public class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> results = new ArrayList<>();
        backtrack(results, new ArrayList<>(), nums, 0);
        return results;
    }
    
    private void backtrack(List<List<Integer>> results, List<Integer> current, int[] nums, int start) {
        // Deep copy of state and append to output set
        results.add(new ArrayList<>(current));
        
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]); // Choose
            backtrack(results, current, nums, i + 1); // Explore
            current.remove(current.size() - 1); // Unchoose (Backtrack)
        }
    }
}
```

---

### Topic 15: Dynamic Programming - 0/1 Knapsack
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Selecting bounded items with given weights and values to maximize total value under a weight constraint [753]. |
| **Why** | Breaks redundant exploration, lowering runtime from exponential $\mathcal{O}(2^N)$ to linear-table $\mathcal{O}(N \cdot W)$ [121, 753]. |
| **Where** | Core dynamic programming question at Amazon and Meta [254, 255]. |
| **How** | Build a 2D state transition table `dp[i][w] = Math.max(dp[i-1][w], dp[i-1][w - weight] + value)` [121, 721]. |

```java
public class Solution {
    public int solveKnapsack(int[] values, int[] weights, int capacity) {
        int n = values.length;
        int[][] dp = new int[n][capacity + 1];
        
        // Base case initialization
        for (int w = 0; w <= capacity; w++) {
            if (weights[0] <= w) {
                dp[0][w] = values[0];
            }
        }
        
        for (int i = 1; i < n; i++) {
            for (int w = 1; w <= capacity; w++) {
                int skip = dp[i - 1][w];
                int take = 0;
                if (weights[i] <= w) {
                    take = values[i] + dp[i - 1][w - weights[i]];
                }
                dp[i][w] = Math.max(skip, take); // State transition decision
            }
        }
        return dp[n - 1][capacity];
    }
}
```
