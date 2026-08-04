# AWS Solutions Architect & DevOps Masterclass
## Pillar 2: GLOBAL INFRASTRUCTURE & DISASTER RECOVERY
**Edition**: 2026 High-Paid Professional Prep

---

#### Topic 11: Regions
*   🧠 **Mental Model**: Major physical continents. Going from Paris to Tokyo takes physical travel time, crossing ocean cables [cite: 597, 989].
*   📋 **What, Why, Where, How**:
    *   **What**: A separate geographical area containing multiple physical data centers [cite: 595, 989].
    *   **Why**: Reduces network latency for global clients, ensures compliance with national data privacy laws, and enables robust disaster recovery [cite: 197, 597, 991].
    *   **Where**: 30+ regions globally, such as us-east-1 (N. Virginia), ap-south-1 (Mumbai), and eu-central-1 (Frankfurt) [cite: 516, 544, 932].
    *   **How**: Pass region parameters directly inside your AWS CLI, SDK, or CDK config files [cite: 210, 836].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "A company is deploying a latency-sensitive high-frequency trading platform. What parameters dictate region selection besides server distance?"
    *   *Answer*: "Beyond physical distance (latency), region selection is dictated by service availability (some regions do not support specialized instances), compliance/data residency laws (e.g., GDPR requiring EU hosting), and cost differences (bandwidth/instance pricing vary by region) [cite: 254, 517, 598]."

#### Topic 12: Availability Zones (AZs)
*   🧠 **Mental Model**: Multiple physical warehouses located 10 miles apart in the same city. If one warehouse burns down, the other continues processing orders smoothly [cite: 545, 595].
*   📋 **What, Why, Where, How**:
    *   **What**: One or more isolated data centers with redundant power, cooling, and network links in a single region [cite: 595].
    *   **Why**: Provides native active-active high availability and fault tolerance within a geographical boundary [cite: 545, 586].
    *   **Where**: Neatly nested inside every global AWS region (at least 3 AZs per region typically) [cite: 595, 1314].
    *   **How**: Selecting subnets configured in different AZs during EC2 or RDS deployment [cite: 188, 396, 543].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How do you explain the network connection between two AZs? How do they avoid latency while maintaining isolation from disasters?"
    *   *Answer*: "AZs are physically separated by enough distance to avoid localized disasters (e.g., flooding) but are connected via low-latency, redundant private fiber-optic lines, ensuring single-digit millisecond latency between AZ-nested resources while maintaining independent power grids [cite: 187, 545]."

#### Topic 13: Edge Locations
*   🧠 **Mental Model**: Local vending machines stocked with cold drinks in every neighborhood. Customers do not need to walk to the factory across the country to get a bottle of water [cite: 251].
*   📋 **What, Why, Where, How**:
    *   **What**: Global points of presence (PoP) that cache content closer to end-users to reduce response times [cite: 250, 251].
    *   **Why**: Accelerates static and dynamic content delivery, offloading massive read traffic from origin servers [cite: 251, 411].
    *   **Where**: Hundreds of edge locations globally, separate from AWS regions [cite: 13, 20].
    *   **How**: Routing website domains through Amazon CloudFront distributions [cite: 48, 594].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How do Edge Locations secure public-facing applications from DDoS attacks before traffic reaches the core VPC network?"
    *   *Answer*: "Edge Locations integrate natively with AWS Shield and AWS WAF [cite: 513]. Because traffic hits global edge networks first, massive volumetric attacks are absorbed by AWS's global network capacity at the edge, blocking malicious requests before they consume VPC network bandwidth [cite: 167, 513]."

#### Topic 14: Network Latency & Latency-Based Routing (LBR)
*   🧠 **Mental Model**: An airport routing passengers to the flight with the shortest absolute transit time, bypassing congested airspace.
*   📋 **What, Why, Where, How**:
    *   **What**: Route 53 feature that measures network latency from users to different AWS regions and routes requests to the region with the lowest latency [cite: 169].
    *   **Why**: Provides a highly responsive global user experience, dynamically adapting to internet routing changes [cite: 169, 597].
    *   **Where**: Managed centrally inside Amazon Route 53 DNS servers [cite: 168].
    *   **How**: Create latency-based routing records inside your Route 53 hosted zones pointing to endpoints in different regions.
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "If a user in London experiences lower network latency to ap-south-1 (Mumbai) than to eu-west-1 (Dublin) due to routing issues, how does Route 53 handle their DNS request?"
    *   *Answer*: "Route 53 latency routing dynamically monitors round-trip times (RTT) across the internet. It will automatically resolve the DNS query to the ap-south-1 IP address, bypassing geography in favor of real-world packet velocity to guarantee the fastest user experience [cite: 169]."

#### Topic 15: DR Strategy: Backup & Restore
*   🧠 **Mental Model**: Saving a copy of your important documents to an external USB hard drive once a week. If your laptop breaks, you lose up to one week of data.
*   📋 **What, Why, Where, How**:
    *   **What**: The most basic disaster recovery strategy, involving taking regular snapshots of data and restoring them when a failure occurs [cite: 197].
    *   **Why**: Cheapest DR option with minimal infrastructure costs, suitable for non-critical enterprise systems [cite: 182, 197].
    *   **Where**: Leverages Amazon S3, S3 Glacier, and EBS snapshots [cite: 197, 512, 568].
    *   **How**: Configuring AWS Backup policies or scheduling automated lambda-based snapshots [cite: 569].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What are the RTO and RPO trade-offs when implementing a basic Backup & Restore disaster recovery strategy?"
    *   *Answer*: "Backup and Restore has the longest Recovery Time Objective (RTO) because you must build the target stack and restore data from cold storage, which can take hours. The Recovery Point Objective (RPO) is determined by backup frequency; if backups occur once every 24 hours, you risk losing up to 24 hours of data."

#### Topic 16: DR Strategy: Pilot Light
*   🧠 **Mental Model**: Keeping a small gas heater's pilot light lit. The main burner is off, but can be ignited instantly to heat the entire house when a cold front hits.
*   🧠 **Technical Definition**: Replicating critical core data databases to a warm standby region while keeping application compute servers completely shut down (AMIs ready) [cite: 197].
*   📋 **What, Why, Where, How**:
    *   **What**: DR pattern where data databases are kept continuously running and replicated, while compute instances remain idle or offline [cite: 197].
    *   **Why**: Significantly lower standby cost compared to active-active setups, with a drastically faster recovery time than backup/restore [cite: 197].
    *   **Where**: Cross-region active replication using Aurora Global Databases or DynamoDB Global Tables [cite: 187, 515].
    *   **How**: Replicating databases, saving EC2 AMIs in the secondary region, and keeping minimum resources idle [cite: 197].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How do you automate the transition from pilot light to full production during a primary region outage?"
    *   *Answer*: "You automate this by scripting the target region activation: first, Route 53 health checks trigger an alarm [cite: 199, 427]; second, an automation script spins up Auto Scaling Groups using pre-saved AMIs, attaches them to Elastic Load Balancers, and promotes the secondary replica database to write mode, rerouting DNS [cite: 164, 165, 183]."

#### Topic 17: DR Strategy: Warm Standby
*   🧠 **Mental Model**: Keeping a secondary backup generator running at a slow idle. It is already connected to the house and can take over the electrical load in seconds if the grid fails.
*   📋 **What, Why, Where, How**:
    *   **What**: A disaster recovery strategy where a minimal, functional version of the full application stack is kept running in a secondary region.
    *   **Why**: Near-zero RTO for critical workloads at a moderate cost, keeping core business services online during regional disasters.
    *   **Where**: Multi-region architectures spanning different AWS regions [cite: 197].
    *   **How**: Running scale-down ASGs and minimal RDS instances in the target region, scaling up when primary fails [cite: 181, 182, 197].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How do you maintain cost efficiency inside a Warm Standby DR region?"
    *   *Answer*: "You optimize warm standby costs by configuring secondary Auto Scaling Groups to run at a minimal capacity (e.g., 2 instances instead of 20) [cite: 182, 328, 652]. The compute instances are only scaled up to 100% capacity via scaling policies when Route 53 fails over the traffic, preventing high, idle running fees [cite: 165, 168]."

#### Topic 18: DR Strategy: Active-Active Multi-Region
*   🧠 **Mental Model**: Running two identical production lines in separate cities simultaneously. If one city loses power, the other handles all manufacturing orders with zero delay [cite: 197].
*   📋 **What, Why, Where, How**:
    *   **What**: A high availability pattern where identical production environments run simultaneously across multiple regions, actively serving traffic [cite: 197].
    *   **Why**: Zero RTO and zero RPO for mission-critical applications where downtime means millions in lost revenue [cite: 197, 198].
    *   **Where**: Amazon DynamoDB Global Tables, Route 53, and multi-region Load Balancers [cite: 187, 197].
    *   **How**: Deploying equal stacks, writing data to Global Tables, and letting Route 53 route traffic [cite: 187, 197, 198].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What is the primary architectural difficulty when deploying an Active-Active Multi-Region system?"
    *   *Answer*: "The primary difficulty is data consistency and conflict resolution (managing concurrent writes). Utilizing Amazon DynamoDB Global Tables solves this by executing a 'last-writer-wins' strategy, but applications must be natively designed to handle eventual consistency across regions [cite: 187]."

#### Topic 19: DR Strategy: Active-Passive Multi-Region
*   🧠 **Mental Model**: A primary bridge serving traffic, with an identical secondary bridge closed to traffic. If the primary bridge collapses, gates open on the secondary bridge instantly [cite: 198].
*   📋 **What, Why, Where, How**:
    *   **What**: A DR pattern where the primary region handles 100% of read/write requests, while Route 53 keeps the secondary region in standby [cite: 198].
    *   **Why**: Solves write conflict issues of active-active systems while maintaining a very low recovery time objective [cite: 198].
    *   **Where**: Route 53 failover routing policies with active/passive health checks [cite: 168, 198].
    *   **How**: Route 53 monitors primary endpoint; upon failure, DNS records are instantly updated to point to the passive region.
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How does Route 53 prevent 'split-brain' scenarios where both regions think they are primary during transient network drops?"
    *   *Answer*: "This is prevented by utilizing authoritative, centralized Route 53 health checks with strict failover thresholds. The DNS failover relies on AWS's independent monitoring systems rather than the guest application's internal state, ensuring only one region is actively mapped as primary at any point."

#### Topic 20: Cross-Region Replication (CRR)
*   🧠 **Mental Model**: Having a live mirror of your whiteboard in Paris instantly redrawn by a robot arm on a whiteboard in New York.
*   📋 **What, Why, Where, How**:
    *   **What**: Automatically replicating objects or data transactions asynchronously from one region to another [cite: 187, 198].
    *   **Why**: Guarantees off-site data availability and local read performance for global clients [cite: 198, 597].
    *   **Where**: Amazon S3 Cross-Region Replication and RDS Read Replicas [cite: 197].
    *   **How**: Enable versioning on S3 buckets and apply cross-region replication rules inside S3 properties [cite: 162, 534].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "Does S3 Cross-Region Replication (CRR) replicate existing objects in a bucket when first enabled?"
    *   *Answer*: "No. By default, S3 CRR only replicates new objects uploaded AFTER the replication rule is created. Existing objects must be backfilled manually using S3 Batch Operations to synchronize the buckets."