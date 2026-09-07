# Days 13–16: Master Fast & Slow Pointers (The Definitive Guide)
## Study Plan - Phase 2: Highly Frequent Patterns

Welcome to the **Fast & Slow Pointers** (Floyd's Tortoise and Hare) masterclass study guide. This file delivers a rigorous, self-contained curriculum designed to build absolute muscle memory for cycle-detection and single-pass list traversal in interviews.

---

### 1. Architectural Deep Dive & Mechanics

The Fast & Slow Pointers pattern solves the critical limitation of traversing linked lists or sequence transitions: **detecting loops or cycles without storing history**. 

#### **The Visual State Machine**
If you have a linked list with a loop, a single pointer will traverse it infinitely. If you store seen nodes in a Hash Set, you require $O(n)$ space. Floyd's algorithm solves this in $O(1)$ space using two runners:

```
Step 0 (Initialization):
[Head] ---> [Node 1] ---> [Node 2] ---> [Node 3] ---> [Node 4]
  ^                                                     |
  |                                                     v
  +-------------------------------------------------+ [Node 5] (Loop Back)
  Slow (1x speed)
  Fast (2x speed)

Each iteration:
- Slow advances 1 step: slow = slow.next
- Fast advances 2 steps: fast = fast.next.next

If they collide (slow == fast):
  A cycle exists!
```

#### **The Mathematical Collision Guarantee**
Let the distance from the head of the list to the start of the cycle be $X$. Let the cycle length be $Y$. Let the distance from the cycle start to the collision point be $Z$.
1. When the slow pointer enters the cycle (having traveled $X$ steps), the fast pointer is at some position $K$ inside the cycle.
2. The distance between them inside the cycle is $Y - K$.
3. Since the fast pointer gains $1$ step on the slow pointer in each iteration, it will take exactly $Y - K$ steps for the fast pointer to catch up and collide with the slow pointer.
4. When they collide, the slow pointer has traveled $X + Z$ steps, and the fast pointer has traveled $X + Z + C \cdot Y$ steps (where $C$ is the number of cycle loops).
5. Since Fast is twice as fast as Slow:
   $$2(X + Z) = X + Z + C \cdot Y \implies X + Z = C \cdot Y \implies X = C \cdot Y - Z = (C-1)Y + (Y - Z)$$
6. **The Insight**: The distance from the head to the cycle start ($X$) is exactly equal to the distance from the collision point to the cycle start going forward ($Y - Z$). Thus, resetting one pointer to the head and moving both 1 step at a time guarantees they will meet precisely at the **cycle start**.

---

### 2. Universal Code Blueprints

#### **A. Classic Cycle Detection & Collision Point**
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def find_cycle_start(head: ListNode) -> ListNode:
    if not head or not head.next:
        return None
        
    slow = head
    fast = head
    has_cycle = False
    
    # 1. Detect Cycle
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            has_cycle = True
            break
            
    if not has_cycle:
        return None  # No cycle present
        
    # 2. Find Cycle Start
    slow = head  # Reset slow to head
    while slow != fast:
        slow = slow.next
        fast = fast.next  # Move both at 1x speed now
        
    return slow  # Intersection point is cycle start
```

---

### 3. Vetted LeetCode Drills (All 9 Problems)

---

#### **LC #141: Linked List Cycle (Easy)**
* **Trigger Cue**: "Determine if the linked list has a cycle in it."
* **Python Implementation**:
```python
def hasCycle(head: ListNode) -> bool:
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$
* **Interview Pitfall**: Forgetting to check `not head` or `not head.next` leading to `NoneAttributeError`.

---

#### **LC #202: Happy Number (Easy)**
* **Trigger Cue**: "Process of replacing a number by the sum of squares of its digits... loops endlessly in a cycle."
* **Mathematical Insight**: Non-happy numbers eventually fall into a cycle that contains the number `4`. We can treat number generation as node transitions.
* **Python Implementation**:
```python
def isHappy(n: int) -> bool:
    def get_next(num):
        total_sum = 0
        while num > 0:
            num, digit = divmod(num, 10)
            total_sum += digit ** 2
        return total_sum
        
    slow = n
    fast = get_next(n)
    
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
        
    return fast == 1
```
* **Complexity**: Time: $O(\log n)$ (number of digits scales logarithmically) | Space: $O(1)$

---

#### **LC #876: Middle of the Linked List (Easy)**
* **Trigger Cue**: "Return the middle node of the linked list."
* **Python Implementation**:
```python
def middleNode(head: ListNode) -> ListNode:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #142: Linked List Cycle II (Medium)**
* **Trigger Cue**: "Return the node where the cycle begins. If there is no cycle, return null."
* **Python Implementation**:
```python
def detectCycle(head: ListNode) -> ListNode:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Cycle detected. Reset pointer to find origin
            ptr = head
            while ptr != slow:
                ptr = ptr.next
                slow = slow.next
            return ptr
    return None
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #287: Find the Duplicate Number (Medium)**
* **Trigger Cue**: "Array of integers `nums` containing $n + 1$ integers where each integer is in the range $[1, n]$ inclusive... find the duplicate."
* **Insight**: Because values are restricted to $[1, n]$, each value points to a valid array index. This creates a directed graph. A duplicate value represents multiple pointers pointing to the same node, which guarantees a cycle!
* **Python Implementation**:
```python
def findDuplicate(nums: list[int]) -> int:
    # Phase 1: Meet inside the cycle
    slow = nums[0]
    fast = nums[nums[0]]
    
    while slow != fast:
        slow = nums[slow]
        fast = nums[nums[fast]]
        
    # Phase 2: Find the cycle entrance (the duplicate number)
    ptr1 = 0
    ptr2 = slow
    while ptr1 != ptr2:
        ptr1 = nums[ptr1]
        ptr2 = nums[ptr2]
        
    return ptr1
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #143: Reorder List (Medium)**
* **Trigger Cue**: "Reorder the list to be $L_0 ightarrow L_n ightarrow L_1 ightarrow L_{n-1} ightarrow \dots$"
* **Steps**: 1. Find mid-point (Fast/Slow) | 2. Reverse second half | 3. Merge both lists alternatively.
* **Python Implementation**:
```python
def reorderList(head: ListNode) -> None:
    if not head or not head.next:
        return
        
    # Step 1: Find middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
    # Step 2: Reverse second half
    prev, curr = None, slow.next
    slow.next = None  # Cut list
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    second_half = prev
    
    # Step 3: Merge alternate
    first_half = head
    while second_half:
        tmp1, tmp2 = first_half.next, second_half.next
        first_half.next = second_half
        second_half.next = tmp1
        first_half = tmp1
        second_half = tmp2
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #457: Circular Array Loop (Medium)**
* **Trigger Cue**: "Determine if there is a loop in `nums`... cycle must be forward-only or backward-only."
* **Python Implementation**:
```python
def circularArrayLoop(nums: list[int]) -> bool:
    n = len(nums)
    
    def get_next(curr_index, direction):
        curr_direction = nums[curr_index] >= 0
        if curr_direction != direction:
            return -1  # Direction mismatch
        next_index = (curr_index + nums[curr_index]) % n
        if next_index == curr_index:
            return -1  # Loop size must be > 1
        return next_index

    for i in range(n):
        if nums[i] == 0:
            continue
            
        direction = nums[i] >= 0
        slow = fast = i
        
        while True:
            slow = get_next(slow, direction)
            fast = get_next(fast, direction)
            if fast != -1:
                fast = get_next(fast, direction)
                
            if slow == -1 or fast == -1 or slow == fast:
                break
                
        if slow != -1 and slow == fast:
            return True
            
        # Freeze checked indices to avoid O(n^2) paths
        curr = i
        while nums[curr] != 0 and (nums[curr] >= 0) == direction:
            nxt = (curr + nums[curr]) % n
            nums[curr] = 0
            curr = nxt
            
    return False
```
* **Complexity**: Time: $O(n)$ | Space: $O(1)$

---

#### **LC #148: Sort List (Medium)**
* **Trigger Cue**: "Sort a linked list in $O(n \log n)$ time using constant space complexity."
* **Python Implementation**:
```python
def sortList(head: ListNode) -> ListNode:
    if not head or not head.next:
        return head
        
    # Get mid and split
    prev = None
    slow = fast = head
    while fast and fast.next:
        prev = slow
        slow = slow.next
        fast = fast.next.next
    prev.next = None  # Sever connection
    
    left = sortList(head)
    right = sortList(slow)
    
    # Merge helper
    dummy = ListNode()
    curr = dummy
    while left and right:
        if left.val < right.val:
            curr.next = left
            left = left.next
        else:
            curr.next = right
            right = right.next
        curr = curr.next
    curr.next = left or right
    return dummy.next
```
* **Complexity**: Time: $O(n \log n)$ | Space: $O(\log n)$ (due to recursion stack frame stack)

---

#### **LC #25: Reverse Nodes in k-Group (Hard)**
* **Trigger Cue**: "Reverse the nodes of a linked list k at a time."
* **Python Implementation**:
```python
def reverseKGroup(head: ListNode, k: int) -> ListNode:
    # Fast verification check
    count = 0
    node = head
    while node and count < k:
        node = node.next
        count += 1
    if count < k:
        return head  # Less than k elements; leave as-is
        
    # Reversing standard k nodes
    prev, curr = None, head
    for _ in range(k):
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
        
    # head is now the tail of Reversed segment. Recurse for the remainder
    head.next = reverseKGroup(curr, k)
    return prev
```
* **Complexity**: Time: $O(n)$ | Space: $O(n/k)$ recursion frames.

---

### 4. Practice Checklist

- [ ] Can you derive Floyd's cycle formula ($X = C \cdot Y - Z$) on a whiteboard?
- [ ] Are you verifying null states of `fast.next` and `fast.next.next` before executing leaps?
- [ ] Do you correctly handle negative/positive direction checks for circular array loops?
- [ ] Remember: Never modify a node's pointer directly without saving its `.next` address first.
