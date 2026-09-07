# Lecture 24 Master Study Guide: Database Replication vs. Sharding

High-scale systems must ensure data availability and handle heavy write loads. This guide analyzes Database Replication (redundancy) versus Physical Sharding (distribution).

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS
*   **WHAT**: **Database Replication** duplicates the entire dataset across multiple active or passive database nodes. **Database Sharding** partitions and distributes the dataset horizontally across separate physical database instances.
*   **WHY**: Replication solves **Availability and Read Bottlenecks**. If your database is read-heavy (e.g., Netflix stream listings), replicating the data to follower nodes allows distributing the read query load. However, replication does not solve **Write Bottlenecks** or storage limits because every node must process every write and store a copy of the entire dataset. Sharding solves this by splitting the dataset into distinct pieces, allowing servers to process writes independently and store larger datasets than single-disk capacities.
*   **WHERE & WHEN**: 
    *   **Replication**: Configured on almost every production database database to ensure high availability and disaster recovery.
    *   **Sharding**: Implemented on ultra-high-scale systems where datasets exceed single-node disk or CPU capacity (e.g., WhatsApp chat messages).
*   **HOW**:
    *   **Replication Loop**: All writes hit a central **Master (Primary) Database** node. The master writes the changes to its WAL, then replicates them synchronously or asynchronously to **Replica (Follower) Databases**. Clients query replicas for read-heavy actions.
    *   **Sharding Loop**: When a client issues a write, the system evaluates a **Shard Key** (e.g., User ID). A hashing algorithm maps this shard key to a specific physical database instance (Shard). The write is routed directly to that shard, bypasses the rest of the database fleet.

---

## 2. TRADEOFF ANALYSIS
*   **Replication Advantages**:
    *   **High Availability & Failover**: If the master node crashes, a follower can be elected to master in milliseconds with zero data loss.
    *   **Read Scale-Out**: Distribute millions of concurrent read queries across multiple read replicas.
*   **Replication Disadvantages**:
    *   **Write Bottleneck**: Writes cannot scale beyond the capacity of the master node.
    *   **Data Lag / Inconsistency**: Asynchronous replication causes read-replicas to lag behind the master, leading to stale reads.
*   **Sharding Advantages**:
    *   **Unlimited Write Scalability**: Adding more database shards increases write throughput linearly.
    *   **Storage Expansion**: Allows storing petabytes of data across cheap commodity storage nodes.
*   **Sharding Disadvantages**:
    *   **No Multi-Shard Joins**: Cross-shard joins are incredibly slow and complex.
    *   **Re-sharding Complexity**: If a shard grows too large, rebalancing the keys space across new physical servers requires complex coordination (e.g., consistent hashing).

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES
**WhatsApp** relies on sharding to store user message histories. Because WhatsApp processes billions of chat messages per day, storing all messages in a single database or replicating them to multiple nodes would instantly crash the database storage layers. WhatsApp shards their database instances by **User ID**. If User A sends a message to User B, the system hashes the destination User ID and routes the write directly to Shard 42, which holds User B's mailbox, ensuring writes are distributed across thousands of independent database instances.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS
*   **Mental Model**: Think of managing a physical filing system.
    *   **Replication (Photocopying)**: You have a single master filing cabinet. Every time a new document is filed, you make three photocopies and put them into three identical filing cabinets nearby. Now, three employees can read different copies at the same time. But you still have to manually file every new document in all four cabinets, and your maximum capacity is limited by the size of a single cabinet.
    *   **Sharding (The Folder Split)**: You split your files alphabetically. Cabinet 1 holds A-G, Cabinet 2 holds H-O, and Cabinet 3 holds P-Z. Now, you can file documents three times faster because employees can file in different cabinets in parallel. Your storage capacity is tripled, but finding files for clients with multiple last names requires searching across separate cabinets.

```
  [ DATABASE REPLICATION ]
  Client Write ───► [ Master Node (Primary) ]
                           │
                     (WAL Replication)
                           ▼
            ┌──────────────┴──────────────┐
            ▼                             ▼
  [ Replica 1 (Read) ]          [ Replica 2 (Read) ]


  [ DATABASE SHARDING ]
  Client ───► [ Shard Key Router ] ─── (User_ID Hash)
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
     [ Shard 1 ] [ Shard 2 ] [ Shard 3 ]
     (User A-F)  (User G-M)  (User N-Z)
```

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

#### JavaScript / TypeScript Shard Routing
Implementing a custom client-side sharding router in Node.js.
```typescript
import { Client } from 'pg';

const SHARDS = [
    new Client({ host: 'db-shard-1.local' }),
    new Client({ host: 'db-shard-2.local' })
];

function getShardIndex(userId: string): number {
    // Hash-based sharding key allocation
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % SHARDS.length;
}

async function writeUserData(userId: string, data: any) {
    const shardIndex = getShardIndex(userId);
    const targetDb = SHARDS[shardIndex];
    await targetDb.query('INSERT INTO user_profile (id, data) VALUES ($1, $2)', [userId, data]);
}
```

#### Java Spring Boot Read-Write Routing
Using AbstractRoutingDataSource to route queries dynamically based on read-only transactions.
```java
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.transaction.support.TransactionSynchronizationManager;

public class RoutingDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        // Route reads to replicas, writes to master
        return TransactionSynchronizationManager.isCurrentTransactionReadOnly() 
            ? "REPLICA" : "MASTER";
    }
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER
*   **AWS**: Amazon RDS Aurora Global Databases (Global multi-AZ replication) vs. Amazon DynamoDB sharding partitions.
*   **Docker**:
```yaml
version: '3.8'
services:
  db-master:
    image: mysql:latest
    container_name: mysql_master
    environment:
      MYSQL_ROOT_PASSWORD: master_password
  db-slave:
    image: mysql:latest
    container_name: mysql_slave
    environment:
      MYSQL_ROOT_PASSWORD: slave_password
    depends_on:
      - db-master
```
*   **Kubernetes (K8s)**:
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql-shard
spec:
  serviceName: "mysql"
  replicas: 2 # Orchestrates two distinct physical database states
```
