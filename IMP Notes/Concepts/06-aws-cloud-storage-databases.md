# 6: AWS Cloud Storage & Databases


### 18. Cloud Storage Typologies (S3 Object, EBS Block, & EFS File Storage)
*   **What**: Three fundamental storage classes: Simple Storage Service (S3) is an infinitely scalable HTTP-accessible object storage; Elastic Block Store (EBS) is a high-speed virtual hard drive mapped to a single EC2; Elastic File System (EFS) is a shared, concurrent network drive accessible by multiple instances.
*   **Why**: Different workloads demand distinct storage performance, accessibility, and consistency characteristics. Databases need low-latency blocks; web servers need shared media access; backups need cheap, durable object storage.
*   **Where**: Used to store database files (EBS), user profile pictures (S3), and shared configuration directories (EFS).
*   **How**:
    *   **S3**: Accessed via standard HTTPS API requests (e.g., `s3.amazonaws.com`).
    *   **EBS**: Formatted with a filesystem (e.g., `ext4`) and mounted to an EC2 instance.
    *   **EFS**: Mounted on multiple EC2 instances simultaneously using standard NFSv4 protocols.
*   **Decision Tree**:
    *   If you need to store raw files, media, database backups, or static sites: **Use S3**.
    *   If you need a high-speed, direct-attached boot disk or database storage for a single server: **Use EBS**.
    *   If you need a shared drive where hundreds of concurrent servers can read and write files simultaneously: **Use EFS**.
*   **Advantages**:
    *   **S3**: Infinite scaling, cheap storage, 11 nines of durability, global availability.
    *   **EBS**: Ultra-low single-digit millisecond latency, close proximity to compute.
    *   **EFS**: Elastic capacity that expands automatically, concurrently accessible by thousands of instances.
*   **Disadvantages**:
    *   **S3**: Not mountable as a fast local OS filesystem, and data modification requires replacing the entire object.
    *   **EBS**: Restricted to a single Availability Zone, and cannot be shared across multiple running servers natively.
    *   **EFS**: Significantly higher cost per GB compared to EBS and S3, and baseline throughput can suffer if IO credits are exhausted.
*   **Mental Model**: Workspace file storage. EBS is the personal lock-drawer inside your office desk (fast, right next to you, but only you can use it). S3 is a massive wholesale shipping warehouse down the street (holds infinite boxes, cheap, but you must write a shipping order/API request to fetch anything). EFS is a massive dry-erase whiteboard on the conference room wall (multiple people can read and write ideas on it at the exact same time).
*   **Example**: Provisioning an EBS `gp3` volume to boot an EC2 server, while mounting an EFS volume across a cluster of web servers to share an upload directory, and running an automated Python script to backup old logs to an S3 Glacier bucket.
*   **Big Picture Resources**: [AWS Storage Services Overview](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Storage.html)

---

### 19. SQL vs. NoSQL Database Paradigms (RDS/Aurora vs. DynamoDB)
*   **What**: Two distinct database architectures: Relational Database Service (RDS/Aurora) provides managed ACID-compliant SQL databases (PostgreSQL, MySQL), while DynamoDB is a serverless, hyper-scalable NoSQL key-value and document store.
*   **Why**: Choosing the wrong database layer leads to scaling bottlenecks or application code complexity. Relational databases are optimized for complex, relational queries and transaction safety, while NoSQL is built for extreme throughput and single-digit millisecond speed at scale.
*   **Where**: Financial ledgers and relational user tables (RDS) vs. high-velocity shopping carts, gaming session histories, and real-time clickstreams (DynamoDB).
*   **How**: Create an RDS PostgreSQL database selecting instance sizes, automatic backups, and Multi-AZ standby replication. Create a DynamoDB table defining only a Partition Key, and immediately write JSON documents without schema restrictions.
*   **Advantages**:
    *   **RDS/Aurora**: Supports complex relational queries, joins, foreign keys, and guarantees ACID compliance across multiple tables.
    *   **DynamoDB**: Completely serverless, auto-scales to handle millions of concurrent queries with single-digit millisecond latency, and costs nothing when idle.
*   **Disadvantages**:
    *   **RDS/Aurora**: Expensive fixed cost (easily $500+/month), requires manual scaling, and database connections can become bottlenecked.
    *   **DynamoDB**: Lacks support for relational joins, requires strict design of partition and sort keys upfront, and complex query patterns are highly difficult to implement.
*   **Mental Model**: A state archive library vs. a digital sorting locker. The library (RDS) has highly cross-referenced, structured book indexes. You can execute complex queries like "find all books written by Author X published in Year Y". The sorting locker (DynamoDB) is a massive wall of digital lockboxes. You enter a locker ID (key) and instantly grab the package inside in 1 millisecond, but you cannot ask the locker system to search inside all packages for a specific word.
*   **Example**: Deploying an Aurora Global Database with read-replicas across multiple regions for global low-latency reads, while leveraging a DynamoDB table to manage user session tokens in real-time.
*   **Big Picture Resources**: [AWS Databases Selection Guide](https://docs.aws.amazon.com/rds/latest/UserGuide/Welcome.html)

---
---

## 🛠️ Enterprise Cloud Storage Performance Tiers (EBS / S3)
Selecting optimal storage configurations requires balancing IOPS, throughput, and costs.

### 1. Amazon EBS Volume Selection Matrix
For high-performance databases, prefer **gp3** or **io2** volumes:
*   **gp3 (General Purpose v3)**: Separates storage size from performance. Standard baseline provides 3,000 IOPS and 125 MB/s throughput for free. Scale IOPS independently up to 16,000 without buying extra GBs.
*   **io2 Block Express**: Provisioned for mission-critical, high-throughput engines. Scales up to 256,000 IOPS and 4,000 MB/s throughput per volume with sub-millisecond latency.

### 2. S3 Storage Lifecycle & Tier Transition Guide
Automate S3 bucket cost optimization by configuring transition rules:
```
[ Instant Ingestion ] ──► S3 Standard (Hot Data)
                               │
                       Transition (30 Days)
                               ▼
                          S3 Standard-Infrequent Access (Infrequent Access)
                               │
                       Transition (90 Days)
                               ▼
                          S3 Glacier Flexible / Deep Archive (Cold Archives)
```

### 3. DynamoDB Partition Sizing & Throttling Mitigation
DynamoDB scales horizontally by partitioning data. A single partition holds a maximum of **10GB** of data, supports up to **3,000 Read Capacity Units (RCUs)**, and **1,000 Write Capacity Units (WCUs)**.

#### Prevent "Hot Partition" Failures:
If an application writes millions of entries targeting the exact same partition key (e.g., `Country = "USA"`), the single physical partition supporting that key will saturate and trigger `ProvisionedThroughputExceededException`.
*   **Strategy**: Implement **Write Sharding**. Append a random numerical suffix to your partition keys (e.g., `USA_1`, `USA_2`, `USA_3`) to spread writes uniformly across multiple physical database partitions.