# 4: AWS Networking & Traffic Topologies


### 10. Multi-Tier VPC Topology & Subnet Reservation Math
*   **What**: A logically isolated virtual network divided into public subnets (routing to an Internet Gateway for ingress/egress) and private subnets (internal routing only, with egress via a NAT Gateway), mathematically partitioned using CIDR blocks.
*   **Why**: Exposing databases, file systems, and internal processing servers directly to the public internet presents an unacceptable security risk. A multi-tier network restricts public ingress to load balancers, keeping core data inside insulated private subnets.
*   **Where**: The architectural blueprint of every secure cloud deployment on AWS.
*   **How**: Provision a large VPC CIDR (e.g., `10.0.0.0/16`) and slice it into subnets across multiple Availability Zones. Route tables on public subnets target the Internet Gateway (`0.0.0.0/0 -> IGW`), while private subnets route outbound-only traffic through a NAT Gateway (`0.0.0.0/0 -> NAT-GW`).
*   **Subnet Reservation Math**: For any IPv4 CIDR prefix of length $C$, the number of assignable host IP addresses $N$ is:
    $$N = 2^{32 - C} - 5$$
    *The subtraction of 5 accounts for the standard AWS-reserved IPs within every subnet:*
    1.  `Base IP` (Network Address)
    2.  `Base IP + 1` (VPC Router Gateway)
    3.  `Base IP + 2` (VPC DNS Resolver / Amazon Provided DNS)
    4.  `Base IP + 3` (AWS Future Use Reservation)
    5.  `Max IP` (Broadcast Address - reserved although traditional broadcasting is unsupported)
*   **Advantages**:
    *   **Complete Network Isolation**: Backend servers and databases are physically unreachable from the public internet.
    *   **Custom Sizing**: Allows precise planning of IP space to prevent overlapping with corporate networks.
*   **Disadvantages**:
    *   **NAT Gateway Cost**: NAT Gateways carry steep hourly and per-GB traffic processing fees that can quickly dominate startup budgets.
    *   **IP Exhaustion**: Carving subnets too small (e.g., `/28`) can prevent container scaling due to address exhaustion.
*   **Mental Model**: A secure research facility. The public subnet is the front lobby (anyone can walk in). The private subnet is the secure laboratory behind badge-locked doors. Teammates in the lab can access the web to download research papers via a one-way security exit (NAT Gateway), but outsiders can never use that path to get inside.
*   **Example**: Slicing a `10.0.0.0/16` VPC into two public subnets (`10.0.1.0/24`, `10.0.2.0/24`) and two private subnets (`10.0.3.0/24`, `10.0.4.0/24`) to achieve highly available, isolated hosting.
*   **Big Picture Resources**: [AWS VPC Subnets & IP Sizing Guide](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)

---

### 11. Traffic Filtering (Stateful Security Groups vs. Stateless NACLs)
*   **What**: A dual-layer firewall architecture. Security Groups act as stateful firewalls at the individual instance or Elastic Network Interface (ENI) level, while Network Access Control Lists (NACLs) act as stateless firewalls at the subnet boundary level.
*   **Why**: Implementing only one firewall layer creates a single point of failure. A dual-layer approach provides defense-in-depth, letting NACLs block broad malicious traffic blocks at the subnet line before they can hit resource firewalls.
*   **Where**: Applied across public and private subnets to secure database clusters, compute instances, and load balancers.
*   **How**: Create Security Groups and write rules allowing specific ports (e.g., port 443). Create NACLs with ordered rules (e.g., 100, 200) that explicitly allow or deny IP ranges.
*   **Comparison Matrix**:
    *   **Security Groups**: Stateful. If an inbound connection is allowed, return outbound traffic is automatically allowed. Supports "Allow" rules only.
    *   **NACLs**: Stateless. Outbound return traffic must be explicitly allowed. Supports both "Allow" and "Deny" rules (essential for IP blacklisting).
*   **Advantages**:
    *   **Security Groups**: Simple to configure; automatically handles dynamic ephemeral return ports.
    *   **NACLs**: High performance; rejects malicious scans and DDoS traffic before it wastes internal compute cycles.
*   **Disadvantages**:
    *   **Security Groups**: Cannot block specific IP addresses directly (no deny rules).
    *   **NACLs**: Complex to manage. Forgetting to open outbound ephemeral ports (ports 1024-65535) will instantly block all outbound communication from the subnet.
*   **Mental Model**: A gated residential community. The NACL is the security guard at the front gate. They statelessy check every entering car and exit request against a paper list of banned plates. The Security Group is the digital smart lock on your front door. If you open the door to walk out, the lock remembers your state and lets you back inside without a re-check.
*   **Example**: Opening inbound port 80/443 on an EC2 Security Group. To allow internet access to function, the associated NACL must allow inbound traffic on port 80/443 and outbound traffic on ephemeral ports 1024-65535 to route the response.
*   **Big Picture Resources**: [AWS Security Group & NACL Comparison](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html)

---

### 12. Edge Caching & Content Delivery (Amazon CloudFront)
*   **What**: A global Content Delivery Network (CDN) service that caches static assets (images, videos, HTML) and dynamic API responses at edge locations worldwide to accelerate content delivery.
*   **Why**: Fetching resources from a single physical server in Mumbai from an office in New York introduces high network latency. Caching copies of files at local edge locations resolves physical distance bottlenecks.
*   **Where**: Used to serve static web content from S3, accelerate REST API endpoints, and mitigate DDoS attacks.
*   **How**: Users configure a CloudFront Distribution pointing to an origin (such as an S3 bucket or an Application Load Balancer). Users are routed to the closest global edge location via DNS.
*   **Advantages**:
    *   **Low Latency**: Delivers web assets with single-digit millisecond latency by pulling from local edge servers.
    *   **Origin Offload**: Reduces data transfer fees and compute load on backend origin servers.
    *   **Built-in Security**: Direct integration with AWS WAF and Route 53 provides automated shield protection against Layer 7 DDoS attacks.
*   **Disadvantages**:
    *   **Cache Invalidation Lag**: When files are updated, clearing the edge cache globally takes time or incurs additional invalidation API fees.
*   **Mental Model**: A franchise convenience store. Instead of every customer travelling to the central factory (origin server) to buy a single bottle of soda, local neighborhood stores (edge locations) keep a fresh stock on hand for immediate pickup.
*   **Example**: Hosting a React static application inside an Amazon S3 bucket, fronted by a CloudFront Distribution that serves the site over HTTPS with custom domain names.
*   **Big Picture Resources**: [Amazon CloudFront Developer Guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)

---

### 13. AWS API Gateway
*   **What**: A fully managed service that enables developers to design, publish, maintain, monitor, and secure REST, HTTP, and WebSocket APIs at scale, acting as a traffic cop for backend microservices.
*   **Why**: Directly exposing backend server ports or Lambda endpoints to the public internet makes authentication, request throttling, and unified endpoint management highly complex. API Gateway provides a single secure gateway for all clients.
*   **Where**: Used as the front door for serverless architectures, microservices, and mobile application backend connections.
*   **How**: Developers define API resources and HTTP methods (e.g., `GET /users`), tie them to backend integrations (such as a Lambda function), configure authorizers, and deploy to stages (e.g., `prod`, `dev`).
*   **Advantages**:
    *   **Built-in Protection**: Native rate limiting (throttling), CORS handling, request validation, and caching.
    *   **Unified Auth**: Simplifies security by integrating with AWS Cognito, IAM, or custom Lambda authorizers.
*   **Disadvantages**:
    *   **Strict Timeout**: Has a hard, non-configurable backend integration timeout of 29 seconds, making it unsuitable for long-running processes.
    *   **Pricing Scale**: At high API call volumes, pay-per-request pricing can become significantly more expensive than running a containerized load-balanced proxy.
*   **Mental Model**: A hotel front desk receptionist. Instead of guests wandering down hallways trying to find specific housekeepers or chefs (backend microservices), they ask the receptionist (API Gateway) who verifies their room card, manages queues, and coordinates the requests.
*   **Example**: Setting up an API Gateway REST endpoint at `/checkout` that validates a billing JSON schema, applies a rate limit of 100 requests/second, and forwards valid requests to an AWS Lambda function.
*   **Big Picture Resources**: [Amazon API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)

---

### 14. Route 53 (Domain Name System)
*   **What**: A highly available, scalable, cloud-native Domain Name System (DNS) web service that translates human-readable domain names (e.g., `example.com`) into physical IP addresses and routes internet traffic.
*   **Why**: Computers communicate via IP addresses, which are difficult for humans to remember. Route 53 manages this translation while introducing advanced traffic routing based on latency, health checks, or geographic origin.
*   **Where**: Used to register custom domain names and map public web traffic to AWS services (like CloudFront, API Gateway, or ALBs).
*   **How**: Create a Hosted Zone for a domain, configure DNS Record sets (A, AAAA, CNAME, TXT, Alias), and select a routing policy (Simple, Weighted, Latency-Based, Geolocation, or Failover).
*   **Advantages**:
    *   **Alias Records**: AWS-specific records that point directly to dynamic AWS resources (like ALBs) without performance degradation or double DNS lookups.
    *   **Disaster Recovery**: Integrated health checks can automatically route traffic away from unhealthy servers to a backup region (failover routing).
*   **Disadvantages**:
    *   **Zone Cost**: Costs $0.50 per hosted zone per month, which can accumulate for massive multi-domain projects.
    *   **Propagation Delay**: DNS records are cached worldwide by local ISPs; modifications suffer from propagation delay dictated by the Time-To-Live (TTL).
*   **Mental Model**: The global telephone book. When you lookup "Acupuncture Studio" (domain), the phone book translates the name to a physical phone number (IP address). Additionally, the operator can route your call to the nearest branch office based on where you are calling from.
*   **Example**: Mapping `api.mycompany.com` via a Route 53 Alias A record with Latency-Based Routing to direct users in Europe to an ALB in Dublin, and users in Asia to an ALB in Singapore.
*   **Big Picture Resources**: [Amazon Route 53 Developer Guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html)

---
---

## 🛠️ Enterprise VPC High-Availability Architecture Spec
This architecture maps out a highly resilient VPC design spanning three Availability Zones (AZs) with separate subnets for the load-balancing layer, application compute layer, and physical storage databases.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           VPC: 10.0.0.0/16 (US-EAST-1 REGION)                                  │
├──────────────────────────────────┬────────────────────────────────┬─────────────────────────────┤
│      Availability Zone A         │      Availability Zone B       │     Availability Zone C     │
├──────────────────────────────────┼────────────────────────────────┼─────────────────────────────┤
│ Public Subnet (10.0.1.0/24)      │ Public Subnet (10.0.2.0/24)    │ Public Subnet (10.0.3.0/24) │
│ └─ ALB (Ingress Root)            │ └─ ALB (Ingress Root)          │ └─ ALB (Ingress Root)       │
├──────────────────────────────────┼────────────────────────────────┼─────────────────────────────┤
│ Private App Subnet (10.0.10.0/24)│ Private App Subnet (10.0.11.0/24) Private App (10.0.12.0/24) │
│ └─ ECS Tasks / Autoscaling EC2   │ └─ ECS Tasks / Autoscaling EC2 │ └─ ECS Tasks / Autoscaling  │
├──────────────────────────────────┼────────────────────────────────┼─────────────────────────────┤
│ Private DB Subnet (10.0.20.0/24) │ Private DB Subnet (10.0.21.0/24) Private DB (10.0.22.0/24)  │
│ └─ RDS Aurora Cluster Master     │ └─ RDS Aurora Replica Instance │ └─ DB Cluster Replica       │
└──────────────────────────────────┴────────────────────────────────┴─────────────────────────────┘
```

### 📊 Network Sizing & Allocation Chart
Always reserve sufficient headroom in CIDR allocations. Remember that AWS reserves **5 IP addresses** per subnet:
*   `.0`: Network address.
*   `.1`: VPC internal router.
*   `.2`: DNS server (AmazonProvidedDNS).
*   `.3`: Reserved for future AWS features.
*   `.255`: Network broadcast address.

| Subnet Type | CIDR Notation | Netmask | Available Hosts | Reserved by AWS | Usable IPs | Primary Workload |
|---|---|---|---|---|---|---|
| **Public Layer** | `10.0.0.0/22` | `255.255.252.0` | 1024 | 5 | **1019** | ALBs, NAT Gateways |
| **Private App Layer** | `10.0.4.0/22` | `255.255.252.0` | 1024 | 5 | **1019** | EKS Worker Nodes, ECS Tasks |
| **Private DB Layer** | `10.0.8.0/24` | `255.255.255.0` | 256 | 5 | **251** | RDS Databases, Cache Clusters |

### 🛠️ Network Security Boundary Matrix
| Security Control | OSI Layer | Stateful vs. Stateless | Associated Layer | Standard Production Configuration Pattern |
|---|---|---|---|---|
| **Security Groups** | Layer 4 (Transport) | **Stateful** (Inbound rules automatically allow matching outbound traffic) | Network Interface (ENI) | Inbound: Allow port 80/443 from Security Group of Load Balancer. Outbound: Allow ALL. |
| **NACLs** | Layer 3 (Network) | **Stateless** (Inbound and outbound rules must be defined explicitly) | Subnet | Inbound: Allow Ephemeral ports (1024-65535) and port 443. Outbound: Explicitly deny known hostile CIDRs. |

### 🔍 Advanced Network Troubleshooting Toolkit
Run these standard terminal utilities inside an application environment to verify routing and security boundary passes:
```bash
# Test layer-7 SSL handshakes and latency
curl -Iv https://api.production.internal/healthz

# Perform recursive trace-route to find network packet drops
traceroute -I api.production.internal

# Verify DNS resolution on the Amazon VPC internal resolver (10.0.0.2)
dig +trace database.production.internal

# Listen to raw socket traffic on port 8080 to troubleshoot connection timeouts
tcpdump -i any port 8080 -nn -vv
```