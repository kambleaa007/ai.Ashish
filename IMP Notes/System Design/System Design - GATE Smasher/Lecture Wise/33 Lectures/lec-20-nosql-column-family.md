# Lecture 20 Master Study Guide: Column-Family Databases (Cassandra, HBase)

Column-Family databases are NoSQL systems designed to scale horizontally across hundreds of nodes to handle petabytes of data, providing extremely high write throughput and sub-millisecond query performance for analytical or sparse datasets.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS
*   **WHAT**: A **Column-Family Database** is an active-active or active-passive distributed NoSQL database that stores data in columns grouped into family structures rather than rows. Unlike relational rows, column families group related columns together and store their data contiguously on disk.
*   **WHY**: Relational databases store records sequentially on disk (row-by-row). If you execute an analytical query like "SELECT AVG(age) FROM users", the database engine must scan every single row from disk, loading useless columns (names, passwords, addresses) into RAM. Column-family databases allow reading only the requested column families contiguously from disk, eliminating redundant disk I/O and CPU memory loading cycles.
*   **WHERE & WHEN**: Sits in the big data storage and distributed analytical layers. It is ideal for storing large, sparse datasets (where many rows have empty columns), time-series data, logging, IoT metrics, and real-time analytical processing (OLAP).
*   **HOW**:
    1.  **Row Key Mapping**: Every row has a unique identifier (Row Key). A Row Key contains a set of Column Families.
    2.  **Column Grouping**: Each Column Family contains dynamic columns, with each column containing a name, a value, and a 64-bit timestamp.
    3.  **LSM Tree Write Path**: Writes are appended to an in-memory commit log (Write-Ahead Log or WAL) for durability, written to an in-memory sorted cache called a **MemTable**, and then flushed to immutable sorted disk files called **SSTables (Sorted String Tables)**.
    4.  **Compaction**: In the background, SSTables are merged and cleaned (tombstoned/deleted records are purged) using a process called **Compaction** to maintain fast read speeds.

---

## 2. TRADEOFF ANALYSIS
*   **Advantages**:
    *   **Extremely High Write Scalability**: Writes are simple append operations to RAM (MemTable) and a sequential log, bypassing heavy SQL transactional checking and random disk seeks.
    *   **Dynamic / Sparse Schemas**: Columns can be added dynamically to individual row keys. Empty columns do not consume a single byte of disk space.
    *   **Analytical Performance**: Out-of-the-box support for aggregate calculations since entire column ranges are packed sequentially on the disk block.
*   **Disadvantages**:
    *   **Heavy Read Path Penalty**: If data is not cleanly organized or cached, a read must scan multiple immutable SSTables on disk, requiring bloom filters and cache optimizations.
    *   **No Multi-Row Transactions**: Lacks standard ACID support across multiple row keys or column families.
    *   **No Relational Joins**: Joining tables is completely unsupported. Data must be heavily denormalized (copied repeatedly under different partition keys) to support target read patterns.

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES
**Netflix** heavily utilizes **Apache Cassandra** (a masterless distributed column-family database) to store and stream user viewing history. Because every user click, pause, and play generates an event, Netflix processes billions of write-heavy metrics per day. Cassandra's masterless ring topology allows Netflix to scale writes horizontally across global AWS regions with zero downtime.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS
*   **Mental Model**: Think of an Excel spreadsheet representing a company roster. 
    *   **SQL (Row-Based)**: You print out each employee's details on a separate index card and file them in a drawer. To find the average age, you must pull out every single card, read the whole card, write down the age, and file it back.
    *   **Column-Family**: You cut the spreadsheet into vertical strips (columns) and group similar columns (e.g., all Salary columns together, all Age columns together). To find the average age, you pull out just the "Age" paper strip. You don't have to look at names, IDs, or departments.

```
                  [ COLUMN FAMILY ARCHITECTURE ]
  Row Key: User_1001 ───► [ Profile_Family ] ───► name: "Amit" (ts: 17257121)
                                             ───► dept: "Engineering"
                     ───► [ System_Family ]  ───► last_login: "2026-09-07"
                                             ───► is_active: "true"
```

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

#### JavaScript / TypeScript & Node.js
In Node.js, we interface with Cassandra using the official `cassandra-driver` utilizing dynamic connection pooling.
```typescript
import { Client } from 'cassandra-driver';

const client = new Client({
    contactPoints: ['cassandra-node1.local', 'cassandra-node2.local'],
    localDataCenter: 'us-east-1',
    keyspace: 'user_analytics'
});

async function writeMetrics(userId: string, eventName: string, duration: number) {
    // Write queries are fast append operations in Cassandra
    const query = `INSERT INTO user_events (user_id, event_name, duration_ms, event_time) 
                   VALUES (?, ?, ?, toTimestamp(now()))`;
    await client.execute(query, [userId, eventName, duration], { prepare: true });
}
```

#### Java (Java 25+ / Spring Boot)
Using Java 25, we map Column Family aggregates using Spring Data Cassandra with native non-blocking Reactive sockets.
```java
import org.springframework.data.cassandra.repository.ReactiveCassandraRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import java.util.UUID;

@Repository
public interface EventRepository extends ReactiveCassandraRepository<UserEvent, UUID> {
    // Fetches sequential columns from a single partition key efficiently
    Flux<UserEvent> findByUserId(String userId);
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER
*   **AWS**: Amazon Keyspaces (a fully managed serverless Apache Cassandra-compatible database service).
*   **Docker**:
```yaml
services:
  cassandra:
    image: cassandra:latest
    container_name: cassandra_node
    ports:
      - "9042:9042"
    environment:
      CASSANDRA_CLUSTER_NAME: "DevCluster"
```
*   **Kubernetes (K8s)**:
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: cassandra
spec:
  serviceName: cassandra
  replicas: 3
  selector:
    matchLabels:
      app: cassandra
  template:
    metadata:
      labels:
        app: cassandra
    spec:
      containers:
      - name: cassandra
        image: cassandra:latest
        ports:
        - containerPort: 9042
```
