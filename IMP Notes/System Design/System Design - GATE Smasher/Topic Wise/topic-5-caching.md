# Topic 5 Master Study Guide: Caching Strategies (Cache-aside, Write-through, Write-back, & Redis)

## 1. WHAT, WHY, WHERE, HOW (Technical Mechanics)
A **Cache** is a high-speed, temporary, in-memory data store designed to sit between your application code and your primary databases. By storing frequently requested data in fast RAM, caches drop read latency from milliseconds to microseconds and protect database instances from exhaustion.

### Primary Caching Patterns

#### 1. Cache-Aside (Lazy Loading)
The application code sits in the middle and orchestrates the cache:
* **The Flow**: Application queries the cache. If found (**Cache Hit**), it is returned. If missing (**Cache Miss**), the application fetches data from the database, saves a copy in the cache, and returns it.
* **Use Case**: Best for read-heavy workloads where data is requested repeatedly.

#### 2. Write-Through
The application treats the cache as the primary data writer:
* **The Flow**: Application writes data directly to the Cache. The cache immediately writes that data to the Database. The write completes only after both cache and DB are saved.
* **Use Case**: Keeps cache content 100% consistent with database records, but adds write latency.

#### 3. Write-Back (Write-Behind)
* **The Flow**: Application writes data directly to the Cache, which returns success immediately. The cache buffers these writes and flushes them to the Database asynchronously in bulk batches.
* **Use Case**: Incredibly fast writes. Ideal for heavy write traffic (like logging or user count increments), but runs a risk of data loss if the cache server crashes before flushing back to the database.

### Redis vs. Memcached

| Feature | Redis | Memcached |
| :--- | :--- | :--- |
| **Thread Model** | Single-Threaded Event Loop (highly optimized in-memory execution, no thread lock contention). | Multi-Threaded (excellent utility for multicore servers handling massive simple datasets). |
| **Data Types** | Strings, Lists, Sets, Hashes, Sorted Sets, Bitmaps, Geospatial. | Simple Strings and Key-Value blobs only. |
| **Persistence** | Supported (RDB snapshots and AOF logs saved to disk). | None. Pure ephemeral in-memory. |

---

## 2. TRADEOFFS (Advantages & Disadvantages under High Load)

| Strategy | Advantages | Disadvantages |
| :--- | :--- | :--- |
| **Cache-Aside** | • Extremely robust against cache server failure (if cache crashes, application reads DB directly).<br>• Only caches what is actually requested. | • Double network round-trip overhead on Cache Miss.<br>• Data inconsistency if a record is updated in the DB without invalidating the cache. |
| **Write-Through** | • Cache is never stale; guarantees immediate write consistency. | • Write latency penalty since two writes must complete. |
| **Write-Back** | • Extreme write throughput capacity.<br>• Drastically reduces write operations on the primary database. | • **Data Loss Vulnerability**: If the cache server loses power, unwritten cached writes are lost forever. |

---

## 3. PRODUCTION EXAMPLES
* **Amazon**: Uses **DynamoDB Accelerator (DAX)**, which is an in-memory Write-Through cache designed specifically for DynamoDB. Application services write records directly to DAX, which updates DynamoDB synchronously, ensuring all read traffic checking DAX always gets the exact same consistent transactional record.
* **Instagram**: Uses **Write-Back** caching for count metrics (likes, page views, stream views). If every single "Like" button tap worldwide directly triggered a SQL update query to the primary relational database, database row lock contention would immediately halt the backend. Instagram buffers these counts in Redis and flushes them back to persistent PostgreSQL tables in bulk every few minutes.

---

## 4. MEMORY ANCHORS

### The 20-Year Non-Tech Analogy: The Desk Cupboard and the Archive Basement
* **No Cache**: Every time you need a tax document, you must leave your desk, walk down 4 flights of stairs into a dusty archive basement (Primary Database), search through catalog file cabinets, find the document, walk back up, and read it.
* **Cache-Aside**: You keep an empty file folder on your desk (Cache). When you need a tax form, you check your desk folder. If it's missing (Cache Miss), you walk down to the basement, grab the paper, make a photocopy, leave the copy in your desk folder, and use it. Next time you need that form, you grab it off your desk in 5 seconds.
* **Write-Back**: You are a writer drafting stories. Instead of walking down to the archive basement every time you write a single page, you quickly write pages and stack them in a tray on your desk (Write-Back Cache). At 5:00 PM, you grab the stack of pages and walk down to the basement once to archive them all in a single bulk batch (Asynchronous Flush).

### ASCII Architecture Diagram
```
     [ Application ] ─── (1. Write) ───> [ Cache (Redis) ]
            │                                     │
       (Cache Miss? DB Fetch)               (Asynchronous / Synchronous Flush)
            v                                     v
     [ Primary Database ] <───────────────────────┘
```

---

## 5. LANGUAGES

### Node.js / TypeScript (Cache-Aside Pattern Implementation)
This TypeScript example implements the lazy-loading pattern using an asynchronous connection to a Redis cluster:
```typescript
import { createClient } from 'redis';

const redisClient = createClient({ url: 'redis://redis-production:6379' });
redisClient.connect();

interface UserProfile { id: string; name: string; email: string; }

async function getUserProfile(userId: string): Promise<UserProfile> {
    const cacheKey = `user:profile:${userId}`;

    // 1. Try to read from cache (RAM)
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        console.log("Cache Hit!");
        return JSON.parse(cachedData);
    }

    // 2. Cache Miss: Fetch from SQL Database
    console.log("Cache Miss! Querying PostgreSQL...");
    const user = await db.queryUserTable(userId);

    // 3. Save copy back to Cache with an expiration TTL (e.g., 1 hour)
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(user));

    return user;
}
```

### Java 25+ (Write-Back Asynchronous Cache Queue Simulator)
This class demonstrates a high-performance, non-blocking Write-Back cache mechanism utilizing Project Loom Virtual Threads to orchestrate database flushes:
```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.Executors;

public class WriteBackCacheManager {
    private static final ConcurrentHashMap<String, String> cache = new ConcurrentHashMap<>();
    private static final LinkedBlockingQueue<WriteJob> writeQueue = new LinkedBlockingQueue<>();

    record WriteJob(String key, String value) {}

    public void init() {
        // Dedicate an asynchronous background worker utilizing virtual threads
        Thread.startVirtualThread(() -> {
            try {
                while (true) {
                    WriteJob job = writeQueue.take(); // Blocks when queue is empty
                    // Simulate writing to PostgreSQL / MySQL
                    saveToPrimaryDatabase(job.key(), job.value());
                }
            } catch (InterruptedException ignored) {}
        });
    }

    public void write(String key, String value) {
        // 1. Write to Cache instantly
        cache.put(key, value);
        // 2. Queue write job for asynchronous batch flush
        writeQueue.add(new WriteJob(key, value));
    }

    private void saveToPrimaryDatabase(String key, String value) throws Exception {
        // Simulate high-latency DB save
        Thread.sleep(100); 
        System.out.println("Asynchronous Flush Completed for key: " + key);
    }
}
```

---

## 6. INFRASTRUCTURE

### Docker Compose Cluster (Redis Cache + Primary PostgreSQL DB)
This Compose file spins up a fully isolated, production-ready cache and relational storage network:
```yaml
# docker-compose-caching.yml
version: '3.8'

services:
  cache_redis:
    image: redis:7-alpine
    container_name: production_redis_cache
    command: redis-server --appendonly yes # Ensure disk durability snapshots
    ports:
      - "6379:6379"
    volumes:
      - redis_data_volume:/data
    networks:
      - storage_network

  database_postgres:
    image: postgres:15-alpine
    container_name: production_postgresql_db
    environment:
      POSTGRES_USER: production_user
      POSTGRES_PASSWORD: production_secure_db_pass
      POSTGRES_DB: user_catalog
    ports:
      - "5432:5432"
    volumes:
      - postgres_data_volume:/var/lib/postgresql/data
    networks:
      - storage_network

volumes:
  redis_data_volume:
  postgres_data_volume:

networks:
  storage_network:
    driver: bridge
```
