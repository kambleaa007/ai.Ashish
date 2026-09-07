# Lecture 7: Caching in System Design (Cache Eviction Policies & Redis vs. Memcached)

This study guide explores the technical mechanics, strategies, trade-offs, and infrastructure configurations of in-memory caching layers in high-scale distributed systems.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS

### WHAT
**Caching** is the architectural practice of storing copies of frequently or recently accessed data in an ultra-fast, temporary, read-optimized hardware or software storage layer (typically Random Access Memory, or RAM). It bypasses slower, disk-based, or computationally heavy downstream data sources.

### WHY
Relational and disk-bound databases are bound by disk I/O, indexing latency, query plan execution, table locks, and row contention. Under high-throughput conditions, constant querying of databases leads to database connection starvation, CPU spikes during query evaluation, and eventual origin failure. Caching solves this by:
*   Minimizing read latency from double-digit milliseconds (disk) to sub-millisecond speeds (RAM).
*   Shielding databases from "Read Storms" and lowering resource consumption (CPU/Memory).
*   Enabling sub-millisecond API responses under massive read loads.

### WHERE & WHEN
Caching exists at multiple layers of a modern production stack:
1.  **Client/Browser Layer**: Local Storage, Session Storage, and HTTP headers (`Cache-Control`, `ETag`).
2.  **CDN/Edge Layer**: Edge PoPs caching full HTTP page bodies, HTML layout structures, and static assets.
3.  **Reverse Proxy/API Gateway Layer**: Web servers (e.g., Nginx) caching compiled responses from backend microservices.
4.  **Application In-Memory Process Layer**: In-memory caching instances inside the app execution process (e.g., Guava Cache, Ehcache in Java) to avoid network calls.
5.  **Distributed Remote Cache Layer**: Independent, clustered, in-memory data structures (e.g., Redis, Memcached) sitting between application server fleets and database clusters.

### HOW
When a client requests a resource, the system navigates through the caching lifecycle:

```
[Client Request] ───> [App Server] ───> [Query Cache] ──(Hit)──> [Return Data]
                                             │
                                          (Miss)
                                             v
                                      [Query Database] ───> [Write to Cache] ───> [Return Data]
```

1.  **Cache Lookup**: The application server receives a read request and hashes the query parameter to construct a unique **Cache Key** (e.g., `user:101:profile`).
2.  **Cache Hit**: The remote distributed cache locates the key in RAM, immediately serializes the string, and returns the payload to the app server.
3.  **Cache Miss**: If the key is not found (or has expired), the app server falls back to query the primary database, populates the cache with the retrieved data, sets an expiration window, and returns the data to the client.

---

## 2. TRADEOFF ANALYSIS

### Advantages
*   **Performance Optimization**: Drops read latency to sub-millisecond ranges (RAM access speeds).
*   **Enhanced Database Resilience**: Bypasses the query planner and disk lookups, protecting the primary datastore.
*   **Cost Efficiency**: Reduces the required replica count of primary relational databases, which are significantly more expensive to scale than raw RAM cache instances.

### Disadvantages & High-Load Vulnerabilities
*   **Cache Inconsistency (Stale Data)**: Writes to the primary database might not instantly propagate to the cache, leading to client-side data drift.
*   **Cache Stampede (Thundering Herd)**: If a highly popular cache key expires or is invalidated, thousands of concurrent app processes will experience a cache miss simultaneously. They will all hit the primary database at the same time, causing connection timeouts and DB crashes.
*   **OOM (Out of Memory) Expirations**: Because RAM is volatile and physically constrained, improper eviction tuning or memory leaks will trigger Out Of Memory errors and crash the node.

### Cache Eviction Policies
When the cache reaches its memory limit, it must execute an eviction algorithm to make space for new writes:
*   **LRU (Least Recently Used)**: Evicts the key that has not been read or written to for the longest time. Standard default for general caching workloads.
*   **LFU (Least Frequently Used)**: Tracks a hit counter on each key and evicts keys with the lowest access count. Ideal for tracking absolute popularity, but has high memory overhead for the counters.
*   **FIFO (First In First Out)**: Evicts the oldest key created, regardless of how often it is accessed. Easy to implement but highly inefficient for hot-key retention.
*   **TTL (Time-To-Live)**: Passive eviction. Each key has an explicit expiration timestamp. Once the TTL is reached, the key is logically marked as deleted.

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES

### Twitter Home Timeline (User Timeline Caching via Redis)
Twitter utilizes a massive, memory-sharded **Redis Cluster** to manage active user home timelines.
*   When a prominent user tweets, instead of appending a row to a heavy SQL database and letting millions of followers query it (which would crash the database), Twitter executes a "Fan-out on Write" model. 
*   An asynchronous background worker retrieves the follower IDs of the author, locates each follower's active timeline cache key inside Redis, and pushes the tweet ID directly into their Redis List structure. 
*   When a user opens Twitter, the app executes a fast `LRANGE` query on the Redis cache node, achieving double-digit millisecond page loads.

### Amazon DynamoDB Accelerator (DAX)
Amazon implements **DAX** as a managed, high-speed, read-through cache layer directly in front of DynamoDB tables. Applications interact with DAX using the same DynamoDB API. If DAX experiences a cache miss, it handles the database read operations and cache hydration internally under the hood, freeing application code from managing cache invalidation logic.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS

### Non-Technical Analogy: The Desk Clerk and the Basement Cabinet
Imagine you are a clerk in a busy government records office, receiving folder requests from citizens constantly.

```
+─────────────────────────────────────────────────────────────+
│                       Desk Surface (RAM Cache)              │
│  [User 101]   [User 102]   [User 103]   [User 104] (Active files)│
+──────────────────────────────┬──────────────────────────────+
                               │ (Desk Full? Evict oldest)
                               v
+─────────────────────────────────────────────────────────────+
│                Basement Archives (Disk DB)                  │
│  [Cabinet A] [Cabinet B] [Cabinet C] [Cabinet D] ...        │
│  (Takes 10 minutes to walk down stairs, find key, search)   │
+─────────────────────────────────────────────────────────────+
```

1.  **The Database (Basement Archive)**: The physical record vault is located in a dark basement. Walking down the stairs, finding the cabinet keys, searching alphabetical indices, and pulling out a file takes 10 minutes (Database Disk Latency).
2.  **The Cache (Desk Surface)**: To speed up work, you place a small tray on top of your desk. When a citizen asks for their folder, you check your desk surface first. If it's there, you hand it over in 1 second (Cache Hit). If it isn't, you walk to the basement (Cache Miss), hand the folder to the citizen, and place a copy on your desk surface so you're ready for their next visit (Cache Hydration).
3.  **Eviction (Desk Space Limits)**: Your desk has space for exactly 5 folders. When a 6th citizen arrives, you look at the 5 folders on your desk, identify the folder that hasn't been opened for the longest time (Least Recently Used), carry that one folder back down to the basement, and put the new folder on your desk.

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

### JavaScript / TypeScript & Node.js (Asynchronous Event Loop with Redis Connection Pooling)
Node.js scales connection performance using non-blocking, asynchronous drivers. When fetching keys from Redis, the thread registers the socket query with the OS kernel and continues serving other client HTTP requests.

```typescript
// Node.js Redis Cache Handler with ioredis and Express
import express, { Request, Response } from 'express';
import Redis from 'ioredis';
import { Pool } from 'pg';

const app = express();
// Single, non-blocking connection pool to Redis cluster
const redis = new Redis({
    host: 'redis-cache-cluster.local',
    port: 6379,
    maxRetriesPerRequest: 3
});

const dbPool = new Pool({ connectionString: 'postgresql://postgres@db.local:5432/prod' });

app.get('/user/:id', async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    const cacheKey = `user:${userId}:profile`;

    try {
        // Step 1: Query Redis Cache asynchronously
        const cachedUser = await redis.get(cacheKey);

        if (cachedUser) {
            // Cache Hit: Instantly return serialized JSON
            res.setHeader('X-Cache', 'HIT');
            res.status(200).json(JSON.parse(cachedUser));
            return;
        }

        // Step 2: Cache Miss - Query Postgres DB
        res.setHeader('X-Cache', 'MISS');
        const dbResult = await dbPool.query('SELECT * FROM users WHERE id = $1', [userId]);

        if (dbResult.rows.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userPayload = dbResult.rows[0];

        // Step 3: Write payload back to Redis with a TTL of 3600 seconds (1 hour)
        // Fire-and-forget: we don't await the redis write to avoid slowing the HTTP response cycle
        redis.set(cacheKey, JSON.stringify(userPayload), 'EX', 3600).catch(err => {
            console.error('Redis Write Failed', err);
        });

        res.status(200).json(userPayload);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000);
```

### Java (Java 25+ Virtual Threads with Caffeine local and Jedis remote cache)
Under Java 25+, Project Loom virtual threads allow synchronous blocking client calls to yield efficiently when awaiting remote network I/O from Redis pools.

```java
// Java 25+ Clustered Redis Cache Service utilizing Virtual Threads
package com.company.cache;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import java.sql.Connection;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

public class CacheManagerService {
    private static final JedisPool jedisPool;
    private static final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

    static {
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(128); // Robust connection limits for concurrent virtual threads
        poolConfig.setMaxIdle(32);
        jedisPool = new JedisPool(poolConfig, "redis-cache-cluster.local", 6379);
    }

    public String getUserProfile(String userId, Connection dbConnection) {
        String cacheKey = "user:" + userId + ":profile";

        // Try cache read
        try (Jedis jedis = jedisPool.getResource()) {
            String cachedPayload = jedis.get(cacheKey);
            if (cachedPayload != null) {
                return cachedPayload; // Cache Hit
            }
        }

        // Cache Miss: Query Database (Virtual Thread blocks here, yield to carrier thread)
        String dbPayload = queryDatabase(userId, dbConnection);

        if (dbPayload != null) {
            // Asynchronously populate cache inside JVM Virtual Thread to prevent client blocking
            String finalDbPayload = dbPayload;
            executor.submit(() -> {
                try (Jedis jedis = jedisPool.getResource()) {
                    jedis.setex(cacheKey, 3600, finalDbPayload);
                } catch (Exception e) {
                    System.err.println("Async cache write failed: " + e.getMessage());
                }
            });
        }

        return dbPayload;
    }

    private String queryDatabase(String userId, Connection dbConnection) {
        // Execute database lookup query details
        return "{\"id\":\"" + userId + "\", \"name\":\"John Doe\"}";
    }
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER (AWS, DOCKER, KUBERNETES)

### AWS Production Implementation Mapping
1.  **Amazon ElastiCache for Redis**: Fully managed, highly available, clustered in-memory datastore supporting replication and automatic failover.
2.  **Amazon ElastiCache for Memcached**: Used for basic, highly scalable, multi-threaded sub-millisecond key-value lookups without persistence requirements.
3.  **AWS Elasticache Global Datastore**: Replicates cache clusters across multiple AWS regions to support ultra-low cross-region latency profiles.

### Docker Compose Sandbox Setup (Redis Master-Replica Topology)
This configuration provisions a highly resilient local caching cluster featuring a Redis Master node and a replication-chained replica node:

```yaml
# docker-compose.yml
version: '3.8'

services:
  redis-master:
    image: redis:7-alpine
    container_name: redis_cache_master
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_master_data:/data
    networks:
      - cache-tier

  redis-replica:
    image: redis:7-alpine
    container_name: redis_cache_replica
    command: redis-server --replicaof redis-master 6379 --maxmemory 256mb --maxmemory-policy allkeys-lru
    depends_on:
      - redis-master
    networks:
      - cache-tier

volumes:
  redis_master_data:
    driver: local

networks:
  cache-tier:
    driver: bridge
```

### Kubernetes State-Bounded Cache Orchestration
This deployment spins up a scalable Redis deployment cluster, exposing it to internal application pods via a headless service.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-cache-deployment
  namespace: production
  labels:
    tier: cache
spec:
  replicas: 2
  selector:
    matchLabels:
      app: redis-cache
  template:
    metadata:
      labels:
        app: redis-cache
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        command: [
          "redis-server",
          "--maxmemory", "512mb",
          "--maxmemory-policy", "allkeys-lru" # Enforce LRU eviction policy at system limits
        ]
        ports:
        - containerPort: 6379
          name: redis
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          tcpSocket:
            port: 6379
          initialDelaySeconds: 15
          periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: redis-cache-service
  namespace: production
spec:
  type: ClusterIP
  ports:
  - port: 6379
    targetPort: 6379
  selector:
    app: redis-cache
```

---
*All caching strategies, eviction models, and memory architectures outlined in this document are fully aligned with the course's caching materials and distributed systems principles.*
