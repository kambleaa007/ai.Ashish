# Lecture 17 Master Study Guide: Write-Through vs. Write-Back Caching Policies

This master study guide details caching write policies, exploring how data updates are synchronized between high-speed volatile caches and durable relational/non-relational database storage engines.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS

```
       [ WRITE-THROUGH (Synchronous) ]                [ WRITE-BACK (Asynchronous) ]
      App ──> Cache ──(Sync)──> Database           App ──> Cache ──(Success returned!)
       │                            ▲                                │
       └───────────(Success)────────┘                                └──(Async Batch)──> Database
```

### WHAT
*   **Caching Write Policies** define the operational protocols for synchronizing data updates, insertions, and deletions between a temporary, high-speed **Cache Layer** (e.g., Redis, Memcached) and the permanent, durable **Database Storage Layer** (e.g., MySQL, PostgreSQL, DynamoDB).
*   **Write-Through**: A synchronous write policy where data is written to both the cache and the underlying database simultaneously before the transaction returns a "success" confirmation to the calling application.
*   **Write-Back (Write-Behind)**: An asynchronous write policy where data is written exclusively to the high-speed cache layer first, which immediately returns a "success" confirmation to the application. The modified cache entries (dirty blocks) are synchronized to the underlying database later in background batches.

### WHY
Relational and disk-bound databases cannot process writes as quickly as they process reads due to physical disk seek-times, index updates, and transaction journaling (WAL - Write-Ahead Logging). Under high-load write traffic, systems without optimized write policies suffer from:
1.  **Connection Pool Exhaustion**: Applications block waiting for disk transactions to commit, depleting available server connections.
2.  **Severe Latency Spikes**: Direct-to-disk synchronous writes slow down user response times from microseconds to hundreds of milliseconds.
3.  **Database Thread Starvation**: The database CPU spends all its cycles managing row locks and transaction commits rather than processing queries.

### WHERE & WHEN
Operates at the boundary between the **Application Compute Tier, Memory Caching Tier (Redis/Memcached), and Relational/NoSQL Database Storage Tier**.

### HOW (Mechanics)
1.  **Write-Through Protocol Mechanics**:
    *   The client app sends `Write(user_id=1, status="active")` to the application server.
    *   The app server writes to the **Cache** first.
    *   The cache layer (or the app code) immediately opens a transaction and writes the exact same tuple to the **Database**.
    *   Only when the database confirms the disk-write commit does the application server return a `200 Success` to the client.
2.  **Write-Back Protocol Mechanics**:
    *   The client app sends `Write(user_id=1, status="active")` to the app server.
    *   The app server writes to the **Cache** and marks the block/key as **"Dirty"** in memory.
    *   The cache layer immediately returns a `200 Success` to the client (taking under 1ms).
    *   A background daemon process sweeps the cache for dirty keys, aggregates them, and executes a high-speed batch insert into the database asynchronously.

---

## 2. TRADEOFF ANALYSIS

### Write-Through Caching Policy
*   **Advantages**:
    *   **Absolute Data Consistency**: The cache and database are always in 100% lock-step sync, eliminating the risk of stale data reads.
    *   **No Data Loss Risk**: If the cache server crashes or loses power, no data is lost because every write has already been committed to durable disk storage.
*   **Disadvantages**:
    *   **High Write Latency**: Every write operation pays the penalty of slow disk writing and database transactional lock times.
    *   **Redundant Disk Writes**: If a resource is updated 100 times in a minute, the database must execute 100 separate disk-writes, wearing out SSD IOPS pools.

### Write-Back Caching Policy
*   **Advantages**:
    *   **Ultra-Low Latency**: Write times drop to sub-millisecond speeds because they only interact with fast system RAM.
    *   **Extreme Write Throughput**: The system handles millions of parallel writes effortlessly by absorbing them in memory.
    *   **Write Coalescing**: If a counter (e.g., likes count) is updated 100 times, the write-back daemon can collapse those 100 memory updates into a single batch database update (`UPDATE likes SET count = count + 100`), saving massive database CPU overhead.
*   **Disadvantages**:
    *   **High Risk of Data Loss**: If the cache server crashes (OOM, power failure) before the dirty memory blocks are flushed to the database, **all unwritten updates are lost permanently**.
    *   **Temporary Inconsistency**: Adjacent application nodes reading directly from the database will see old stale states until the asynchronous queue flushes.

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES

### YouTube: Asynchronous Video View Count Updates
When a video goes viral on YouTube, millions of users click play simultaneously, generating millions of view count updates per second. If YouTube used a **Write-Through** policy, their relational database indexes would lock instantly, crashing the video playback flow.
Instead, YouTube implements a **Write-Back Caching model**. As views occur, they are written to a sharded in-memory cache fleet, which instantly returns success. 
At regular intervals (e.g., every 5 minutes), a background job aggregates these memory counts (coalescing) and flushes a single bulk update to the database (`UPDATE videos SET views = views + 250000`). This ensures that visitors see updated view counts without putting high-frequency write pressure on central database drives.

### Amazon: Synchronous Account Ledger Updates
During Amazon checkout, a customer's gift card balance is deducted. Because financial ledger transactions require 100% consistency to prevent double-spending, Amazon *never* uses a write-back policy for financial balances.
Instead, they enforce a strict **Write-Through** policy. When a balance is debited, the update is synchronously committed to both the database ledger (ensuring ACID durability) and the cache layer. This ensures that any adjacent read (like checking remaining balance on a different device) is guaranteed to see the correct balance instantly.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS

### The Restaurant Notebook vs. Kitchen Order Analogy
Imagine how a restaurant waiter records and synchronizes order bills:

```
            [ WRITE-THROUGH (The Double-Book) ]             [ WRITE-BACK (The Scratchpad) ]
            
              [ Waiter Notebook ] ──(Sync)──> [ Ledger ]      [ Waiter Notebook ] (Returns Success)
                       │                                               │
                       ▼                                               ▼ (Later, batch copy)
                 (Locks Line)                                     [ Ledger Book ]
```

1.  **Write-Through (The Double-Book Policy)**: When a guest orders a drink, the waiter writes the $10 charge in his personal pocket notebook (The Cache). Before serving the drink, he must walk to the manager's office at the back of the building and wait for the manager to write the $10 charge in the main physical accounting ledger book (The Database).
    *   *The Trade-off*: The waiter takes 10 minutes to serve a single drink (high latency), but your financial books are guaranteed to be 100% accurate at any second.
2.  **Write-Back (The Scratchpad Policy)**: When a guest orders a drink, the waiter writes the $10 charge in his pocket notebook (The Cache) and serves the drink instantly (low latency). He continues doing this for hours, recording dozens of drinks.
    *   At the end of the shift (asynchronously), the waiter sits down and copies the aggregated totals from his notepad into the main ledger book in one go.
    *   *The Risk*: If the waiter falls into the swimming pool and ruins his notepad (cache crash), the restaurant loses all record of the drinks served, and those profits are lost forever.

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

### Node.js / TypeScript (Write-Back Batch Daemon with Redis)
Below is an implementation of a Write-Back cache in Node.js. It writes likes to Redis instantly and flushes them to PostgreSQL asynchronously using a background batch timer.

```typescript
// write-back-cache.ts - Asynchronous Caching synchronizer in Node.js
import Redis from 'ioredis';
import { Client } from 'pg';

const redis = new Redis("redis://10.0.0.10:6379");
const pgClient = new Client("postgresql://user:pwd@10.0.0.20:5432/db");
pgClient.connect();

// High-speed write endpoint: Writes to memory only (Sub-millisecond latency)
export async function registerLike(videoId: string) {
    // Increment view counter in Redis cache
    await redis.hincrby("video_likes_cache", videoId, 1);
    // Add to dirty set to keep track of what keys need to be flushed
    await redis.sadd("dirty_video_likes", videoId);
}

// Background Daemon: Runs every 10 seconds to flush updates to PostgreSQL
async function flushLikesToDatabase() {
    const dirtyKeys = await redis.smembers("dirty_video_likes");
    if (dirtyKeys.length === 0) return;

    console.log(`Flush Daemon active. Syncing ${dirtyKeys.length} video counters...`);

    for (const videoId of dirtyKeys) {
        // Retrieve accumulated views from Redis
        const cachedLikes = await redis.hget("video_likes_cache", videoId);
        
        if (cachedLikes) {
            // Synchronize with Postgres in a single bulk operation
            await pgClient.query(
                "UPDATE videos SET likes = likes + $1 WHERE id = $2;", 
                [parseInt(cachedLikes), videoId]
            );
            
            // Deduct the flushed amount from the Redis counter
            await redis.hincrby("video_likes_cache", videoId, -parseInt(cachedLikes));
            await redis.srem("dirty_video_likes", videoId);
        }
    }
}

// Start the daemon loop
setInterval(flushLikesToDatabase, 10000);
```

### Java (Java 25+ Spring Boot Write-Through Cache Mapping)
In Java, we utilize `@CachePut` to enforce a declarative Write-Through pattern. Spring Boot updates both the SQL database and the Redis cache synchronously within a single transactional boundary.

```java
// UserProfileService.java - Spring Boot Declarative Write-Through Implementation
package com.gatesmashers.billing;

import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    @Autowired
    private UserRepository userRepository; // Relational Database (SQL)

    // Spring intercepts this call, writes to PostgreSQL, and then updates Redis cache
    // synchronously within the transaction boundary (Lock-step Write-Through)
    @CachePut(value = "users", key = "#profile.id")
    @Transactional
    public UserProfile updateProfile(UserProfile profile) {
        // Step 1: Write synchronously to PostgreSQL database
        UserProfile updatedUser = userRepository.save(profile);
        
        // Step 2: Return object (Spring automatically serializes this and saves to Redis)
        return updatedUser;
    }
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER

### AWS Production Architecture Mapping
1.  **Amazon ElastiCache for Redis**: Sits in front of RDS as the high-speed caching tier.
2.  **DynamoDB Accelerator (DAX)**: A fully managed, highly available in-memory cache for DynamoDB that supports **Write-Through** operations automatically, maintaining tight consistency with DynamoDB tables without requiring application-level caching code.

### Docker Compose Caching Sandbox (Redis + PostgreSQL)
This configuration launches an isolated caching tier (Redis) alongside a transactional database (PostgreSQL) and our application server nodes.

```yaml
# docker-compose.yml
version: '3.8'

services:
  cache-redis:
    image: redis:7-alpine
    container_name: cache_redis_tier
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes # Ensure local append log is active for basic durability
    networks:
      - app-net

  db-postgres:
    image: postgres:15-alpine
    container_name: database_postgres_tier
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret_password
      POSTGRES_DB: app_db
    networks:
      - app-net

  app-server:
    image: node:18-alpine
    container_name: app_compute_server
    ports:
      - "8080:8080"
    networks:
      - app-net
    depends_on:
      - cache-redis
      - db-postgres

networks:
  app-net:
    driver: bridge
```

### Kubernetes Service Configuration (Cache Connection Pooling)
This manifest configures a headless service for Redis, allowing backend application pods to establish direct, low-latency persistent connection pools to the caching nodes.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-cache-headless
  namespace: caching
spec:
  clusterIP: None # Headless service bypassed virtual routing IP
  selector:
    app: redis-cache-node
  ports:
  - port: 6379
    targetPort: 6379
```

---
*All write policies, transactional flows, and storage tier mappings detailed in this master study guide are fully grounded in the provided Gate Smashers System Design resources and standard distributed systems engineering frameworks.*
