# Module 5: Stacks & Expression Processing (Lec 30–45)

## Lecture Scope
* **Lec-30**: Introduction to Stack | PUSH and POP operations [7]
* **Lec-31**: PUSH operation using Array [7]
* **Lec-32**: POP operation using Array [7]
* **Lec-33**: PUSH operation using Linked List [8]
* **Lec-34**: POP operation using Linked List [8]
* **Lec-35**: Recursion vs Loop | How both approaches work [8]
* **Lec-36**: Infix, Prefix & Postfix with examples [8]
* **Lec-37**: Infix to prefix Conversion [8]
* **Lec-38**: Infix to Postfix Conversion [9]
* **Lec-39**: Infix to Prefix conversion using Stack [9]
* **Lec-40**: Infix to postfix Conversion using Stack [9]
* **Lec-41**: Practice question on Infix to postfix notation [9]
* **Lec-42**: Postfix Expression Evaluation | Stack Application [9]
* **Lec-43**: Practice question on Postfix Evaluation [10]
* **Lec-44**: Understanding Call Stack with example [10]
* **Lec-45**: The Magic of Recursion: Recursive Functions & Time Complexity [10]

---

## 1. Core Logic & Theoretical Overview
A Stack is an abstract data structure operating on a **Last-In, First-Out (LIFO)** policy [7]. Elements are added and removed exclusively from one end, designated as the `TOP` [7].

---

## 2. Implementations: Array vs. Linked List

### Array-Based Stack
* Uses a fixed array `stack[MAX]` and an index variable `top = -1` [7].
* **PUSH**: Check overflow (`top == MAX - 1`). If false, `top++`, `stack[top] = val` [7].
* **POP**: Check underflow (`top == -1`). If false, `val = stack[top]`, `top--` [7].

### Linked List-Based Stack
* Dynamic stack where `top` points to the head node [8].
* **PUSH**: Insert node at beginning (`newNode->next = top; top = newNode;`). Eliminates fixed overflow limit [8].
* **POP**: Delete node from beginning (`temp = top; top = top->next; free(temp);`) [8].

---

## 3. Expression Conversion & Parsing

### Notation Definitions
* **Infix**: Operator between operands ($A + B$) [8].
* **Prefix (Polish)**: Operator before operands ($+ A B$) [8].
* **Postfix (Reverse Polish)**: Operator after operands ($A B +$) [8].

### Infix to Postfix Stack Algorithm
1. Initialize an operator stack.
2. Scan infix expression from left to right.
3. If operand $\to$ output immediately [9].
4. If `(`, push onto stack [9].
5. If `)`, pop stack to output until `(` is encountered [9].
6. If operator $op$, pop operators with $\ge$ precedence from stack to output, then push $op$ [9].

### Postfix Evaluation Algorithm
1. Scan postfix string left to right.
2. If operand $\to$ push onto numerical stack [9].
3. If operator $\to$ pop $A$ (second operand), pop $B$ (first operand), evaluate $B \text{ op } A$, push result back onto stack [9, 10].

---

## 4. Call Stack & Recursion
* **Call Stack**: System memory stack allocating activation records (stack frames) tracking local variables, parameters, and return addresses during function execution [10].
* **Recursion**: A function calling itself until reaching a base condition. Excessive recursion without proper termination triggers **Stack Overflow** [8, 10].

---

## 5. Active Recall Checkpoints

### Question 1
Evaluate the Postfix expression `5 3 2 * + 4 -` using a stack.
* **Explanation**:
  1. Push 5, Push 3, Push 2. Stack: `[5, 3, 2]`.
  2. Operator `*`: Pop 2, Pop 3. Evaluate $3 \times 2 = 6$. Push 6. Stack: `[5, 6]`.
  3. Operator `+`: Pop 6, Pop 5. Evaluate $5 + 6 = 11$. Push 11. Stack: `[11]`.
  4. Push 4. Stack: `[11, 4]`.
  5. Operator `-`: Pop 4, Pop 11. Evaluate $11 - 4 = 7$. Push 7.
  *Final Result*: **7** [9, 10].

---
*Grounded in source: Data Structure - YouTube (Gate Smashers) [7–10]*
