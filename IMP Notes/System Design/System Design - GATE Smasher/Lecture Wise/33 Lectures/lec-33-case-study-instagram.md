# Lecture 33 Case Study: Instagram Feed Generation & Media Scaling

This case study analyzes the architecture of high-scale social media platforms (such as Instagram), which process millions of media uploads and distribute personalized news feeds to billions of users globally in real-time.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS
*   **WHAT**: An **Instagram-Scale Social Network System** is a distributed web architecture designed to handle high-write media uploads and execute high-speed, personalized news feed compilation and delivery.
*   **WHY**: If Instagram compiled news feeds dynamically by querying SQL database tables and joining user follower tables on every page refresh, the database servers would instantly collapse under the weight of billions of read queries. Instagram uses pre-compiled caching, hybrid feed fan-out algorithms, and globally distributed CDN architectures to serve feeds instantly to users worldwide.
*   **WHERE & WHEN**: Spans geographically distributed CDNs, edge reverse proxies, media transcoding worker nodes, NoSQL Graph and Document databases, and distributed caching grids (Redis).
*   **HOW**:
    1.  **Media Upload Path**: Client uploads photo -> Edge Reverse Proxy intercepts -> Routes to Object Storage (S3) -> Triggers background media transcoding workers to compress and generate multiple resolutions (360p, 720p, 1080p).
    2.  **Metadata Write Path**: Image metadata (URL, dimensions, location) is saved to a Document database (MongoDB) and mapped to the user social graph inside a Graph database (Neo4j).
    3.  **Feed Fan-Out (Push vs. Pull)**:
        *   *Normal Users (Push)*: When a regular user posts a photo, background workers push the post ID directly into the pre-compiled Redis feed caches of all their followers (high write amplification, instant reads).
        *   *Celebrities (Pull)*: When a celebrity with 100M+ followers posts a photo, pushing to all followers' caches would exhaust system resources. Instead, the photo is compiled dynamically (pulled) only when a follower refreshes their feed (hybrid model).

---

## 2. TRADEOFF ANALYSIS
*   **Advantages**:
    *   **Instant Feed Loading**: Pre-compiling feeds into memory (Redis) ensures sub-100ms response times for users.
    *   **Reduced Core Database Load**: Offloading media delivery to CDNs keeps core databases free to handle metadata writes.
*   **Disadvantages**:
    *   **High Write Amplification**: Pushing post IDs to millions of followers' caches consumes massive write bandwidth and memory.
    *   **Data Consistency Delays**: Celebrities' posts can take several seconds to replicate and appear in all followers' feeds globally.

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES
**Instagram** processes over 100 million media uploads per day. They implement a **Hybrid Fan-Out model**. For regular users with small follower counts, Instagram uses a **Push model** to pre-compile and write posts directly to their followers' feed caches. For celebrities (e.g., Selena Gomez, Cristiano Ronaldo), Instagram switches to a **Pull model**, merging celebrity posts dynamically with the follower's pre-compiled feed cache on request.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS
*   **Mental Model**: Think of distributing physical newsletters.
    *   **Pure Push (The Neighborhood News)**: A local club coordinator writes a newsletter and delivers a copy to the physical mailboxes of all 50 members. When members want to read it, they just open their mailbox (instant read).
    *   **Pure Pull (The National Magazine)**: A publisher prints a magazine but does not deliver it. Instead, they keep it in a central warehouse. When subscribers want to read it, they must travel to the warehouse and ask for a copy. This takes longer, but it avoids shipping millions of magazines to inactive subscribers.

```
  [ THE INSTAGRAM FLOW ]
  Client Upload ───► [ API Gateway ] ───► Store Binary ───► [ AWS S3 / CDN ]
                           │
                     (Metadata Write)
                           ▼
                 [ Mongo Metadata DB ]
                           │
                    (Fan-out Worker)
                           ▼
                  [ Redis Feed Cache ] ◄─── Read Feed ◄─── Follower Device
```

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

#### JavaScript / TypeScript (Dynamic Feed Aggregation)
Compiling a user's feed from their social graph and media metadata in Node.js.
```typescript
import Redis from 'ioredis';
const redis = new Redis();

async function getUserFeed(userId: string): Promise<string[]> {
    const feedKey = `feed:user:${userId}`;
    // Fetch pre-compiled post IDs directly from the user's Redis feed cache
    const postIds = await redis.zrevrange(feedKey, 0, 20); // Get latest 20 post IDs
    return postIds;
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER
*   **AWS**: Amazon S3 (raw media storage), Amazon CloudFront (CDN media distribution), and Amazon ElastiCache Redis (pre-compiled user feeds).
*   **Docker Compose (Instagram-scale local sandbox)**:
```yaml
version: '3.8'
services:
  s3-local-mock:
    image: adobe/s3rver:latest
    ports: ["4569:4569"] # Local S3 storage mock

  redis-feed-cache:
    image: redis:alpine
    ports: ["6379:6379"]
```
