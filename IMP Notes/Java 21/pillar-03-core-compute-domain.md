# AWS Solutions Architect & DevOps Masterclass
## Pillar 3: CORE COMPUTE DOMAIN
**Edition**: 2026 High-Paid Professional Prep

---

#### Topic 21: Amazon EC2 (Elastic Compute Cloud)
*   🧠 **Mental Model**: Renting a secure laptop from a tech rental company where you can choose the exact CPU, RAM, and OS, and pay only for the minutes you use [cite: 163, 227].
*   📋 **What, Why, Where, How**:
    *   **What**: A web service providing secure, resizable compute capacity in the cloud [cite: 163, 301].
    *   **Why**: Eliminates physical server acquisition, maintenance, and power costs while enabling instant vertical scaling [cite: 165, 230].
    *   **Where**: Standard virtual machine deployments inside public and private subnets [cite: 188, 660].
    *   **How**: Launching instances via AWS Console, CLI, or CDK and accessing them via SSH/RDP [cite: 302, 350, 362].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What occurs to the data stored on an EC2 instance's local Instance Store volume when you stop and start the instance?"
    *   *Answer*: "The data on the Instance Store is lost forever. Instance Store volumes are physically attached to the host computer; stopping an instance de-allocates the hardware, causing an absolute wipe of ephemeral storage. Persistent data must be stored on Amazon EBS volumes [cite: 164, 512, 995]."

#### Topic 22: EC2 Instance Families
*   🧠 **Mental Model**: Vehicle fleets: T/M families are sedan cars (general purpose), C family are formula-1 race cars (compute optimized), R/X are cargo trucks (memory optimized), and I/D are shipping ships (storage optimized).
*   📋 **What, Why, Where, How**:
    *   **What**: Specialized hardware classifications of EC2 instances optimized for different workloads [cite: 22, 546].
    *   **Why**: Ensures optimal cost-to-performance by matching instance resources with application bottlenecks [cite: 546].
    *   **Where**: Selectable during EC2 launch configuration or CDK instance definitions [cite: 22, 546].
    *   **How**: Specifying instance family names such as `c6g.xlarge` or `r7g.2xlarge` [cite: 546, 547].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "Which instance family would you select to host an in-memory Redis database, and why?"
    *   *Answer*: "I would select the R (Memory Optimized) or X (High-Memory) families [cite: 547]. These instances are architected with a high RAM-to-CPU ratio, ensuring large-scale Redis datasets reside completely in memory without hitting disk-paging limits, maximizing read/write performance [cite: 410, 547]."

#### Topic 23: AMIs (Amazon Machine Images)
*   🧠 **Mental Model**: A master blueprint or clone machine of a fully configured computer, including its OS, software patches, and configurations, ready to stamp out thousands of exact copies [cite: 23, 171, 172].
*   📋 **What, Why, Where, How**:
    *   **What**: A template containing the software configuration (operating system, application server, and applications) required to launch an instance [cite: 528, 551, 915].
    *   **Why**: Drastically speeds up boot times for Auto Scaling Groups by baking pre-installed packages into a custom boot image [cite: 305, 548, 637].
    *   **Where**: Core template used by EC2 and Auto Scaling launch configurations [cite: 27, 636].
    *   **How**: Creating an AMI from a configured EC2 instance and utilizing its unique AMI ID in CDK templates [cite: 548].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How do custom AMIs facilitate faster auto-scaling compared to utilizing standard Amazon Linux AMIs with user data scripts?"
    *   *Answer*: "Standard AMIs require user data scripts to execute during boot, which pulls packages from the internet and runs installations, taking several minutes [cite: 639]. Custom AMIs have all application dependencies pre-compiled and baked in, reducing boot times from minutes to seconds, allowing ASGs to absorb traffic spikes immediately [cite: 328, 548]."

#### Topic 24: Public vs. Private IPs on EC2
*   🧠 **Mental Model**: Private IP: Your desk phone extension inside a secure corporate office (internal routing only). Public IP: Your direct global cell phone number (reachable from anywhere) [cite: 183, 188].
*   📋 **What, Why, Where, How**:
    *   **What**: Private IPs route traffic within the local VPC network; Public IPs are routable over the public internet [cite: 183, 550].
    *   **Why**: Enhances security by keeping backend database servers completely hidden from the internet [cite: 188].
    *   **Where**: Bound directly to the Elastic Network Interfaces (ENIs) of EC2 instances [cite: 550, 939].
    *   **How**: Automatically allocated based on subnet 'auto-assign public IP' settings [cite: 1066].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What happens to the public IP of an EC2 instance when it is stopped and subsequently started?"
    *   *Answer*: "The public IP is released back into AWS's dynamic IP pool [cite: 164, 183]. When the instance is started again, it receives a completely new public IP address. To prevent this IP drift, you must associate an Elastic IP (EIP) [cite: 183, 184, 549]."

#### Topic 25: Elastic IP Addresses
*   🧠 **Mental Model**: Having a reserved toll-free corporate phone number that never changes, even if you physically move your office building [cite: 183, 184].
*   📋 **What, Why, Where, How**:
    *   **What**: A static, public IPv4 address designed for dynamic cloud computing [cite: 183, 550].
    *   **Why**: Ensures clients or DNS records point to an unchanging IP address during instance restarts or migrations [cite: 183, 549].
    *   **Where**: Bound to your AWS account region and manually associated with instances [cite: 183, 549].
    *   **How**: Allocating an Elastic IP via the EC2 dashboard and associating it with an ENI [cite: 550, 736].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "Are there any cost implications for holding an Elastic IP address in your AWS account?"
    *   *Answer*: "Yes. AWS charges a small fee for Elastic IP addresses to prevent IP hoarding [cite: 549, 937]. Previously, it was only charged when the IP was idle/unassociated, but in 2026 all public IPv4 addresses, whether associated or idle, carry an hourly charge [cite: 736, 1079]."

#### Topic 26: Auto Scaling Groups (ASG)
*   🧠 **Mental Model**: A smart thermostat that automatically turns on more cooling fans as more people walk into a crowded room, then turns them off when people leave to save energy [cite: 327, 328, 637].
*   📋 **What, Why, Where, How**:
    *   **What**: A service that automatically launches or terminates EC2 instances to match user load [cite: 327, 637].
    *   **Why**: Optimizes application availability, handles sudden traffic spikes, and reduces costs during low-demand periods [cite: 326, 328, 637].
    *   **Where**: Managed under the EC2 dashboard, spanning multiple availability zones [cite: 164, 642].
    *   **How**: Configuring ASGs with a launch template and scaling policies (CPU/Memory thresholds) [cite: 328, 636].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "An ASG is configured with a minimum of 2, desired of 4, and maximum of 10. If an instance in the group becomes unhealthy, how does the ASG handle it?"
    *   *Answer*: "The ASG automatically detects the unhealthy instance (either via EC2 status checks or ELB health checks), terminates it, and launches a brand-new instance using the launch template to return the group to the desired capacity of 4 [cite: 165, 652, 655]."

#### Topic 27: Launch Templates
*   🧠 **Mental Model**: A standardized form pre-filled with your compute preferences: OS type, security groups, firewall rules, and startup commands [cite: 27, 638].
*   📋 **What, Why, Where, How**:
    *   **What**: A configuration specifying instance properties (AMI, instance type, keys, security groups, user data) used by ASGs [cite: 505, 638].
    *   **Why**: Replaces obsolete launch configurations, allowing version control and multi-use inheritance [cite: 636, 640].
    *   **Where**: Managed centrally in the EC2 console and referenced by ASGs [cite: 636, 640].
    *   **How**: Creating a template and versioning it inside CDK or AWS CLI [cite: 640, 641].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "Can you update an active Launch Template used by an Auto Scaling Group in-place? How do you roll out configuration updates?"
    *   *Answer*: "Launch Templates are immutable and versioned [cite: 640, 641]. To roll out updates, you create a new template version, update the ASG to target this new version, and initiate an Instance Refresh to systematically replace existing instances with new ones [cite: 1184]."

#### Topic 28: Elastic Beanstalk (PaaS Compute)
*   🧠 **Mental Model**: An automated packaging system: you throw in your raw code, and it builds the servers, sets up the load balancer, hooks up the database, and hands you a live URL [cite: 185, 274, 308].
*   📋 **What, Why, Where, How**:
    *   **What**: A managed orchestration service for deploying web applications quickly [cite: 163, 185, 307].
    *   **Why**: Minimizes infrastructure overhead while still allowing complete control over underlying resource settings [cite: 235, 308, 316].
    *   **Where**: Deploys multi-tier web applications using standard stacks like Java, Node.js, Python, and PHP [cite: 185, 370, 527].
    *   **How**: Uploading application code via the Beanstalk dashboard or CLI [cite: 185, 372].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How do you achieve zero-downtime application deployments when using Elastic Beanstalk?"
    *   *Answer*: "You achieve zero-downtime by utilizing 'Blue-Green deployments' or 'Rolling with Additional Batch' [cite: 812]. In Blue-Green, you spin up a completely separate environment (Green) with the new code, test it, and swap the DNS CNAME with the active environment (Blue), preventing pipeline disruptions [cite: 185, 812]."

#### Topic 29: Amazon ECS (Elastic Container Service)
*   🧠 **Mental Model**: A busy shipping port shipping thousands of identical, standard-sized steel cargo containers, seamlessly loading and stacking them onto massive cargo ships [cite: 330, 331].
*   📋 **What, Why, Where, How**:
    *   **What**: A highly scalable, high-performance container orchestration service that supports Docker containers [cite: 29, 333, 511].
    *   **Why**: Eliminates the overhead of managing complex Kubernetes master node control planes while maintaining fast deployment speed [cite: 332, 511].
    *   **Where**: Run containerized microservices on AWS EC2 or AWS Fargate serverless [cite: 508, 1314].
    *   **How**: Writing task definitions, creating ECS services, and letting ECS handle container scale [cite: 527, 812].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What is the difference between running ECS with an EC2 Launch Type vs. an AWS Fargate Launch Type?"
    *   *Answer*: "With EC2 Launch Type, you manage and pay for the underlying physical EC2 instances hosting the containers [cite: 527]. With Fargate, you run serverless containers; AWS manages the underlying servers, and you pay strictly for the CPU and memory allocated per task, eliminating OS management [cite: 511, 527, 1314]."

#### Topic 30: Amazon EKS (Elastic Kubernetes Service)
*   🧠 **Mental Model**: A massive global cargo airline. It uses the standardized international Kubernetes airport rules but lets AWS handle the safety control tower, fueling, and runway maintenance [cite: 528, 915].
*   📋 **What, Why, Where, How**:
    *   **What**: A managed service that makes it easy to run Kubernetes on AWS without installing your own control plane [cite: 30, 528, 915].
    *   **Why**: Perfect for cloud-native applications requiring strict hybrid container portability and standard Kubernetes ecosystem APIs [cite: 507, 528].
    *   **Where**: Scaled global container applications spanning multiple zones [cite: 108, 528].
    *   **How**: Provisioning an EKS cluster via CDK and connecting to it using kubectl [cite: 780].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What new capability was added to Amazon EKS version upgrades in recent releases to improve the safety of operations?"
    *   *Answer*: "Amazon EKS added the capability to execute a 'Kubernetes Version Rollback' within 7 days of an upgrade [cite: 108]. If a cluster upgrade introduces unexpected breaking changes or API incompatibilities with running pods, engineers can safely roll back the control plane to the previous version to prevent outages [cite: 108]."