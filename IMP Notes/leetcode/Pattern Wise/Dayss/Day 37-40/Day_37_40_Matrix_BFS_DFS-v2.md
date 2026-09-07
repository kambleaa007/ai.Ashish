# Days 37–40: Master Matrix DFS & BFS (The Definitive Guide)

Welcome to the **Matrix DFS & BFS** master training file. 2D grids and binary matrices represent graph problems where cell coordinates are vertices, and adjacent neighbors (Up, Down, Left, Right) represent edges.

---

### 1. Core Mechanics & State Machine Visualization

Grid traversals can be performed using either Depth-First Search (via recursion stack) or Breadth-First Search (via explicit queue). The most important considerations are **boundary checks** and **state mutations** to prevent infinite loop traps.

```
Directions:     Up (-1, 0)
                 ▲
Left (0, -1) ◄──(r, c)──► Right (0, 1)
                 ▼
                Down (1, 0)
```

We represent direction changes using offset vectors:
`directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]`

To prevent infinite loops, we must track visited cells. There are two primary techniques:
1. **In-place Grid Modification**: Modify visited values directly in the source array (e.g., swap `"1"` to `"0"` in an island search) to bypass extra space allocations.
2. **Visited Hash Set**: Add tuple coordinates `(r, c)` to a Set structure when in-place array modification is prohibited.

---

### 2. The Universal Matrix Traversals

#### **Matrix DFS Template (Grid Island Model)**
```python
def matrix_dfs_template(grid):
    if not grid or not grid[0]:
        return
    rows, cols = len(grid), len(grid[0])
    
    def dfs(r, c):
        # 1. Boundary checking and base termination triggers
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return
            
        # 2. In-place modification to mark cell as visited
        grid[r][c] = "0"
        
        # 3. Explore 4 directional adjacent nodes
        dfs(r + 1, c) # Down
        dfs(r - 1, c) # Up
        dfs(r, c + 1) # Right
        dfs(r, c - 1) # Left
        
    # Example outer loop scan
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                dfs(r, c)
```

#### **Matrix Multi-Source BFS Template**
```python
from collections import deque

def multi_source_bfs_template(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    visited = set()
    
    # Push all initial starting points into the queue simultaneously
    for r in range(rows):
        for c in range(cols):
            if is_starting_trigger(grid[r][c]):
                queue.append((r, c, 0)) # row, col, current_step
                visited.add((r, c))
                
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while queue:
        r, c, step = queue.popleft()
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited:
                if is_valid_transition(grid[nr][nc]):
                    visited.add((nr, nc))
                    queue.append((nr, nc, step + 1))
```

---

### 3. Vetted Problem Deep-Dives

#### **1. LC #733 - Flood Fill**
* **Trigger Cue**: Color adjacent cells having the original matching target color.
* **Python Code**:
```python
def floodFill(image: list[list[int]], sr: int, sc: int, color: int) -> list[list[int]]:
    rows, cols = len(image), len(image[0])
    start_color = image[sr][sc]
    if start_color == color:
        return image
        
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or image[r][c] != start_color:
            return
        image[r][c] = color
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    dfs(sr, sc)
    return image
```
* **Complexity**: Time: $O(R 	imes C)$ | Space: $O(R 	imes C)$ for call stack.

#### **2. LC #463 - Island Perimeter**
* **Trigger Cue**: Count boundaries of island cells that face either water or grid boundaries.
* **Python Code**:
```python
def islandPerimeter(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    perimeter = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                perimeter += 4
                if r > 0 and grid[r-1][c] == 1:
                    perimeter -= 2  # Shared vertical edge
                if c > 0 and grid[r][c-1] == 1:
                    perimeter -= 2  # Shared horizontal edge
    return perimeter
```
* **Complexity**: Time: $O(R 	imes C)$ | Space: $O(1)$.

#### **3. LC #542 - 01 Matrix (Warm-up)**
* **Trigger Cue**: Find shortest path of every coordinate cell to 0. (Solved using Multi-source BFS starting with 0 cells).
* **Python Code**:
```python
def updateMatrix(mat: list[list[int]]) -> list[list[int]]:
    rows, cols = len(mat), len(mat[0])
    queue = deque()
    dist = [[float('inf')] * cols for _ in range(rows)]
    
    for r in range(rows):
        for c in range(cols):
            if mat[r][c] == 0:
                dist[r][c] = 0
                queue.append((r, c))
                
    directions = [(-1,0), (1,0), (0,-1), (0,1)]
    while queue:
        r, c = queue.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                if dist[nr][nc] > dist[r][c] + 1:
                    dist[nr][nc] = dist[r][c] + 1
                    queue.append((nr, nc))
    return dist
```

#### **4. LC #200 - Number of Islands**
* **Trigger Cue**: Scan grid and count total disjoint coordinate island regions.
* **Python Code**:
```python
def numIslands(grid: list[list[str]]) -> int:
    if not grid or not grid[0]:
        return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == "0":
            return
        grid[r][c] = "0"  # In-place visited mark
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                islands += 1
                dfs(r, c)
    return islands
```

#### **5. LC #695 - Max Area of Island**
* **Trigger Cue**: Return the maximum size of connected coordinate groups.
* **Python Code**:
```python
def maxAreaOfIsland(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    max_area = 0
    
    def dfs(r, c) -> int:
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0:
            return 0
        grid[r][c] = 0
        return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1)
        
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                max_area = max(max_area, dfs(r, c))
    return max_area
```

#### **6. LC #130 - Surrounded Regions**
* **Trigger Cue**: Protect regions connected to matrix borders, then flip remaining cells.
* **Python Code**:
```python
def solve(grid: list[list[str]]) -> None:
    if not grid or not grid[0]:
        return
    rows, cols = len(grid), len(grid[0])
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != 'O':
            return
        grid[r][c] = 'E'  # Mark as Exempt from flipping
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    # Phase 1: Exempt O's bordering the matrix limits
    for r in range(rows):
        dfs(r, 0)
        dfs(r, cols - 1)
    for c in range(cols):
        dfs(0, c)
        dfs(rows - 1, c)
        
    # Phase 2: Flip 'O' to 'X', and restore exempted 'E' back to 'O'
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 'O':
                grid[r][c] = 'X'
            elif grid[r][c] == 'E':
                grid[r][c] = 'O'
```

#### **7. LC #994 - Rotting Oranges**
* **Trigger Cue**: Multi-source BFS spreading infection level-by-level (minute-by-minute) until all fresh oranges are reached.
* **Python Code**:
```python
def orangesRotting(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))
            elif grid[r][c] == 1:
                fresh_count += 1
                
    if fresh_count == 0:
        return 0
        
    minutes = 0
    directions = [(-1,0), (1,0), (0,-1), (0,1)]
    while queue:
        r, c, mins = queue.popleft()
        minutes = mins
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2  # infect
                fresh_count -= 1
                queue.append((nr, nc, mins + 1))
                
    return minutes if fresh_count == 0 else -1
```

#### **8. LC #542 - 01 Matrix (Duplicates same name but optimal execution is above)**
*Note: Refer to Warm-up code for the optimized multi-source BFS implementation of LC #542.*

#### **9. LC #1293 - Shortest Path in a Grid with Obstacles Elimination (Hard)**
* **Trigger Cue**: BFS shortest path tracker keeping an active counter state of remaining obstacles that can be destroyed. We represent visited locations using 3D coordinates `(row, col, remaining_elimination_budget)`.
* **Python Code**:
```python
def shortestPath(grid: list[list[int]], k: int) -> int:
    rows, cols = len(grid), len(grid[0])
    if rows == 1 and cols == 1:
        return 0
        
    # If budget allows, we can take the Manhattan distance directly
    if k >= (rows - 1) + (cols - 1):
        return (rows - 1) + (cols - 1)
        
    queue = deque([(0, 0, k, 0)]) # row, col, budget, steps
    visited = {(0, 0, k)}  # 3D Visited Set (row, col, budget)
    
    directions = [(-1,0), (1,0), (0,-1), (0,1)]
    while queue:
        r, c, budget, steps = queue.popleft()
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                new_budget = budget - grid[nr][nc]
                if new_budget >= 0:
                    if nr == rows - 1 and nc == cols - 1:
                        return steps + 1
                    state = (nr, nc, new_budget)
                    if state not in visited:
                        visited.add(state)
                        queue.append((nr, nc, new_budget, steps + 1))
    return -1
```
* **Complexity**: Time: $O(R 	imes C 	imes K)$ | Space: $O(R 	imes C 	imes K)$ for 3D state tracking.

---

### 4. Common Interview Pitfalls

1. **Incorrect Visited Transitions**: Forgetting to mark a cell as visited immediately after pushing it to the BFS queue can cause identical cells to be pushed repeatedly, triggering severe memory limits and timeouts.
2. **ArrayIndexOutOfBounds**: Ensure coordinate checks `0 <= nr < rows` and `0 <= nc < cols` occur *before* dereferencing `grid[nr][nc]` in your code conditional tests.

---

### 5. Interview Defense Checklist
* [ ] Do I check row/col boundaries before attempting to access grid cell values?
* [ ] Am I using direction vector offsets rather than repeating 4 distinct condition blocks?
* [ ] Did I mark cells as visited *the instant* they enter the queue or recursion tree?
