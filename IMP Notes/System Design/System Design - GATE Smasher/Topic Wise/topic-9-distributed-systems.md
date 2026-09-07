# Topic 9 Master Study Guide: Distributed Systems Theory (CAP, PACELC, & Consistent Hashing)

## 1. WHAT, WHY, WHERE, HOW (Technical Mechanics)

### The CAP Theorem
In a distributed data system, any network failure will inevitably lead to **Network Partitions (P)**—situations where servers remain alive but cannot talk to each other. When a partition occurs, a database must trade off between two fundamental behaviors:
* **Consistency (C)**: Every read request returned by any node in the cluster yields the exact same, most recent write. If a node cannot verify its data is up to date, the query is rejected.
* **Availability (A)**: Every healthy node in the cluster returns a non-error response, even if the returned data is stale due to partition synchronization lags.
* **Partition Tolerance (P)**: The system continues to operate despite network partition errors. **You cannot "choose" CP or AP in a distributed system, because P is a physical reality. You must decide whether your system chooses Consistency or Availability during a partition.**

### PACELC Theorem (Beyond CAP)
CAP only describes system behavior *during network partitions*. PACELC completes distributed theory by describing behavior during *normal operations*:
* **If there is a Partition (P)**, trade off **Availability (A)** vs. **Consistency (C)**.
* **Else (E)**, when everything is operating normally, trade off **Latency (L)** vs. **Consistency (C)**.

### Consistent Hashing
In a standard horizontal server hashing scheme (`hash(key) % total_servers`), adding or removing a single database server completely shifts the entire keyspace. This causes a total cache invalidation and forces databases to restage records.
* **The Mechanics of Consistent Hashing**:
  * Both database servers and data keys are mapped onto a logical **360-degree Hash Ring** using their hashed values.
  * To route a write, you hash the data's key and travel **clockwise** around the hash ring until you encounter the first server node.
  * **The Scalability Impact**: When a server is added or removed, **only a fraction of the keys (approximately `1 / N`) need to be re-mapped**, keeping cluster cache pools intact.
  * **Virtual Nodes**: To prevent uneven key distribution (data hotspots), multiple virtual nodes (replicas) of each physical server are placed around the ring.

---

## 2. TRADEOFFS (Advantages & Disadvantages under High Load)

| System Design Choice | Advantages | Disadvantages |
| :--- | :--- | :--- |
| **CP System (Consistent)** | Guarantees absolute correctness. Critical for financial ledgers and bank balances. | Under network partition events, nodes must reject incoming write queries, causing user outages. |
| **AP System (Available)** | High resilience. Keeps systems functional and accepting traffic even during outages. | Users will read stale data (e.g., seeing deleted items in their catalog feed). |
| **Consistent Hashing** | Native, near-instant horizontal scalability. Adding caching servers never breaks existing cache pools. | Requires more complex hashing logic and memory management at the routing gateway layer. |

---

## 3. PRODUCTION EXAMPLES
* **Amazon DynamoDB**: Uses a highly optimized **AP / PACELC** architecture. Because Amazon calculated that even a 100ms latency increase costs millions in lost sales, DynamoDB chooses **Latency (L)** over **Consistency (C)** under normal operations (PA/EL). It uses consistent hashing to partition data across AWS physical hardware pools dynamically.
* **ZooKeeper / Consul**: Choose **Consistency (C)** under partitions. They act as distributed configuration registries. Having stale configuration information can cause server fleets to route traffic to dead services. When a partition occurs, ZooKeeper immediately blocks writes until the partition resolves and a consensus is reached (CP).

---

## 4. MEMORY ANCHORS

### The 20-Year Non-Tech Analogy: The Two Bank Branches and the Clockwise Dinner Table
* **CAP Theorem (The Two Branches)**: You have a bank with two physical branches—one in London, one in Tokyo. 
  * **Normal State**: If a customer deposits $100 in London, a clerk calls Tokyo and updates their ledger.
  * **Network Partition**: The trans-oceanic phone lines cut. London and Tokyo cannot communicate.
  * **AP Option**: London accepts deposits and Tokyo keeps cash withdrawals active. This is Available (AP), but ledgers are now completely out of sync (Inconsistent).
  * **CP Option**: London and Tokyo agree that until the lines are repaired, they will lock accounts and refuse all operations. This is Consistent (CP), but customers are locked out (Unavailable).
* **Consistent Hashing (The Clockwise Dinner Table)**: Imagine 5 plates (Servers) positioned around a circular table. You hold a handful of marbles (Data Keys). For each marble, you drop it onto a random spot on the table and slide it **clockwise** until it rolls into the first plate it hits. If you add a 6th plate to the table, only the marbles directly behind that plate roll into it—all other marbles on the rest of the table stay in their original plates.

### ASCII Architecture Diagram
```
                     Consistent Hashing Ring (0 - 360 Degrees)
                                 
                                [Server A] (45°)
                               /                                      /                               [Key 1] (300°)          [Server B] (135°)
                     \                      /
                       \                  /
                       [Server C] (225°)
                       
   * Key 1 (300°) moves clockwise and lands on Server A (45°)
   * If Server B (135°) is removed, only Keys mapping to Server B shift to Server C (225°)
```

---

## 5. LANGUAGES

### Node.js / TypeScript (Consistent Hashing Ring Router Implementation)
This class implements a consistent hashing ring, mapping dynamic database keys to active server nodes:
```typescript
import crypto from 'crypto';

class ConsistentHashingRing {
    private ring: Map<number, string> = new Map();
    private sortedKeys: number[] = [];

    private hash(val: string): number {
        const hash = crypto.createHash('sha256').update(val).digest();
        return hash.readUInt32BE(0); // Return numerical representation
    }

    public addServer(server: string) {
        const hashKey = this.hash(server);
        this.ring.set(hashKey, server);
        this.sortedKeys.push(hashKey);
        this.sortedKeys.sort((a, b) => a - b);
    }

    public getServer(key: string): string {
        if (this.ring.size === 0) throw new Error("No servers in ring");
        const hashKey = this.hash(key);

        // Find the first server clockwise (key >= hashKey)
        const targetKey = this.sortedKeys.find(k => k >= hashKey) || this.sortedKeys[0];
        return this.ring.get(targetKey) as string;
    }
}
```

### Java 25+ (CAP Consistent consensus state machine simulator)
The following simulation demonstrates a CP replica state machine rejecting operations when network connectivity drops:
```java
import java.util.concurrent.Executors;

public class DistributedConsensusNode {
    private final String nodeId;
    private boolean isPartitioned = false;

    public DistributedConsensusNode(String nodeId) {
        this.nodeId = nodeId;
    }

    public void setPartitionState(boolean isPartitioned) {
        this.isPartitioned = isPartitioned;
    }

    public boolean processAtomicWrite(String key, String value) {
        if (isPartitioned) {
            // CP Choice: Reject write immediately rather than risk returning stale state
            System.err.println("Node [" + nodeId + "] is Partitioned! Rejecting transaction to maintain Consistency.");
            return false;
        }
        
        // Simulating the transaction commit on a virtual thread
        Thread.startVirtualThread(() -> {
            commitToReplicaStateStore(key, value);
        });
        return true;
    }

    private void commitToReplicaStateStore(String key, String value) {
        System.out.println("Node [" + nodeId + "] committed: " + key + " = " + value);
    }
}
```

---

## 6. INFRASTRUCTURE

### Production-Grade Kubernetes Configuration (Consistent Consul State Pods)
Consul is a CP registry requiring strict node configuration. This stateful manifest guarantees cluster membership consistency:
```yaml
# Consul StatefulSet for CP Coordination Cluster
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: consul-cp-cluster
  namespace: production
spec:
  serviceName: "consul-internal"
  replicas: 3
  selector:
    matchLabels:
      app: consul-node
  template:
    metadata:
      labels:
        app: consul-node
    spec:
      containers:
      - name: consul
        image: consul:1.15
        args:
          - "agent"
          - "-server"
          - "-bootstrap-expect=3"
          - "-data-dir=/consul/data"
          - "-bind=0.0.0.0"
          - "-client=0.0.0.0"
        ports:
        - containerPort: 8500
          name: http
        - containerPort: 8301
          name: serf-lan
        volumeMounts:
        - name: consul-data
          mountPath: /consul/data
  volumeClaimTemplates:
  - metadata:
      name: consul-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```
