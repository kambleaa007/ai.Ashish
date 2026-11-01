# AWS Conceptwise: Master Concept-to-Keyword Matrix

> A senior/principal interview reference mapping every AWS scenario to a core distributed-systems tension, a rejected naive fix, a managed-service anchor, and a target metric.

## Table of Contents

1. [Compute, Containers & Serverless Execution](#1-compute-containers--serverless-execution)
2. [Databases, Caching & State Management](#2-databases-caching--state-management)
3. [Storage, File Systems & Data Lifecycle](#3-storage-file-systems--data-lifecycle)
4. [Asynchronous Messaging, Streaming & Orchestration](#4-asynchronous-messaging-streaming--orchestration)
5. [Networking, Edge Delivery & Hybrid Connectivity](#5-networking-edge-delivery--hybrid-connectivity)
6. [Generative AI, LLM Infrastructure & Machine Learning](#6-generative-ai-llm-infrastructure--machine-learning)
7. [Security, Identity & Enterprise Governance](#7-security-identity--enterprise-governance)
8. [Observability, Resilience & Chaos Engineering](#8-observability-resilience--chaos-engineering)
9. [Data Engineering, Analytics, Migration & DevOps](#9-data-engineering-analytics-migration--devops)
10. [Interview Execution: From Trigger to Service](#10-interview-execution-from-trigger-to-service)
11. [Quick-Reference Keyword Glossary](#11-quick-reference-keyword-glossary)

---

Mastering senior and principal AWS interviews requires mapping every scenario to a core distributed systems tension before naming an AWS service. Grouping the AWS ecosystem into nine architectural domains allows you to pair any interview problem trigger with its conceptual keyword, rejected naive alternative, managed service anchor, and target metric.

## 1. Compute, Containers & Serverless Execution

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| Server config drift | Immutable infrastructure | Manual EC2 patching | ECS Fargate | Deployment lead time |
| Kubernetes control overhead | Managed container orchestration | Self-managed EC2 K8s | EKS with Karpenter | Cluster utilization rate |
| Spiky unpredictable traffic | Event-driven compute | Idle EC2 fleets | AWS Lambda | Cost per request |
| Java Lambda cold starts | Snapshot restore | Provisioned concurrency everywhere | Lambda SnapStart | p99 initialization latency |
| High compute bill | ARM64 price performance | Over-sized x86 instances | AWS Graviton instances | Compute cost reduction |
| Fault-tolerant batch jobs | Preemptible compute | On-Demand EC2 clusters | EC2 Spot with Batch | Batch processing cost |
| Multi-AZ latency spikes | Single-AZ colocation | Cross-AZ chatty calls | Placement Groups | Network p99 latency |
| Edge law requirements | Data residency compliance | Central region routing | AWS Local Zones | Sub-10ms local latency |
| Simple web container | PaaS abstraction | Complex EKS setup | AWS App Runner | Time to market |

* **ECS Fargate vs EKS:** Frame this around **operational cognitive load**, choosing ECS Fargate for native AWS integration and lower overhead unless multi-cloud portability or custom Kubernetes operators are strictly required.
* **Lambda SnapStart:** When interviewers probe Java or Spring Boot serverless cold starts, explain how Firecracker microVM snapshot caching eliminates initialization bottlenecks without paying for idle capacity.
* **Spot Instances & Batch:** Highlight **checkpointing** and **graceful termination handling** via the two-minute EC2 Spot interruption notice to run stateless or batch workloads at up to a 90% discount.

## 2. Databases, Caching & State Management

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| DB connection exhaustion | Connection pooling | Vertical DB scaling | Amazon RDS Proxy | Active connection count |
| Read-heavy DB bottleneck | Read-through caching | Adding read replicas | ElastiCache for Redis | Cache hit ratio |
| Relational write scaling | Distributed storage separation | Sharding MySQL manually | Amazon Aurora | Write throughput IOPS |
| Massive write sharding | Horizontal scale-out | Custom app sharding | Aurora Limitless Database | Transactions per second |
| Unpredictable DB load | Fine-grained autoscaling | Over-provisioned RDS | Aurora Serverless v2 | Database ACU utilization |
| Single-digit ms key-value | Partitioned NoSQL | Relational join tables | Amazon DynamoDB | Consistent p99 latency |
| Hot DynamoDB partitions | In-memory write-through | Raising table RCU | DynamoDB Accelerator DAX | Microsecond read latency |
| Ephemeral cache loss | Durable in-memory state | Redis without persistence | Amazon MemoryDB | Zero data loss |
| Complex fraud relationships | Graph traversal | Recursive SQL joins | Amazon Neptune | Multi-hop query latency |
| IoT telemetry flood | Time-series compression | Storing logs in RDS | Amazon Timestream | Ingestion write rate |
| Multi-region active-active | Conflict-free replication | Cross-region DB peering | DynamoDB Global Tables | Cross-region RPO |

* **RDS Proxy:** Use the keyword **connection multiplexing** to explain how you prevent serverless or container bursts from exhausting PostgreSQL or MySQL memory threads.
* **DynamoDB Single-Table Design:** Emphasize **access-pattern-driven modeling** and **write sharding with random suffixes** to prevent hot partition throttling under extreme traffic.
* **Aurora vs Standard RDS:** Anchor on **decoupled storage and compute**, where Aurora replicates six storage copies across three Availability Zones using quorum writes rather than slow block-level replication.

## 3. Storage, File Systems & Data Lifecycle

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| API payload size limits | Direct client-to-storage upload | Streaming files through API | S3 Pre-signed URLs | API memory footprint |
| Unknown storage access patterns | Automated tiering | Manual S3 scripts | S3 Intelligent-Tiering | Monthly storage spend |
| Sub-millisecond ML data access | Single-AZ directory buckets | Standard S3 prefixes | S3 Express One Zone | Request latency |
| Regulatory WORM compliance | Immutable object locking | Restrictive IAM policies | S3 Object Lock | Audit compliance score |
| Long-term archival cost | Cold storage tiering | Keeping data in Standard | S3 Glacier Deep Archive | Archival cost per TB |
| Multi-container shared files | Elastic NFS storage | Copying files to EBS | Amazon EFS | Concurrent mount throughput |
| High-performance ML training | Parallel POSIX filesystem | Reading small files on EFS | FSx for Lustre | GPU data starvation time |
| Disk IOPS bottleneck | Decoupled IOPS provisioning | Larger gp2 volume size | EBS gp3 or io2 | Disk queue length |
| On-prem storage exhaustion | Hybrid cloud caching | Buying local SAN arrays | AWS Storage Gateway | Local cache hit rate |
| Cross-service backup sprawl | Centralized backup policy | Custom snapshot lambdas | AWS Backup | Recovery Time Objective |

* **S3 Pre-signed URLs:** Whenever a prompt involves large file uploads, immediately bypass the API Gateway 10MB limit and application memory tier by issuing short-lived cryptographic URLs directly to the client.
* **S3 Express One Zone:** Cite **single-AZ colocation** and **hierarchical directory buckets** when designing for high-frequency trading, real-time analytics, or PyTorch training pipelines requiring single-digit millisecond latency.
* **EBS gp3 vs io2 Block Express:** Mention decoupling storage capacity from IOPS and throughput on gp3 for baseline cost savings, reserving io2 for mission-critical databases needing sub-millisecond latency and Multi-Attach.

## 4. Asynchronous Messaging, Streaming & Orchestration

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| Downstream service overwhelmed | Load leveling backpressure | Synchronous REST retries | Amazon SQS Standard | Zero dropped messages |
| Poison-pill message loop | Dead-letter isolation | Infinite consumer retries | SQS Dead Letter Queue | Consumer availability |
| Duplicate payment processing | Exactly-once ordering | Distributed DB locks | SQS FIFO with Dedup | Duplicate transaction rate |
| Multi-service notifications | Pub-sub fanout | Chained HTTP calls | Amazon SNS | Fanout delivery latency |
| SaaS & cross-account events | Schema-driven event bus | Custom webhook polling | Amazon EventBridge | Event routing latency |
| High-velocity clickstreams | Partitioned log streaming | Writing directly to DB | Kinesis Data Streams | Shard ingestion lag |
| Near real-time lake ingestion | Managed stream buffering | Custom consumer lambdas | Data Firehose | S3 delivery freshness |
| Distributed transaction failure | Saga orchestration | Two-phase commit locks | AWS Step Functions | Workflow completion rate |
| Legacy RabbitMQ migration | Managed broker lift-and-shift | Rewriting to SQS immediately | Amazon MQ | Migration cutover risk |
| Kafka cluster management | Managed streaming | Self-hosted ZooKeeper | Amazon MSK | Broker uptime SLA |

* **SQS + SNS Fanout vs Kinesis:** Contrast **queue-based competing consumers** (SQS) with **append-only replayable commit logs** (Kinesis/MSK) where multiple independent consumers must read the exact same stream sequentially.
* **Step Functions Saga Pattern:** Use this whenever an interviewer asks how you handle distributed failures across microservices (such as payment, inventory, and shipping) by executing **compensating transactions** instead of distributed ACID locks.
* **Idempotency:** Always pair SQS answers with **idempotency keys** stored in DynamoDB with a TTL to guarantee safe retry handling during network partitions.

## 5. Networking, Edge Delivery & Hybrid Connectivity

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| Global static & API latency | Edge caching & termination | Single-region origin reads | Amazon CloudFront | Time to First Byte |
| Global TCP/UDP jitter | Anycast backbone routing | Public internet DNS routing | AWS Global Accelerator | Global packet loss |
| Exorbitant NAT Gateway bill | Private service routing | Routing S3 via NAT | Gateway VPC Endpoints | Data processing spend |
| Public SaaS traffic exposure | Private interface endpoints | Whitelisting public IPs | AWS PrivateLink | Zero public egress |
| Complex cross-VPC service mesh | Application-layer networking | Tangled VPC peering | Amazon VPC Lattice | Service-to-service latency |
| Hundreds of peered VPCs | Hub-and-spoke routing | Full-mesh VPC peering | AWS Transit Gateway | Route table complexity |
| Unreliable hybrid VPN | Dedicated fiber circuit | Public internet IPsec | AWS Direct Connect | Bandwidth consistency |
| Microservice auth & throttling | Centralized API ingress | Auth logic in every app | Amazon API Gateway | Throttled abuse rate |
| Extreme TCP throughput | Layer-4 flow hashing | Layer-7 ALB inspection | Network Load Balancer | Millions of requests/sec |
| Third-party firewall insertion | Bump-in-the-wire inspection | Proxy per VPC | Gateway Load Balancer | Inspection throughput |

* **VPC Lattice vs PrivateLink:** Distinguish PrivateLink (privately connecting a VPC to an AWS service or NLB-backed endpoint) from VPC Lattice (connecting microservices across multiple VPCs and accounts with native IAM auth and zero NLB overhead).
* **NAT Gateway FinOps:** Calling out **Gateway VPC Endpoints** for S3 and DynamoDB and **Interface Endpoints** for ECR/CloudWatch is one of the fastest ways to prove real-world cost awareness in an interview.
* **ALB vs API Gateway:** Use ALB for high-volume container routing inside a VPC, and place API Gateway at the perimeter when you need **token-bucket rate limiting**, **usage plans**, **request validation**, or **WebSocket management**.

## 6. Generative AI, LLM Infrastructure & Machine Learning

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| Multi-model LLM integration | Unified serverless inference | Managing raw GPU servers | Amazon Bedrock | Time to production |
| LLM prompt injection & PII | Deterministic safety filters | Prompt-only instructions | Bedrock Guardrails | Blocked policy violations |
| Hallucinations on private data | Retrieval-Augmented Generation | Fine-tuning every week | Bedrock Knowledge Bases | Answer groundedness score |
| Multi-step autonomous tasks | ReAct tool orchestration | Hardcoded if-else chains | Amazon Bedrock Agents | Task completion accuracy |
| High repeated LLM token costs | Semantic vector caching | Calling LLM every time | OpenSearch Serverless | Cost per 1k tokens |
| Custom LoRA/vLLM hosting | Self-managed GPU serving | Expensive public APIs | EKS or ECS on g5/p4d | Tokens per second |
| High inference GPU cost | Custom silicon acceleration | Standard Nvidia instances | AWS Inferentia2 | Cost per inference |
| Distributed foundation training | Resilient cluster training | Unmanaged EC2 scripts | SageMaker HyperPod | Cluster goodput ratio |
| Unstructured PDF extraction | OCR layout parsing | Regex text scraping | Amazon Textract | Field extraction F1 |
| Enterprise document search | Semantic enterprise index | SQL LIKE queries | Amazon Kendra | Search click-through rate |

* **Bedrock vs Self-Hosted vLLM on EKS/ECS:** Frame the trade-off around **token volume unit economics** and **customization depth**—use Bedrock with PrivateLink for rapid, low-ops deployment, and switch to self-hosted quantized models or LoRA adapters on **EC2 g5/Inf2 instances** when high sustained throughput makes reserved compute cheaper than per-token billing.
* **Semantic Caching & Model Routing:** Explain how you place **ElastiCache for Redis** or **OpenSearch Vector Engine** in front of LLMs to serve cached responses for semantically identical queries, while routing simple classification tasks to smaller models.

## 7. Security, Identity & Enterprise Governance

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| Hardcoded AWS access keys | Ephemeral STS credentials | Long-lived IAM users | IAM Roles & OIDC | Zero static credentials |
| Multi-account privilege creep | Guardrail boundary enforcement | Manual IAM audits | AWS Organizations SCPs | Compliance violation count |
| Developer IAM bottleneck | Delegated role boundaries | Admin review per role | IAM Permission Boundaries | Provisioning velocity |
| Hardcoded database passwords | Automated secret rotation | Env variables in Git | AWS Secrets Manager | Credential rotation SLA |
| Customer-facing auth scaling | Managed OIDC/OAuth2 pool | Custom JWT auth tables | Amazon Cognito | Auth latency & security |
| Fine-grained app permissions | Policy-as-code authorization | Hardcoded RBAC checks | Verified Permissions | Auth policy decoupling |
| Layer-7 SQLi & bot attacks | Edge web filtering | App-level IP blocking | AWS WAF | Malicious traffic blocked |
| Volumetric DDoS extortion | Always-on DDoS mitigation | Auto-scaling out the bill | AWS Shield Advanced | Uptime & cost protection |
| Unnoticed account compromise | ML anomaly detection | Manual CloudTrail grep | Amazon GuardDuty | Mean Time to Detect |
| Sensitive PII in S3 buckets | Automated data discovery | Manual file sampling | Amazon Macie | Exposed PII bucket count |
| Unencrypted data at rest | Envelope encryption | App-level custom crypto | AWS KMS | Encryption coverage |
| Container CVE vulnerabilities | Automated image scanning | Manual vulnerability checks | Amazon Inspector | Critical CVE remediation |

* **SCPs vs IAM Permission Boundaries:** Clarify that **Service Control Policies (SCPs)** define the maximum allowed permissions across an entire AWS Organization account, while **Permission Boundaries** allow developers to safely create new IAM roles without escalating their own privileges.
* **KMS Envelope Encryption:** Mention how data keys encrypt large payloads locally while KMS only encrypts the Master Key, avoiding KMS API throttling and network latency.

## 8. Observability, Resilience & Chaos Engineering

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| Microservice latency mystery | Distributed request tracing | Reading logs on servers | AWS X-Ray / OTel | Root-cause isolation time |
| High-cardinality log search | Centralized log indexing | SSH tailing log files | CloudWatch Logs Insights | Mean Time to Diagnose |
| Top-N noisy neighbor mystery | Real-time contributor analysis | Scanning raw VPC logs | Contributor Insights | Hot-spot detection speed |
| Unaudited resource changes | Configuration state tracking | Manual console checks | AWS Config | Non-compliant drift time |
| Untested disaster recovery | Chaos fault injection | Paper-only DR drills | Fault Injection Service | Verified failover RTO |
| Cross-region DNS split-brain | Readiness & routing control | Manual DNS TTL edits | Route 53 ARC | Failover reliability |
| Critical server ransomware | Continuous block replication | Weekly manual backups | Elastic Disaster Recovery | Sub-minute RPO |
| Unauthorized API activity | Immutable audit trail | Application-only logging | AWS CloudTrail | Forensic audit completeness |

* **Observability Three Pillars:** Always structure incident recovery stories around **Metrics** (CloudWatch alarms triggering on p99 latency), **Traces** (X-Ray pinpointing the exact downstream microservice bottleneck), and **Logs** (CloudWatch Logs Insights correlating the trace ID to stack traces).
* **AWS Fault Injection Service (FIS):** Dropping FIS into the final sentence of an outage story proves you don't just fix bugs—you validate system resilience under controlled chaos (such as simulating AZ blackholes or CPU throttling in staging).

## 9. Data Engineering, Analytics, Migration & DevOps

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| Ad-hoc queries on S3 logs | Serverless schema-on-read | Loading logs into RDS | Amazon Athena | Query cost per TB scanned |
| Complex ETL data pipelines | Serverless Spark transformation | Custom Python cron jobs | AWS Glue | Data pipeline SLA |
| Petabyte enterprise warehousing | Columnar MPP analytics | Running OLAP on OLTP DB | Amazon Redshift | Complex query runtime |
| Broken data lake permissions | Unified lakehouse governance | Bucket policies per folder | AWS Lake Formation | Access audit overhead |
| Zero-downtime DB migration | Change Data Capture replication | Weekend downtime dump | AWS DMS | Cutover downtime window |
| Risky monolithic deployments | Progressive canary shifting | Big-bang midnight deploys | AWS CodeDeploy | Deployment rollback rate |
| Hardcoded feature toggles | Dynamic runtime configuration | Redeploying to flip flags | AWS AppConfig | Feature toggle latency |
| Legacy OpsWorks / Chef stacks | Declarative IaC modernization | Manual script migration | AWS CDK / Terraform | Provisioning repeatability |
| SSH bastion security risks | Agent-based session manager | Opening port 22 publicly | Systems Manager SSM | Zero open inbound ports |

* **Athena Optimization:** Whenever mentioning Athena or Glue, add that you converted raw JSON/CSV into **columnar Apache Parquet or Iceberg** with **partition projection**, reducing query latency and Athena scan costs by over 90%.
* **Zero-Downtime Cutovers:** Combine **AWS DMS** (using Change Data Capture to keep source and target databases in sync) with **AWS AppConfig** or **Route 53 weighted routing** to shift 1%, 10%, and 100% of traffic with instant rollback capability.

For a visual walk-through of how these advanced services connect in real-world interview architectures, check out [Top Advance AWS Services Explained - System Design](https://www.youtube.com/watch?v=s2jD2E3YN30), which breaks down how to combine compute, queuing, caching, and edge services during system design rounds.

---

## 10. Interview Execution: From Trigger to Service

| Trigger | Conceptual Keyword | Service Anchor | One-Sentence Pitch |
| --- | --- | --- | --- |
| "How do you handle scaling?" | Horizontal stateless scale-out | ECS Fargate / EKS / Lambda | "I scale the execution plane, not the data plane, and let managed services absorb the variance." |
| "Why not just add more servers?" | Over-provisioning anti-pattern | Auto Scaling Groups | "Over-provisioning converts capital expense into idle cost and doesn't solve latency spikes." |
| "How do you stay under budget?" | Unit economics & reserved compute | Graviton + Spot + Savings Plans | "I shift from on-demand to reserved/spot and measure cost per transaction, not per instance." |
| "What if it fails?" | Fault isolation & graceful degradation | Multi-AZ + health checks + SQS DLQ | "I isolate blast radius by design and ensure retries/idempotency absorb transient failures." |
| "How do you know it's working?" | Observable by construction | CloudWatch / X-Ray / SLOs | "Every critical path emits metrics, traces, and logs; I alert on SLO burn rate, not CPU." |
| "How did you migrate without downtime?" | Zero-downtime cutover | DMS + Route 53 weighted routing | "I mirrored writes with CDC, drained traffic gradually, and cut over only after lag hit zero." |
| "How do you secure this?" | Least privilege & defense in depth | IAM Roles, SCPs, KMS, WAF | "I eliminate keys, encrypt by default, and enforce guardrails at the org and boundary level." |
| "How do you govern at scale?" | Policy as code & guardrails | AWS Organizations + SCPs + Config | "I codify guardrails so every account inherits them and drift is detected in minutes." |

## 11. Quick-Reference Keyword Glossary

| Keyword | Meaning | Typical Interview Use |
| --- | --- | --- |
| Immutable infrastructure | Replace, never patch | ECS Fargate, AMI pipelines |
| Operational cognitive load | Human cost of toil | Fargate over self-managed K8s |
| Event-driven compute | Run only when invoked | Lambda, S3 event triggers |
| Snapshot restore | Pre-warmed microVM state | Lambda SnapStart for Java |
| Preemptible compute | Use abandoned capacity | EC2 Spot, Batch |
| Colocation | Keep latency-sensitive workloads together | Placement Groups, Local Zones |
| Connection multiplexing | Many logical flows over few TCP connections | RDS Proxy |
| Read-through caching | Serve reads from cache, populate on miss | ElastiCache, DAX |
| Decoupled storage and compute | Scale each independently | Aurora, S3, EBS gp3 |
| Horizontal scale-out | Add more units, not bigger ones | Aurora Limitless, DynamoDB |
| Competing consumers | Many workers drain one queue | SQS Standard |
| Append-only commit log | Replayable, ordered stream | Kinesis, MSK |
| Compensating transactions | Undo a completed step via reverse action | Step Functions Saga |
| Idempotency keys | Safe retries under at-least-once delivery | SQS + DynamoDB TTL |
| Edge caching & termination | Terminate TLS at the edge, cache objects | CloudFront |
| Anycast backbone | Route over lowest-latency fiber | Global Accelerator |
| Private service routing | Avoid NAT by using VPC endpoints | Gateway VPC Endpoints, PrivateLink |
| Policy as code | Machine-evaluated authorization rules | Verified Permissions, SCPs |
| Envelope encryption | Data keys wrap payloads; master key wraps data keys | KMS |
| Chaos engineering | Inject faults to prove resilience | FIS |
| Observability three pillars | Metrics, traces, logs | CloudWatch, X-Ray, Logs Insights |
| Columnar storage | Vectorized, compressed scans | Parquet/Iceberg, Redshift |
| Change Data Capture | Stream row-level changes from source DB | DMS |
| Progressive shifting | Ramp traffic gradually by percentage | CodeDeploy canary, weighted ALB |