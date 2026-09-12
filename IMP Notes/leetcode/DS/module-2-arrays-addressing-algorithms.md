# Module 2: Arrays, Memory Addressing & Array Algorithms (Lec 3–13)

## Lecture Scope
* **Lec-3**: Arrays in Data Structure by #Naina Mam | Initialization, Declaration, Memory Representation [2]
* **Lec-4**: Types of Array | One dimensional & Multi-dimensional Array by #Naina Mam [2]
* **Lec-5**: Addressing in One Dimensional Array by #Naina Mam | Data Structure [2]
* **Lec-6**: 2D Arrays | Addressing in 2D Arrays | Row Major Order [2]
* **Lec-7**: 3D Arrays | Addressing in 3D Arrays | Row Major Order [3]
* **Lec-8**: Addressing in Lower Triangular Matrix | Data Structure for beginners [3]
* **Lec-9**: Find 2nd Largest Number in Array | Data Structure for beginners [3]
* **Lec-10**: Two Pointer Technique | Two Sum Problem in Data Structure [3]
* **Lec-11**: Maximum Sum Subarray Problem | Understand Naive Approach [3]
* **Lec-12**: Sliding Window Technique | Data Structure [4]
* **Lec-13**: Remove Duplicate Elements in Sorted Array | Various Methods [4]

---

## 1. Core Logic & Theoretical Overview
Arrays represent contiguous blocks of memory where elements of identical data types are stored sequentially [2]. The physical memory model allows $O(1)$ constant-time random access via mathematical index calculations [2, 5].

### Memory Addressing & Row Major Order (RMO)
In Row Major Order, multi-dimensional array elements are linearized into contiguous 1D physical RAM addresses row by row [2, 3].

#### Mathematical Formulas
1. **1D Array Address Calculation**:
   $$\text{Address}(A[i]) = \text{Base Address} + (i - \text{Lower Bound}) \times c$$
   *(where $c$ is the element size in bytes)* [2].

2. **2D Array Address Calculation (Row Major Order)**:
   $$\text{Address}(A[i][j]) = \text{Base Address} + [(i - L_1) \times N_2 + (j - L_2)] \times c$$
   *(where $L_1, L_2$ are row/column lower bounds, and $N_2$ is total number of columns)* [2].

3. **3D Array Address Calculation (Row Major Order)**:
   $$\text{Address}(A[i][j][k]) = \text{Base Address} + [(i - L_1) \times N_2 \times N_3 + (j - L_2) \times N_3 + (k - L_3)] \times c$$ [3].

4. **Lower Triangular Matrix Indexing**:
   In an $n \times n$ lower triangular matrix, non-zero elements exist only where $i \ge j$. Storing only non-zero elements requires $\frac{n(n+1)}{2}$ space [3].
   The 1D index mapping for $A[i][j]$ is:
   $$\text{Index} = \frac{i(i-1)}{2} + (j-1)$$ [3].

---

## 2. Algorithmic Techniques & Problem Walkthroughs

### A. Two-Pointer Technique (Two-Sum Problem)
* **Logic**: Uses two index markers (`left` at index 0, `right` at index $n-1$) traversing toward each other on a sorted array [3].
* **Complexity**: Reduces time complexity from naive $O(n^2)$ to optimal $O(n)$ [3].

### B. Sliding Window Technique
* **Logic**: Maintains a contiguous sub-segment window across the array, expanding or shifting the window bounds dynamically instead of re-calculating sub-array sums from scratch [4].
* **Complexity**: Optimized from $O(n \cdot k)$ or $O(n^2)$ to $O(n)$ time [3, 4].

### C. Remove Duplicates in Sorted Array
* **Logic**: Uses a single slow pointer to track unique element positions while a fast pointer scans forward. Overwrites duplicate entries in-place [4].

---

## 3. Key Terminology & Definitions
* **Contiguous Allocation**: Storing data elements in adjacent physical RAM memory locations [2].
* **Row Major Order (RMO)**: Linearizing multidimensional matrices by placing sequential row elements consecutively in memory [2, 3].
* **Base Address**: The starting memory address of the first element ($A[0]$ or $A[0][0]$) of an array [2].

---

## 4. Active Recall & Self-Assessment Checkpoints

### Question 1
Given a 2D array $A[1..10][1..15]$ stored in Row Major Order with Base Address 2000 and element size 4 bytes, calculate the address of $A[4][6]$.
* **Explanation**:
  $L_1 = 1, L_2 = 1, N_2 = 15$.
  $\text{Address}(A[4][6]) = 2000 + [(4 - 1) \times 15 + (6 - 1)] \times 4 = 2000 + [45 + 5] \times 4 = 2000 + 200 = 2200$.

---
*Grounded in source: Data Structure - YouTube (Gate Smashers) [2–4]*
