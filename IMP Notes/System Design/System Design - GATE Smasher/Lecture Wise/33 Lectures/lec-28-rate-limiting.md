# Lecture 28 Rate Limiting in System Design

High-scale backends are vulnerable to denial-of-service floods, credential brute-forcing, and resource starvation. This guide explores the algorithms and implementations of distributed Rate Limiters.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS
*   **WHAT**: A **Rate Limiter** is an ingress traffic control service that monitors incoming request rates and blocks requests from clients that exceed predefined threshold limits, returning an **HTTP 429 Too Many Requests** error.
*   **WHY**: Without a rate limiter, a malicious user or a bug in a client-side loop could generate millions of API calls in seconds. This exhausts server CPU threads, floods database socket queues, and causes a complete outage for legitimate users.
*   **WHERE & WHEN**: Lives at the outermost edge of your virtual private cloud (VPC), typically embedded inside **API Gateways**, Web Application Firewalls (WAF), CDNs, or load-balancer ingress controllers.
*   **HOW**:
    1.  **Request Interception**: Client sends an API request. The Ingress Gateway interceptor extracts identifying keys (e.g., Client IP, API Token, or JWT claim).
    2.  **Cache Evaluation**: The gateway queries an in-memory key-value cache (such as Redis) using this key to check their historical usage budget.
    3.  **Algorithm Verification**: The limiter runs an algorithm (e.g., Token Bucket) to decide if the request fits the budget.
    4.  **Enforcement**: 
        *   *Within limits*: Increment count in Redis and forward request to the backend.
        *   *Limit breached*: Drop request, write "Rate Limit Exceeded" headers, and return HTTP 429.

---

## 2. TRADEOFF ANALYSIS

### Token Bucket vs. Leaky Bucket vs. Sliding Window
*   **Token Bucket**:
    *   *How*: A bucket holds $B$ tokens. Tokens refill at a constant rate $R$ per second. Each request consumes 1 token. If the bucket is empty, requests are dropped.
    *   *Pros*: Highly memory efficient; allows short **bursts of traffic** (e.g., if a page has 5 asset calls, they pass simultaneously).
    *   *Cons*: Under extreme load, burst allowance can still saturate downstream databases.
*   **Leaky Bucket (Leaky FIFO Queue)**:
    *   *How*: Requests enter a queue. The queue drains (processes) at a constant, fixed rate. If the queue overflows, new requests leak (are dropped).
    *   *Pros*: Enforces a smooth, stable, predictable traffic output flow, protecting legacy database nodes.
    *   *Cons*: Increases latency for legitimate, bursty client-side user experiences.
*   **Sliding Window Counter**:
    *   *How*: Divides time into windows and tracks counters. When a request arrives, it calculates: $Current\_Window\_Count + Previous\_Window\_Count \times Overlap\_Percentage$.
    *   *Pros*: Bypasses boundary-limit exploitation (where users double-spend budgets at fixed slot boundaries) without excessive memory usage.

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES
**Twitter (X)** implements rate limiting across all API tiers using **Redis-backed Token Bucket algorithms**. For example, Twitter restricts post-creation actions to 500 posts per hour per user. When a tweet request hits their API Gateway, the gateway queries a sharded Redis cluster using the user's OAuth ID key to check and decrement the token balance, protecting downstream timeline compilation queues from malicious spam scripts.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS
*   **Mental Model**: Think of an amusement park ride with a strict security guard.
    *   **Token Bucket (The Ticket Box)**: A box at the ride holds 10 ride tickets (tokens). Every hour, the park adds 2 tickets to the box. When a group of friends arrives, they can grab all 10 tickets at once and ride together (burst). But once the tickets are gone, no one can ride until the box refills.
    *   **Leaky Bucket (The Turnstile Maze)**: Guests must queue in a single-file maze. The turnstile lets exactly 1 person through every 5 seconds. Even if 50 people arrive at the same time, they cannot enter together; they must wait in line. If the maze fills up, the guard locks the gate and turns new arrivals away.

```
  [ TOKEN BUCKET ]                       [ LEAKY BUCKET ]
  Tokens Refill (+R/sec)                  Traffic Burst Input (Unstable)
        │                                        │
        ▼                                        ▼
  ┌─────────────┐                          ┌─────────────┐
  │ ░ ░ ░ ░ ░   │ Max Capacity: B          │ █ █ █ █ █ █ │ Max Queue: Q
  └──────┬──────┘                          └─────┬───────┘
         │ (Consumes token)                      │ (Leaks at constant rate)
         ▼                                       ▼
  Request Approved                         Stable Flow Output
```

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

#### JavaScript / TypeScript sliding window in Node.js
We execute sliding window checks atomically inside Redis using Lua scripts.
```typescript
import Redis from 'ioredis';
const redis = new Redis();

async function isRateLimited(ip: string, limit = 10, windowSec = 60): Promise<boolean> {
    const key = `rate:${ip}`;
    const now = Date.now();
    const clearBefore = now - (windowSec * 1000);

    // Redis transaction using multi/exec for thread safety
    const pipeline = redis.multi();
    pipeline.zremrangebyscore(key, 0, clearBefore); // Evict old requests
    pipeline.zcard(key); // Count active requests in current window
    pipeline.zadd(key, now, `${now}-${Math.random()}`); // Record current timestamp
    pipeline.expire(key, windowSec);
    
    const results = await pipeline.exec();
    const requestCount = results?.[1][1] as number;

    return requestCount >= limit;
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER
*   **AWS**: AWS WAF Rate-Based Rules (integrates directly with ALBs or CloudFront distributions).
*   **Docker (Nginx Rate Limiting Sandbox)**:
```yaml
# nginx.conf
http {
    # Limit requests by zone key (IP) to 10 requests per second
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    
    server {
        listen 80;
        location / {
            limit_req zone=api_limit burst=5 nodelay;
            proxy_pass http://api_servers;
        }
    }
}
```
