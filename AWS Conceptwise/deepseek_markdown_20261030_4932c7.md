# AWS Conceptwise: Master Concept-to-Keyword Matrix (Enhanced Edition)

> A senior/principal interview reference mapping every AWS scenario to a core distributed-systems tension, a rejected naive fix, a managed-service anchor, and a target metric. **Enhanced with reliability patterns, DR tiering, FinOps, migration strategies, and a phased interview preparation plan.**

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
10. [Architecture Frameworks & Design Principles](#10-architecture-frameworks--design-principles) ⭐ NEW
11. [Reliability Patterns & Resilience Engineering](#11-reliability-patterns--resilience-engineering) ⭐ NEW
12. [Disaster Recovery & Business Continuity](#12-disaster-recovery--business-continuity) ⭐ NEW
13. [Cost Optimization & FinOps](#13-cost-optimization--finops) ⭐ NEW
14. [Migration Strategies: The 7 Rs](#14-migration-strategies-the-7-rs) ⭐ NEW
15. [Interview Execution: From Trigger to Service](#15-interview-execution-from-trigger-to-service)
16. [Anti-Patterns to Avoid](#16-anti-patterns-to-avoid) ⭐ NEW
17. [Quick-Reference Keyword Glossary](#17-quick-reference-keyword-glossary)
18. [Interview Preparation Plan](#18-interview-preparation-plan) ⭐ NEW

---

Mastering senior and principal AWS interviews requires mapping every scenario to a core distributed systems tension before naming an AWS service. Each row pairs an interview problem trigger with its conceptual keyword, rejected naive alternative, managed service anchor, and target metric.

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
| Unknown optimal instance type | Rightsizing | Guessing at t3.large | AWS Compute Optimizer | Idle CPU/memory % |
| Lambda concurrency exhaustion | Reserved concurrency + DLQ | Unbounded invocations | Lambda Reserved/Provisioned Concurrency | Throttle rate |
| Slow deploy rollback | Blue/green with traffic shift | In-place AMI swaps | CodeDeploy + ALB weighted target groups | Mean time to rollback |
| Monolithic deploy cadence | Decompose by business capability | One giant CI pipeline | ECS services + independent pipelines | Deploys per week per team |

* **ECS Fargate vs EKS:** Frame around **operational cognitive load**—choose Fargate for native AWS integration and lower overhead unless multi-cloud portability or custom Kubernetes operators are strictly required.
* **Lambda SnapStart:** For Java/Spring Boot cold starts, explain how Firecracker microVM snapshot caching eliminates initialization bottlenecks without paying for idle capacity.
* **Spot Instances & Batch:** Highlight **checkpointing** and **graceful termination handling** via the two-minute EC2 Spot interruption notice.
* **Compute Optimizer:** Never say "we guessed t3.large." Say "Compute Optimizer flagged our instances as over-provisioned at 12% CPU average, so we rightsized and saved 40%."

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
| Choosing DB under partition | CAP / PACELC theorem | "Just use Postgres" | DynamoDB (AP) vs Aurora (CP) | Consistency vs availability |
| Schema migration safety | Expand-contract migrations | ALTER TABLE in prod | DMS + dual-write window | Migration rollback time |
| DynamoDB stream processing | Change data capture to fan-out | Polling table GSI | DynamoDB Streams + Lambda | Stream lag |
| Cross-region analytics | Async replica lag tolerance | Assuming synchronous replication | Aurora Global Database | Replication lag p99 |

* **RDS Proxy:** Use **connection multiplexing** to explain how you prevent serverless bursts from exhausting PostgreSQL memory threads.
* **DynamoDB Single-Table Design:** Emphasize **access-pattern-driven modeling** and **write sharding with random suffixes** to prevent hot partition throttling.
* **Aurora vs Standard RDS:** Anchor on **decoupled storage and compute**—six storage copies across three AZs using quorum writes.
* **CAP / PACELC:** Name this explicitly. DynamoDB is AP (availability under partition); Aurora is CP (consistency over availability). This single framework answers "why not just one DB?"

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
| Accidental object deletion | Versioning + MFA delete | Trusting "we don't delete" | S3 Versioning + Object Lock | Recovery time for deleted data |
| Data durability questions | 11 nines durability ≠ availability | Confusing durability/availability | S3 Standard (11 9s durability) | Data loss probability |
| Unbounded storage growth | Lifecycle policy automation | Manual quarterly cleanup | S3 Lifecycle rules | Cost per GB/month trend |

* **S3 Pre-signed URLs:** Bypass the API Gateway 10MB limit and application memory tier by issuing short-lived cryptographic URLs directly to the client.
* **S3 Express One Zone:** Cite **single-AZ colocation** and **hierarchical directory buckets** for high-frequency trading, real-time analytics, or PyTorch training.
* **Durability vs Availability:** S3 offers 99.999999999% durability (11 nines) but only 99.99% availability. Interviewers love testing whether you conflate the two.

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
| Ordering guarantees | FIFO vs standard semantics | Assuming global order | SQS FIFO + MessageGroupId | Out-of-order rate |
| Reliable event publishing | Transactional outbox pattern | Dual-write DB + queue | DynamoDB Streams → EventBridge | Event loss rate |
| Multi-service workflow visibility | Choreography vs orchestration | Hidden side-effects | Step Functions (orchestration) | Workflow traceability |
| Message visibility timeout | At-least-once delivery semantics | Assuming one delivery | SQS visibility timeout + DLQ | In-flight duplicate rate |

* **SQS + SNS Fanout vs Kinesis:** Contrast **queue-based competing consumers** (SQS) with **append-only replayable commit logs** (Kinesis/MSK) where multiple independent consumers read the same stream.
* **Step Functions Saga Pattern:** Use for distributed failures across microservices (payment, inventory, shipping) by executing **compensating transactions** instead of distributed ACID locks.
* **Idempotency:** Always pair SQS answers with **idempotency keys** stored in DynamoDB with a TTL.
* **Transactional Outbox:** When asked "how do you guarantee an event is published exactly when the DB writes," answer with the **outbox pattern**—write to a DB table and stream changes via DynamoDB Streams or CDC, never dual-write.

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
| Subnet/CIDR planning | VPC design with room to grow | /24 subnets everywhere | VPC with /16 CIDR + hierarchical subnets | Available IPs headroom |
| SG vs NACL confusion | Stateful vs stateless filtering | Deny rules in SGs | Security Groups (stateful) + NACLs (stateless) | Blocked traffic analysis |
| DNS split-horizon | Private hosted zones | /etc/hosts edits | Route 53 Resolver + Private Hosted Zones | Resolution latency |
| DDoS at multiple layers | L3/4/7 layered defense | Only CloudFront | Shield Advanced + WAF + CloudFront | Attack absorption rate |

* **VPC Lattice vs PrivateLink:** Distinguish PrivateLink (VPC → AWS service/NLB endpoint) from VPC Lattice (microservices across VPCs/accounts with IAM auth and zero NLB overhead).
* **NAT Gateway FinOps:** Calling out **Gateway VPC Endpoints** for S3/DynamoDB and **Interface Endpoints** for ECR/CloudWatch proves real-world cost awareness.
* **Security Groups vs NACLs:** SGs are **stateful** (return traffic auto-allowed) and can only allow, not deny. NACLs are **stateless** and support both allow and deny. Never try to write a deny rule in an SG.

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
| Choosing RAG vs fine-tune vs prompt | Customization depth ladder | Fine-tune everything | Prompt → RAG → Fine-tune (escalate) | Cost per improved quality point |
| Perceived latency for streaming | Token streaming UX | Blocking 20-second waits | Bedrock streaming APIs / SSE | Time to first token |
| Model quality evaluation | Eval harness + golden sets | Eyeballing outputs | Bedrock Model Evaluation | Regression rate per release |

* **Bedrock vs Self-Hosted vLLM:** Frame the trade-off around **token volume unit economics** and **customization depth**—Bedrock with PrivateLink for rapid deployment; self-hosted quantized models on **g5/Inf2** when high sustained throughput beats per-token billing.
* **RAG vs Fine-Tuning Ladder:** Start with prompt engineering (cheapest), escalate to RAG for knowledge grounding, only fine-tune when behavior/format/style must change. Interviewers love this ladder.
* **Semantic Caching:** Place **ElastiCache Redis** or **OpenSearch Vector Engine** in front of LLMs to serve cached responses for semantically identical queries.

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
| Understanding security boundaries | Shared responsibility model | "AWS secures everything" | AWS (of cloud) + Customer (in cloud) | Coverage of customer responsibilities |
| Blast radius of compromised role | Least privilege + boundaries | Admin roles for developers | IAM Access Analyzer | Unused permissions count |
| Zero-trust service-to-service | mTLS + workload identity | Network trust only | App Mesh / VPC Lattice + IRSA | Lateral movement prevention |
| Compliance evidence gathering | Continuous audit automation | Manual SOC2 spreadsheets | AWS Audit Manager + Config | Audit prep time |
| IAM policy evaluation order | Explicit deny > SCP > identity > resource | Guessing why access denied | IAM Access Analyzer Policy Simulator | Time to diagnose denial |

* **SCPs vs IAM Permission Boundaries:** SCPs define the maximum allowed permissions across an Organization account; Permission Boundaries let developers create IAM roles without privilege escalation.
* **KMS Envelope Encryption:** Data keys encrypt large payloads locally while KMS only encrypts the Master Key, avoiding KMS API throttling and network latency.
* **Shared Responsibility:** "AWS secures the cloud; you secure what's in the cloud." Always clarify this boundary when discussing security.

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
| Alert fatigue from CPU alarms | SLO-based alerting | Alerting on infra metrics | CloudWatch SLO + composite alarms | Alert signal-to-noise ratio |
| Unknown user-facing health | Synthetic canary monitoring | Trusting internal metrics | CloudWatch Synthetics | Detection time for user-facing failures |
| Non-reproducible incidents | Distributed traces at 100% sampling | 1% sampling on failures | X-Ray + tail-based sampling | Trace completeness on failures |

* **Observability Three Pillars:** Metrics (CloudWatch alarms on p99), Traces (X-Ray pinpointing downstream bottleneck), Logs (Logs Insights correlating trace ID to stack traces).
* **SLO Burn Rate Alerting:** Alert on error budget consumption (e.g., 2% burn in 1 hour), not on raw CPU. Interviewers love this—it shows you've felt alert fatigue.
* **AWS FIS:** Validate resilience under controlled chaos (AZ blackhole, CPU throttling in staging). Never run in prod without planning first.

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
| IaC drift from console changes | Declarative over imperative | Console edits on Terraform | Terraform + GitOps | Drift detection time |
| CI/CD pipeline fragility | Pipeline-as-code + blast radius | Snowflake Jenkins jobs | CodePipeline + CodeBuild | Pipeline success rate |
| Testing in prod | Progressive delivery | Big-bang prod deploys | CodeDeploy canary + feature flags | % releases with rollback |

* **Athena Optimization:** Convert raw JSON/CSV to **columnar Parquet/Iceberg** with **partition projection** to cut latency and scan costs by 90%.
* **Zero-Downtime Cutovers:** Combine **DMS** (CDC) with **Route 53 weighted routing** to shift 1%/10%/100% with instant rollback.
* **IaC Drift:** Interviewers will ask "what if someone makes a console change?" Answer: **drift detection** in Terraform, or AWS Config rules that flag non-compliant resources within minutes.

## 10. Architecture Frameworks & Design Principles

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| Justifying design decisions | Well-Architected Framework (6 pillars) | "It works in prod" | AWS Well-Architected Tool | Pillar review coverage |
| Capacity planning uncertainty | Stop guessing capacity | Over-provisioning "just in case" | Auto Scaling + serverless | Idle resource spend |
| Undiscovered failure modes | Game days / chaos engineering | Assuming DR plan works | AWS FIS + scheduled game days | Mean time to detect (MTTD) |
| Legacy monolith blocks team independence | Strangler Fig Pattern | Big-bang rewrite | API Gateway + Lambda/ECS (incremental) | Deploys per week per team |
| Coupling between services | Loose coupling | Direct synchronous calls | EventBridge + SQS | Blast radius of downstream failure |
| Elasticity assumptions | Design for failure | Assuming components never fail | Multi-AZ + retries + DLQ | Failure recovery automation |
| Over-engineering risk | Simplicity wins | Kubernetes for a static site | App Runner / Lambda | Time to first production deploy |

**The Six Well-Architected Pillars** (memorize these):

1. **Operational Excellence** — run and monitor systems to deliver business value
2. **Security** — protect information, systems, and assets
3. **Reliability** — recover from failures and meet demand
4. **Performance Efficiency** — use resources efficiently
5. **Cost Optimization** — avoid unnecessary costs
6. **Sustainability** — minimize environmental impact

**Trade-off hierarchy** (interview gold): Security and Operational Excellence are generally **non-negotiable**. Cost and Reliability are **explicitly traded** based on workload criticality. When asked "why this design," answer in this form: *"This optimizes Reliability at the explicit expense of Cost because the workload is payment-critical, and a 10-second outage has financial impact greater than the extra $X/month."*

## 11. Reliability Patterns & Resilience Engineering

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| Cascading failure from one service | Circuit breaker | Retrying into failing downstream | App Mesh / VPC Lattice + retry budgets | Error rate containment |
| Thundering herd on recovery | Exponential backoff + jitter | Fixed retry intervals | SDK retries + jitter config | Recovery time after outage |
| Noisy neighbor across tenants | Bulkhead pattern | Shared resource pools | Separate queues / DLQs per tenant | Tenant SLO impact |
| Slow consumer backpressure | Queue-based load leveling | Synchronous blocking calls | SQS + worker auto scaling | Queue depth stability |
| Retry storms amplifying outage | Retry budgets + rate limiting | Unbounded client retries | API Gateway throttling + client backoff | Retry volume vs. baseline |
| Cross-region failover ambiguity | Active-passive vs active-active | Untested failover plan | Route 53 failover + health checks | Failover success rate |
| Health checks hiding failures | Deep health checks | TCP-only checks | ALB deep health + Route 53 ARC | False-positive health rate |

* **Circuit breaker:** If downstream fails, stop calling it for N seconds, fail fast, and let the request succeed via fallback or degraded response. This prevents cascading failure.
* **Bulkhead:** Isolate resource pools per tenant / per feature so one failure doesn't drain shared resources. Named after ship compartments.
* **Exponential backoff + jitter:** Never use fixed-interval retries. Always add random jitter to prevent thundering herd.
* **Retry budget:** Cap total retries across the system (e.g., 10% of requests) so retries never amplify an outage.

## 12. Disaster Recovery & Business Continuity

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| Defining DR strategy cost vs. speed | RTO/RPO trade-off tiers | "We have backups" | Backup/Restore → Pilot Light → Warm Standby → Active-Active | Recovery cost per tier |
| Multi-region database failover | Cross-region read replicas (async) | Assuming RDS Multi-AZ covers regions | Aurora Global Database | Cross-region RPO |
| Brief downtime during AZ failover | HA vs. Fault Tolerance distinction | Treating Multi-AZ as zero-downtime | Multi-AZ RDS / Aurora | RTO (Recovery Time Objective) |
| Region-level failover | Fault-tolerant multi-region | Single-region active-passive only | Route 53 ARC + DynamoDB Global Tables | Zero interruption on region failure |
| DR plan never tested | Game-day validation | Static runbook PDFs | FIS + DR drills quarterly | Verified failover time |

**DR Strategy Tiers (memorize the table):**

| Strategy | RTO | RPO | Cost | Key Characteristic |
| --- | --- | --- | --- | --- |
| **Backup & Restore** | Hours | Hours | $ | Data backed up; no services deployed |
| **Pilot Light** | 10s of minutes | Minutes | $$ | Data live; core services idle |
| **Warm Standby** | Minutes | Seconds | $$$ | Scaled-down but functional copy running |
| **Multi-Site Active/Active** | Near-zero | Near-zero | $$$$ | Live services in multiple regions |

**Critical Distinction — HA vs Fault Tolerance vs DR:**

- **High Availability (HA):** Keeps workload running during *expected* failures (AZ failure). Brief interruption during failover is acceptable. Example: Multi-AZ RDS promotes standby in ~60 seconds.
- **Fault Tolerance:** Workload continues operating with *no visible impact* when components fail. Example: Active-active multi-region.
- **Disaster Recovery:** Restores business capability after an event *larger* than normal availability design (region failure, data corruption, cyber incident).

**Interview trap:** Saying "RDS Multi-AZ gives us multi-region redundancy." Multi-AZ is AZ-resilient only; cross-region requires **Aurora Global Database** or cross-region read replicas with async replication. Call this out before the interviewer does.

## 13. Cost Optimization & FinOps

| Problem Trigger | Core Concept | Rejected Naive Fix | AWS Service Anchor | Target Metric |
| --- | --- | --- | --- | --- |
| Unpredictable monthly bill | Unit economics (cost per transaction) | Total bill tracking only | Cost Explorer + Budgets | Cost per business unit |
| Idle dev/staging environments | Schedule-based shutdown | Always-on non-prod | Instance Scheduler / EventBridge | Non-prod idle hours |
| Steady-state compute overspend | Reserved capacity planning | On-Demand everywhere | Savings Plans / RIs | % covered by commitments |
| Bursty batch workloads | Spot for fault-tolerant work | On-Demand for batch | EC2 Spot + Batch | Spot savings % |
| Data transfer surprises | Data gravity awareness | Multi-region for no reason | CloudFront + VPC endpoints | Egress $ per GB |
| Storage sprawl | Lifecycle policies | "We'll clean up later" | S3 Lifecycle + Intelligent-Tiering | $ per TB/month trend |
| Orphaned resources | Tagging + rightsizing | Manual audits | AWS Cost Categories + Compute Optimizer | Orphan resource count |
| Over-provisioned servers | Rightsizing recommendations | Guessing instance size | Compute Optimizer + Trusted Advisor | % instances rightsized |

* **Unit economics:** Always frame cost in **business terms**—cost per order, per active user, per API call—not "total AWS bill."
* **Commitment coverage:** Show you understand that 60–80% of steady-state compute should be under Savings Plans or RIs, with Spot for interruptible work.
* **Data transfer is silent killer:** Egress and cross-AZ data transfer frequently exceed compute costs in poorly designed architectures. Mention VPC endpoints and CloudFront for egress control.

## 14. Migration Strategies: The 7 Rs

| Strategy | When to Use | Trade-off |
| --- | --- | --- |
| **Rehost** (lift-and-shift) | Fast migration, minimal change | Technical debt carried over |
| **Replatform** (lift-tinker-and-shift) | Minor optimizations (e.g., RDS instead of self-managed MySQL) | Some refactoring effort |
| **Repurchase** (drop-and-shop) | SaaS replaces custom build | Vendor lock-in |
| **Refactor / Re-architect** | Business value from cloud-native | Highest cost and risk |
| **Retire** | No longer needed | Requires audit |
| **Retain** | Not ready to migrate | Hybrid complexity |
| **Relocate** | VMware workloads to VMware Cloud on AWS | Niche use case |

**Interview framing:** When asked "how would you migrate a legacy estate," don't say "we refactor everything." Say: "I'd **portfolio-assess** first—tag applications by business value and technical debt, then apply the **7 Rs** selectively. High-value/high-debt apps get refactored; low-debt apps get rehosted; unused apps get retired."

## 15. Interview Execution: From Trigger to Service

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
| "What did you give up?" | Explicit trade-off articulation | Any service | "I chose X over Y because the workload prioritized [pillar], accepting [specific trade-off]." |
| "Why not the simpler option?" | Right-sized complexity | Managed > self-managed | "I default to managed until operational need justifies self-managed complexity." |
| "What's the worst failure mode?" | Failure mode analysis | FIS + DR drills | "The worst failure is [X]; we contain it via [bulkhead/circuit breaker/DR tier]." |

**The golden rule:** Name the trade-off before naming the service. Naming a service is table stakes; explaining what you sacrificed to choose it is what interviewers actually score.

## 16. Anti-Patterns to Avoid

| Anti-Pattern | Why It's Wrong | The Fix |
| --- | --- | --- |
| Service-listing without reasoning | "I'd use Lambda, SQS, DynamoDB" tells interviewers nothing | Anchor each service to a trade-off and metric |
| Claiming fault tolerance when you mean HA | Multi-AZ RDS is HA (brief downtime), not zero-downtime | Use precise language: HA / FT / DR |
| Assuming Multi-AZ = multi-region | AZ failure ≠ region failure | Aurora Global Database / cross-region replicas |
| Using DynamoDB like a relational DB | Scans and joins don't scale | Access-pattern-first single-table design |
| Kubernetes for everything | Operational overhead for small workloads | Fargate, App Runner, or Lambda first |
| Ignoring data transfer costs | Egress and cross-AZ costs often dwarf compute | VPC endpoints + CloudFront + AZ-aware design |
| Unbounded retries without backoff | Amplifies outages | Exponential backoff + jitter + retry budgets |
| Dual-write DB + queue | Inconsistent state on partial failure | Transactional outbox pattern |
| Alerting on CPU | Doesn't correlate with user pain | SLO-based alerting on error budgets |
| Big-bang migrations | No rollback path | Phased cutover with DMS CDC + weighted routing |
| Manual console changes | Drift and unauditable state | IaC with GitOps + Config drift detection |
| Fine-tuning LLMs as first resort | Expensive, slow, brittle | Prompt → RAG → fine-tune escalation ladder |

## 17. Quick-Reference Keyword Glossary

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
| Transactional outbox | Publish events reliably with DB commit | DynamoDB Streams → EventBridge |
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
| High Availability (HA) | Minimize downtime; brief failover interruption | Multi-AZ RDS |
| Fault Tolerance | Zero visible impact from component failure | Active-active multi-region |
| RTO | Recovery Time Objective: acceptable downtime | DR strategy selection |
| RPO | Recovery Point Objective: acceptable data loss | DR strategy selection |
| Well-Architected Pillars | Six-pillar design evaluation framework | Justifying architecture decisions |
| Strangler Fig | Incremental monolith decomposition | Legacy modernization |
| Circuit breaker | Fail fast when downstream is unhealthy | Cascading failure prevention |
| Bulkhead | Isolate resource pools per tenant/feature | Noisy neighbor containment |
| Retry budget | Cap total retries system-wide | Prevent retry storms |
| CAP / PACELC | Consistency vs availability under partition | DB selection reasoning |
| 7 Rs | Migration strategies (Rehost, Replatform, etc.) | Portfolio migration planning |
| SLO / Error Budget | Service Level Objective + allowed failure budget | Alerting strategy |
| Unit economics | Cost per business transaction | FinOps reasoning |
| Shared responsibility | AWS secures cloud; you secure what's in cloud | Security boundary discussions |
| Anti-pattern | Common wrong solution style | Showing senior judgment |

## 18. Interview Preparation Plan

### Phase 1: Master the Mental Models (Week 1–2)

**The three highest-leverage concepts, in priority order:**

1. **RTO/RPO → DR tier mapping.** This single framework answers DR questions, migration questions, and multi-region questions.
2. **HA vs Fault Tolerance vs DR precision.** Saying "Multi-AZ gives us fault tolerance" is a credibility leak that principal interviewers catch immediately.
3. **Well-Architected pillars as justification vocabulary.** "This optimizes Reliability at the explicit expense of Cost because the workload is payment-critical" beats "it's best practice."

**Practice exercise:** For each of the 14 domains in this file, write **one sentence** that names the core tension and the trade-off you'd accept. Example: *"For compute, I trade operational overhead for control—choosing ECS Fargate unless Kubernetes portability is a hard requirement."*

### Phase 2: Scenario Drills (Week 3)

**Senior/Principal scenario patterns to rehearse aloud (2–3 min each):**

| Scenario | What They're Testing | Your Framework |
| --- | --- | --- |
| "Design a multi-region architecture with strict recovery objectives" | RTO/RPO reasoning, trade-off articulation | Start with RTO/RPO → select DR tier → justify cost vs speed |
| "Production latency spikes during peak traffic" | Observability, bottleneck isolation | Three pillars (metrics/traces/logs) → identify hot spot → fix without over-engineering |
| "Migrate a legacy estate with complex dependencies" | Strangler Fig, DMS, progressive cutover | Portfolio assess → 7 Rs → CDC replication → weighted routing |
| "AWS spend increased without proportional business value" | FinOps, unit economics | Cost per transaction → Graviton/Spot/Savings Plans → rightsizing |
| "Design a secure multi-account landing zone" | Organizations, SCPs, guardrails | SCPs at org level → permission boundaries → centralized logging |
| "Design a real-time analytics pipeline" | Streaming vs batch, Lambda vs Kinesis | Kinesis/Firehose → S3/Athena or Redshift → partition projection |
| "Third-party API is failing intermittently" | Reliability patterns | Circuit breaker + retry budget + bulkhead |
| "Design an LLM application with private data" | RAG vs fine-tune, cost | Bedrock + Knowledge Bases → Guardrails → semantic caching |
| "What's the worst failure mode of your design?" | Failure mode analysis | Enumerate → contain via bulkhead → validate via FIS |

**Drill method:** Speak each answer aloud. Record it. Replay and grade yourself on:
- Did you name the trade-off?
- Did you justify with a pillar?
- Did you avoid service-listing without reasoning?
- Did you mention a target metric?

### Phase 3: Certification-Aligned Deepening (Week 4, optional)

If targeting **AWS Certified Solutions Architect – Professional (SAP-C02/C03):** the exam is 75 questions in 180 minutes covering complex solution design, migration planning, cost control, and continuous improvement. Recommended experience: 2+ years designing AWS solutions. Use this matrix as your domain map—every row is an exam-relevant scenario.

**Exam-critical gaps this matrix fills:**
- DR strategies and their RTO/RPO characteristics
- HA vs. fault tolerance distinction
- Well-Architected pillar trade-offs
- 7 Rs migration framework
- Chaos engineering with AWS FIS

### Phase 4: Weakness Audit (Ongoing)

After each practice session, log:

| Date | Scenario | Trade-off Named? | Pillar Justified? | Service Anchor Correct? | Gap Identified |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

Review weekly. If a gap repeats, return to the relevant domain row in this file and write a new one-sentence pitch.

---

### The Five Things to Remember in the Room

1. **Name the trade-off before you name the service.** "Aurora decouples storage from compute—accepting higher per-hour cost for predictable write scaling" beats "I'd use Aurora."
2. **HA is not fault tolerance is not DR.** Multi-AZ RDS is HA. Active-active multi-region is fault tolerance. Backup/restore is DR.
3. **Every decision maps to a Well-Architected pillar.** "This optimizes Reliability at the expense of Cost" shows you think like an architect.
4. **Prefer managed services until operational need justifies self-managed.** Show restraint; complexity is a cost.
5. **Name the failure mode and how you'd contain it.** "Worst failure is X; we contain it via bulkhead/circuit breaker/DR tier, and validate via FIS."

---

*Enhanced matrix — 14 architectural domains, 5 new sections (Architecture Frameworks, Reliability Patterns, DR & BC, FinOps, Migration 7 Rs), 12 anti-patterns, and a phased 4-week interview preparation plan.*