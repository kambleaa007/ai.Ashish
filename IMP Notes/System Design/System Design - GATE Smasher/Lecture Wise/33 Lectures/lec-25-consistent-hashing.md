# Lecture 25 Master Study Guide: Consistent Hashing

Traditional hashing schemes fail when distributed systems scale horizontally. Consistent Hashing is the mathematical solution that minimizes data movement during cluster re-sharding.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS
*   **WHAT**: **Consistent Hashing** is a distributed hashing paradigm that maps both database server nodes and client data keys onto a circular **hash ring topology**.
*   **WHY**: In simple load-balancing setups, database keys are mapped to servers using the modulo operator: $Hash(Key) \pmod N$, where $N$ is the number of servers. If the cluster size changes (e.g., $N$ scales from 4 to 5 because of traffic spikes), almost every single key hashes to a completely different server number. This invalidates up to 99% of database caches and triggers a massive cascading database overload. Consistent Hashing guarantees that when a node is added or removed, only $1/N$ of the keys need to be reallocated.
*   **WHERE & WHEN**: Sit at the routing layer of distributed caching grids (Redis/Memcached clusters), sharded NoSQL databases (Cassandra, DynamoDB), and dynamic Layer 7 request gateways.
*   **HOW**:
    1.  **Hash Ring Space**: A hash function (e.g., MD5 or SHA-1) defines a fixed circular range (e.g., 0 to $2^{32}-1$).
    2.  **Server Placement**: Server IP addresses are hashed and placed at specific coordinates along this ring.
    3.  **Key Mapping**: Client data keys are hashed using the exact same function. To find its home server, the key walks **clockwise** along the ring until it meets the first server node.
    4.  **Virtual Nodes**: To prevent "Hotspots" (where one physical server gets a disproportionate share of the hash ring space), each physical server is mapped to multiple **Virtual Nodes (V-Nodes)** distributed randomly across the ring.

---

## 2. TRADEOFF ANALYSIS
*   **Advantages**:
    *   **Elastic Sharding**: Adding or removing database nodes relocates only a small fraction of keys, preventing thundering herds on databases.
    *   **Load Balancing Uniformity**: Virtual nodes distribute keys evenly across physical hardware, avoiding hotspots.
    *   **Decentralized Coordination**: Routers can find a key's server location independently without query metadata masters.
*   **Disadvantages**:
    *   **Increased Code Complexity**: Implementing and maintaining a dynamic hash ring is significantly harder than basic modulo routing.
    *   **Re-routing Latency**: Ring searches require binary search trees ($O(\log N)$) instead of simple constant-time math calculations.

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES
**Discord** implements consistent hashing rings inside its dynamic gateway routing layers. When users join voice channels, Discord maps active voice channel sessions to physical server nodes using a consistent hashing ring. This ensures that when individual Discord servers scale up or fail under heavy user load, only a tiny fraction of active user voice calls are disconnected and rerouted, while the remaining millions of user connections remain uninterrupted.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS
*   **Mental Model**: Think of a circular running track.
    *   **Traditional Modulo**: You are running on a track and must drop a package off at one of 4 boxes spaced evenly. If the stadium adds a 5th box, every single runner is forced to drop their packages off at completely different box locations.
    *   **Consistent Hashing**: You hash the boxes and place them on the track. When you run, you carry a package, hash it to get a coordinate, drop onto the track, and jog clockwise until you find a box. If a new box is added, it only intercepts packages that were previously destined for the box directly ahead of it, leaving the rest of the track completely unaffected.

```
                      [ CONSISTENT HASH RING ]
                          Coordinate 0
                           /       \
             [Node_A_V1]  *         *  [Node_C_V1]
                         /           \
           [Key_101] ──► *             *  [Node_B_V1]
                         \           /
             [Node_C_V2]  *         *  [Key_205] ──► (mapped to Node_B_V1)
                           \       /
                        [Node_A_V2]
```

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

#### JavaScript / TypeScript Ring Hash Implementation
Building a production-ready Consistent Hashing Ring with Virtual Nodes.
```typescript
import crypto from 'crypto';

class ConsistentHashRing {
    private ring: Map<number, string> = new Map();
    private sortedKeys: number[] = [];
    private vNodesCount: number;

    constructor(vNodesCount = 100) {
        this.vNodesCount = vNodesCount;
    }

    private hash(val: string): number {
        const md5 = crypto.createHash('md5').update(val).digest();
        return md5.readUInt32BE(0); // Return 32-bit integer hash space coordinate
    }

    addNode(node: string) {
        for (let i = 0; i < this.vNodesCount; i++) {
            const hash = this.hash(`${node}-vnode-${i}`);
            this.ring.set(hash, node);
            this.sortedKeys.push(hash);
        }
        this.sortedKeys.sort((a, b) => a - b);
    }

    getNode(key: string): string {
        if (this.ring.size === 0) throw new Error("Ring is empty");
        const hash = this.hash(key);
        
        // Binary search the closest server coordinate clockwise
        let low = 0, high = this.sortedKeys.length - 1;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (this.sortedKeys[mid] >= hash) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        // Wrap around circular ring structure
        const ringIdx = low % this.sortedKeys.length;
        return this.ring.get(this.sortedKeys[ringIdx])!;
    }
}
```

#### Java Consistent Hash Ring Implementation
```java
import java.security.MessageDigest;
import java.util.TreeMap;

public class ConsistentHashRing {
    private final TreeMap<Long, String> ring = new TreeMap<>();
    private final int numberOfReplicas;

    public ConsistentHashRing(int numberOfReplicas) {
        this.numberOfReplicas = numberOfReplicas;
    }

    private long hash(String key) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(key.getBytes());
            return ((long) (digest[3] & 0xFF) << 24) |
                   ((long) (digest[2] & 0xFF) << 16) |
                   ((long) (digest[1] & 0xFF) << 8)  |
                   ((long) (digest[0] & 0xFF));
        } catch (Exception e) {
            return key.hashCode();
        }
    }

    public void addServer(String server) {
        for (int i = 0; i < numberOfReplicas; i++) {
            ring.put(hash(server + "-vnode-" + i), server);
        }
    }

    public String getServer(String key) {
        if (ring.isEmpty()) return null;
        long hash = hash(key);
        // Find the tail map of keys equal or greater than the key hash coordinate
        var tailMap = ring.tailMap(hash);
        long nodeHash = tailMap.isEmpty() ? ring.firstKey() : tailMap.firstKey();
        return ring.get(nodeHash);
    }
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER
*   **AWS**: Amazon ElastiCache Redis Cluster mode (automatically implements hash-ring slot allocations).
*   **Docker (Dynamic Caching Fleet)**:
```yaml
version: '3.8'
services:
  redis-node-1:
    image: redis:alpine
    ports: ["6379"]
  redis-node-2:
    image: redis:alpine
    ports: ["6379"]
```
*   **Kubernetes (K8s)**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hash-ring-router
spec:
  replicas: 2
  template:
    metadata:
      labels:
        app: router-node
```
