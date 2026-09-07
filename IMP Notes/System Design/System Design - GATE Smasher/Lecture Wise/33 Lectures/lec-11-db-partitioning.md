# Lecture 11 Master Study Guide: Database Partitioning (Logical & Physical Local Splitting)

This master-class study guide covers the technical mechanics, strategies, and implementation details of Database Partitioning inside a single database server node. We analyze how database engines split multi-billion row tables locally to keep index sizes manageable and prevent query latency degradation.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS

```
                         [ BILION-ROW TABLE ]
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼ (Vertical: Split Columns)                     ▼ (Horizontal: Split Rows)
  ┌───────────────┬───────────────┐               ┌───────────────────────────────┐
  │  ID | Name    │  Bio | Photos │               │ Partition 1: Range 'A' - 'M'  │
  ├───────────────┼───────────────┤               ├───────────────────────────────┤
  │  User Profile │  Heavy Blobs  │               │ Partition 2: Range 'N' - 'Z'  │
  └───────────────┴───────────────┘               └───────────────────────────────┘
```

### WHAT
**Database Partitioning** is the process of decomposing a large table or index into smaller, more manageable physical subsets (partitions) within a **single database engine instance**. While the table remains a single logical entity to the application layer, the underlying storage engine stores and manages the data across separate physical storage units (tablespaces) on disk.

### WHY
Under massive transaction volumes, database tables that grow to billions of rows suffer from:
1.  **Index Bloat**: High B-Tree index depths require multiple disk-seek operations per query, degrading search speeds from $O(\log N)$ to linear-like delays as RAM caches overflow.
2.  **I/O Contention**: Read/Write heads constantly lock files when performing full-table scans.
3.  **Maintenance Blockages**: Rebuilding indexes, backing up data, or running schema alterations on multi-terabyte files locks the entire system, causing long downtime.

### WHERE & WHEN
Lives strictly within the **Database Storage Engine Layer** (e.g., PostgreSQL, MySQL InnoDB). It is implemented when table sizes exceed the memory cache capabilities of a single host (typically >50GB-100GB or >10 million rows) and queries begin suffering from disk-swapping latency.

### HOW (Mechanics)
1.  **Partition Key Selection**: The architect designates a specific column (e.g., `created_at` or `tenant_id`) as the partition boundary.
2.  **Partition Scheme Definition**: 
    *   **Range Partitioning**: Maps data to partitions based on value ranges (e.g., partition by year/month).
    *   **List Partitioning**: Groups rows based on explicit enumerated lists (e.g., partition by `country_code`).
    *   **Hash Partitioning**: Applies a hash function to the key to distribute rows evenly across $N$ predefined physical tablespaces.
3.  **Partition Pruning**: When a query containing the partition key is executed (e.g., `SELECT * FROM orders WHERE order_date = '2026-09-07'`), the query planner bypasses scanning all other partitions. It directly targets the specific subdirectory on disk containing that range, converting a linear search into a targeted local scan.

---

## 2. TRADEOFF ANALYSIS

*   **Advantages**:
    *   **Partition Pruning Efficiency**: Drastically reduces physical disk I/O by executing scans solely on relevant target partitions.
    *   **Fast Data Eviction**: Drops old log history or archival rows in microseconds using physical file operations (`ALTER TABLE DROP PARTITION`) rather than executing millions of slow transactional deletes (`DELETE FROM WHERE date < X`), which cause heavy transaction log lock-up.
    *   **Independent Indexing**: Each partition maintains its own local B-Tree index. This prevents global index leaf node fragmentation and keeps indexes tiny enough to fit entirely inside server RAM.
*   **Disadvantages**:
    *   **Global Query Penalty**: Queries that do not specify the partition key in their `WHERE` clause force the query planner to run parallel scans across **all partitions** (scatter-gather), causing severe latency spikes.
    *   **Unique Constraint Rules**: Unique keys and Primary keys must include the partition key column. This makes enforcing global uniqueness across other columns highly complex.
    *   **No Cross-Partition Joins**: Joining tables that are partitioned on different keys can lead to high disk-swapping overhead.

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES

### Netflix: Playback History Aggregation
Netflix records millions of video playback sessions every second. This playback activity log is stored in a master history database. To prevent this massive table from choking under index bloat, Netflix implements local **Range-List Partitioning** on their hot storage nodes. 
The partition key is set on `playback_date`. As each day closes, active writes shift to a newly spawned, empty partition. Meanwhile, older daily partitions are compressed on disk. Playback history lookups (which typically query recent days) are resolved within milliseconds by targeting only the recent active partitions, completely bypassing terabytes of older historical rows.

### Amazon: Tenant Multi-Vendor Isolation
On Amazon’s merchant platform, millions of independent sellers manage inventories. To isolate seller data and prevent regional index lockouts, Amazon uses **List Partitioning** on their relational metadata databases. 
Tables are partitioned by `merchant_country_code`. Queries executed by European portal services are pruned instantly to the European-specific tablespaces, ensuring high operational concurrency without risking global table deadlocks.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS

### The Mega-Warehouse filing Cabinet Analogy
Imagine a massive city hall record room containing 100 million citizen profile files.
1.  **Unpartitioned Table (The Giant Drawer)**: All 100 million folders are crammed inside one massive drawer. To find "Varun's" file, a clerk has to pull out a massive index log, find the approximate location, and walk down long shelves. If a new citizen folder is added, the clerk has to slide millions of cards down to make room.
2.  **Horizontal Partitioning (The Alphabetical Cabinets)**: You replace the giant drawer with 26 separate physical filing cabinets labeled A, B, C... through Z. When you seek "Varun", you walk directly to Cabinet "V" and search there. The remaining 25 cabinets are completely untouched, allowing 25 other clerks to work simultaneously without getting in each other's way.
3.  **Vertical Partitioning (Split Folders)**: Each citizen folder is thick because it contains basic profile cards plus heavy physical medical exam booklets, tax forms, and dental scans. To find someone's name, you have to haul the heavy tax forms too. By vertically partitioning, you keep the basic profile card (ID, Name, Phone) in Cabinet 1, and place the heavy tax documents and scans in Cabinet 2. This keeps the index searches lightweight and fast.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          UNPARTITIONED DESIGN                          │
│                                                                        │
│  [ One Massive Table File on Disk ] ──> Full Disk Sweep (High I/O)    │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                        RANGE PARTITIONED DESIGN                        │
│                                                                        │
│               [ Logical Table: Orders ]                                │
│                           │                                            │
│        ┌──────────────────┼──────────────────┐                         │
│        ▼                  ▼                  ▼                         │
│  [Partition 2024]   [Partition 2025]   [Partition 2026]                │
│  (Disk Folder A)    (Disk Folder B)    (Disk Folder C)                 │
│                                                                        │
│  Query: WHERE Date = 2026 ───> Targets ONLY Folder C (Pruned A & B)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

### Node.js / TypeScript (PostgreSQL Partition Query Routing)
Node.js client connectors communicate with partitioned databases seamlessly, but to achieve partition pruning, queries must be parameterized to pass the partition key explicitly.

```typescript
// pg-client.ts - Database Connection Pool with Parameterized Partition Queries
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: "postgresql://db_user:secret@10.0.0.50:5432/orders_db",
    max: 20, // Strict connection limit for performance
    idleTimeoutMillis: 30000
});

export async function fetchOrderDetails(orderId: string, orderYear: number) {
    // CRITICAL: We must include 'orderYear' (the partition key) in our WHERE clause.
    // Without 'orderYear', PostgreSQL is forced to scan every partition on disk!
    const query = `
        SELECT id, customer_id, total, status 
        FROM client_orders 
        WHERE id = $1 AND order_date_year = $2;
    `;
    
    try {
        const result = await pool.query(query, [orderId, orderYear]);
        return result.rows[0];
    } catch (err) {
        console.error("Database query execution error:", err);
        throw err;
    }
}
```

### Java (Java 25+ Spring Boot / JPA Partition Schema Initialization)
In Java Hibernate, we define standard entities, but the underlying table schema must be generated with the partition layout. Here is how you model a range-partitioned entity in Spring Boot.

```java
// OrderEntity.java - JPA Entity Mapping to a Partitioned Table
package com.gatesmashers.storage;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "client_orders")
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    // This column acts as our range partition key at the database level
    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "total_amount")
    private Double totalAmount;

    // Getters and Setters ...
}
```

Database Schema Definition (PostgreSQL DDL executed during initialization):
```sql
-- DDL to create the master partitioned table
CREATE TABLE client_orders (
    id BIGSERIAL,
    customer_id VARCHAR(255) NOT NULL,
    order_date DATE NOT NULL,
    total_amount NUMERIC(10,2),
    PRIMARY KEY (id, order_date) -- Partition key MUST be part of primary key!
) PARTITION BY RANGE (order_date);

-- Create concrete physical partitions
CREATE TABLE orders_2025 PARTITION OF client_orders
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE orders_2026 PARTITION OF client_orders
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER

### AWS Production Architecture Mapping
1.  **Amazon Aurora PostgreSQL**: Supports declarative partitioning and advanced automated partition pruning.
2.  **AWS RDS Storage Auto-Scaling**: Partitions can be mapped to different IOPS-provisioned GP3 volumes to scale storage independently.
3.  **AWS Glue & Athena**: Used for cold partitions. Older partitioned database files are offloaded to Amazon S3 as Parquet files, allowing Athena to query them serverless-style using S3 partition folders (e.g., `s3://archive/year=2024/`).

### Docker Compose Multi-Volume DB Sandbox
This file spins up a partitioned PostgreSQL instance with host volume mapping to simulate dedicated storage folders.

```yaml
# docker-compose.yml
version: '3.8'

services:
  partitioned-db:
    image: postgres:15-alpine
    container_name: partitioned_postgres_node
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: db_user
      POSTGRES_PASSWORD: secret_password
      POSTGRES_DB: orders_db
    volumes:
      - db-data-2025:/var/lib/postgresql/data/pg_tblspc/ts_2025
      - db-data-2026:/var/lib/postgresql/data/pg_tblspc/ts_2026
    command: ["postgres", "-c", "max_connections=100", "-c", "shared_buffers=512MB"]
    networks:
      - storage-net

volumes:
  db-data-2025:
    driver: local
  db-data-2026:
    driver: local

networks:
  storage-net:
    driver: bridge
```

### Kubernetes StatefulSet Manifest (Database Instance with Local PVCs)
A StatefulSet manages database instances that utilize partitioning, mapping dynamic volumes to stable database pods.

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: partitioned-postgres
  namespace: database
spec:
  serviceName: "postgres-service"
  replicas: 1
  selector:
    matchLabels:
      app: partitioned-postgres
  template:
    metadata:
      labels:
        app: partitioned-postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
          name: dbport
        env:
        - name: POSTGRES_DB
          value: orders_db
        - name: POSTGRES_USER
          value: db_user
        - name: POSTGRES_PASSWORD
          value: secret_password
        volumeMounts:
        - name: postgres-volume
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-volume
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 100Gi
```

---
*All partition designs, query routing mechanics, and database storage mappings detailed in this master study guide are fully grounded in the provided Gate Smashers System Design resources and standard distributed systems engineering frameworks.*
