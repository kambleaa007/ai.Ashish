# Module 4: Practical System Design & Components (Java)
## Mapping Algorithmic Data Structures to Scalable Distributed Architectures

High-level system design loops increasingly demand that you connect your low-level algorithmic decisions directly to global scalability trade-offs [33, 231]. This module master-classes how to build distributed, resilient structures where Java choices affect database, caching, and network constraints [96, 617].

---

### Topic 19: Cache Eviction Policies (Designing LRU/LFU Caches)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Evicting the Least Recently Used or Least Frequently Used elements from memory when capacity is hit [612, 617]. |
| **Why** | Ensures key operations (get, put, evict) occur in stable $\mathcal{O}(1)$ time, preventing performance degradation under peak load [612]. |
| **Where** | Standard design question at Amazon and Salesforce [250]. |
| **How** | Use a hybrid structure: a Java `HashMap` for constant-time index lookups, paired with a custom doubly linked list to track access recency [250]. |

#### 🧠 Mental Model
Think of a checkout queue at a grocery store. When a customer pays or enters, they go to the back of the queue. If the queue is at capacity, the person at the very front is evicted. The hashmap acts as an index of who is currently in the queue.

```java
import java.util.HashMap;

public class LRUCache {
    class Node {
        int key;
        int value;
        Node prev;
        Node next;
        Node(int k, int v) {
            this.key = k;
            this.value = v;
        }
    }
    
    private final int capacity;
    private final HashMap<Integer, Node> map;
    private final Node head;
    private final Node tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            remove(node);
            insertAtHead(node); // Keep hot items at the head of the list
            return node.value;
        }
        return -1;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.value = value;
            remove(node);
            insertAtHead(node);
        } else {
            if (map.size() == capacity) {
                map.remove(tail.prev.key);
                remove(tail.prev); // Evict least recently used item
            }
            Node newNode = new Node(key, value);
            map.put(key, newNode);
            insertAtHead(newNode);
        }
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insertAtHead(Node node) {
        node.next = head.next;
        node.next.prev = node;
        head.next = node;
        node.prev = head;
    }
}
```

---

### Topic 20: Consistent Hashing (Distributed Routing Ring)
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Distributing load evenly across cache servers in a horizontal-scaling architecture [96, 617]. |
| **Why** | Minimizes cache misses when nodes are added or removed from the cluster [96]. |
| **Where** | Standard distributed system design loop at Google, Amazon, and Netflix [99]. |
| **How** | Use a sorted ring (implemented via Java `TreeMap`) to map keys and server nodes to a circular coordinate space [99, 833]. |

```java
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.TreeMap;

public class ConsistentHashRing {
    private final TreeMap<Long, String> ring = new TreeMap<>();
    private final int numberOfReplicas; // Virtual nodes for even balancing

    public ConsistentHashRing(int numberOfReplicas) {
        this.numberOfReplicas = numberOfReplicas;
    }

    public void addServer(String server) {
        for (int i = 0; i < numberOfReplicas; i++) {
            long hash = hash(server + "-vnode-" + i);
            ring.put(hash, server);
        }
    }

    public void removeServer(String server) {
        for (int i = 0; i < numberOfReplicas; i++) {
            long hash = hash(server + "-vnode-" + i);
            ring.remove(hash);
        }
    }

    public String getServer(String key) {
        if (ring.isEmpty()) return null;
        long hash = hash(key);
        // Find nearest server on ring clockwise
        if (!ring.containsKey(hash)) {
            Long tailKey = ring.ceilingKey(hash); // Find next greater or equal hash on ring
            hash = (tailKey == null) ? ring.firstKey() : tailKey;
        }
        return ring.get(hash);
    }

    private long hash(String key) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(key.getBytes());
            // Map MD5 bytes to 32-bit unsigned numeric coordinate
            long res = ((long) (bytes[3] & 0xFF) << 24) |
                       ((long) (bytes[2] & 0xFF) << 16) |
                       ((long) (bytes[1] & 0xFF) << 8)  |
                       ((long) (bytes[0] & 0xFF));
            return res & 0xffffffffL;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
```
