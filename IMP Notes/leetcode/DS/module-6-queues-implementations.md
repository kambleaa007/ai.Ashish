# Module 6: Queues & Operational Mechanics (Lec 46–51)

## Lecture Scope
* **Lec-46**: Introduction to Queue Data structure with real life example [10]
* **Lec-47**: Enqueue(), Dequeue() & other Operations on Queue [10]
* **Lec-48**: Dequeue() in Queue using Array [11]
* **Lec-49**: isfull() and isempty() in queue | Queue operations [11]
* **Lec-50**: Implementation of Queue using Array | Enqueue() in Queue [11]
* **Lec-51**: Implementation of Queue using Linked List | Enqueue() in Queue [11]

---

## 1. Core Logic & Theoretical Overview
A Queue is a linear data structure following a **First-In, First-Out (FIFO)** access model [10]. Insertions occur at the `REAR` pointer (**Enqueue**), and deletions occur at the `FRONT` pointer (**Dequeue**) [10, 11].

---

## 2. Operational Mechanics & Boundary Checks

### Core Queue Operations
* **Enqueue(x)**: Adds element $x$ to `REAR` [10, 11].
* **Dequeue()**: Removes element from `FRONT` [10, 11].
* **isfull()**: Returns true if array queue capacity is exhausted (`rear == MAX - 1`) [11].
* **isempty()**: Returns true if queue contains no elements (`front == -1` or `front > rear`) [11].

---

## 3. Implementations: Array vs. Dynamic Linked List

### Array Queue Limitations
* In a linear array implementation, continuous `Dequeue()` operations increment `front`, creating unusable empty spaces at the beginning of the array while `rear` hits `MAX - 1` [11].

### Linked List Queue Implementation
* Uses dynamic pointers `front` and `rear` pointing to list nodes [11].
* **Enqueue**: Insert at tail node (`rear->next = newNode; rear = newNode;`) [11].
* **Dequeue**: Delete from head node (`temp = front; front = front->next; free(temp);`) [11].
* Guarantees $O(1)$ constant time for both Enqueue and Dequeue operations without memory starvation [11].

---

## 4. Active Recall Checkpoints

### Question 1
Why does a linear array implementation of a queue suffer from false overflow, and how is it resolved?
* **Answer**: False overflow occurs when `rear` reaches the last array index (`MAX - 1`), triggering `isfull()`, even though previous `Dequeue()` calls left empty slots at the front. It is resolved using Circular Queues or Dynamic Linked Lists [11].

---
*Grounded in source: Data Structure - YouTube (Gate Smashers) [10, 11]*
