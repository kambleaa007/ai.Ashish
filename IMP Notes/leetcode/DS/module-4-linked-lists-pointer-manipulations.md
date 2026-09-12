# Module 4: Linked Lists & Pointer Manipulations (Lec 16–29)

## Lecture Scope
* **Lec-16**: Introduction to Linked List | Types and Need of linked list [4]
* **Lec-17**: Arrays vs Linked Lists | Data Structures [5]
* **Lec-18**: Single Linked List in Data Structures | Self Referential Structure [5]
* **Lec-19**: The Basic Operations of Linked List [5]
* **Lec-20**: Traversing in Linked list | Data Structure [5]
* **Lec-21**: Insert a node at the beginning of Linked list [5]
* **Lec-22**: Insert a node at the end of Linked List [5]
* **Lec-23**: Insert a node after a given node in Linked List [6]
* **Lec-24**: Delete a node from the beginning of Linked List [6]
* **Lec-25**: Delete a node from the end of Linked List [6]
* **Lec-26**: Deletion after a given node in Linked List [6]
* **Lec-27**: Deleting Entire Linked List [6]
* **Lec-28**: Introduction to Doubly Linked List [7]
* **Lec-29**: How to find a Cycle in Linked List | 2 Pointer Algorithm [7]

---

## 1. Core Logic & Theoretical Overview
A Linked List is a linear non-contiguous data structure where elements (nodes) are dynamically allocated in heap memory and connected via pointers [4, 5].

### Self-Referential Structure
A linked list node is defined in C/C++ using a self-referential structure—a structure containing a pointer member to an instance of its own structure type [5]:
```c
struct Node {
    int data;
    struct Node* next;
};
```

---

## 2. Array vs. Linked List Trade-offs

| Dimension | Array | Linked List |
| :--- | :--- | :--- |
| **Memory Allocation** | Static / Contiguous [2] | Dynamic / Non-contiguous [4, 5] |
| **Access Time** | $O(1)$ Random Access [2] | $O(n)$ Sequential Access [5] |
| **Insertion / Deletion** | Expensive ($O(n)$ shifts) [5] | Efficient ($O(1)$ pointer update if node pointer known) [5, 6] |
| **Memory Overhead** | None (only elements) [2] | Extra memory per node for pointer fields [5, 7] |

---

## 3. Node Operations & Pointer Workflow

### A. Traversing & Insertion
* **Insert at Beginning**:
  `newNode->next = head; head = newNode;` ($O(1)$ time) [5].
* **Insert at End**:
  Traverse to end node (`temp->next == NULL`), then `temp->next = newNode; newNode->next = NULL;` ($O(n)$ time) [5].
* **Insert After Node `P`**:
  `newNode->next = P->next; P->next = newNode;` ($O(1)$ time given pointer `P`) [6].

### B. Deletion Operations
* **Delete from Beginning**:
  `temp = head; head = head->next; free(temp);` ($O(1)$ time) [6].
* **Delete Entire List**:
  Iteratively traverse and `free()` every node while updating `head = nextNode` to prevent dangling memory leaks [6].

---

## 4. Advanced Algorithm: Cycle Detection (Floyd's Two-Pointer)
* **Logic**: Uses a `slow` pointer (moves 1 node/step) and a `fast` pointer (moves 2 nodes/step) [7].
* **Mechanism**: If a circular loop exists, `fast` will enter the loop and eventually overlap with `slow` (`slow == fast`). If `fast == NULL` or `fast->next == NULL`, no cycle exists [7].

---

## 5. Active Recall Checkpoints

### Question 1
What happens if you delete a node without saving its `next` pointer reference first?
* **Answer**: The structural chain is broken, making all downstream nodes inaccessible in memory, causing a severe memory leak [5, 6].

---
*Grounded in source: Data Structure - YouTube (Gate Smashers) [4–7]*
