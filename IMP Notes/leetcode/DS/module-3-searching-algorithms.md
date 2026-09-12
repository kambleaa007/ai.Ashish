# Module 3: Searching Algorithms & Time Complexity (Lec 14–15)

## Lecture Scope
* **Lec-14**: Linear Search in Data Structure by #Naina Mam | Time Complexity [4]
* **Lec-15**: Binary Search in Data Structure by #Naina Mam [4]

---

## 1. Core Logic & Theoretical Overview
Searching involves finding the index location of a target key within a collection of data elements [4]. The course evaluates Linear Search versus Binary Search based on dataset prerequisites and asymptotic performance [4].

---

## 2. Detailed Algorithm Breakdown

### A. Linear Search
* **Logic**: Iterates sequentially through each element from index 0 to $n-1$, comparing the target key against each array entry [4].
* **Prerequisite**: Operates on both unsorted and sorted datasets [4].
* **Complexity Analysis**:
  * Best Case: $O(1)$ (target at first index).
  * Worst Case: $O(n)$ (target at last index or absent).
  * Average Case: $O(n)$ [4].

### B. Binary Search
* **Logic**: Employs a divide-and-conquer strategy [4]. It compares the target key against the middle element `mid = low + (high - low) / 2`.
  * If `key == A[mid]`, return `mid`.
  * If `key < A[mid]`, search left half (`high = mid - 1`).
  * If `key > A[mid]`, search right half (`low = mid + 1`) [4].
* **Prerequisite**: Requires the input dataset to be sorted [4].
* **Complexity Analysis**:
  * Best Case: $O(1)$ (target at middle index).
  * Worst / Average Case: $O(\log_2 n)$ time complexity [4].
  * Space Complexity: $O(1)$ iterative, $O(\log n)$ recursive call stack [4].

---

## 3. Comparative Summary Table

| Feature | Linear Search | Binary Search |
| :--- | :--- | :--- |
| **Sorted Requirement** | No | Yes (Mandatory) [4] |
| **Worst-Case Time** | $O(n)$ [4] | $O(\log n)$ [4] |
| **Data Structure Support** | Arrays, Linked Lists [4, 5] | Arrays (direct random access required) [4, 5] |

---

## 4. Active Recall Checkpoints

### Question 1
Why cannot Binary Search be efficiently applied to a Singly Linked List despite the list being sorted?
* **Answer**: Binary Search requires $O(1)$ random access to calculate `mid` and jump directly to elements. Singly Linked Lists only support $O(n)$ sequential node traversal, making finding `mid` take $O(n)$ time and reducing Binary Search efficiency to $O(n)$ [4, 5].

---
*Grounded in source: Data Structure - YouTube (Gate Smashers) [4]*
