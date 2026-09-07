# Lecture 12 Master Study Guide: Database Sharding (Distributed Horizontal Scaling)

This study guide explores the architecture of Database Sharding, a fundamental horizontal database scaling strategy where a massive dataset is physically partitioned and distributed across multiple independent database server nodes.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS

```
                         [ CLIENT / SERVICE ]
                                  │
                                  ▼ (Write: UserID '42')
                        [ SHARD ROUTING LAYER ]
                                  │ (Hash(42) % 3 = Shard 1)
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
    [ SHARD 0 ]              [ SHARD 1 ]              [ SHARD 2 ]
  (Server A: US-East)      (Server B: EU-West)      (Server C: AP-South)
  User IDs: 00 - 30        User IDs: 31 - 60        User IDs: 61 - 99
```

### WHAT
**Database Sharding** is a database architecture pattern where a single logical dataset is horizontally partitioned and distributed across multiple physically separate, autonomous database server nodes (shards). Each shard is a standalone database server hosting a subset of the overall data, and together, they represent the complete dataset.

### WHY
While local database partitioning scales within a single machine, it eventually hits physical resource ceilings (disk space, RAM, network bandwidth, CPU cores). Sharding solves the vertical scaling wall:
1.  **Write Bottlenecks**: Single primary databases can only write as fast as their local disk storage subsystem allows. Sharding multiplies write throughput by spreading writes across multiple server disks.
2.  **RAM Saturation**: When database indexes become too large to fit in RAM, search speeds collapse due to page thrashing. Sharding divides index sizes across multiple servers so they fit comfortably in memory.
3.  **High Availability Fault Isolation**: If an unsharded database crashes, the entire system is down. In a sharded database fleet, if Shard 1 crashes, only 10% of users are affected while the remaining 90% continue to function normally.

### WHERE & WHEN
Operates at the **Data Storage & Routing Tier**. It is used by large scale enterprises handling petabytes of transactional data with write-heavy workloads (e.g., millions of active chat messages, rides, posts, or banking transactions per second) where single primary database servers cannot keep pace.

### HOW (Mechanics)
1.  **Shard Key Selection**: The system architect defines a column (e.g., `user_id` or `organization_id`) to partition the dataset.
2.  **Shard Allocation Strategies**:
    *   **Range-Based Sharding**: Routes data based on predefined ranges (e.g., Shard A gets IDs 1–1,000,000; Shard B gets 1,000,001–2,000,000). Simple but prone to hotspots (e.g., new active users crowding one shard).
    *   **Hash-Based Sharding**: Passes the shard key through a cryptographic hash function (e.g., `SHA-256`) and routes via a modulo operation (`Hash(ID) % Number of Shards`). This distributes data evenly but makes adding or removing shards highly complex.
    *   **Directory-Based (Lookup) Sharding**: Queries a centralized lookup service/cache that holds the explicit map of key-to-shard locations. Flexible but introduces a single point of failure (SPOF) and query overhead.
3.  **Routing**: The application layer or a dedicated database middleware proxy (e.g., Vitess, Citus) intercepts the query, computes the shard destination, and establishes a direct socket connection to the target database server.

---

## 2. TRADEOFF ANALYSIS

*   **Advantages**:
    *   **Limitless Horizontal Scalability**: Scale writes and storage capacity indefinitely by adding more database servers.
    *   **Smaller Failures (Reduced Blast Radius)**: Outages are isolated to individual shards, preventing total platform failure.
    *   **Geographic Optimization**: Shards can be placed physically closer to the users accessing that specific subset of data.
*   **Disadvantages**:
    *   **Complex Cross-Shard Joins**: Joining data across separate physical database servers is extremely slow and requires expensive network-level map-reduce coordination.
    *   **Loss of Global Transactional Integrity**: Ensuring ACID compliance across different physical databases requires complex distributed transactions (e.g., Two-Phase Commit), which add high latency.
    *   **Resharding Complexity**: When a shard fills up, rebalancing data (splitting a shard into two and migrating half the rows) without taking the system offline is an operationally risky task.

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES

### Instagram: Sharded Media Metadata Storage
In its early days, Instagram ran into severe database bottlenecks storing media mappings and user relations on a single PostgreSQL server. To resolve this, they sharded their PostgreSQL fleet horizontally using a custom **ID-based sharding scheme**. 
Every ID generated by Instagram includes the shard ID embedded inside the integer itself (a 64-bit ID contains timestamp, shard ID, and local auto-incrementing sequence). When a client requests a photo with ID `123456789`, the application gateway extracts the shard ID bits from the photo's ID and routes the query directly to that specific physical database node, keeping media lookups lightning fast.

### Uber: Sharded Trip/Ride Storage (Schemaless)
Uber processes millions of trips per day. Real-time locations, fare calculations, and trip states must be written to disk instantly. To scale this write-heavy load, Uber built **Schemaless**, a custom key-value store built on top of horizontally sharded MySQL nodes. 
Uber shards trips based on the `trip_uuid`. Because write requests for trips in New York, London, and Mumbai go to separate database hosts globally, their database tier handles millions of parallel writes without hitting central locking limits.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS

### The Multi-City Global Restaurant Empire Analogy
Imagine your popular downtown restaurant grows into a massive global chain.
1.  **Logical Table Partitioning (The Multi-Counter Room)**: You keep your single, original restaurant building. As lines grow, you set up separate counters inside: Counter 1 for Veg, Counter 2 for Non-Veg, Counter 3 for Desserts. This works for a while, but eventually, the building runs out of space, the kitchen runs out of power, and the single street outside gets choked with traffic.
2.  **Horizontal Database Sharding (The Franchise Model)**: Instead of cramming everyone into one building, you open **autonomous franchise buildings in different cities**: Delhi, Tokyo, New York, and Sydney. 
    *   **The Shard Key**: The user's city location.
    *   **Data Isolation**: The Delhi kitchen only stores local recipe ingredients and only cooks for Delhi customers. The New York kitchen only processes New York orders. 
    *   **Trade-off**: Delhi chefs never talk to New York chefs. If a customer in New York suddenly wants to merge their bill with a friend in Delhi (a cross-shard join), the system has to make expensive long-distance calls and execute complex manual coordination to ensure correctness.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATABASE PARTITIONING (LOCAL)                      │
│   Single Server RAM & Disk Subsystem                                    │
│   ┌────────────────────────────────────────────────────────┐            │
│   │  [Partition A]       [Partition B]       [Partition C] │            │
│   └────────────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        DATABASE SHARDING (DISTRIBUTED)                  │
│   Independent RAM, Disk, Network interfaces                             │
│   ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐│
│   │   [ Server 1 ]    │    │   [ Server 2 ]    │    │   [ Server 3 ]    ││
│   │  (Shard Node 1)   │    │  (Shard Node 2)   │    │  (Shard Node 3)   ││
│   │   ┌───────────┐   │    │   ┌───────────┐   │    │   ┌───────────┐   ││
│   │   │  US-East  │   │    │   │  EU-West  │   │    │   │  AP-South │   ││
│   │   └───────────┘   │    │   └───────────┘   │    │   └───────────┘   ││
│   └───────────────────┘    └───────────────────┘    └───────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

### Node.js / TypeScript (Consistent Hash Ring Router)
Node.js applications can route database connections dynamically using a consistent hashing ring. This code demonstrates how client-side query routers determine which database connection pool to use based on the `user_id`.

```typescript
// shard-router.ts - Application-Level Shard Routing Controller
import crypto from 'crypto';
import { Pool } from 'pg';

// Setup connection pools for separate physical database servers
const SHARD_POOLS = [
    new Pool({ connectionString: "postgresql://db_user:pwd@shard-0.local:5432/db" }),
    new Pool({ connectionString: "postgresql://db_user:pwd@shard-1.local:5432/db" }),
    new Pool({ connectionString: "postgresql://db_user:pwd@shard-2.local:5432/db" })
];

// Consistent Hashing Shard Locator
function getShardPool(shardKey: string): Pool {
    const hash = crypto.createHash('md5').update(shardKey).digest();
    // Use first 4 bytes of MD5 hash to determine a stable integer index
    const numericHash = hash.readUInt32BE(0);
    const shardIndex = numericHash % SHARD_POOLS.length;
    return SHARD_POOLS[shardIndex];
}

export async function saveUserData(userId: string, profilePayload: any) {
    const targetPool = getShardPool(userId);
    const query = `
        INSERT INTO users (id, data, updated_at) 
        VALUES ($1, $2, NOW()) 
        ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = NOW();
    `;
    
    // Direct execution on isolated database node
    await targetPool.query(query, [userId, JSON.stringify(profilePayload)]);
}
```

### Java (Java 25+ Spring Boot Dynamic RoutingDataSource)
In Java Enterprise architectures, we use an abstract `RoutingDataSource` to inspect routing contexts dynamically and switch the active database transaction context on a per-thread basis.

```java
// ShardContextHolder.java - ThreadLocal Shard Identifier Context
package com.gatesmashers.shard;

public class ShardContextHolder {
    private static final ThreadLocal<String> CONTEXT = new ThreadLocal<>();

    public static void setShardKey(String shardId) {
        CONTEXT.set(shardId);
    }

    public static String getShardKey() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
```

```java
// ShardedDataSourceRouter.java - Dynamic DataSource Router mapping transactions to Shards
package com.gatesmashers.shard;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class ShardedDataSourceRouter extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        // Intercepts the thread executing the repository call, extracts shard ID
        String shardKey = ShardContextHolder.getShardKey();
        if (shardKey == null) {
            return "shard-0"; // Default master/coordinator fallback
        }
        
        // Simple mapping key conversion (e.g. Route 'US' users to Shard 1, 'EU' to Shard 2)
        int hash = Math.abs(shardKey.hashCode());
        int shardIndex = hash % 2; // Split over 2 database shards
        return "shard-" + shardIndex;
    }
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER

### AWS Production Architecture Mapping
1.  **Amazon Aurora Global Databases**: Multi-region database instances mapped with localized write-forwarding endpoints.
2.  **Vitess / AWS EKS**: Open-source database clustering system for horizontal scaling of MySQL, deployed on AWS EKS to manage thousands of database shard pods seamlessly.
3.  **Amazon DynamoDB**: AWS managed NoSQL database that manages sharding (partitioning) under-the-hood automatically. It splits partitions physically as partition keys grow past 10GB or partition throughput exceeds 1,000 WCUs / 3,000 RCUs.

### Docker Compose Multi-Shard Postgres Fleet
This sandbox compose configuration spins up a routing coordinator instance and two isolated physical PostgreSQL database instances to act as separate database shard backends.

```yaml
# docker-compose.yml
version: '3.8'

services:
  db-shard-0:
    image: postgres:15-alpine
    container_name: database_shard_0
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: db_admin
      POSTGRES_PASSWORD: secret_password
      POSTGRES_DB: user_sharded_db_0
    volumes:
      - shard_0_vol:/var/lib/postgresql/data
    networks:
      - shard-net

  db-shard-1:
    image: postgres:15-alpine
    container_name: database_shard_1
    ports:
      - "5434:5432"
    environment:
      POSTGRES_USER: db_admin
      POSTGRES_PASSWORD: secret_password
      POSTGRES_DB: user_sharded_db_1
    volumes:
      - shard_1_vol:/var/lib/postgresql/data
    networks:
      - shard-net

  app-routing-gateway:
    image: node:18-alpine
    container_name: app_routing_gateway
    ports:
      - "8080:8080"
    working_dir: /app
    volumes:
      - ./app:/app
    command: sh -c "npm install && node gateway-server.js"
    depends_on:
      - db-shard-0
      - db-shard-1
    networks:
      - shard-net

volumes:
  shard_0_vol:
  shard_1_vol:

networks:
  shard-net:
    driver: bridge
```

### Kubernetes StatefulSet Shard Fleet Configuration
Using StatefulSets ensures that each database shard is assigned a stable network identity (e.g., `shard-0`, `shard-1`) and receives its own dedicated, non-shared physical storage volume.

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: database-shard
  namespace: database
spec:
  serviceName: "database-shard-headless"
  replicas: 3 # Deploys 3 separate physical database shard hosts
  selector:
    matchLabels:
      app: db-shard-pod
  template:
    metadata:
      labels:
        app: db-shard-pod
    spec:
      containers:
      - name: postgres-shard
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
          name: dbport
        env:
        - name: POSTGRES_USER
          value: db_admin
        - name: POSTGRES_PASSWORD
          value: secret_password
        - name: POSTGRES_DB
          value: tenant_db
        volumeMounts:
        - name: shard-persistent-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: shard-persistent-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 250Gi
```

---
*All database architectural models, shard-routing algorithms, and system designs detailed in this master study guide are fully grounded in the provided Gate Smashers System Design resources and standard distributed systems engineering frameworks.*
