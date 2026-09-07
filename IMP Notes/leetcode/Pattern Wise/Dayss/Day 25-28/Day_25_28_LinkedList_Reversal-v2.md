# Days 25–28: Master LinkedList In-Place Reversal (The Definitive Guide)

Welcome to the **LinkedList In-Place Reversal Pattern** Deep Dive! This file acts as your ultimate, self-contained study companion for the next 4 days. This guide details the state-machine transitions of pointers, complete structural blueprints, and 9 production-ready LeetCode solutions.

---

### 1. The Core Paradigm: Pointer Manipulation State Machine

In LinkedList questions, allocating extra memory (like copying nodes to an array) is considered an interview failure. You must manipulate the links **in-place** with \(O(1)\) auxiliary space.

Think of in-place reversal as a sequence of **pointer redirections** using three sliding pointers:
* `prev`: Points to the node we processed in the previous step. Initially `None`.
* `curr`: Points to the node we are currently processing. Initially `head`.
* `next_node`: A temporary pointer used to secure the remaining list before we sever links.

#### **Visual Walkthrough: Reversing A -> B -> C**

**Initial State:**
```text
[prev = None]     [curr = A] -> [B] -> [C] -> None
```

**Step 1: Secure Next Node**
We point `next_node` to `curr.next` so we don't lose the rest of our list when we redirect `curr.next`.
```text
[prev = None]     [curr = A] -> [next_node = B] -> [C] -> None
```

**Step 2: Reverse Link**
We redirect `curr.next` to point backwards to `prev`.
```text
[prev = None] <- [curr = A]     [next_node = B] -> [C] -> None
```

**Step 3: Shift Pointers**
We move `prev` and `curr` one step forward.
```text
                  [prev = A]     [curr = B] -> [C] -> None
```

This sequence repeats until `curr` is `None`, leaving `prev` pointing to the new head.

---

### 2. Universal Blueprint Skeletons

#### **Blueprint A: Reverse Entire LinkedList**
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    
    while curr:
        next_node = curr.next  # 1. Secure next node
        curr.next = prev       # 2. Reverse the link
        prev = curr            # 3. Shift prev forward
        curr = next_node       # 4. Shift curr forward
        
    return prev  # prev is the new head of the reversed list
```

#### **Blueprint B: Reverse Sublist (Between indices `left` and `right`)**
```python
def reverse_sub_list(head: ListNode, left: int, right: int) -> ListNode:
    if not head or left == right:
        return head
        
    # Set up dummy node to handle cases where 'left' is the head node
    dummy = ListNode(0)
    dummy.next = head
    pre = dummy
    
    # Step 1: Reach node right before the sublist
    for _ in range(left - 1):
        pre = pre.next
        
    # Step 2: Set up reversal pointers
    curr = pre.next
    # We will use a link-hopping mechanism to reverse links on the fly
    for _ in range(right - left):
        temp = curr.next
        curr.next = temp.next
        temp.next = pre.next
        pre.next = temp
        
    return dummy.next
```

---

### 3. Vetted LeetCode Drills: Full Problem Deep-Dives

Here are the 9 problems making up your vertical deep dive, complete with triggers, traces, typed implementations, and space-time details.

---

#### **Problem 1 (Easy): LC #206 - Reverse Linked List**
* **Trigger Cue:** "Reverse a singly linked list."
* **Python Implementation:**
```python
def reverseList(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
```
* **Complexity:** Time: \(O(n)\) | Space: \(O(1)\)

---

#### **Problem 2 (Medium): LC #92 - Reverse Linked List II**
* **Trigger Cue:** "Reverse nodes from position left to right."
* **Python Implementation:**
```python
def reverseBetween(head: ListNode, left: int, right: int) -> ListNode:
    if not head or left == right:
        return head
    dummy = ListNode(0)
    dummy.next = head
    pre = dummy
    for _ in range(left - 1):
        pre = pre.next
    
    curr = pre.next
    for _ in range(right - left):
        temp = curr.next
        curr.next = temp.next
        temp.next = pre.next
        pre.next = temp
    return dummy.next
```
* **Complexity:** Time: \(O(n)\) (single-pass) | Space: \(O(1)\)

---

#### **Problem 3 (Hard): LC #25 - Reverse Nodes in k-Group**
* **Trigger Cue:** "Reverse the nodes of a linked list k at a time."
* **Python Implementation:**
```python
def reverseKGroup(head: ListNode, k: int) -> ListNode:
    # Check if there are at least k nodes left
    curr = head
    count = 0
    while curr and count < k:
        curr = curr.next
        count += 1
    
    if count == k:
        # Reverse k nodes
        prev = None
        curr = head
        for _ in range(k):
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        # Recurse for the next group
        head.next = reverseKGroup(curr, k)
        return prev
    return head
```
* **Complexity:** Time: \(O(n)\) | Space: \(O(n/k)\) recursion stack space.

---

#### **Problem 4 (Easy): LC #234 - Palindrome Linked List**
* **Trigger Cue:** "Determine if a linked list is a palindrome."
* **Python Implementation:**
```python
def isPalindrome(head: ListNode) -> bool:
    if not head or not head.next:
        return True
    
    # Find middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
    # Reverse second half
    prev = None
    curr = slow
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
        
    # Compare halves
    left, right = head, prev
    while right:  # Only check right half which is shorter or equal
        if left.val != right.val:
            return False
        left = left.next
        right = right.next
    return True
```
* **Complexity:** Time: \(O(n)\) | Space: \(O(1)\)

---

#### **Problem 5 (Medium): LC #143 - Reorder List**
* **Trigger Cue:** "Reorder L0 -> L1 -> ... -> Ln to L0 -> Ln -> L1 -> Ln-1 -> ..."
* **Python Implementation:**
```python
def reorderList(head: ListNode) -> None:
    if not head or not head.next:
        return
        
    # Step 1: Find middle node
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
    # Step 2: Reverse second half in-place
    prev = None
    curr = slow.next
    slow.next = None  # Sever connection
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
        
    # Step 3: Merge alternate nodes
    first, second = head, prev
    while second:
        temp1, temp2 = first.next, second.next
        first.next = second
        second.next = temp1
        first = temp1
        second = temp2
```
* **Complexity:** Time: \(O(n)\) | Space: \(O(1)\)

---

#### **Problem 6 (Medium): LC #1721 - Swapping Nodes in a Linked List**
* **Trigger Cue:** "Swap the values of the k-th node from the beginning and end."
* **Python Implementation:**
```python
def swapNodes(head: ListNode, k: int) -> ListNode:
    first = second = head
    # Find k-th node from beginning
    for _ in range(k - 1):
        first = first.next
        
    # Find k-th node from end using sliding pointers
    curr = first
    while curr.next:
        curr = curr.next
        second = second.next
        
    # Swap values
    first.val, second.val = second.val, first.val
    return head
```
* **Complexity:** Time: \(O(n)\) | Space: \(O(1)\)

---

#### **Problem 7 (Medium): LC #24 - Swap Nodes in Pairs**
* **Trigger Cue:** "Swap every two adjacent nodes."
* **Python Implementation:**
```python
def swapPairs(head: ListNode) -> ListNode:
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    
    while prev.next and prev.next.next:
        first = prev.next
        second = prev.next.next
        
        # Re-link nodes
        first.next = second.next
        second.next = first
        prev.next = second
        
        # Advance prev
        prev = first
        
    return dummy.next
```
* **Complexity:** Time: \(O(n)\) | Space: \(O(1)\)

---

#### **Problem 8 (Medium): LC #2074 - Reverse Nodes in Even Length Groups**
* **Trigger Cue:** "Reverse nodes in even-length groups consecutively."
* **Python Implementation:**
```python
def reverseEvenLengthGroups(head: ListNode) -> ListNode:
    prev_group_end = head
    curr = head.next
    group_len = 2
    
    while curr:
        # Check size of current group
        temp = curr
        count = 0
        nodes = []
        while temp and count < group_len:
            nodes.append(temp)
            temp = temp.next
            count += 1
            
        if count % 2 == 0:
            # Reverse node sequence values in even groups
            left = 0
            right = len(nodes) - 1
            while left < right:
                nodes[left].val, nodes[right].val = nodes[right].val, nodes[left].val
                left += 1
                right -= 1
                
        prev_group_end = nodes[-1]
        curr = temp
        group_len += 1
        
    return head
```
* **Complexity:** Time: \(O(n)\) | Space: \(O(	ext{group\_len})\) space to hold group nodes.

---

#### **Problem 9 (Medium): LC #2816 - Double a Number Represented as a Linked List**
* **Trigger Cue:** "Double the number represented by a linked list and return its head."
* **Python Implementation:**
```python
def doubleIt(head: ListNode) -> ListNode:
    # Helper to reverse list
    def reverse(node):
        prev = None
        curr = node
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev
        
    # Reverse list to process carry starting from Least Significant Digit
    rev_head = reverse(head)
    curr = rev_head
    carry = 0
    
    while curr:
        new_val = curr.val * 2 + carry
        curr.val = new_val % 10
        carry = new_val // 10
        if not curr.next and carry:
            curr.next = ListNode(carry)
            carry = 0
            break
        curr = curr.next
        
    return reverse(rev_head)
```
* **Complexity:** Time: \(O(n)\) | Space: \(O(1)\)

---

### 4. Common Pitfalls & Defense Checklist

* **The Lost Next Pointer**: Forgetting to save `curr.next` to a temporary variable before changing `curr.next = prev`. Ensure your loop *starts* with `nxt = curr.next`.
* **Cycle creation**: If you don't sever the tail node's connection properly when reversing portions of lists, you will introduce a loop that hangs runtime.
* **Header swapping edge cases**: When swapping the actual head of a list, always use a `dummy = ListNode(0)` node pointing to `head` to gracefully avoid NullPointerExceptions.

---

### 5. Final Checklist
- [ ] Implement a dry run with 3 nodes `A -> B -> C` on paper.
- [ ] Memorize the four assignment lines of `reverse_list` in perfect order.
- [ ] Understand dummy node tracking and link-hopping algorithms.
