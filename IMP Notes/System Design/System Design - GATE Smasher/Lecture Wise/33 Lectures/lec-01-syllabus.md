# Lec-1 Master Study Guide: System Design Introduction & Syllabus Discussion

This master study guide introduces the engineering foundations of System Design, maps out the complete learning curriculum, and establishes the systematic methodologies used by top-tier Principal Architects to design high-scale distributed systems.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS

### WHAT
**System Design** is the software engineering discipline of defining the architecture, software modules, data models, interfaces, protocols, and deployment infrastructure of a system to satisfy functional specifications while guaranteeing rigorous non-functional requirements—such as low latency, high availability, massive scalability, partition tolerance, and security boundaries. It is the art and science of organizing independent computer systems to act as a unified, highly efficient execution engine.

### WHY
In software engineering, small-scale systems can get away with poor architecture because their raw hardware capacity is vastly underutilized. However, when user concurrent demands scale from hundreds to millions of requests per second, standard application loops fail dramatically. 

Without intentional system design, systems suffer from:
1. **Single Points of Failure (SPOF)**: A single database server crash takes down the entire global business.
2. **Cascading Failures**: A slow network connection causes upstream microservice socket pools to block, leading to resource exhaustion across the entire cluster.
3. **Resource Exhaustion**: CPU cycles are wasted on excessive SSL handshakes, network serialization, or database lock contentions rather than computing business logic.
4. **Data Corruption**: Uncoordinated concurrent writes lead to race conditions and inconsistent states across distributed databases.

### WHERE & WHEN
System design does not live in an isolated layer of a tech stack. It represents a **vertical slice** spanning across all architectural layers:
* **The Client / Network Edge**: Local caching, DNS resolution, and global CDN caching.
* **The Ingress / Gateway Layer**: Load balancing, SSL termination, and API rate limiting.
* **The Compute Layer**: Monoliths, microservices, container fabrics, and serverless runtimes.
* **The Distributed Data Layer**: Relational caches, NoSQL databases, message brokers, and analytical data warehouses.

Architects begin System Design at the earliest phases of the Software Development Life Cycle (SDLC) and continuously iterate as traffic payloads and scaling properties evolve.

### HOW (The Architectural Lifecycle)
When designing a distributed system from scratch, architects follow a highly structured, repeatable execution roadmap:

```
[Gather Requirements] ──> [Capacity Estimation] ──> [Data Model & Schema] ──> [High-Level Design] ──> [Deep-Dive Bottlenecks]
```

1. **Step 1: Gather Requirements**:
   * **Functional Requirements**: *What* features must the system support? (e.g., "Users must be able to post 280-character text snippets with media attachments.")
   * **Non-Functional Requirements (NFRs)**: *How well* must the system perform? These are defined using strict **Service Level Agreements (SLAs)** and **Service Level Objectives (SLOs)**:
     * *Availability*: 99.99% uptime ("Four Nines" allows only ~52 minutes of downtime *per year*).
     * *Latency*: $P_{99}$ response time $< 200\text{ ms}$ (99% of requests must resolve within 200ms).
     * *Scale*: 100,000 Concurrent Active Users (CAU) with write-heavy workloads.
2. **Step 2: Capacity Estimation**:
   * **Back-of-the-Envelope Calculations**: Translating NFRs into raw physical infrastructure constraints (Storage, Bandwidth, CPU, RAM):
     * *Write Volume*: $10\text{ million posts/day} \approx 115\text{ writes/sec}$.
     * *Media Storage*: $115\text{ writes/sec} \times 1\text{ MB/media} \approx 115\text{ MB/sec} \approx 9.9\text{ TB/day}$.
     * *Bandwidth Requirements*: $9.9\text{ TB/day} \approx 916\text{ Mbps}$ egress network capacity.
3. **Step 3: Data Model & Database Schema**:
   * Deciding on the storage paradigm (Relational vs. Non-Relational) based on data relations, query access patterns, and read/write ratios.
4. **Step 4: High-Level Design (HLD)**:
   * Drawing the master block diagrams showing the path of data from client devices, through the ingress network, to the application servers and databases.
5. **Step 5: Low-Level Deep-Dives & Bottleneck Discovery**:
   * Identifying single points of failure, designing replication layers, planning data partitioning strategies, and establishing active caching policies.

---

## 2. TRADEOFF ANALYSIS

```
           [ Distributed Microservices ]             VS             [ Monolithic System ]
      • High Scalability  • Complex Networks                  • Fast Network  • Hard to Scale
```

### Advantages of Distributed Architectures
* **Horizontal Elasticity**: Systems can scale outward by adding inexpensive, standardized server nodes to a cluster rather than buying massive, expensive mainframe hardware.
* **Fault Isolation (Blast Radius Reduction)**: If the `/billing` service experiences a memory leak, it crashes independently. The client can still use the `/search` and `/catalog` services, preventing complete system outages.
* **Organizational Scalability**: Decoupling the codebase into discrete microservices allows multiple engineering teams to write, test, and release code independently without lock-step deployments.

### Disadvantages of Distributed Architectures
* **Distributed System Complexity**: Introduces the **fallacy of distributed computing**—assuming the network is reliable, bandwidth is infinite, and latency is zero.
* **Consistency Management**: Moving away from a single relational database database locks forces architects to deal with **eventual consistency** and distributed transaction coordination (such as the Saga Pattern or 2-Phase Commit).
* **Operational Observability Costs**: Debugging a request requires highly complex distributed tracing layers (e.g., OpenTelemetry) to trace spans across dozens of independent network jumps.
* **Network Latency & Serialization Overhead**: Inter-service communication consumes CPU cycles converting objects to network-ready bytes (JSON over HTTP, Protobuf over gRPC) and back.

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES

### Netflix (Scale-Aware Decoupled Architecture)
Netflix isolates their system architecture based on scaling properties. Their user authentication, video catalog browsing, and recommendation services run inside highly elastic **stateless microservices** hosted on AWS. 

Because these services do not store state in local RAM, they can instantly scale from 1,000 instances to 100,000 instances within minutes during high-traffic spikes (such as a weekend release). 

Conversely, their actual heavy video asset delivery bypasses AWS entirely and is offloaded to a globally distributed, custom-built CDN network named **Open Connect**, optimizing video delivery paths close to the consumer's ISP.

### Amazon (Decoupled E-Commerce Order Flow)
When you click "Buy Now" on Amazon, the request is not processed synchronously. If Amazon's system forced you to wait while it verified inventory, charged your credit card, allocated warehouse staff, and printed shipping labels in a single thread, the system would immediately collapse under high load. 

Instead, Amazon's HLD decouples this transaction asynchronously:
1. The frontend places your order directly inside a highly scalable, distributed **Message Queue** (such as SQS).
2. The UI instantly returns "Order Placed successfully."
3. Background microservices pull messages from the queue to process inventory, charge cards, and schedule shipping at their own pace, protecting core databases from sudden write-spikes.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS

### The Non-Technical Analogy: The Industrial Metropolis Logistics System
Imagine a small, local farm-to-table bakery run by a single baker. He takes orders, bakes the bread, sweeps the floor, and processes cash payments. This works perfectly for 15 customers a day. This is a **Monolithic, Single-Instance Application**.

```
[ Bakerey Monolith ] ──> (Baker handles Customer, Baking, Sweeping, Payments in one room)
```

Now, imagine the bakery scales to serve **5 million citizens** across a global metropolitan area.
1. If you kept the single-baker model, the physical lines would stretch for miles, the baker would suffer physical exhaustion, and if he fell ill, the entire city would go hungry (SPOF).
2. Instead, you design a systematic logistics network:
   * **CDNs**: You build local distribution stands (Edge CDNs) in every neighborhood. Popular breads are pre-shipped overnight so locals can grab them in 2 minutes.
   * **Load Balancers**: At the main bakery warehouse, a traffic coordinator (Load Balancer) directs delivery trucks to designated loading docks based on active capacity.
   * **Microservices**: You divide the bakery into independent departments: a baking department, an inventory department, a finance department, and a shipping department. If the finance department's accounting books are temporarily backlogged, the bakers still keep baking bread.
   * **Message Queues**: Bakers do not wait for the delivery trucks to arrive. They bake the bread, place it on a conveyor belt (Message Queue), and return to baking. The shipping department grabs bread from the belt as trucks become available.

### High-Level Distributed System Design Blueprint
This ASCII diagram maps out the standard macro-level components of a production distributed system:

```
[ Client Sockets ] ── (Mobile / Browser requests)
        │
        ▼
 [ DNS Resolver ] ─── (Route domain to closest edge IP)
        │
        ▼
 [ CDN Edge PoPs ] ── (Hit: Serve static images / files instantly)
        │ (Miss / Dynamic API Call)
        ▼
 [ SSL Terminating ] ─ (WAF Protection & SSL Decryption)
 [  Load Balancer  ]
        │
        ▼
 [ API Gateway / ] ─── (Checks JWT, routes paths, applies rate-limits)
 [ Reverse Proxy ]
        │
        ▼
 [ Microservices ] ─── (Stateless business logic processing)
   │     │     │
   │     │     └─────> [ Shared Distributed Cache ] ──> (Fast in-memory Redis lookup)
   │     │
   │     └───────────> [ Message Brokers / Queues ] ──> (Asynchronous Kafka / SQS decoupling)
   │
   └─────────────────> [ Distributed Databases ] ───> (Sharded SQL / NoSQL write-stores)
```

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

Designing a high-throughput gateway, proxy, or server daemon requires selecting a language runtime whose concurrency model matches your scalability properties.

### JavaScript / TypeScript & Node.js (Non-Blocking Kernel Event Loop)
Node.js processes concurrent operations asynchronously using a single-threaded execution loop backed by `libuv`.
* **The Mechanics**: It relies on non-blocking I/O multiplexing via system calls like `epoll` (Linux) or `kqueue` (macOS). When an incoming HTTP request hits the Node.js socket, the single thread registers the socket descriptor with the OS kernel and immediately moves to accept the next request.
* **The High-Load Trap**: If the request handler executes a CPU-heavy task—such as validating an SSL handshake or parsing a massive 50MB JSON payload—the single thread blocks. The entire event loop freezes, and all other incoming connections experience severe latency spikes.

```typescript
// Node.js Asynchronous Non-Blocking Gateway Router
import express, { Request, Response } from 'express';
import http from 'http';

const app = express();

// High-speed, non-blocking asynchronous proxy route
app.get('/homefeed', async (req: Request, res: Response) => {
    try {
        const upstreamRequest = http.request({
            host: 'internal-feed-service.local',
            port: 8080,
            path: '/v1/feed',
            method: 'GET'
        }, (upstreamResponse) => {
            res.writeHead(upstreamResponse.statusCode || 200, upstreamResponse.headers);
            upstreamResponse.pipe(res); // Stream bytes efficiently
        });

        upstreamRequest.on('error', () => {
            res.status(502).send("Gateway Error");
        });

        // Event loop is instantly free to accept hundreds of other incoming sockets
        upstreamRequest.end();
    } catch (err) {
        res.status(500).send("Internal Server Exception");
    }
});

app.listen(80);
```

### Java 25+ (Project Loom Virtual Thread per Connection)
Historically, Java applications mapped each incoming socket connection to a heavy, native Operating System thread (the Thread-per-Request model). This model hit a scalability wall at around 5,000 to 10,000 concurrent connections due to high memory overhead (each native thread allocates a 1MB stack) and context-switching overhead on the CPU cores. Project Loom introduces **Virtual Threads** to completely decouple Java thread objects from OS native threads.
* **The Mechanics**: Virtual threads are lightweight thread structures managed directly by the JVM runtime on the heap.
* **The High-Load Benefit**: When a virtual thread performs a blocking I/O operation (like waiting for a slow backend microservice or a database query), the JVM automatically yields its execution, detaching the virtual thread from its underlying native carrier thread. The carrier thread immediately runs another virtual thread, keeping CPU utilization near 100% with minimal memory overhead.

```java
// Java 25+ Virtual Thread Gateway Controller
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.util.concurrent.Executors;

@RestController
public class IngressGatewayController {

    // Configure HTTP client backed by JVM Virtual Threads instead of native OS threads
    private final HttpClient httpClient = HttpClient.newBuilder()
        .executor(Executors.newVirtualThreadPerTaskExecutor())
        .build();

    @GetMapping("/homefeed")
    public String proxyRequest() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("http://internal-feed-service.local:8080/v1/feed"))
                .GET()
                .build();

            // This blocks the lightweight virtual thread, NOT the physical OS thread.
            // The JVM carrier thread is immediately freed to process other incoming HTTP requests.
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (Exception e) {
            return "Gateway Error: " + e.getMessage();
        }
    }
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER

### Production AWS Architecture Mapping
To host a globally scalable, production-ready system design topology, architects map high-level blocks directly to AWS managed infrastructure:
1. **AWS Route 53 (Global DNS)**: Routes client domains to the nearest physical datacenter or CDN PoP using latency-based or geolocation routing tables.
2. **AWS CloudFront (Content Delivery Network)**: Places static images, video files, and assets on edge servers to decrease loading latency.
3. **AWS Shield & WAF (Ingress Security)**: Detects and drops massive distributed layer-7 network attacks (such as SQL injections, script cross-sites, or flood bots).
4. **AWS Application Load Balancer (ALB)**: Acts as the secure entry point inside the private VPC, decrypting TLS certificates at the edge and load-balancing traffic down to the compute layer.
5. **AWS EKS (Elastic Kubernetes Service)**: Orchestrates the compute microservices fleets in separate virtual networks.

### Docker Compose Multi-Container Configuration
This configuration spins up a local sandbox environment featuring an Nginx gateway routing traffic to isolated backend services.

```yaml
# docker-compose.yml
version: '3.8'

services:
  ingress-gateway:
    image: nginx:alpine
    container_name: local_ingress_nginx
    ports:
      - "80:80"
    volumes:
      - ./gateway.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - feed-service
      - chat-service
    networks:
      - app-tier

  feed-service:
    image: node:18-alpine
    container_name: local_feed_node
    command: >
      node -e "
        const http = require('http');
        http.createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ service: 'Feed Service', status: 'Healthy' }));
        }).listen(8080);
      "
    networks:
      - app-tier

  chat-service:
    image: node:18-alpine
    container_name: local_chat_node
    command: >
      node -e "
        const http = require('http');
        http.createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ service: 'Chat Service', status: 'Healthy' }));
        }).listen(8080);
      "
    networks:
      - app-tier

networks:
  app-tier:
    driver: bridge
```

### Kubernetes Pod & Deployment Specification
This manifest deploys backend compute resources inside a secure Kubernetes namespace, configuring a replica set with liveness and readiness probes to guarantee self-healing:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: stateless-feed-deployment
  namespace: production
  labels:
    tier: compute
    app: feed-service
spec:
  replicas: 3 # Scale out horizontally across multiple physical nodes
  selector:
    matchLabels:
      app: feed-service
  template:
    metadata:
      labels:
        app: feed-service
    spec:
      containers:
      - name: feed-node-container
        image: node:18-alpine
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "1"
            memory: 512Mi
          requests:
            cpu: "0.5"
            memory: 256Mi
        # Self-healing readiness and liveness checks
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 20
```
