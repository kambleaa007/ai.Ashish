# Topic 7 Master Study Guide: Database Partitioning vs. Sharding & SQL vs. NoSQL

## 1. WHAT, WHY, WHERE, HOW (Technical Mechanics)

### SQL vs. NoSQL Paradigm Split
* **Relational Databases (SQL - e.g., PostgreSQL, MySQL)**: Store highly structured data in rigid schemas using tables with rows and columns. They enforce strict relational constraints (Foreign Keys) and offer strong ACID transactional guarantees. They scale primarily vertically.
* **Non-Relational Databases (NoSQL - e.g., MongoDB, Cassandra, Neo4j, Redis)**: Prioritize schema flexibility, speed, and horizontal scaling. They model data as JSON-like documents, key-value pairs, column-families, or graph networks. They follow the BASE eventual consistency model.

### ACID vs. BASE

| ACID (SQL Guarantees) | BASE (NoSQL Philosophy) |
| :--- | :--- |
| **Atomicity**: All operations in a transaction succeed, or all fail. | **Basically Available**: The system remains available even under severe partial outages. |
| **Consistency**: Data transitions from one valid schema state to another. | **Soft State**: Data state may drift asynchronously without user action. |
| **Isolation**: Concurrent transactions execute without cross-contamination. | **Eventual Consistency**: Replicas synchronize and reach identical states over time. |
| **Durability**: Once committed, records are permanently saved to disk. | |

### NoSQL Families
1. **Key-Value (e.g., Redis)**: Ultra-fast key-blob dictionary. Excellent for cache layers and active session stores.
2. **Document (e.g., MongoDB)**: Stores data in nested JSON documents. Highly flexible schemas for catalog configurations.
3. **Column-Family (e.g., Cassandra)**: Organizes storage by columns rather than rows. Incredible write performance for time-series logs.
4. **Graph (e.g., Neo4j)**: Focuses on node nodes and edge relationships. Essential for recommendation engines and social mapping.

### Database Partitioning vs. Sharding
* **Database Partitioning (Local Node Splitting)**: Dividing a single massive table into smaller logical subsets **within a single database engine instance** (e.g., partitioning a `sales` table by year into a `sales_2023` and `sales_2024` table on the same disk). 
* **Database Sharding (Horizontal Physical Distribution)**: Splitting and distributing your dataset across **multiple physically independent database servers**.
  * **Range Sharding**: Split based on ranges (e.g., keys A-M to Server 1, N-Z to Server 2).
  * **Hash Sharding**: Take a sharding key, run it through a hashing function modulo the number of servers (`hash(userId) % total_servers`), and route the write to that destination. This ensures a highly uniform distribution of data.

---

## 2. TRADEOFFS (Advantages & Disadvantages under High Load)

| Metric | SQL / Relational Databases | NoSQL / Distributed Databases |
| :--- | :--- | :--- |
| **Schema Stability** | Rigid. Modifying schemas on high-load tables can lock databases. | Dynamic. Nodes can write documents with completely varied fields. |
| **Scaling Mechanics** | Difficult. Requires expensive vertical scaling or complex write replication topologies. | Native. Easily scaled horizontally by appending extra nodes to clusters. |
| **Transactional Reliability**| Perfect. Strong ACID compliance makes them essential for financial accounting. | Relaxed. Eventual consistency can result in stale read states temporarily. |
| **Query Complexity** | Excellent. Support highly complex nested relational multi-table JOIN operations. | Limited. High-load NoSQL queries must avoid JOINs and rely on pre-denormalized tables. |

---

## 3. PRODUCTION EXAMPLES
* **Netflix**: Uses **Cassandra (Column-Family NoSQL)** as their primary global distributed storage engine. Every time you pause, seek, or watch a video, a continuous telemetry log stream is written asynchronously. Relational engines would exhaust active connection limits under this write load. Cassandra handles this write-heavy streaming telemetry across multi-region nodes effortlessly.
* **Uber**: Operates a globally distributed sharded datastore called **Schemaless** (built on top of MySQL). Because driver geolocations and rider logs generate massive write traffic, Uber shards database instances utilizing the `trip_id` as the sharding key. This ensures all trip coordinates route to the exact same MySQL shard node, minimizing cross-node query latency.

---

## 4. MEMORY ANCHORS

### The 20-Year Non-Tech Analogy: The Single Filing Cabinet vs. The Distributed Archives
* **SQL (Strict File Cabinet)**: You keep client records in a single high-quality filing cabinet. Every folder must use the exact same template—colored tabs, structured forms, pre-defined signature blocks (ACID schemas). If you run out of space, you buy a taller cabinet (Vertical Scaling).
* **NoSQL (The Box Storage)**: You have a warehouse of boxes. You drop document portfolios of various sizes inside. Folder 1 contains a paper contract, Folder 2 contains photos, Folder 3 contains audio tapes. This is flexible, and if you run out of room, you simply buy more boxes and stack them in new aisles (Horizontal Scaling).
* **Partitioning vs. Sharding**:
  * **Local Partitioning**: You have a 1,000-page client ledger. To speed up lookups, you split it into 12 sections inside the folder—one tab per month. But the ledger folder remains in the exact same desk drawer.
  * **Sharding**: You have 10,000 client ledger pages. It is too heavy for your office. You split the ledger pages by alphabetical name ranges: letters A-D are shipped to your Brooklyn archive office, E-H to your Manhattan office, and the rest elsewhere. You now have scaled your physical capacity horizontally.

### ASCII Architecture Diagram
```
                     [ Incoming Client Write ]
                                │
                        (Computes Hash Key)
                       hash(userId) % 3 = Shard ID
                                │
         ┌──────────────────────┼──────────────────────┐
         ▼                      ▼                      ▼
  [ Database Shard 1 ]   [ Database Shard 2 ]   [ Database Shard 3 ]
  (Server IP: 10.0.1.1)  (Server IP: 10.0.1.2)  (Server IP: 10.0.1.3)
```

---

## 5. LANGUAGES

### Node.js / TypeScript (NoSQL Document Write Handler with MongoDB)
Connecting and writing asynchronously to a flexible schema document database utilizing the official MongoDB framework:
```typescript
import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb://production-mongo-shard:27017';
const client = new MongoClient(mongoUrl);

interface DynamicUserProfile {
    userId: string;
    email: string;
    [key: string]: any; // Allows complete schema-less field write flexibility
}

async function saveUserProfile(profile: DynamicUserProfile) {
    await client.connect();
    const db = client.db('user_catalog');
    const collection = db.collection('profiles');

    // Atomic schema-less write execution
    const result = await collection.insertOne(profile);
    console.log(`User profile written successfully. ID: ${result.insertedId}`);
}
```

### Java 25+ (Distributed SQL Sharding Router Simulator)
This class demonstrates a simulated SQL sharding router, computing destination shard connections using Loom-based thread task management:
```java
import java.net.Socket;
import java.util.concurrent.Executors;

public class DatabaseShardRouter {
    private static final String[] SHARD_CONNECTION_IPS = {"10.0.1.10", "10.0.1.11", "10.0.1.12"};

    public void routeQueryToShard(String userId, String sqlQuery) {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            executor.submit(() -> {
                // Calculate destination physical shard using simple Hash routing
                int shardIndex = Math.abs(userId.hashCode()) % SHARD_CONNECTION_IPS.length;
                String targetShardIp = SHARD_CONNECTION_IPS[shardIndex];

                // Direct the database client connection exclusively to the targeted physical node
                executeQueryOnServer(targetShardIp, sqlQuery);
            });
        }
    }

    private void executeQueryOnServer(String serverIp, String query) {
        System.out.println("Querying Server Node [" + serverIp + "] with Query: " + query);
    }
}
```

---

## 6. INFRASTRUCTURE

### Production Sharded PostgreSQL Cluster Deployment Setup
This Kubernetes manifest details deploying a PostgreSQL StatefulSet. StatefulSets are required for database workloads to ensure pods maintain consistent hostname identities and retain persistent disk claims across container restarts:
```yaml
# StatefulSet for Sharded Database Node
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-shard-node
  namespace: production
spec:
  serviceName: "postgres-shards"
  replicas: 3
  selector:
    matchLabels:
      app: postgres-db
  template:
    metadata:
      labels:
        app: postgres-db
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
          name: dbport
        env:
        - name: POSTGRES_DB
          value: shard_data
        - name: POSTGRES_USER
          value: shard_admin
        - name: POSTGRES_PASSWORD
          value: secure_password
        volumeMounts:
        - name: postgres-persistent-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-persistent-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 100Gi
```
