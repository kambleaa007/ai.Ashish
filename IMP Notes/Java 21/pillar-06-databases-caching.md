# AWS Solutions Architect & DevOps Masterclass
## Pillar 6: DATABASES & CACHING
**Edition**: 2026 High-Paid Professional Prep

---

#### Topic 51: Amazon RDS Relational Engines
*   🧠 **Mental Model**: Renting a fully managed database server with an expert database administrator (DBA) bundled in, who automatically manages server patching, backups, and scale [cite: 178, 540, 541].
*   📋 **What, Why, Where, How**:
    *   **What**: A managed relational database service supporting MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server [cite: 51, 177, 406].
    *   **Why**: Reduces DB administration burden, offering automated snapshots, minor version updates, and scaling [cite: 178, 407, 540].
    *   **Where**: Securely hosted within private database subnets inside a VPC [cite: 188, 698].
    *   **How**: Launching RDS instances via CDK and connecting via SQL client libraries [cite: 202, 208].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "Does RDS automatically optimize or tune slow SQL queries on your behalf?"
    *   *Answer*: "No. Under the shared responsibility model, RDS manages the database engine installation, host patching, and physical backups [cite: 540]. Query optimization, index creation, and logical database schema design are strictly the client's responsibility [cite: 179, 541]."

#### Topic 52: Amazon Aurora Clustered Databases
*   🧠 **Mental Model**: A high-end sports car built with an ultra-resilient engine that automatically duplicates your car's tires and spare parts six times across three different garages [cite: 193].
*   📋 **What, Why, Where, How**:
    *   **What**: A cloud-native, fully managed, MySQL and PostgreSQL-compatible relational database [cite: 52, 193, 194].
    *   **Why**: Delivers up to 5x the performance of standard MySQL by utilizing a highly resilient shared storage layer [cite: 193, 194].
    *   **Where**: Enterprise relational database workloads requiring extreme scale [cite: 783, 1161].
    *   **How**: Provisioning Aurora clusters with active write and read nodes via CDK.
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How does Amazon Aurora's underlying storage mechanism differ from standard RDS Multi-AZ storage?"
    *   *Answer*: "Standard RDS Multi-AZ replicates data synchronously to a single standby database in another AZ [cite: 181, 407]. Amazon Aurora automatically replicates data asynchronously across three Availability Zones, keeping exactly 6 copies of your data (2 per AZ) on SSD-backed shared storage, allowing write operations to continue even if an entire AZ fails [cite: 545, 595]."

#### Topic 53: RDS Multi-AZ vs. Read Replicas
*   🧠 **Mental Model**: Multi-AZ: A backup database server running in the background for emergencies. Read Replicas: Extra staff members hired solely to answer customer phone questions, freeing up the manager to handle sales.
*   📋 **What, Why, Where, How**:
    *   **What**: Multi-AZ is a high-availability disaster recovery mechanism; Read Replicas are a performance scaling mechanism [cite: 53, 407].
    *   **Why**: Multi-AZ protects against localized hardware failures; Read Replicas offload heavy read-query loads from the master [cite: 407, 539].
    *   **Where**: High-traffic database tiers serving global web applications [cite: 539].
    *   **How**: Enabling Multi-AZ or creating up to 15 read replicas via the RDS dashboard [cite: 407, 539].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "Can you execute write operations directly against an RDS Read Replica?"
    *   *Answer*: "No. Read Replicas are strictly read-only copies [cite: 407, 539]. All write operations must be executed against the primary master database. The changes are asynchronously replicated from the master to the replicas [cite: 407]."

#### Topic 54: NoSQL Foundations & DynamoDB
*   🧠 **Mental Model**: A giant warehouse where boxes of varying sizes and structures are stored on shelves with a rapid automated forklift retrieval system [cite: 186, 187].
*   📋 **What, Why, Where, How**:
    *   **What**: A fully managed, serverless, multi-region NoSQL key-value database [cite: 54, 186, 187].
    *   **Why**: Delivers single-digit millisecond latency at virtually any scale, with zero maintenance overhead [cite: 187, 506].
    *   **Where**: High-throughput workloads like shopping carts, user sessions, game leaderboards, and IoT streams [cite: 187, 195].
    *   **How**: Designing schema-less tables using primary partition keys [cite: 55, 187].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What does it mean that Amazon DynamoDB is a 'schema-less' database?"
    *   *Answer*: "It means that except for the primary partition and sort keys, individual items (rows) in a table can have completely different attributes (columns) [cite: 187]. You do not need to alter database schemas or run migration scripts to store new fields, providing extreme data flexibility [cite: 187]."

#### Topic 55: DynamoDB Partition Keys & Sort Keys
*   🧠 **Mental Model**: Partition Key: Finding the correct book cabinet in a library (e.g., Fiction). Sort Key: Locating the exact book alphabetically on the shelf inside that cabinet.
*   📋 **What, Why, Where, How**:
    *   **What**: The composite primary key structure used to uniquely identify items in a DynamoDB table [cite: 55, 187].
    *   **Why**: Partition keys determine physical data placement on SSD storage partitions; sort keys organize data within partitions [cite: 55, 187].
    *   **Where**: Schema definitions for high-performance NoSQL query access [cite: 55].
    *   **How**: Specifying String/Number Partition Keys (PK) and optionally Sort Keys (SK) in table props [cite: 1358, 1362].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What is a 'Hot Partition' in DynamoDB, and how do you design your Partition Key to prevent it?"
    *   *Answer*: "A hot partition occurs when a large volume of read/write requests target a single partition key (e.g., hardcoding a status 'active'), overloading the underlying SSD partition. To prevent this, design partition keys with high cardinality (e.g., using UUIDs or timestamp suffixes) to distribute requests evenly."

#### Topic 56: DynamoDB On-Demand vs. Provisioned Capacity
*   🧠 **Mental Model**: On-Demand: Pay-as-you-go water bill (charge per drop consumed). Provisioned: A gym membership where you pay a flat monthly rate for access to 10 treadmills, whether you use them or not.
*   📋 **What, Why, Where, How**:
    *   **What**: Scaling models for managing read and write capacity allocations on tables [cite: 56, 186].
    *   **Why**: On-Demand handles highly unpredictable traffic peaks; Provisioned minimizes costs for consistent, predictable workloads.
    *   **Where**: High-scale data storage tiers [cite: 56].
    *   **How**: Toggling the billing mode between PAY_PER_REQUEST and PROVISIONED [cite: 186, 1362].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "Your table is hitting `ProvisionedThroughputExceededException` errors. How do you resolve this?"
    *   *Answer*: "You resolve this by enabling auto-scaling for read/write capacity units (RCUs/WCUs), switching the billing mode to On-Demand (pay-per-request), or implementing exponential backoff with jitter in your application SDK calls [cite: 186]."

#### Topic 57: DynamoDB Streams
*   🧠 **Mental Model**: A security camera continuously recording every single change made to a folder and instantly alerting a team of workers to act on each edit [cite: 170, 181].
*   📋 **What, Why, Where, How**:
    *   **What**: An ordered flow of information about changes to items in a DynamoDB table [cite: 57, 1218].
    *   **Why**: Enables near real-time reactive workflows (e.g., triggering a Lambda function whenever a new user registers) [cite: 506, 1218].
    *   **Where**: Event-driven microservices architectures [cite: 1218].
    *   **How**: Enabling streams and mapping the stream ARN as an event source for a Lambda function [cite: 1356, 1362].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How long are change records retained inside a DynamoDB Stream?"
    *   *Answer*: "DynamoDB Stream records are retained for exactly 24 hours. After 24 hours, the change data is permanently purged, so consuming applications must process events asynchronously within this window."

#### Topic 58: Amazon ElastiCache (Redis vs. Memcached)
*   🧠 **Mental Model**: A post-it note stuck to your monitor containing the most common phone numbers. Instead of opening the heavy corporate phonebook database every time, you look at the note instantly [cite: 410, 411].
*   📋 **What, Why, Where, How**:
    *   **What**: A fully managed in-memory data store and cache service [cite: 58, 410].
    *   **Why**: Drastically offloads read traffic from relational databases and reduces page load times to sub-milliseconds [cite: 411, 412].
    *   **Where**: Web applications with heavy session state, leaderboards, or repetitive SQL query trends [cite: 410, 411].
    *   **How**: Setting up caching layers in front of your RDS databases [cite: 410, 412].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "When would you select Redis over Memcached for your caching layer?"
    *   *Answer*: "You select Redis when you require advanced data structures (lists, sets, sorted sets), database persistence, pub-sub messaging, multi-AZ replication, or failover capability [cite: 58]. You select Memcached for simple key-value caching workloads where speed and multi-threaded processing are the only objectives."

#### Topic 59: Amazon Redshift
*   🧠 **Mental Model**: A giant warehouse where decades of historical corporate reports are systematically indexed and analyzed by a team of researchers using advanced analytics tools [cite: 59].
*   📋 **What, Why, Where, How**:
    *   **What**: A fast, fully managed, petabyte-scale data warehouse service [cite: 59, 409].
    *   **Why**: Enables complex analytical queries (OLAP) across massive historical datasets without impacting transactional databases [cite: 409].
    *   **Where**: Business intelligence, reporting dashboards, and large-scale data lake analysis [cite: 318].
    *   **How**: Consolidating logs and transactional tables into a Redshift cluster via ETL pipelines [cite: 318].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What is the primary architectural difference between Amazon RDS (OLTP) and Amazon Redshift (OLAP)?"
    *   *Answer*: "Amazon RDS uses row-oriented storage, optimized for rapid, individual write/read transactional operations [cite: 407]. Amazon Redshift uses columnar storage, optimized for scanning massive columns of data across billions of records to execute aggregations and analytical reporting queries with high compression [cite: 409]."

#### Topic 60: ACID vs. BASE Compliance
*   🧠 **Mental Model**: ACID: A banking bank transaction (absolutely correct, no compromise on accuracy, strict lock). BASE: Social media likes (eventually correct, doesn't matter if you see 100 likes and your friend sees 98 likes for a few seconds).
*   📋 **What, Why, Where, How**:
    *   **What**: ACID (Atomicity, Consistency, Isolation, Durability) guarantees reliable database transactions; BASE (Basically Available, Soft state, Eventual consistency) prioritizes availability over immediate consistency [cite: 60].
    *   **Why**: ACID ensures absolute financial data integrity; BASE enables global horizontal scaling and speed.
    *   **Where**: SQL relational databases (RDS/Aurora) vs NoSQL databases (DynamoDB) [cite: 186, 187].
    *   **How**: Selecting database engines based on CAP theorem requirements [cite: 187].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "Under what conditions does DynamoDB support ACID-compliant transactions?"
    *   *Answer*: "DynamoDB supports ACID through DynamoDB TransactWriteItems and TransactGetItems APIs [cite: 187]. These allow you to execute atomic, all-or-nothing transactions across multiple items within a single AWS account and region, combining NoSQL scaling with ACID reliability."