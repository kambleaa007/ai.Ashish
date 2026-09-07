# Topic 1 Master Study Guide: End-to-End Request Flow (DNS, CDN, & Load Balancers)

This study guide explores the critical path of a network request from the instant a user interacts with a client application to the moment the request hits the private upstream backend application servers.

---

## 1. Technical Mechanics (What, Why, Where, How)

When an event triggers a request on a client app, a multi-layered network traversal begins, moving from high-level logical domains down to bare-metal hardware routing.

```
[Client Application]
       │
       ▼  (Phase 1: DNS Lookup)
  Hosts File / Local Cache ──(Miss)──> ISP/Public Resolver ──> Root -> TLD -> Authoritative
       │
       ▼  (Phase 2: Anycast / Geoproximity Routing)
  CDN Edge Server (Anycast IP) ──(Cache Hit: Return Static Files)
       │
       ▼  (Phase 3: TCP Handshake & TLS Negotiate)
  Layer 4 / Layer 7 Edge Ingress (SSL Termination)
       │
       ▼  (Phase 4: Load Balancing)
  Upstream Private Application Servers
```

### Phase A: Client-Side Initialization & DNS Resolution
Before any data packet can be transmitted over the internet, the client application must resolve the logical hostname (e.g., `api.hotstar.com`) into a routable physical IP address.
1. **Local DNS Cache Check**: The client Operating System (OS) first inspects its local memory buffers:
   * **In-browser / In-app cache**: Built-in memory store.
   * **OS resolver cache**: System-level DNS cache.
   * **Local hosts file**: Static, hardcoded local IP-to-domain mappings (e.g., `/etc/hosts` or `C:\Windows\System32\drivers\etc\hosts`).
2. **Recursive Resolver Query**: If a local cache miss occurs, the OS queries its configured **Recursive DNS Resolver** (usually hosted by the ISP, or public resolvers like Cloudflare's `1.1.1.1` or Google's `8.8.8.8`) via UDP port 53.
3. **Iterative DNS Hierarchy Navigation**:
   * **Root Name Servers**: The recursive resolver queries one of the **13 logical root DNS server clusters** (named `a.root-servers.net` through `m.root-servers.net`). The root server inspects the Top-Level Domain (TLD) and redirects the resolver to the `.com` TLD nameservers.
   * **TLD Name Servers**: The resolver queries the `.com` TLD registry servers, which return the IP addresses of the **Authoritative Name Servers** delegated for `hotstar.com`.
   * **Authoritative Name Servers**: The resolver makes a final query to the authoritative name server. This server owns the definitive DNS record database and returns the target IP mapping (A or AAAA records) for `api.hotstar.com`.

### Phase B: Anycast IP & CDN Edge Routing
To minimize global network latency, high-scale enterprises assign **Anycast IP addresses** to their Content Delivery Network (CDN) edge locations.
* **Anycast Mechanics**: Anycast allows multiple geographically separated CDN edge servers to share the exact same IP address. Routers across the internet use **Border Gateway Protocol (BGP)** path cost metrics to automatically route the client's packet to the topologically nearest physical CDN Edge Point of Presence (PoP).
* **Static Offloading**: Static media assets, HTML documents, CSS files, and structured JSON metadata are stored on these edge servers. When a request hits the edge:
  * **Cache Hit**: The edge server returns the asset immediately, keeping latency within single-digit milliseconds.
  * **Cache Miss**: The edge server proxies the request back to the central origin server over optimized backbone networks, caches the returned response locally, and delivers it to the client.

### Phase C: TCP socket Connection & SSL/TLS Handshake
For dynamic API requests that cannot be cached, a secure transport channel must be established directly with the edge load balancer.
1. **TCP Three-Way Handshake**:
   * Client sends `SYN` (Synchronize flag with initial sequence number $X$).
   * Load Balancer replies with `SYN-ACK` (acknowledging $X$ and sending its sequence number $Y$).
   * Client sends `ACK` (acknowledging $Y$).
2. **SSL/TLS 1.3 Handshake (Symmetric/Asymmetric Cryptography Hybrid)**:
   * **ClientHello**: Client transmits supported TLS versions, cryptographic cipher suites, and a random client share ($g^x$).
   * **ServerHello & Key Exchange**: The load balancer chooses the strongest shared TLS version and cipher suite, validates its identity by serving its SSL Certificate (signed by a public Certificate Authority), and sends its random server share ($g^y$).
   * **Secret Derivation**: Both client and server execute a **Diffie-Hellman Key Exchange** math sequence to generate a shared symmetric **Session Key** without ever transmitting the key over the wire.
   * **Encrypted Stream**: All subsequent HTTP data packets are encrypted symmetrically using this session key, which requires negligible CPU overhead compared to heavy asymmetric cryptography.

### Phase D: Load Balancing (Layer 4 vs. Layer 7 Ingress)
Once decrypted, traffic reaches the gateway infrastructure where it must be safely distributed across backend microservice clusters.
* **Layer 4 (L4) Load Balancing**: Operates strictly at the transport layer (TCP/UDP). It does not look inside the encrypted HTTP payload. It maintains routing mapping tables in memory and forwards raw packet streams directly to target servers using IP addresses and port numbers.
* **Layer 7 (L7) Load Balancing**: Operates at the application layer. It acts as a reverse proxy, fully terminating the client's TCP/SSL connection and initiating a separate TCP connection to the upstream application servers. This allows the load balancer to read HTTP headers, request paths (e.g., routing `/reels` vs `/messaging` to different pods), cookies, and query parameters to execute highly intelligent routing logic.

---

## 2. High-Load Trade-offs & Bottlenecks

```
                [Layer 7 Load Balancer] (terminates SSL)
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
[App Node 1]        [App Node 2]        [App Node 3]
```

### DNS Cache Invalidation vs. Latency
* **Trade-off**: Lower DNS **Time-To-Live (TTL)** values allow companies to quickly redirect traffic away from failing servers or datacenters. However, setting TTLs too low forces client devices to frequently re-resolve hostnames, causing noticeable network lookup latency penalties on every fresh connection attempt.

### Layer 4 vs. Layer 7 Routing
* **Layer 4 (Transport Level)**:
  * *Pros*: Incredibly fast throughput with minimal CPU overhead, because the load balancer does not disassemble or decrypt application layer packets.
  * *Cons*: Complete lack of application-level intelligence. It cannot route traffic based on request path prefixes, session state cookies, or HTTP headers. It also cannot perform security operations like HTTP header inspection or WAF sanitization.
* **Layer 7 (Application Level)**:
  * *Pros*: Supports path-based routing, header manipulation, SSL termination, and rate-limiting.
  * *Cons*: Requires massive CPU and memory pools to constantly execute TCP termination, SSL/TLS decryption, and JSON payload parsing. This makes L7 nodes highly vulnerable to CPU exhaustion under high-throughput denial-of-service (DDoS) floods.

### SSL/TLS Termination Architectures
* **Edge Termination**: Decrypting HTTPS at the edge load balancer and forwarding raw, unencrypted HTTP traffic inside the private cloud network.
  * *Pros*: Frees internal application microservice nodes from consuming CPU cycles on encryption mathematics.
  * *Cons*: Internal lateral traffic is vulnerable to inspection if an attacker breaches the private virtual private cloud (VPC) network boundary.

---

## 3. Tier-1 Production Case Studies

### Netflix Open Connect (Custom CDN Appliance)
Rather than relying purely on third-party commercial CDNs, Netflix developed **Open Connect**. They build custom physical server appliances (Open Connect Appliances, or OCAs) loaded with hundreds of terabytes of flash memory. Netflix physically ships these appliances to local Internet Service Providers (ISPs) worldwide to place them directly inside the ISP's regional datacenters. During off-peak overnight hours, Netflix proactively copies popular video files onto these local OCAs. This ensures that during peak evening streaming hours, over 95% of video traffic bypasses the public internet completely and is served directly from the user's local ISP loop.

### Amazon Route 53 & CloudFront Origin Shielding
Under major flash sales, Amazon protects its database origins from getting overwhelmed by cache misses through **CloudFront Origin Shielding**. When a localized regional CDN edge node suffers a cache miss, it does not query the central Amazon database origin directly. Instead, it routes through a highly available intermediary caching tier called the **Origin Shield**. The Origin Shield consolidates duplicate cache-miss queries from adjacent regional edges into a single aggregated origin request. This eliminates redundant database lookups, preventing the database from collapsing under a "Cache Stampede."

### Uber Anycast Edge DNS Routing
Uber utilizes a global Anycast DNS network combined with regional load balancers to route mobile application traffic. Since driver coordinate updates and ride requests require low-latency WebSocket connections, Uber routes connection traffic to the closest regional PoP. Anycast BGP routing ensures that even if an entire regional datacenter drops offline, the surrounding internet routers automatically recalculate the path costs and redirect live driver traffic to the next closest active regional gateway within seconds.

---

## 4. Memory Anchor & Analogies

### The Global Blueprint Courier Analogy
Imagine you are trying to obtain a highly classified blueprint from a global corporation based in New York.

```
[Customer] (Client)
   │
   ├── (1. Check Host Address) ───────> [Master Registry Office] (DNS Resolver)
   │                                            │
   │                                    (Gives Local Branch Address)
   │                                            v
   ├── (2. Try Local Warehouse) ──────> [Local Neighborhood Depot] (CDN Edge)
   │                                            │  (Cache Hit: Return Copy)
   │                                            v  (Cache Miss: Call NY Office)
   ├── (3. Travel to NY Branch) ──────> [Private High-Security Gate] (L7 Reverse Proxy)
   │                                            │  (Decrypt Secret Briefcase Code)
   │                                            v
   └── (4. Direct to Counter) ────────> [Intake Desk Coordinator] (Load Balancer)
                                                │
                                       ┌────────┴────────┐
                                       ▼                 ▼
                                 [Office Desk A]   [Office Desk B] (Backend App Nodes)
```

1. **DNS (The Registry Office)**: You do not know where the corporation's building is. You ask your local town registry clerk (Recursive Resolver). The local clerk doesn't know, so they call the international registry, which directs them to the New York state registry, which finally yields the exact physical address of the firm.
2. **CDN (The Local Depot)**: Before traveling to NY, you check a local neighborhood depot (CDN). It turns out the corporation pre-shipped identical copies of standard blueprints to this local warehouse. You grab a copy in 5 minutes (Cache Hit).
3. **Reverse Proxy (The Security Guard)**: For highly customized, secure requests, you must go to the New York building. At the entrance, you meet a security guard (Reverse Proxy). He shields the staff inside from public view, screens you for weapons (WAF inspection), and verifies your security badge.
4. **SSL/TLS Handshake (The Secret Suitcase)**: The security guard hands you a secure lockbox. You negotiate a temporary 3-digit combination (Symmetric Session Key) using an exchange of physical keys (Asymmetric Handshake). All subsequent documents you pass back and forth are locked inside this suitcase.
5. **Load Balancer (The Intake Coordinator)**: Once inside the lobby, an intake coordinator (Load Balancer) assesses the length of the lines at the internal offices and directs you to Desk B (Application Server) because Desk A is currently backlogged.

---

## 5. Runtime Deep Dive (Language Architecture)

When routing massive connection traffic at the edge gateway layer, the execution thread pool model of your runtime directly dictates your scalability limits.

### Node.js (Asynchronous Kernel Multiplexing)
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

## 6. Infrastructure Blueprint (AWS, Docker, & K8s)

```
[Client Request] ────> [AWS Route 53] ────> [CloudFront CDN] ────> [AWS ALB] ────> [K8s Ingress Pods]
```

### Production AWS Architecture Mapping
1. **Route 53**: Resolves global DNS queries utilizing Latency-Based Routing (LBR) policies.
2. **AWS CloudFront**: Standard CDN edge caching static image and media assets at global edge locations.
3. **AWS Shield & WAF**: Attached directly to CloudFront to inspect payloads, block SQL Injection patterns, and absorb volumetric L3/L4 DDoS attacks.
4. **AWS Application Load Balancer (ALB)**: Acts as the entry point into the virtual private cloud (VPC), managing SSL certificate decryption and routing traffic to the Kubernetes cluster based on request paths.

### Docker Compose Local Sandbox Environment
This configuration spins up a local sandbox environment featuring an Nginx reverse proxy acting as an SSL-terminating L7 load balancer in front of two backend application nodes.

```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx-ingress:
    image: nginx:alpine
    container_name: nginx_l7_load_balancer
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:read-only
      - ./certs:/etc/nginx/certs:read-only
    depends_on:
      - app-node-1
      - app-node-2
    networks:
      - internal-net

  app-node-1:
    image: node:18-alpine
    container_name: backend_node_1
    command: >
      node -e "
        const http = require('http');
        http.createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ node: 1, message: 'Hello from Node 1' }));
        }).listen(8080);
      "
    networks:
      - internal-net

  app-node-2:
    image: node:18-alpine
    container_name: backend_node_2
    command: >
      node -e "
        const http = require('http');
        http.createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ node: 2, message: 'Hello from Node 2' }));
        }).listen(8080);
      "
    networks:
      - internal-net

networks:
  internal-net:
    driver: bridge
```

### Nginx SSL Termination & Upstream Load Balancing Configuration

```nginx
# nginx.conf
events { 
    worker_connections 2048; # Maximum active descriptors per worker process
}

http {
    # Define the group of upstream application servers to balance across
    upstream private_backends {
        server app-node-1:8080 max_fails=3 fail_timeout=10s;
        server app-node-2:8080 max_fails=3 fail_timeout=10s;
    }

    # Redirect all plain HTTP traffic to secure HTTPS port
    server {
        listen 80;
        server_name api.hotstar.com;
        return 301 https://$host$request_uri;
    }

    # Secure HTTPS Ingress Server
    server {
        listen 443 ssl;
        server_name api.hotstar.com;

        # SSL Certificates
        ssl_certificate /etc/nginx/certs/fullchain.pem;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;

        # Enforce modern secure protocols & ciphers
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Keep-alive settings for downstream client connections
        keepalive_timeout 65;
        keepalive_requests 500;

        location /homefeed {
            proxy_pass http://private_backends;
            
            # Preserve original headers
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # HTTP Keep-alive connection pooling back to private nodes
            proxy_http_version 1.1;
            proxy_set_header Connection "";
        }
    }
}
```

### Kubernetes Ingress Controller Configuration
This manifest routes incoming external traffic to the private, internal Kubernetes microservices running inside the cluster.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: dynamic-api-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "15"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "30"
    nginx.ingress.kubernetes.io/upstream-fail-timeout: "10"
spec:
  tls:
  - hosts:
    - api.hotstar.com
    secretName: edge-tls-certificate-secret
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
*All architectural principles, request flows, and protocol designs mapped in this master study guide are fully grounded in the provided system design resources and standard distributed systems engineering frameworks.*
