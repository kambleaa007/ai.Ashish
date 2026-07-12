# The System Design Tradeoff Cheat Sheet

Here is the complete reconstruction of the 30 System Design Tradeoffs table from the DesignGurus guide, organized by category for rapid decision-making.

The 30 key system design tradeoffs, as detailed in the source guide, are categorized into six areas for managing architectural decisions.

---

## 1. Consistency and Data Integrity

| Tradeoff | Description |
|----------|-------------|
| Consistency vs. Availability | Prioritize consistency for data accuracy (e.g., banking) or availability for high uptime (e.g., social feeds) |
| Strong vs. Eventual | Choose strong consistency when data must be identical everywhere, or eventual consistency for higher scalability |
| Latency vs. Consistency | Opt for low latency by using local data, or high consistency by waiting for global consensus |
| Optimistic vs. Pessimistic Locking | Use optimistic for low-conflict scenarios or pessimistic to lock resources in high-conflict scenarios |
| Synchronous vs. Asynchronous Replication | Choose sync for zero data loss or async for better performance |

---

## 2. Databases and Storage

| Tradeoff | Description |
|----------|-------------|
| SQL vs. NoSQL | Select SQL for structured, relational data (ACID) or NoSQL for flexible, high-volume data |
| Normalization vs. Denormalization | Use normalization to maintain integrity, or denormalization to boost read performance |
| Strict vs. Flexible Schema | Pick strict for stable data structures or flexible for rapidly changing data |
| Replication vs. Sharding | Replicate for read-heavy workloads or shard to distribute write-heavy loads |
| Hash vs. Range Sharding | Use hash for uniform data distribution or range for sorting and range queries |
| In-Memory vs. On-Disk | Choose in-memory for speed or on-disk for durability and capacity |

---

## 3. Scaling and Performance

| Tradeoff | Description |
|----------|-------------|
| Vertical vs. Horizontal | Use vertical for simplicity or horizontal for massive, elastic scaling |
| Latency vs. Throughput | Prioritize low latency for fast user experience or high throughput for processing volume |
| Read vs. Write Optimization | Tune system architecture to favor either read-heavy or write-heavy operations |
| Caching vs. Freshness | Balance using caches for speed against the need for real-time data accuracy |
| Write-Through vs. Write-Behind | Use write-through for data safety or write-behind for maximum write performance |
| Precompute vs. Compute On-Demand | Precompute data for instant reads or calculate on-demand to save space |

---

## 4. Architecture

| Tradeoff | Description |
|----------|-------------|
| Monolith vs. Microservices | Start with a monolith for simplicity or adopt microservices for independent scalability and team autonomy |
| Stateful vs. Stateless | Use stateful for session persistence or stateless for horizontal scaling |
| Tight vs. Loose Coupling | Choose tight for performance or loose for system flexibility and resilience |
| Serverless vs. Managed | Pick serverless for cost-effective, variable traffic or managed servers for high, consistent loads |
| Single vs. Multi-Region | Select single for simplicity or multi-region for global low latency and high availability |

---

## 5. Communication and APIs

| Tradeoff | Description |
|----------|-------------|
| Synchronous vs. Asynchronous | Use sync for immediate responses or async to unblock processes |
| REST vs. gRPC | Choose REST for public, web-friendly APIs or gRPC for internal, high-performance communication |
| REST vs. GraphQL | Select REST for standardized access or GraphQL for efficient, flexible data fetching |
| Polling vs. WebSockets | Use polling for infrequent updates or WebSockets for real-time, bi-directional communication |
| Fan-out on Write vs. Read | Choose based on whether optimizing for fast user posting or fast user feed loading |

---

## 6. Processing, Transactions, and Cost

| Tradeoff | Description |
|----------|-------------|
| Batch vs. Stream | Use batch for high-volume, asynchronous processing or stream for real-time data analytics |
| Two-Phase Commit vs. Saga | Choose 2PC for strong distributed consistency or Saga for long-running, resilient transactions |
| Cost vs. Performance | Balance budget constraints against user experience demands |

---