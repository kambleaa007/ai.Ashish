# Module 8: Graph Structures & Network Algorithms (Lec 64–66)

## Lecture Scope
* **Lec-64**: Topological Order/ Sort in DAG (Directed Acyclic Graph) [14]
* **Lec-65**: How to Find Cycle in Undirected Graph using DFS [14]
* **Lec-66**: How to Find Cycle in Directed Graph using DFS [14]

---

## 1. Core Logic & Network Definitions
A Graph $G = (V, E)$ consists of a set of vertices $V$ and edges $E$ [14]. Graphs model complex non-linear network topologies, software dependency maps, and resource graphs [14].

---

## 2. Topological Sort in Directed Acyclic Graphs (DAG)
* **Definition**: A linear ordering of vertices such that for every directed edge $u \to v$, vertex $u$ appears before $v$ in the ordering [14].
* **Prerequisite**: Graph must be a **Directed Acyclic Graph (DAG)** [14].
* **Applications**: Task scheduling, build dependency ordering, prerequisite course planning [14].

---

## 3. Cycle Detection Algorithms using Depth-First Search (DFS)

### A. Cycle Detection in Undirected Graph (DFS)
* **Logic**: Perform DFS traversal while maintaining a `visited[]` array [14].
* **Condition**: If DFS encounters an adjacent node $v$ that is already `visited` AND $v$ is **not the direct parent** of the current node $u$, an undirected cycle exists [14].

### B. Cycle Detection in Directed Graph (DFS)
* **Logic**: Maintain two tracking structures during DFS:
  1. `visited[]` array to track visited nodes [14].
  2. `recursionStack[]` (or active path stack) to track nodes in the current DFS path [14].
* **Condition**: A directed cycle exists if DFS encounters a node $v$ that is already marked true in the current `recursionStack[]` [14]. Upon backtracking from node $u$, unmark $u$ in `recursionStack[]` [14].

---

## 4. Active Recall Checkpoints

### Question 1
Why does undirected graph cycle detection only require checking `visited` and `parent`, whereas directed graph cycle detection requires a `recursionStack`?
* **Answer**: In undirected graphs, edges are bidirectional, so moving back to an immediate parent is not a cycle. In directed graphs, a node can be visited via a separate non-cyclic branch; a true directed cycle only exists if an edge points back to an ancestor node currently active in the execution path (`recursionStack`) [14].

---
*Grounded in source: Data Structure - YouTube (Gate Smashers) [14]*
