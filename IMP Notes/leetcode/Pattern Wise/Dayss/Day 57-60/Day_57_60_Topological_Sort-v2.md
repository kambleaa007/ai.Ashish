# Days 57–60: Master Topological Sort (The Definitive Guide)

Welcome to the **Topological Sort Pattern** Deep Dive! This file acts as your ultimate, self-contained study companion. This guide details Kahn's BFS Algorithm, dynamic orderings, and 9 production-ready LeetCode solutions.

---

### 1. The Core Paradigm: Dependency Resolution Schedulers

Topological Sort is an algorithm designed to linearly order vertices of a **Directed Acyclic Graph (DAG)**. This order ensures that for every directed edge from node \(U 	o V\), node \(U\) appears before node \(V\) in the final sorting sequence.

#### **Algorithm Mechanics: Kahn's Algorithm (BFS)**

Kahn's algorithm resolves dependencies by tracking the "In-degree" of each vertex—defined as the number of incoming edges pointing into it.

1. **Calculate In-degrees & Adjacency List:** 
   Build a dictionary mapping nodes to lists of child nodes, and track each node's in-degree value.
2. **Find Sources:** 
   Identify all "sources" (nodes with an in-degree of `0`, meaning they have zero prerequisites). Enqueue all sources.
3. **Process Vertices:**
   While the Queue is not empty:
   * Pop a node \(U\) from the Queue.
   * Append \(U\) to your sorted output list.
   * For each adjacent child node \(V\) of \(U\), decrement its in-degree count by `1`.
   * If a child's in-degree drops to `0`, enqueue it immediately (its dependencies are satisfied).
4. **Detect Cycles:** 
   If your sorted list does not contain all graph vertices, the graph is cyclic, and no valid topological ordering can exist.

---

### 2. Universal Topological Sort Blueprint

```python
from collections import deque

def topological_sort(vertices: int, prerequisites: list[list[int]]) -> list[int]:
    sorted_order = []
    if vertices <= 0:
        return []
        
    # Step 1: Initialize in-degree map and adjacency list
    in_degree = {i: 0 for i in range(vertices)}
    graph = {i: [] for i in range(vertices)}
    
    # Step 2: Build the graph
    for parent, child in prerequisites:
        graph[parent].append(child)
        in_degree[child] += 1
        
    # Step 3: Find all source vertices with in-degree = 0
    queue = deque([v for v in in_degree if in_degree[v] == 0])
    
    # Step 4: Traverse level-by-level
    while queue:
        vertex = queue.popleft()
        sorted_order.append(vertex)
        
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    # Step 5: Cycle Check
    if len(sorted_order) != vertices:
        return []  # Graph has cycles, no valid sorting
        
    return sorted_order
```

---

### 3. Vetted LeetCode Drills: Full Problem Deep-Dives

---

#### **Problem 1 (Medium): LC #207 - Course Schedule**
* **Trigger Cue:** "Determine if you can finish all courses given prerequisite lists."
* **Python Implementation:**
```python
from collections import deque, defaultdict

def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    in_degree = [0] * numCourses
    adj = defaultdict(list)
    
    for course, prereq in prerequisites:
        adj[prereq].append(course)
        in_degree[course] += 1
        
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    visited_count = 0
    
    while queue:
        node = queue.popleft()
        visited_count += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    return visited_count == numCourses
```
* **Complexity:** Time: \(O(V + E)\) | Space: \(O(V + E)\)

---

#### **Problem 2 (Medium): LC #210 - Course Schedule II**
* **Trigger Cue:** "Return the ordering of courses you should take."
* **Python Implementation:**
```python
from collections import deque, defaultdict

def findOrder(numCourses: int, prerequisites: list[list[int]]) -> list[int]:
    in_degree = [0] * numCourses
    adj = defaultdict(list)
    
    for course, prereq in prerequisites:
        adj[prereq].append(course)
        in_degree[course] += 1
        
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    res = []
    
    while queue:
        node = queue.popleft()
        res.append(node)
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    return res if len(res) == numCourses else []
```
* **Complexity:** Time: \(O(V + E)\) | Space: \(O(V + E)\)

---

#### **Problem 3 (Hard): LC #269 - Alien Dictionary**
* **Trigger Cue:** "Derive the character dictionary ordering from a sorted alien words list."
* **Python Implementation:**
```python
from collections import deque, defaultdict

def alienOrder(words: list[str]) -> str:
    adj = defaultdict(set)
    in_degree = {char: 0 for w in words for char in w}
    
    # Compare consecutive words to find relative character sort constraints
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        
        # Prefix edge check (e.g., "abc" before "ab" is invalid)
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""
            
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in adj[w1[j]]:
                    adj[w1[j]].add(w2[j])
                    in_degree[w2[j]] += 1
                break
                
    queue = deque([c for c in in_degree if in_degree[c] == 0])
    res = []
    
    while queue:
        char = queue.popleft()
        res.append(char)
        for neighbor in adj[char]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    return "".join(res) if len(res) == len(in_degree) else ""
```
* **Complexity:** Time: \(O(C)\) where C is total length of all words | Space: \(O(U)\) where U is unique letters count.

---

#### **Problem 4 (Medium): LC #444 - Sequence Reconstruction**
* **Trigger Cue:** "Determine if there is a unique reconstruction path sequence."
* **Python Implementation:**
```python
from collections import deque, defaultdict

def sequenceReconstruction(nums: list[int], sequences: list[list[int]]) -> bool:
    in_degree = {x: 0 for x in nums}
    adj = defaultdict(list)
    
    # Establish graph bounds using available elements
    for seq in sequences:
        for i in range(len(seq) - 1):
            parent, child = seq[i], seq[i + 1]
            if parent in in_degree and child in in_degree:
                adj[parent].append(child)
                in_degree[child] += 1
                
    # Unique queue holds only one choice at any execution level
    queue = deque([v for v in in_degree if in_degree[v] == 0])
    res = []
    
    while queue:
        if len(queue) > 1:
            return False  # More than one valid sorting choice exists
        node = queue.popleft()
        res.append(node)
        
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    return res == nums
```
* **Complexity:** Time: \(O(V + E)\) | Space: \(O(V + E)\)

---

#### **Problem 5 (Medium): LC #310 - Minimum Height Trees**
* **Trigger Cue:** "Find trees with minimum height among root choices."
* **Python Implementation:**
```python
from collections import deque, defaultdict

def findMinHeightTrees(n: int, edges: list[list[int]]) -> list[int]:
    if n <= 2:
        return list(range(n))
        
    adj = defaultdict(set)
    for u, v in edges:
        adj[u].add(v)
        adj[v].add(u)
        
    # Trim outward leaves recursively
    leaves = deque([i for i in range(n) if len(adj[i]) == 1])
    remaining_nodes = n
    
    while remaining_nodes > 2:
        num_leaves = len(leaves)
        remaining_nodes -= num_leaves
        for _ in range(num_leaves):
            leaf = leaves.popleft()
            neighbor = adj[leaf].pop()
            adj[neighbor].remove(leaf)
            if len(adj[neighbor]) == 1:
                leaves.append(neighbor)
                
    return list(leaves)
```
* **Complexity:** Time: \(O(V)\) | Space: \(O(V)\)

---

#### **Problem 6 (Medium): LC #2115 - Find All Recipes from Given Supplies**
* **Trigger Cue:** "Create recipes given prerequisite ingredients."
* **Python Implementation:**
```python
from collections import deque, defaultdict

def findAllRecipes(recipes: list[str], ingredients: list[list[str]], supplies: list[str]) -> list[str]:
    in_degree = defaultdict(int)
    adj = defaultdict(list)
    recipes_set = set(recipes)
    
    # Establish graph relations
    for r, ing_list in zip(recipes, ingredients):
        for ing in ing_list:
            adj[ing].append(r)
            in_degree[r] += 1
            
    queue = deque(supplies)
    res = []
    
    while queue:
        node = queue.popleft()
        if node in recipes_set:
            res.append(node)
            
        for child in adj[node]:
            in_degree[child] -= 1
            if in_degree[child] == 0:
                queue.append(child)
                
    return res
```
* **Complexity:** Time: \(O(V + E)\) | Space: \(O(V + E)\)

---

#### **Problem 7 (Medium): LC #1462 - Course Schedule IV**
* **Trigger Cue:** "Check if course U is a prerequisite of course V for queries."
* **Python Implementation:**
```python
def checkIfPrerequisite(numCourses: int, prerequisites: list[list[int]], queries: list[list[int]]) -> list[bool]:
    # Floyd-Warshall reachability map
    connected = [[False] * numCourses for _ in range(numCourses)]
    for u, v in prerequisites:
        connected[u][v] = True
        
    for k in range(numCourses):
        for i in range(numCourses):
            for j in range(numCourses):
                if connected[i][k] and connected[k][j]:
                    connected[i][j] = True
                    
    return [connected[u][v] for u, v in queries]
```
* **Complexity:** Time: \(O(V^3)\) optimal for high query densities | Space: \(O(V^2)\)

---

#### **Problem 8 (Medium): LC #851 - Loud and Rich**
* **Trigger Cue:** "Find the quietest person who is at least as rich as person x."
* **Python Implementation:**
```python
from collections import deque, defaultdict

def loudAndRich(richer: list[list[int]], quiet: list[int]) -> list[int]:
    n = len(quiet)
    adj = defaultdict(list)
    in_degree = [0] * n
    
    for u, v in richer:
        adj[u].append(v)  # rich -> poorer
        in_degree[v] += 1
        
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    res = list(range(n))  # Initial answer is themselves
    
    while queue:
        node = queue.popleft()
        for neighbor in adj[node]:
            # If the current leader is quieter than neighbor's saved quietest person
            if quiet[res[node]] < quiet[res[neighbor]]:
                res[neighbor] = res[node]
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    return res
```
* **Complexity:** Time: \(O(V + E)\) | Space: \(O(V + E)\)

---

#### **Problem 9 (Medium): LC #1136 - Parallel Courses**
* **Trigger Cue:** "Return minimum semesters to complete all courses."
* **Python Implementation:**
```python
from collections import deque, defaultdict

def minimumSemesters(n: int, relations: list[list[int]]) -> int:
    in_degree = [0] * (n + 1)
    adj = defaultdict(list)
    
    for prev_course, next_course in relations:
        adj[prev_course].append(next_course)
        in_degree[next_course] += 1
        
    queue = deque([i for i in range(1, n + 1) if in_degree[i] == 0])
    semesters = 0
    courses_taken = 0
    
    while queue:
        semesters += 1
        num_courses = len(queue)
        courses_taken += num_courses
        
        for _ in range(num_courses):
            node = queue.popleft()
            for neighbor in adj[node]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
                    
    return semesters if courses_taken == n else -1
```
* **Complexity:** Time: \(O(V + E)\) | Space: \(O(V + E)\)

---

### 4. Common Pitfalls & Defense Checklist

* **Undetected Cycles**: Never return the output list without comparing its length to the total number of vertices. If `len(sorted_order) != num_vertices`, the graph is cyclic and the topological sort is invalid.
* **Incorrect In-degree updates**: Ensure you increment indegree counts strictly for *downstream nodes* (`child`), not source nodes (`parent`).

---

### 5. Final Checklist
- [ ] Implement Kahn's algorithm on graph dependencies manually.
- [ ] Review how Alien Dictionary converts character pairs to topological edge mappings.
