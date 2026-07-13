# The Ultimate Comprehensive Architectural Impact Matrix

The Ultimate Comprehensive Architectural Impact Matrix below maps all 30 system design tradeoffs to their specific trigger conditions, mental models, and real-world applications.

---

## 1. Consistency & Data Integrity

| Tradeoff | Mental Model | The Trigger (When) | The Impact (Why) | Real World Spec |
|----------|--------------|-------------------|------------------|-----------------|
| Consistency vs. Availability | ATM vs. Tinder | ATM stops if offline; Tinder works regardless. | When: Network partition occurs (CAP Theorem). | Cons: Data is correct; system may error. Avail: System works; data may be stale. |
| | | | Bank Balance (CP) vs. Likes Counter (AP) | |
| Strong vs. Eventual | Conference Call vs. Email | Call = everyone hears now. Email = delay. | When: Users read data immediately after writing. | Strong: High latency, hard to scale. Eventual: Fast writes, complex debugging. |
| | | | Inventory Count (Strong) vs. News Feed (Eventual) | |
| Latency vs. Consistency | Phone Call vs. Snail Mail | Call is fast/ephemeral; Mail is slow/record-based. | When: Global synchronization is required. | Lat: Local data, fast, potentially wrong. Con: Global data, slow, guaranteed right. |
| | | | CDN (Latency) vs. Stock Market (Consistency) | |
| Optimistic vs. Pessimistic | Google Docs vs. File Lock | Docs = merge later. Lock = "Read Only" for others. | When: Collision probability is High (Pess) or Low (Opt). | Opt: High throughput, complex retry logic. Pess: Zero conflicts, potential deadlocks. |
| | | | Wiki Edits (Optimistic) vs. Ticket Booking (Pessimistic) | |
| Sync vs. Async Replication | Carbon Copy vs. "Scan Later" | Sync = receipt now. Async = dropbox it. | When: Data loss is unacceptable (e.g., Payments). | Sync: Zero data loss, write latency penalty. Async: Fast writes, risk of data loss. |
| | | | Payment Gateway (Sync) vs. Profile Update (Async) | |

---

## 2. Databases & Storage

| Tradeoff | Mental Model | The Trigger (When) | The Impact (Why) | Real World Spec |
|----------|--------------|-------------------|------------------|-----------------|
| SQL vs. NoSQL | Phonebook vs. Scrapbook | Phonebook = rigid. Scrapbook = stick anything anywhere. | When: Data structure is unstable or volume > 10TB. | SQL: ACID guarantee, limited scale. NoSQL: Infinite scale, no joins. |
| | | | User Accounts (SQL) vs. IoT Sensor Logs (NoSQL) | |
| Normalization vs. Denormalization | Ingredient Jar vs. Pre-made Meal | Jar = efficient storage. Meal = instant eating. | When: Read latency is the bottleneck. | Norm: Fast writes, slow reads (Joins). Denorm: Fast reads, slow/complex writes. |
| | | | Inventory DB (Norm) vs. Landing Page (Denorm) | |
| Strict vs. Flexible Schema | Gov Form vs. Whiteboard | Form = reject errors. Board = write anything. | When: Business rules are evolving rapidly. | Strict: Data quality, slow iteration. Flex: Fast iteration, "data swamp" risk. |
| | | | Billing System (Strict) vs. Clickstream (Flexible) | |
| Replication vs. Sharding | Xerox Copy vs. Tearing Book | Copy = more readers. Tearing = parallel writers. | When: Single node hits capacity limits. | Rep: Scales reads, adds lag. Shard: Scales writes, adds routing complexity. |
| | | | CDN (Replication) vs. User Data A-M / N-Z (Sharding) | |
| Hash vs. Range Sharding | Dictionary vs. Encyclopedia | Dictionary = random access. Volumes = A-C, D-F. | When: You need efficient query patterns. | Hash: Uniform distribution, no range queries. Range: Good range queries, "Hotspot" risk. |
| | | | Memcached (Hash) vs. Google BigTable (Range) | |
| In-Memory vs. On-Disk | Brain (RAM) vs. Notebook (Disk) | Brain is fast but forgets. Notebook is permanent. | When: Response time needs to be < 10ms. | Mem: Blazing fast, expensive/volatile. Disk: Slow, cheap/durable. |
| | | | Redis Cache (In-Memory) vs. PostgreSQL (On-Disk) | |

---

## 3. Scaling & Performance

| Tradeoff | Mental Model | The Trigger (When) | The Impact (Why) | Real World Spec |
|----------|--------------|-------------------|------------------|-----------------|
| Vertical vs. Horizontal | Stronger Horse vs. More Horses | One beast limits speed; a herd has no limit. | When: Traffic exceeds single-server CPU/RAM. | Vert: Easy ops, hard hardware ceiling. Horiz: Unlimited scale, complex ops. |
| | | | Internal Tool (Vertical) vs. Public Search Engine (Horizontal) | |
| Latency vs. Throughput | Ferrari vs. Cargo Ship | Ferrari = fast delivery of 1. Ship = slow delivery of 10k. | When: Optimizing for User (Lat) or System (Thr). | Lat: Fast response, low volume. Thr: Slow response, massive volume. |
| | | | Typeahead Search (Latency) vs. Data Backup (Throughput) | |
| Read vs. Write Optimization | Billboard vs. Diary | Billboard = read by many. Diary = written by one. | When: Selecting database indexes. | Read: Heavy indexing, slow writes. Write: No indexes, slow reads. |
| | | | Wikipedia (Read Opt) vs. System Logs (Write Opt) | |
| Caching vs. Freshness | Memorization vs. Calculation | Reciting a poem vs. doing math. | When: Read/Write ratio > 100:1. | Cache: Sub-ms speed, risk of stale data. Fresh: 100% accuracy, high DB load. |
| | | | Product Price (Cache) vs. Checkout Total (Fresh) | |
| Write-Through vs. Write-Behind | Carbon Copy vs. "I'll file it later" | Copy = safe. Later = fast but risky. | When: Write latency is critical. | Through: Safe, slow writes. Behind: Fast writes, risk of data loss. |
| | | | Bank Ledger (Through) vs. YouTube View Count (Behind) | |
| Precompute vs. On-Demand | Buffet vs. A La Carte | Buffet = food ready (fast). Order = cooked now (fresh). | When: Complex aggregations are required. | Pre: Instant reads, storage cost. On-Demand: Slow reads, CPU cost. |
| | | | Trending Hashtags (Pre) vs. Custom Reports (On-Demand) | |

---

## 4. Architecture

| Tradeoff | Mental Model | The Trigger (When) | The Impact (Why) | Real World Spec |
|----------|--------------|-------------------|------------------|-----------------|
| Monolith vs. Microservices | Apartment vs. Suburbs | Apt = shared plumbing. Suburbs = independent houses. | When: Team size > 50 engineers. | Mono: Simple deploy, spaghetti code. Micro: Complex deploy, clear boundaries. |
| | | | MVP Startup (Monolith) vs. Netflix/Uber (Microservices) | |
| Stateful vs. Stateless | Elephant vs. Goldfish | Elephant remembers. Goldfish forgets instantly. | When: Scaling horizontally across regions. | Stateful: Sticky sessions, hard to scale. Stateless: Infinite scale, redundant data. |
| | | | FTP / Gaming (Stateful) vs. REST API (Stateless) | |
| Tight vs. Loose Coupling | Three-legged Race vs. Relay | Tight = move together. Loose = hand off and go. | When: Defining service dependencies. | Tight: Fast local calls, cascade failures. Loose: Resilient, higher complexity. |
| | | | Library Call (Tight) vs. Message Queue (Loose) | |
| Serverless vs. Managed | Uber vs. Owning a Car | Uber = pay per ride. Car = pay monthly regardless. | When: Traffic is "spiky" or unpredictable. | Serverless: Zero idle cost, cold starts. Managed: Predictable, idle cost. |
| | | | Image Resizing (Serverless) vs. Core App Server (Managed) | |
| Single vs. Multi-Region | Local Shop vs. Franchise Chain | Shop = one location. Chain = everywhere. | When: Latency > 200ms for global users. | Single: Simple, high latency abroad. Multi: Complex sync, low latency everywhere. |
| | | | Small Business (Single) vs. Facebook (Multi) | |

---

## 5. Communication & APIs

| Tradeoff | Mental Model | The Trigger (When) | The Impact (Why) | Real World Spec |
|----------|--------------|-------------------|------------------|-----------------|
| Synchronous vs. Asynchronous | Waiter vs. Ticket System | Waiter waits at table. Ticket = "Order #55 is ready". | When: Client cannot wait for completion. | Sync: Simple, blocks resources. Async: Complex, efficient resource usage. |
| | | | Login (Sync) vs. Video Transcoding (Async) | |
| REST vs. gRPC | Mailing a Letter vs. Hardwire | Letter = readable (JSON). Wire = binary speed. | When: Internal Service-to-Service comms. | REST: Readable, heavy (Text). gRPC: Unreadable, light (Binary). |
| | | | Public API (REST) vs. Internal Microservices (gRPC) | |
| REST vs. GraphQL | Set Menu vs. Buffet | Set = get what you're given. Buffet = pick exactly what you want. | When: Mobile clients with limited bandwidth. | REST: Over-fetching data. GraphQL: Exact data fetching. |
| | | | Public Partner API (REST) vs. Mobile App (GraphQL) | |
| Polling vs. WebSockets | "Are we there yet?" vs. "Wake me up" | Polling wastes energy asking. Sockets wait. | When: Real-time updates are required. | Poll: High server load (empty checks). Socket: Persistent connection overhead. |
| | | | Dashboard (Polling) vs. Chat App (WebSockets) | |
| Fan-out Write vs. Fan-out Read | Megaphone vs. Library | Mega (Write) = Push to all. Library (Read) = User comes to check. | When: Building feeds (Twitter/Insta). | Write: Fast reads, "Justin Bieber" problem. Read: Slow reads, easy writes. |
| | | | Twitter Timeline (Write) vs. Facebook News Feed (Read) | |

---

## 6. Processing, Transactions & Cost

| Tradeoff | Mental Model | The Trigger (When) | The Impact (Why) | Real World Spec |
|----------|--------------|-------------------|------------------|-----------------|
| Batch vs. Stream | Laundry Day vs. Washing Hands | Laundry = wait for load. Hands = wash immediately. | When: Insight value decays rapidly. | Batch: High efficiency, high latency. Stream: Low latency, high complexity. |
| | | | Payroll (Batch) vs. Fraud Detection (Stream) | |
| 2-Phase Commit vs. Saga | Marriage Vows vs. Ordering Pizza | Vows = atomic "I Do". Pizza = order now, eat later. | When: Transaction spans multiple services. | 2PC: Strong consistency, locks system. Saga: High avail, eventual consistency. |
| | | | DB Sharding (2PC) vs. Order Fulfillment (Saga) | |
| Cost vs. Performance | Economy Class vs. Private Jet | Economy = cheap/slow. Jet = expensive/fast. | When: Budget is the primary constraint. | Cost: Commodity hardware, higher latency. Perf: Specialized hardware, max speed. |
| | | | Archive Storage (Cost) vs. HFT Trading (Performance) | |