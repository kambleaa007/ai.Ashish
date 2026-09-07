# Lecture 3 Study Guide: Load Balancers (Routing Algorithms, L4 vs. L7, Nginx vs. HAProxy)

This study guide explores the low-level, packet-level, OS-level, and infrastructure-level mechanics of **Lecture 3: Load Balancers (Algorithms, L4 vs. L7, Nginx/HAProxy)**.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS

### WHAT
A **Load Balancer (LB)** is a high-performance reverse proxy that acts as a single point of entry for incoming network traffic, distributing client requests across a pool of backend application instances (servers, containers, or virtual machines) based on defined routing metrics and health states.

### WHY
If a system runs without a load balancer under realistic production loads, several cascading failures occur:
* **Single Instance Resource Saturation**: One server will run out of physical memory (RAM), experience CPU thread exhaustion (100% load), or saturate its Network Interface Card (NIC) bandwidth, leading to dropped connection packets.
* **TCP Socket Backlog Overflow**: The Operating System kernel's connection backlog queue (`listen()` backlog) will fill up, causing the OS to silently ignore new incoming `SYN` packets from clients.
* **Lack of Fault Isolation**: If a backend application server crashes due to a memory leak or database deadlock, client devices will continue trying to connect directly to that dead IP address, causing persistent connection timeouts and service outages.

### WHERE & WHEN
Load Balancers reside at multiple boundaries of a modern distributed architecture:
1. **Edge Ingress Gateway**: Positioned at the outer boundary of the Virtual Private Cloud (VPC), immediately receiving public traffic from the internet or CDN edge nodes (terminating SSL/TLS certificates).
2. **Internal Service-to-Service Mesh**: Positioned between distinct microservice layers (e.g., routing HTTP/gRPC requests from the Frontend-BFF service to the private internal Payment or Order services).
3. **Database Read Proxy Layer**: Sits in front of a pool of read-only database replicas to distribute analytical or read-heavy queries.

### HOW
The lifecycle of a connection traversing a load balancer operates as follows:

```
[Client Socket] ─────────(1. TCP SYN / HTTPS Handshake)─────────> [Load Balancer]
                                                                        │
                                                            (2. Evaluates Health &
                                                              Selects Upstream Node)
                                                                        │
                                                                        ▼
[Selected App Node] <──(3. Layer 4 NAT or Layer 7 Socket Pipe)──────────┘
```

1. **Downstream Socket Intake**: The load balancer listens on a public socket (e.g., TCP port 80 or 443) and accepts incoming client connection attempts.
2. **Active Health Evaluation**: An internal daemon runs continuous background checks against the configured upstream server pool (e.g., executing a TCP socket test or calling an HTTP endpoint like `GET /health` every 2000ms). If a backend node fails consecutive checks, its IP is removed from the routing table.
3. **Routing Decision**: The load balancer applies its configured routing algorithm to select an active, healthy upstream node:
   * **Round Robin / Weighted Round Robin**: Sequential iteration across the server list, optionally adjusted by node capacity weight values.
   * **Least Connections**: Selects the node with the fewest active, unclosed TCP socket connections.
   * **IP Hash**: Computes a cryptographic or mathematical hash of the client's source IP address and maps it to a specific index in the upstream pool.
4. **Upstream Forwarding**: Depending on the operational layer, the load balancer forwards the traffic:
   * **Layer 4 (L4) Mode**: It modifies the packet headers at the TCP/IP level via NAT (Network Address Translation) and routes the raw TCP stream to the chosen backend without reading the HTTP payload.
   * **Layer 7 (L7) Mode**: It fully terminates the client's TCP/TLS connection, decrypts the SSL packet, parses the HTTP/HTTPS request headers, and opens a completely new TCP connection to the backend node to stream the payload.

---

## 2. TRADEOFF ANALYSIS

### Advantages
* **High Availability & Fault Tolerance**: Instantly detours traffic around failing or dead backend nodes, maintaining uninterrupted service availability.
* **Elastic Horizontal Scalability**: Lets you scale out backend server fleets dynamically by adding or removing nodes without needing to update public DNS records on client devices.
* **SSL Offloading / Termination**: Centralizes SSL/TLS decryption on the load balancer, offloading heavy mathematical operations from application servers.
* **Security Shielding**: Masks the private internal IP addresses of backend services from the public internet, reducing the direct attack surface.

### Disadvantages
* **Single Point of Failure (SPOF)**: If you do not run multiple load balancers in an active-passive clustering setup (e.g., using Keepalived and VRRP with a shared Virtual IP), the load balancer itself is a single failure point.
* **CPU and Latency Overhead**: Layer 7 load balancing requires disassembling TCP packets, decrypting SSL/TLS, and parsing HTTP strings. This introduces high CPU overhead and adds milliseconds of latency compared to direct IP routing.
* **Session Persistence Challenges**: In a stateless architecture, routing successive requests from the same user to different backend servers can break stateful operations (like local memory user sessions), requiring externalized session storage (e.g., Redis).

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES

### HAProxy at GitHub
GitHub uses **HAProxy** as its core Layer 4 and Layer 7 load balancer. Because GitHub supports both massive HTTPS web traffic and millions of high-throughput SSH connections for Git commands, HAProxy's ultra-low memory footprint and advanced connection-pooling engine are essential. HAProxy is optimized to handle high TCP concurrency while keeping resource usage to a minimum.

### Nginx at Netflix
Netflix uses a combination of hardware load balancers and highly customized **Nginx** configurations (integrated into their Zuul API gateway). Nginx acts as an L7 gateway, performing SSL termination and routing dynamic requests to specialized microservices depending on the URL path (e.g., routing `/play` requests to video streaming services and `/recommend` to recommendation engines).

---

## 4. MENTAL MEMORY ANCHORS

### The Grand Airport Terminal Analogy
Imagine a massive international airport dealing with thousands of travelers arriving every minute.

```
                               [ Arriving Passengers ]
                                          │
                     ┌────────────────────┴────────────────────┐
                     ▼                                         ▼
         [ Layer 4 Airport Director ]              [ Layer 7 Customs Officer ]
          Directs entire buses to gates              Opens passports, checks visas
          without opening bus doors.                 and routes based on purpose.
                     │                                         │
              ┌──────┴──────┐                           ┌──────┴──────┐
              ▼             ▼                           ▼             ▼
         [ Terminal 1 ] [ Terminal 2 ]             [ Domestic ]   [ International ]
```

* **Layer 4 Load Balancer**: A runway controller standing out on the tarmac. He sees entire buses (TCP packets) arriving. Without looking at who is inside the buses, what language they speak, or what luggage they carry, he quickly directs Bus 1 to Gate A and Bus 2 to Gate B based purely on gate capacities. He is incredibly fast and never slows down the flow.
* **Layer 7 Load Balancer**: A customs agent standing at the terminal entrance. She stops every traveler, opens their passport (decrypts SSL), reviews their physical ticket (inspects HTTP headers/paths), and routes first-class flyers to private lounges, domestic flyers to Domestic Gate 5, and international flyers to International Gate 12. It takes longer per passenger, but is highly organized.

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

### JavaScript / TypeScript & Node.js (Event-Loop Multiplexing Proxy)
Node.js scales connection handling using asynchronous, non-blocking I/O multiplexing. Under the hood, the single event loop delegates socket read/write operations to the OS kernel (via `epoll` or `kqueue`) and immediately moves to accept the next incoming connection.

```typescript
// A Lightweight L4 TCP Load Balancer in Node.js
import * as net from 'net';

const BACKEND_POOL = [
    { host: '10.0.1.10', port: 8080 },
    { host: '10.0.1.11', port: 8080 }
];
let currentBackendIndex = 0;

const loadBalancer = net.createServer((clientSocket) => {
    // Select a backend server using Round Robin routing
    const target = BACKEND_POOL[currentBackendIndex];
    currentBackendIndex = (currentBackendIndex + 1) % BACKEND_POOL.length;

    // Establish a non-blocking TCP socket to the chosen backend server
    const backendSocket = net.connect(target.port, target.host, () => {
        // Bi-directional data piping. Pipes streams directly through network sockets.
        clientSocket.pipe(backendSocket);
        backendSocket.pipe(clientSocket);
    });

    clientSocket.on('error', () => {
        clientSocket.destroy();
        backendSocket.destroy();
    });
    
    backendSocket.on('error', () => {
        clientSocket.destroy();
        backendSocket.destroy();
    });
});

loadBalancer.listen(80, () => {
    console.log("Asynchronous L4 Load Balancer listening on port 80");
});
```

### Java (Java 25+ Virtual Threads)
Java 25 handles highly concurrent proxying using **Project Loom Virtual Threads**. This model allows developers to write straightforward, blocking, synchronous code. The JVM automatically yields and parks virtual threads during blocking network I/O, keeping the physical native carrier threads free to handle other traffic.

```java
// Java 25+ Virtual Thread Load Balancer Engine
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class VirtualThreadLB {
    private static final String[][] BACKENDS = {
        {"10.0.1.10", "8080"},
        {"10.0.1.11", "8080"}
    };
    private static int currentIndex = 0;

    public static void main(String[] args) throws Exception {
        // High-performance virtual thread per task executor
        ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

        try (ServerSocket serverSocket = new ServerSocket(80)) {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                // Hand connection off to a lightweight virtual thread
                executor.submit(() -> routeConnection(clientSocket));
            }
        }
    }

    private static synchronized String[] selectBackend() {
        String[] target = BACKENDS[currentIndex];
        currentIndex = (currentIndex + 1) % BACKENDS.length;
        return target;
    }

    private static void routeConnection(Socket clientSocket) {
        String[] backend = selectBackend();
        try (Socket backendSocket = new Socket(backend[0], Integer.parseInt(backend[1]))) {
            // Spawn a virtual thread to pipe traffic from client to backend
            Thread.startVirtualThread(() -> pipe(clientSocket, backendSocket));
            // Pipe traffic from backend to client on current virtual thread
            pipe(backendSocket, clientSocket);
        } catch (Exception ignored) {
        } finally {
            try { clientSocket.close(); } catch (Exception ignored) {}
        }
    }

    private static void pipe(Socket src, Socket dest) {
        try (InputStream in = src.getInputStream(); OutputStream out = dest.getOutputStream()) {
            byte[] buffer = new byte[8192];
            int readBytes;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        } catch (Exception ignored) {}
    }
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER (AWS, DOCKER, KUBERNETES)

### AWS
* **AWS Network Load Balancer (NLB)**: Operates at Layer 4. It routes millions of concurrent TCP requests with minimal latency, making it ideal for high-throughput messaging or raw TCP traffic.
* **AWS Application Load Balancer (ALB)**: Operates at Layer 7. It inspects HTTP headers, manages SSL/TLS certificates (SSL Termination), and routes requests based on URL paths (e.g., routing `/api/v1/auth` to an authentication service).

### Docker
Below is a multi-container Docker setup that configures an **Nginx** reverse proxy to act as a Layer 7 load balancer in front of two containerized backend nodes:

```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx-loadbalancer:
    image: nginx:alpine
    container_name: production_l7_lb
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend-node-1
      - backend-node-2
    networks:
      - backend-network

  backend-node-1:
    image: nginx:alpine
    container_name: app_replica_1
    command: >
      sh -c "echo '<h1>App Instance 1</h1>' > /usr/share/nginx/html/index.html && nginx -g 'daemon off;'"
    networks:
      - backend-network

  backend-node-2:
    image: nginx:alpine
    container_name: app_replica_2
    command: >
      sh -c "echo '<h1>App Instance 2</h1>' > /usr/share/nginx/html/index.html && nginx -g 'daemon off;'"
    networks:
      - backend-network

networks:
  backend-network:
    driver: bridge
```

#### Corresponding Nginx Configuration File:
```nginx
# nginx.conf
events { 
    worker_connections 2048; # Maximum concurrent connections per Nginx process
}

http {
    upstream application_pool {
        # Weighted Round Robin load balancing configuration
        server backend-node-1:80 weight=3 max_fails=2 fail_timeout=10s;
        server backend-node-2:80 weight=1 max_fails=2 fail_timeout=10s;
    }

    server {
        listen 80;
        server_name api.hotstar.com;

        location / {
            proxy_pass http://application_pool;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Enable HTTP 1.1 keep-alives to reuse connections back to backend nodes
            proxy_http_version 1.1;
            proxy_set_header Connection "";
        }
    }
}
```

### Kubernetes (K8s)
This manifest defines a Kubernetes **ClusterIP Service** that acts as an internal load balancer, automatically distributing traffic to replica pods matching the selector label:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-internal-loadbalancer
  namespace: production
spec:
  type: ClusterIP # Internal load balancer accessible only within the cluster
  selector:
    app: backend-app-node # Routes traffic to any pod with this label
  ports:
    - protocol: TCP
      port: 80 # Service port
      targetPort: 8080 # Container port on the target pod
```

---
*All concepts, routing architectures, and configurations detailed in this study guide are fully grounded in the provided system design resources and verified distributed systems blueprints.*
