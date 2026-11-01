# 50 Core AWS Architectural Scenarios

A comprehensive set of scenario-based AWS questions tests your architectural decision-making across compute, storage, databases, networking, and security. Mastering these 50 core architectural scenarios will prepare you for almost any AWS certification or technical interview.

## Compute & Auto Scaling
* **Unpredictable traffic spikes:** A web application experiences sudden, unpredictable bursts of traffic. **Solution:** Combine an Application Load Balancer (ALB) with an Auto Scaling Group (ASG) to dynamically scale EC2 instances.
* **Non-urgent batch processing:** You have a massive backlog of video rendering jobs that can be interrupted. **Solution:** Use EC2 Spot Instances managed by AWS Batch or SQS to process jobs at the lowest cost.
* **Long-term baseline workload:** A legacy database must run on EC2 continuously for the next three years. **Solution:** Purchase EC2 Reserved Instances or Compute Savings Plans for maximum discount.
* **Monolithic application decomposition:** You need to break a legacy app into microservices without managing servers. **Solution:** Use AWS Fargate (serverless containers) or AWS Lambda triggered by Amazon API Gateway.
* **Hadoop cluster deployment:** You need to deploy a 4-node Hadoop cluster for big data processing. **Solution:** Use Amazon EMR (Elastic MapReduce) to automate cluster provisioning and configuration.

## Storage & Content Delivery
* **Aging data lifecycle:** Documents are accessed frequently for 30 days, then rarely accessed but require millisecond retrieval. **Solution:** Use S3 Lifecycle policies to transition data from S3 Standard to S3 Standard-IA (Infrequent Access).
* **Compliance archiving:** Financial logs must be kept for 7 years and a 12-hour retrieval time is acceptable. **Solution:** Route the data to Amazon S3 Glacier Deep Archive for the lowest storage cost.
* **Shared Linux storage:** Hundreds of EC2 instances across multiple Availability Zones need concurrent access to a shared file system. **Solution:** Use Amazon EFS (Elastic File System).
* **Extreme database I/O:** A high-transaction NoSQL database requires sub-millisecond latency and guaranteed IOPS. **Solution:** Attach Amazon EBS Provisioned IOPS SSD (io2) volumes to the EC2 instances.
* **Global media delivery:** Users worldwide experience high latency when downloading static images from an S3 bucket in us-east-1. **Solution:** Put Amazon CloudFront in front of the S3 bucket to cache content at edge locations.

## Databases
* **Complex joins with high availability:** A 2-tier web app requires complex SQL query processing and replication across multiple AZs. **Solution:** Use Amazon Aurora for highly available, MySQL/PostgreSQL-compatible relational storage.
* **Schema-less gaming leaderboard:** You need a database that can handle millions of requests per second with single-digit millisecond latency. **Solution:** Amazon DynamoDB.
* **Database migration without downtime:** You are moving an on-premises Oracle database to AWS. **Solution:** Use AWS Database Migration Service (DMS) alongside the Schema Conversion Tool (SCT).
* **Read-heavy bottlenecks:** A MySQL database is overwhelmed by analytical read queries slowing down primary writes. **Solution:** Create RDS Read Replicas and offload caching to Amazon ElastiCache (Redis/Memcached).
* **Global active-active DR:** You need a database that allows instantaneous writes in both the US and Europe for disaster recovery. **Solution:** Amazon DynamoDB Global Tables or Aurora Global Database.

## Networking & Connectivity
* **Consistent hybrid bandwidth:** Your on-premises data center needs a dedicated, highly secure, and consistent 10 Gbps connection to AWS. **Solution:** AWS Direct Connect.
* **Private internet access:** EC2 instances in a private subnet must download software patches without accepting inbound internet traffic. **Solution:** Route outbound traffic through a NAT Gateway located in a public subnet.
* **Malicious IP blocking:** You notice a specific block of IP addresses initiating SQL injection attacks against your web servers. **Solution:** Block the IPs using AWS WAF (Web Application Firewall) or VPC Network ACLs.
* **Geolocation routing:** European users must be routed to European servers to comply with data sovereignty laws. **Solution:** Amazon Route 53 Geolocation routing policy.
* **Internal AWS routing:** You want to securely transfer data from EC2 to S3 without traffic traversing the public internet. **Solution:** Implement a VPC Gateway Endpoint for S3.

## Security & Identity
* **Controlled encryption:** You must encrypt S3 data at rest but retain total control over the encryption key rotation. **Solution:** AWS Key Management Service (KMS) using Customer Managed Keys.
* **Temporary instance permissions:** An application on an EC2 instance needs permission to upload files to an S3 bucket. **Solution:** Attach an IAM Role with the necessary policies directly to the EC2 instance; never hardcode credentials.
* **API auditing:** You need to find out which user terminated a critical production EC2 instance last night. **Solution:** Query AWS CloudTrail logs.
* **Centralized compliance:** You must monitor security alerts and CIS benchmark compliance across 50 different AWS accounts. **Solution:** AWS Security Hub integrated with AWS Organizations.
* **Sensitive data discovery:** You need to automatically identify and protect PII (Personally Identifiable Information) stored across multiple S3 buckets. **Solution:** Amazon Macie.

## Serverless & Integration
* **Decoupling architectures:** A front-end web application is dropping requests because the backend video processing server is overwhelmed. **Solution:** Place an Amazon SQS (Simple Queue Service) queue between them to buffer requests.
* **Mass push notifications:** You need to send real-time order confirmation alerts to 500,000 mobile app users simultaneously. **Solution:** Amazon SNS (Simple Notification Service).
* **Event-driven compute:** You want to run a thumbnail-generation script automatically every time a user uploads a photo, without provisioning servers. **Solution:** AWS Lambda triggered by an S3 object creation event.
* **Workflow orchestration:** You need to manage a multi-step checkout process requiring conditional branching, human approval, and automatic retries. **Solution:** AWS Step Functions.
* **Real-time data streaming:** You must ingest and process terabytes of continuous clickstream data from a global website in real time. **Solution:** Amazon Kinesis Data Streams.

## Cost Optimization & Management
* **Cost attribution:** The finance team needs to know exactly how much the "Marketing" department spends on EC2 resources. **Solution:** Enforce AWS Cost Allocation Tags and view reports in AWS Cost Explorer.
* **Automated environment scheduling:** Development environments are running 24/7, wasting money over the weekend. **Solution:** Use AWS Instance Scheduler or EventBridge rules triggering Lambda to stop instances on Friday night and start them Monday morning.
* **Budget alerting:** You need an immediate email alert if your monthly AWS spend is forecasted to exceed $10,000. **Solution:** Set up AWS Budgets.
* **Architectural health checks:** You want an automated check of your entire AWS environment against best practices for cost, performance, and security. **Solution:** AWS Trusted Advisor.
* **Infrastructure replication:** You need to deploy an identical copy of your production environment in a new region within 10 minutes. **Solution:** Define the infrastructure as code using AWS CloudFormation or AWS CDK.

## Migration & Hybrid Cloud
* **Exabyte-scale migration:** You need to move 50 Petabytes of on-premises data to AWS, and your internet connection would take years to transfer it. **Solution:** AWS Snowmobile.
* **Terabyte-scale offline transfer:** You need to securely migrate 10 Terabytes of local data to S3 without using the internet. **Solution:** Request an AWS Snowball Edge device.
* **Hybrid file storage:** On-premises servers need seamless SMB/NFS access to virtually unlimited storage backed by Amazon S3. **Solution:** AWS Storage Gateway (File Gateway).
* **Lift-and-shift migration:** You need to rapidly re-host 200 VMware virtual machines to AWS with minimal downtime. **Solution:** AWS Application Migration Service (MGN).
* **Local cloud infrastructure:** You require single-digit millisecond latency to on-premises manufacturing equipment but want to use standard AWS APIs. **Solution:** Deploy AWS Outposts in your local facility.

## Analytics & Machine Learning
* **Serverless SQL on S3:** Data analysts need to query raw CSV and JSON logs directly in S3 using standard SQL. **Solution:** Amazon Athena.
* **Managed ML pipelines:** Data scientists need a fully managed environment to build, train, and deploy custom machine learning models. **Solution:** Amazon SageMaker.
* **Automated document extraction:** You need to automatically extract printed text, handwriting, and data from millions of scanned medical forms. **Solution:** Amazon Textract.
* **Enterprise data warehousing:** You are consolidating disparate databases into a massive central repository for complex BI reporting. **Solution:** Amazon Redshift.
* **Serverless ETL:** You need to extract, transform, and load data from RDS to Redshift without provisioning Apache Spark clusters. **Solution:** AWS Glue.

## Disaster Recovery & Reliability
* **AZ failure protection:** You must ensure a web application survives the complete failure of a single data center. **Solution:** Deploy the ALB and ASG across at least two Availability Zones.
* **Cost-effective DR:** You need a disaster recovery environment in a second region that costs very little during normal operations but can scale up quickly during a crisis. **Solution:** Implement a Pilot Light or Warm Standby architecture.
* **Point-in-time database recovery:** An administrator accidentally drops a critical database table, and you need to restore the state from exactly 4 minutes ago. **Solution:** Rely on Amazon RDS Automated Backups to perform a point-in-time recovery.
* **Automated failover:** You want to route user traffic away from a primary AWS region automatically if the application becomes unresponsive. **Solution:** Route 53 Health Checks tied to a Failover Routing Policy.
* **Accidental deletion protection:** You must prevent administrators from permanently deleting critical compliance files in S3. **Solution:** Enable S3 Versioning combined with MFA (Multi-Factor Authentication) Delete.