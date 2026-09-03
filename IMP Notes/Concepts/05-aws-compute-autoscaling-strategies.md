# 5: AWS Compute & Autoscaling Strategies


### 15. EC2 Virtual Compute (Elastic Compute Cloud) & Auto Scaling
*   **What**: On-demand, resizable virtual servers running on AWS hypervisors, managed dynamically by Auto Scaling groups to adjust server count based on real-time traffic demand.
*   **Why**: Traditional application frameworks, legacy workloads, or custom heavy computing pipelines require full operating system control, persistent local storage, and custom CPU/GPU hardware profiles.
*   **Where**: Core hosting for web applications, build agents, database hosting, and machine learning model training.
*   **How**: Deploy an EC2 instance by selecting an Amazon Machine Image (AMI), choosing a performance family (e.g., general t3, compute c6, storage i3, or GPU p5/g5), and placing it inside an Auto Scaling Group (ASG) governed by scaling policies.
*   **Advantages**:
    *   **Complete Control**: Administrative root/sudo access allows the installation of any custom software or operating system components.
    *   **Cost Management**: Auto Scaling minimizes cost by terminating idle instances during low-traffic hours, and using Spot instances can save up to 90%.
*   **Disadvantages**:
    *   **High Operational Overhead**: Engineers are responsible for managing OS upgrades, security patching, virus scanning, and configuring backups.
*   **Mental Model**: Renting an apartment. You get complete keys to the place and can decorate or modify it however you want, but you are responsible for keeping it clean, maintaining appliances, and paying rent based on its physical size.
*   **Example**: Deploying a pool of t3.medium EC2 instances running Jenkins build agents inside an Auto Scaling Group that scales up by 1 instance whenever average CPU utilization exceeds 70%.
*   **Big Picture Resources**: [Amazon EC2 User Guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)

---

### 16. Serverless Compute (AWS Lambda)
*   **What**: An event-driven, serverless compute service that executes application code in isolated micro-containers in response to specific triggers, scaling automatically down to zero.
*   **Why**: Managing virtual servers that sit idle during off-peak hours wastes engineering time and cloud budgets. Lambda allows developers to write code functions that only run—and incur costs—when a specific event happens.
*   **Where**: Processing data uploads in S3 buckets, handling API Gateway backend requests, parsing streaming data, and running scheduled automation cron jobs.
*   **How**: Developers upload a zip file or container image containing their code (Python, Node.js, Go) and define an event trigger (e.g., an S3 file upload). AWS automatically handles container provisioning and execution.
*   **Advantages**:
    *   **Zero Server Maintenance**: No OS updates, patching, or scaling policies to write; scaling is handled transparently by AWS.
    *   **Pay-per-Use**: Charges are calculated based on the exact duration of execution in milliseconds, scaling down to absolute zero when idle.
*   **Disadvantages**:
    *   **Cold Start Latency**: The first execution after idle requires provisioning a new container, introducing a brief sub-second latency spike.
    *   **Strict Time Limit**: Functions have a hard execution limit of 15 minutes, making them unsuitable for long-running processes.
*   **Mental Model**: A taxi cab service. You do not own a vehicle, pay insurance, or manage maintenance. You simply summon a ride (trigger a function), get driven to your location (code runs), and pay only for the exact duration of the trip.
*   **Example**: An S3 bucket trigger that automatically fires a Python Lambda function to resize an uploaded JPEG image and write the thumbnail to a separate bucket whenever a user uploads an avatar.
*   **Big Picture Resources**: [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)

---

### 17. Container Orchestration (ECS vs. EKS vs. AWS Fargate)
*   **What**: Container scheduling planes: Elastic Container Service (ECS) is AWS's simple proprietary orchestrator; Elastic Kubernetes Service (EKS) is a managed upstream-compatible Kubernetes service; AWS Fargate is a serverless engine that runs container workloads for both without node management.
*   **Why**: Manually SSH-ing into servers to run `docker run` commands and manage container networking at scale is impossible. Orchestrators automate scheduling, routing, health checking, and container cluster scaling.
*   **Where**: The foundation of modern microservice architectures, enterprise SaaS applications, and scalable API platforms.
*   **How**: Developers define container specifications (ECS Task Definitions or Kubernetes Pod Manifests). When using Fargate, they configure CPU and memory requirements, and AWS executes the container on a fully managed fleet.
*   **Decision Matrix**:
    *   **ECS on EC2**: Simple, AWS-native integration with IAM and CloudWatch, very low learning curve.
    *   **EKS on EC2**: Standardized Kubernetes, highly extensible (CRDs, operators), prevents vendor lock-in, high complexity.
    *   **Fargate**: Serverless. Eliminates EC2 capacity planning entirely; best for teams wanting to focus purely on application containers.
*   **Advantages**:
    *   **ECS/EKS**: Automates rolling deployments, service discovery, and high availability.
    *   **Fargate**: Eliminates server patching, capacity management, and OS maintenance for container fleets.
*   **Disadvantages**:
    *   **EKS**: Carries a flat control plane charge of $0.10/hour ($73/month) and requires extensive expertise in YAML, Helm, and cluster networking.
    *   **Fargate**: Higher cost per CPU/RAM hour compared to reserving raw EC2 instance capacity.
*   **Mental Model**: A shipping container cargo port. ECS is a local port authority loader (highly integrated with AWS, simple and fast). EKS is a standard international cargo crane system (conforms to global maritime standards, complex, but lets you load ships from anywhere in the world). Fargate is a completely outsourced freight forwarder (you just drop off the packages, and they disappear into the destination without you ever seeing a ship or crane).
*   **Example**: Deploying an enterprise e-commerce application onto a managed AWS EKS cluster, utilizing Kubernetes manifests to orchestrate 8 separate microservices and route traffic using an ALB ingress controller.
*   **Big Picture Resources**: [AWS Container Services Decision Matrix](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)

---
---

## 🛠️ Enterprise Compute Selection & Fleet-Optimization Patterns
Choosing the wrong compute tier can inflate cloud spend by up to 70%. Use this decision matrix to align workload specifications with resource execution tiers.

### 📊 Compute Decision Framework
```
                 Is the workload continuous & stateful?
                                ├── YES ──► EC2 / Auto Scaling Group (ASG)
                                └── NO
                                     │
                    Is it containerized or microservices?
                                ├── YES ──► AWS Fargate (Serverless Containers)
                                └── NO
                                     │
                    Event-driven execution under 15 minutes?
                                ├── YES ──► AWS Lambda (Serverless Functions)
                                └── NO ───► EC2 / ECS Standard Instance
```

### 📈 Scaling Engine Comparison
*   **Target Tracking Scaling**: Keeps a specific metric stable. *Example:* Scale out/in to maintain average CPU utilization at exactly 65%.
*   **Step Scaling**: Scales based on defined step-adjustments. *Example:* If CPU is between 70%-80%, add 2 instances. If CPU is above 80%, add 5 instances.
*   **Scheduled Scaling**: Proactively scales based on time patterns. *Example:* Scale out to 10 instances every Monday morning at 8:00 AM before business hours.

### 🔍 Spot Fleet Architecture & Graceful Interruption Handling
When utilizing AWS Spot instances for stateless compute, the spot scheduler can reclaim the instance with only a **2-minute notice**. Ensure your application handles this interruption gracefully:

```
┌──────────────────┐  Instance Interruption Event  ┌──────────────────┐  Trigger Script  ┌────────────────────┐
│  AWS Spot Fleet  │ ────────────────────────────► │ EventBridge Rule │ ───────────────► │ Lambda Node Drain  │
│  reclaims node   │                               │ (2-minute warning)│                  │ or Target Group API│
└──────────────────┘                               └──────────────────┘                  └────────────────────┘
```

#### Node Interruption Graceful Code Hook (Go/Python example):
Deploy a cron-job or daemon inside the instance to poll the EC2 Instance Metadata Service (IMDSv2) at 1-second intervals for the interruption flag:
```bash
# Poll metadata endpoint for spot termination action
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/spot/instance-action
```