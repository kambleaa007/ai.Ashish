# Lecture 2 Master Study Guide: What happens when you open a website/Mobile App? (End-to-End Request Flow)

This master study guide provides a rigorous, deep-dive examination of the end-to-end request flow when a user opens a web application or mobile app. It details every packet-level, OS-level, and infrastructure-level operation that occurs, grounded in the system design syllabus of the course.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS

### WHAT
The **End-to-End Request Flow** is the physical and logical path of network packets initiated by a client action (e.g., tap on a mobile app or URL entry in a web browser) traveling across the global internet down to the application service layers and back [304, 305]. It encompasses:
1. **Operating System (OS) Application Loading & RAM Execution** [148, 154].
2. **Recursive & Iterative Domain Name System (DNS) Resolution** [150-152, 156-158].
3. **Border Gateway Protocol (BGP) Anycast & Edge CDN Routing** [20, 28, 195-197].
4. **TCP Sockets & Secure Cryptographic SSL/TLS Handshakes** [305, 311, 312].
5. **Layer 7 Application Routing & Reverse Proxy Gateways** [153, 164, 211, 217].
6. **Backend Microservices Execution, Caching, and Database Queries** [23-24, 31-32, 246-247].

### WHY
If we do not design and coordinate this multi-step pathway, modern web systems will collapse under minimal concurrency. For example, if clients were allowed to connect directly to back-end databases:
* **Single Points of Failure (SPOFs)** would bring the entire system down if a single database node failed [62, 63].
* **Network Exhaustion**: Sockets at the OS level would quickly exhaust their maximum file descriptors (`FD_SET`) [176, 186].
* **Database I/O Bottlenecks**: Disk seeks (even on modern NVMe drives) take milliseconds ($10^{-3}$ seconds), which is $10^6$ times slower than CPU L1 cache access ($10^{-9}$ seconds), creating immediate read/write backlogs [247, 252].
* **Security Breaches**: Public exposure of server IPs enables direct port scans, SQL injection sweeps, and volumetric DDoS floods [21, 29, 212, 218].

### WHERE & WHEN
This flow operates in real-time across the entire distributed system. It spans the client device (hardware RAM/CPU), transit ISP backbones, geographically distributed Content Delivery Network (CDN) edge nodes, the virtual private cloud (VPC) network boundaries (WAFs/Gateways), Layer 4 and Layer 7 Load Balancers, and internal server nodes [20-21, 28-29, 138-139, 144-145].

### HOW (Step-by-Step Lifecycle Mechanics)

```
[Client App Tap]
       │
       ▼ (Phase 1: OS Execution)
 OS reads binary -> Allocates memory space in RAM -> Spawns execution thread -> Pre-flight network check
       │
       ▼ (Phase 2: DNS Resolution - UDP 53)
 OS Cache -> /etc/hosts -> Recursive ISP Resolver -> Root DNS Server -> TLD Server -> Authoritative Server
       │
       ▼ (Phase 3: CDN / Anycast Routing)
 BGP Anycast routes to closest CDN POP -> Cache Hit? (Return Static Asset) -> Cache Miss? (Forward to Origin)
       │
       ▼ (Phase 4: TCP Handshake - Layer 4)
 Client sends SYN (Seq=X) -> Load Balancer replies SYN-ACK (Ack=X+1, Seq=Y) -> Client sends ACK (Ack=Y+1)
       │
       ▼ (Phase 5: TLS 1.3 Handshake - Layer 7)
 ClientHello (g^x) -> ServerHello (Cert, g^y) -> Diffie-Hellman derivation (Symmetric Session Key g^xy)
       │
       ▼ (Phase 6: Reverse Proxy / LB Routing)
 Proxy decrypts TLS -> Evaluates paths/cookies -> Routes packets to Microservices -> Fetch from DB/Cache
```

#### Phase 1: Client-Side Execution & OS Initialization
1. **User Action**: The user taps the Hotstar icon on a mobile device or hits Enter in a web browser [148, 154].
2. **Disk-to-RAM Migration**: The OS reads the compiled application binary or browser runtime from local storage (flash memory) and loads it into the physical Random Access Memory (RAM) [148, 154].
3. **Thread Spawning**: The OS scheduler spawns a process and allocates execution thread contexts to parse the UI templates [148, 154].
4. **Connectivity Assessment**: The app queries the OS network interface cards (cellular or Wi-Fi NICs) to confirm an active routing pathway to the local gateway [149, 155].

#### Phase 2: Domain Name System (DNS) Resolution
Since computers communicate via binary IP addresses (32-bit IPv4 or 128-bit IPv6) but humans use logical domains (e.g., `api.hotstar.com`), the client must resolve the target address [150, 156]:
1. **Local Memory Buffers**: The client first checks local caches to save time:
   * **In-app/In-browser Cache**: Active memory store containing recent hostname resolutions [149, 155].
   * **Operating System DNS Cache**: System-level resolution tables [150, 156].
   * **Local hosts file**: Static, hardcoded local IP-to-domain mappings (e.g., `/etc/hosts`) [150, 156].
2. **Recursive Resolver Query**: On a local cache miss, the client OS constructs a UDP packet on Port 53 containing the domain query and routes it to the configured **Recursive DNS Resolver** (usually hosted by the ISP, or public resolvers like Cloudflare's `1.1.1.1` or Google's `8.8.8.8`) [150-151, 156-157].
3. **Iterative DNS Hierarchy Navigation**: If the resolver does not have the mapping cached [151, 157]:
   * **Root Nameservers**: The resolver sends a UDP query to one of the **13 logical root DNS server clusters** (named `a.root-servers.net` through `m.root-servers.net`). The root server reads the Top-Level Domain (TLD) suffix (`.com`) and redirects the resolver to the `.com` TLD nameservers [152, 158].
   * **TLD Nameservers**: The resolver queries the `.com` TLD registry servers, which return the IP addresses of the **Authoritative Name Servers** delegated for `hotstar.com` [152, 158].
   * **Authoritative Nameservers**: The resolver queries these authoritative servers. They hold the master zone file records and return the final target IP address mapping (A or AAAA records) for `api.hotstar.com` [152, 158].

#### Phase 3: BGP Anycast & CDN Edge Caching
1. **Geoproximity Routing**: The IP address returned is typically a global **Anycast IP address** [20, 28, 173]. Anycast maps the same IP address to multiple geographically separated CDN edge servers across the globe [173].
2. **BGP Path Selection**: Internet routers use **Border Gateway Protocol (BGP)** path cost metrics to automatically route the client's HTTP request packets to the topologically nearest physical CDN Edge Point of Presence (PoP) [20, 28, 195-197].
3. **Asset Evaluation**: The Edge CDN receives the connection:
   * **Cache Hit**: If static assets (such as logos, CSS, JavaScript, or video segments) are cached locally at the edge, they are returned directly to the user [197-198, 201-202].
   * **Cache Miss**: If the cache has expired (based on TTL) or the request is for a dynamic API (like `/homefeed`), the edge server forwards the request to the central origin server [198, 202].

#### Phase 4: TCP Socket Establishment (Layer 4)
For dynamic requests that must reach the origin, a secure Layer 4 transport channel is established:
1. **SYN**: The client sends a TCP packet with the `SYN` (Synchronize) flag set and an initial sequence number $X$.
2. **SYN-ACK**: The edge load balancer receives the packet, allocates socket memory buffers, and replies with a `SYN-ACK` packet (acknowledging $X+1$ and sending its sequence number $Y$).
3. **ACK**: The client responds with an `ACK` packet (acknowledging $Y+1$). The Layer 4 socket connection is now established.

#### Phase 5: Cryptographic SSL/TLS Handshake (TLS 1.3)
To secure the data stream in transit:
1. **ClientHello**: The client sends supported TLS versions, cryptographic cipher suites, and a random Diffie-Hellman client share $g^x$ [2, 11].
2. **ServerHello & Key Exchange**: The load balancer selects the strongest mutual cipher suite, sends its SSL Certificate signed by a public Certificate Authority (CA) (e.g., DigiCert, Let's Encrypt), and sends its random server share $g^y$ [229-231, 236-238].
3. **Symmetric Key Derivation**: Both client and server execute the Diffie-Hellman mathematical calculation ($g^{xy}$) using their private parameters and shared values [231, 238]. This securely derives a symmetric **Session Key** without ever transmitting the key over the network [231, 238].
4. **Encrypted Session**: All subsequent application data payloads are encrypted symmetrically using this session key, which requires significantly less CPU overhead than asymmetric cryptography [231, 238].

#### Phase 6: Layer 7 Reverse Proxying & Load Balancing
1. **TLS Termination**: The edge **Reverse Proxy / Load Balancer** terminates the incoming TLS session and decrypts the application payload [153, 164, 211, 217].
2. **Security & Rate Limiting**: The request passes through a Web Application Firewall (WAF) to scan for SQL Injection, XSS, and bot patterns, while Rate Limiters check if the user has exceeded their request quota [21, 29, 136-139, 142-145].
3. **Path-Based Routing**: An L7 load balancer inspects the HTTP headers and path prefix (e.g., `/homefeed`) [171-172, 181-182]. It selects a healthy backend microservice pod from its routing tables and proxies the decrypted HTTP payload to it [171-172, 181-182].
4. **Application Logic & DB Execution**: The microservice processes the request, checks its local memory cache (e.g., Redis), and executes SQL or NoSQL queries against relational or NoSQL database clusters before compiling the final JSON payload to send back through the pipeline [23-24, 31-32, 246-247, 249, 254].

---

## 2. TRADEOFF ANALYSIS

### Advantages
* **Edge Offloading via CDNs**: Offloads static assets at the edge, saving up to 90% of origin network bandwidth and drastically reducing database load [195-197, 199-201].
* **Layered Security Boundary**: Reverse proxies, WAFs, and rate limiters act as an edge shield, dropping malicious payloads before they ever reach core application servers [21, 29, 212, 218].
* **Microservices Isolation**: Separating traffic paths prevents a single slow service (e.g., billing) from blocking other independent pathways (e.g., home feed loading) [24, 32, 65, 71].

### Disadvantages
* **Increased Latency from Network Hops**: Hopping through DNS resolvers, Anycast routing nodes, CDNs, API Gateways, and Load Balancers adds network transport latency overhead.
* **Cache Invalidation Complexity**: Setting CDN TTLs too high risks serving stale data to clients, while setting them too low causes cache misses that can trigger a database "Cache Stampede" [198, 202].
* **Computational Cost of L7 Routing**: Parsing, disassembling, and decrypting SSL/TLS HTTP headers at Layer 7 requires massive CPU and memory pools compared to simple Layer 4 packet forwarding [171-172, 181-182].

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES

### Netflix Open Connect CDN & Cloud AWS Origin
Netflix segregates its systems into two completely distinct planes:
* **The Control Plane (AWS)**: Catalog management, search, user authentication, and movie recommendation services run inside AWS elastic microservices.
* **The Data Plane (Open Connect)**: High-bandwidth video file delivery is offloaded completely to Netflix's proprietary CDN, called **Open Connect**. Netflix builds custom physical caching servers called Open Connect Appliances (OCAs) and ships them directly to regional Internet Service Providers (ISPs) worldwide. When a subscriber clicks Play, their request is routed to an OCA sitting inside their local ISP's datacenter, completely bypassing the core public internet.

### Instagram Dynamic Feed Generation & Media Caching
When a user opens **Instagram**:
* The static shell layout and application templates are fetched from geographically proximate edge CDN locations [20, 28, 207-208].
* Dynamic feed requests (`api.instagram.com/v1/feed`) bypass CDN edge caches and route through an API Gateway for authentication (JWT verification) [21-22, 29-30].
* The API Gateway forwards the request to the **Feed Microservice**. This service reads the user's pre-computed feed directly from a distributed in-memory **Redis Cache Cluster**, delivering home posts with single-digit millisecond latency without running heavy SQL operations [24, 32].

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS

### The Global Blueprint Courier Analogy
Imagine you are trying to obtain a highly customized, secure architectural blueprint from a global corporation based in New York:

```
[Customer (Client)]
   │
   ├── (1. Check Host Address) ─────────> [Town Registry Office (DNS Resolver)]
   │                                              │
   │                                      (Gives Local Depot Address)
   │                                              v
   ├── (2. Try Local Branch) ───────────> [Local Neighborhood Depot (CDN Edge)]
   │                                              │ (Cache Hit: Return Blueprint)
   │                                              v (Cache Miss: Go to New York)
   ├── (3. Travel to NY HQ Gate) ───────> [High-Security Gate Guard (Reverse Proxy)]
   │                                              │ (Checks ID, Screens for Weapons)
   │                                              v
   ├── (4. Lock Suitcase Handshake) ────> [Secure Lockbox Handshake (TLS Handshake)]
   │                                              │ (Negotiate 3-digit Code)
   │                                              v
   └── (5. Direct to Service Desk) ─────> [Lobby Coordinator (Load Balancer)]
                                                  │
                                         ┌────────┴────────┐
                                         ▼                 ▼
                                   [Service Desk A]  [Service Desk B] (Backend Servers)
```

1. **DNS (The Registry Office)**: You do not know where the corporation's building is. You ask your local town registry clerk (Recursive Resolver). The local clerk doesn't know, so they call the international registry, which directs them to the New York state registry, which finally yields the exact physical address of the firm [150-152, 156-158].
2. **CDN (The Local Depot)**: Before traveling to NY, you check a local neighborhood depot (CDN). It turns out the corporation pre-shipped identical copies of standard blueprints to this local warehouse [195-197, 199-201]. You grab a copy in 5 minutes (Cache Hit).
3. **Reverse Proxy (The Security Guard)**: For highly customized, secure requests, you must go to the New York building. At the entrance, you meet a security guard (Reverse Proxy). He shields the staff inside from public view, screens you for weapons (WAF inspection), and verifies your security badge [21, 29, 212, 218].
4. **SSL/TLS Handshake (The Secret Suitcase)**: The security guard hands you a secure lockbox. You negotiate a temporary 3-digit combination (Symmetric Session Key) using an exchange of physical keys (Asymmetric Handshake). All subsequent documents you pass back and forth are locked inside this suitcase [231, 238].
5. **Load Balancer (The Intake Coordinator)**: Once inside the lobby, an intake coordinator (Load Balancer) assesses the length of the lines at the internal offices and directs you to Desk B (Application Server) because Desk A is currently backlogged [153, 164, 166, 176].

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

### JavaScript / TypeScript (Node.js Asynchronous Non-Blocking Resolution)
Node.js handles high network request concurrency using a single-threaded execution loop backed by `libuv`.

```typescript
// Node.js Express Gateway Proxy Node
import express, { Request, Response } from 'express';
import http from 'http';

const app = express();

app.get('/homefeed', (req: Request, res: Response) => {
    // Initiate non-blocking asynchronous socket query to upstream service
    const upstreamRequest = http.request({
        host: 'internal-feed-service.local',
        port: 8080,
        path: '/v1/feed',
        method: 'GET'
    }, (upstreamResponse) => {
        // Direct buffer streaming: pipes bytes directly from socket to socket
        res.writeHead(upstreamResponse.statusCode || 200, upstreamResponse.headers);
        upstreamResponse.pipe(res);
    });

    upstreamRequest.on('error', (err) => {
        res.status(502).json({ error: "Upstream gateway connection failure" });
    });

    // Event loop is instantly free to accept hundreds of other incoming sockets
    upstreamRequest.end();
});

app.listen(80, () => {
    console.log("High-performance L7 API proxy running on port 80");
});
```

### Java (Java 25+ Virtual Thread-per-Request Model)
Java 25 uses **Project Loom Virtual Threads** to execute a synchronous thread-per-request blocking socket pipeline, avoiding heavy native OS thread context-switching costs.

```java
// Java 25+ Virtual Thread Ingress Controller
package com.company.gateway;

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
        .executor(Executors.newVirtualThreadPerTaskExecutor()) // Loom Virtual Thread Pool
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
            return "{\"error\": \"Upstream Gateway Error: " + e.getMessage() + "\"}";
        }
    }
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER

### Production AWS Architecture Mapping
1. **AWS Route 53**: Handles global DNS resolution, employing Latency-Based Routing (LBR) policies to resolve domains to the nearest Anycast edge.
2. **AWS CloudFront**: Serves as the global CDN edge POP, caching static, cacheable media assets locally.
3. **AWS Shield & WAF**: Attached directly to CloudFront to absorb volumetric L3/L4 DDoS attacks and drop common L7 web exploits.
4. **AWS ALB (Application Load Balancer)**: Sits as the VPC entryway, managing SSL/TLS decryption (SSL termination) and path-based routing.

### Docker Compose Multi-Node sandbox Setup
This compose file builds an edge topology containing an Nginx gateway routing traffic to two separate backend instances:

```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx-gateway:
    image: nginx:alpine
    container_name: edge_nginx_gateway
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - feed-app-1
      - feed-app-2
    networks:
      - production-net

  feed-app-1:
    image: node:18-alpine
    container_name: app_node_1
    command: >
      node -e "
        const http = require('http');
        http.createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ node: 1, state: 'App Node 1 Active' }));
        }).listen(8080);
      "
    networks:
      - production-net

  feed-app-2:
    image: node:18-alpine
    container_name: app_node_2
    command: >
      node -e "
        const http = require('http');
        http.createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ node: 2, state: 'App Node 2 Active' }));
        }).listen(8080);
      "
    networks:
      - production-net

networks:
  production-net:
    driver: bridge
```

### Production Nginx Load Balancing Configuration
Configuration managing SSL decryption and connection keep-alives:

```nginx
# nginx.conf
events { 
    worker_connections 2048; 
}

http {
    upstream backend_app_pool {
        server feed-app-1:8080 max_fails=3 fail_timeout=10s;
        server feed-app-2:8080 max_fails=3 fail_timeout=10s;
    }

    server {
        listen 80;
        server_name api.hotstar.com;
        return 301 https://$host$request_uri; # Force secure HTTPS redirect
    }

    server {
        listen 443 ssl;
        server_name api.hotstar.com;

        # SSL Certificates
        ssl_certificate /etc/nginx/certs/fullchain.pem;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;

        # Keep-alive pooling settings back to upstream nodes
        keepalive_timeout 65;
        keepalive_requests 1000;

        location /homefeed {
            proxy_pass http://backend_app_pool;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Optimize connection keepalives back to application pods
            proxy_http_version 1.1;
            proxy_set_header Connection "";
        }
    }
}
```

### Kubernetes Ingress Orchestration Manifest
Configures dynamic routing boundaries within the production namespace:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress-routing
  namespace: production
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "15"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "30"
spec:
  tls:
  - hosts:
    - api.hotstar.com
    secretName: api-tls-cert-secret
  rules:
  - host: api.hotstar.com
    http:
      paths:
      - path: /homefeed
        pathType: Prefix
        backend:
          service:
            name: home-feed-service
            port:
              number: 8080
```

---
*All architectural blueprints, code-level execution loops, and network lifecycle mechanisms documented in this study guide are fully grounded in your system design sources and industry-grade engineering frameworks.*
