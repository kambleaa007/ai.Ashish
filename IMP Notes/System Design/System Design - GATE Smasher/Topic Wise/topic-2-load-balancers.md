# Topic 2 Master Study Guide: Load Balancers (L4 vs. L7, Routing, Nginx vs. HAProxy)

## 1. WHAT, WHY, WHERE, HOW (Technical Mechanics)
A **Load Balancer (LB)** acts as a reverse proxy traffic cop that sits in front of your server fleets to distribute incoming network requests across multiple healthy application nodes. 

### Why Use Load Balancers?
* **High Availability**: Prevents single points of failure (SPoFs). If one server crashes, the load balancer routes requests around it.
* **Scalability**: Enables horizontal scaling (scaling out) by allowing you to add more servers seamlessly.
* **Security & SSL Offloading**: Acts as a shield protecting the private backend IP range, while optionally decrypting SSL certificates at the edge.

### Where Does It Sit?
* Between the Client (or CDN) and the Web Server/API Gateway layer.
* Between the Web Server layer and the Internal Application Microservices layer.
* Between the Application services and the Database clusters.

### Layer 4 (L4) vs. Layer 7 (L7) Load Balancing
* **Layer 4 Routing**: Operates at the **Transport Layer** (TCP/UDP). It does not inspect the application payload. It reads purely the IP packet headers and TCP ports to make routing decisions. Because it never decrypts or parses HTTP payloads, it is incredibly fast and has a minimal CPU footprint.
* **Layer 7 Routing**: Operates at the **Application Layer** (HTTP/HTTPS/gRPC). It disassembles the incoming TCP connections, decrypts the SSL/TLS session, and fully inspects the HTTP headers, query parameters, cookies, and JSON payloads. This enables smart routing (e.g., routing `/reels` requests to video pods and `/payment` to payment pods).

### Routing Algorithms
* **Round Robin**: Routes requests sequentially (Server A -> B -> C). **Weighted Round Robin** adds capacity coefficients (Server A gets 3 requests, Server B gets 1 request).
* **Least Connections**: Evaluates the active connection pool of each server and routes the request to the server with the lowest current workload. Ideal for long-lived connection environments (like WebSockets).
* **IP Hash**: Hashes the client's IP address to map them to a specific server. This maintains simple session persistence, but can create server hotspots if a major office network behind a single NAT gateway connects simultaneously.

---

## 2. TRADEOFFS (Advantages & Disadvantages under High Load)

| Metric | Layer 4 Load Balancing | Layer 7 Load Balancing |
| :--- | :--- | :--- |
| **Throughput / Speed** | Extremely High (Millions of packets/sec per node). No payload parsing. | Moderately High (Limited by CPU parsing of text strings/headers). |
| **CPU Overhead** | Very Low. Direct socket pipeline. | High. Must perform SSL termination and parse HTTP structures. |
| **Routing Granularity** | Low. Restricted to IP and Port level only. | Extremely High. Path-based, header-based, and cookie-based routing. |
| **Security Inspection** | Low. Blind to payload vulnerabilities (e.g., SQL injections). | High. Can analyze payloads to block malicious injection scripts at the firewall edge. |

---

## 3. PRODUCTION EXAMPLES
* **Amazon**: Employs an architecture using a hybrid two-tier load balancing system. At the outer edge, AWS **Network Load Balancers (NLBs - L4)** handle millions of raw concurrent TCP requests with microsecond latency. These NLBs hand off clean connections directly to fleets of **Application Load Balancers (ALBs - L7)** which handle SSL termination, check routing paths, and parse cookies for targeted user routing.
* **Netflix**: Uses L7 proxies extensively to perform dynamic canary deployments. When rolling out a new catalog service version, their L7 load balancers route exactly 1% of incoming user requests (identified via HTTP headers) to the new "canary" microservice pool while routing 99% to the stable production pool.

---

## 4. MEMORY ANCHORS

### The 20-Year Non-Tech Analogy: The Grand Airport Terminal
Imagine a massive airport terminal dealing with thousands of passengers arriving every minute.
* **Layer 4 Load Balancer**: A traffic controller standing outside on the tarmac. He sees buses (TCP packets) arriving. Without looking at who is inside the buses or what they are carrying, he quickly directs Bus 1 to Terminal Gate A, Bus 2 to Terminal Gate B, and Bus 3 to Terminal Gate C based purely on gate capacities.
* **Layer 7 Load Balancer**: A check-in supervisor standing inside the doors. She opens each passenger's passport (decrypts SSL), inspects their tickets (HTTP headers), and routes first-class flyers to private lounges, international flyers to custom terminals, and domestic flyers to domestic gates. It takes longer per passenger, but is highly organized.

### ASCII Architecture Diagram
```
                          [ Client Traffic ]
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
            [ L4 Load Balancer ]        [ L7 Load Balancer ]
             (TCP/UDP Port 80)          (HTTP Path/SSL/Cookies)
                     │                           │
              ┌──────┴──────┐             ┌──────┴──────┐
              ▼             ▼             ▼             ▼
         [Server A]    [Server B]    [Video Pod]   [Payment Pod]
         (Round Robin Routing)       (Routes based on URL /video)
```

---

## 5. LANGUAGES

### Node.js / TypeScript (Asynchronous Event Loop Routing Proxy)
Node.js acts as an efficient lightweight proxy because of its non-blocking I/O model. It can sit on port 80/443, stream incoming TCP streams, and redirect them to backend servers without getting blocked on active client connections.
```typescript
import http from 'http';
import httpProxy from 'http-proxy'; // npm install http-proxy

const proxy = httpProxy.createProxyServer({});
const servers = ['http://backend1:8080', 'http://backend2:8080'];
let current = 0;

// Simple Round Robin In-Memory Proxy Load Balancer
const server = http.createServer((req, res) => {
    const target = servers[current];
    current = (current + 1) % servers.length; // Rotate target
    
    // Asynchronously pipes client socket directly to backend node
    proxy.web(req, res, { target });
});

server.listen(80);
```

### Java 25+ (Multi-Threaded Proxy Per Task utilizing Project Loom)
In modern Java architecture, every proxy task is isolated inside an ultra-lightweight Virtual Thread. This allows the load balancer or API Gateway to process thousands of blocking downstream API proxy calls safely without exhausting system threads.
```java
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class VirtualThreadLoadBalancer {
    private static final String[] UPSTREAM_SERVERS = {"backend1", "backend2"};
    private static int currentServer = 0;

    public static void main(String[] args) throws Exception {
        ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
        try (ServerSocket serverSocket = new ServerSocket(80)) {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                executor.submit(() -> handleClient(clientSocket)); // Managed by JVM Virtual Thread
            }
        }
    }

    private static synchronized String getUpstream() {
        String target = UPSTREAM_SERVERS[currentServer];
        currentServer = (currentServer + 1) % UPSTREAM_SERVERS.length;
        return target;
    }

    private static void handleClient(Socket clientSocket) {
        try {
            String upstreamHost = getUpstream();
            try (Socket upstreamSocket = new Socket(upstreamHost, 8080)) {
                // Bi-directional blocking stream piping (safe on Project Loom Virtual Threads)
                Thread.startVirtualThread(() -> pipe(clientSocket, upstreamSocket));
                pipe(upstreamSocket, clientSocket);
            }
        } catch (Exception ignored) {}
    }

    private static void pipe(Socket src, Socket dest) {
        try (InputStream in = src.getInputStream(); OutputStream out = dest.getOutputStream()) {
            byte[] buffer = new byte[8192];
            int read;
            while ((read = in.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
        } catch (Exception ignored) {}
    }
}
```

---

## 6. INFRASTRUCTURE

### Production Nginx Load Balancer Configuration
Configure Nginx as a Layer 7 Reverse Proxy with weighted round-robin and active health checks:
```nginx
# nginx.conf
events { worker_connections 4096; }

http {
    upstream backend_servers {
        # Weighted Round Robin
        server backend1.production.svc.cluster.local:8080 weight=3 max_fails=2 fail_timeout=10s;
        server backend2.production.svc.cluster.local:8080 weight=1 max_fails=2 fail_timeout=10s;
        
        # Backup server if all upstream nodes fail
        server backup-node.production.svc.cluster.local:8080 backup;
    }

    server {
        listen 80;
        server_name api.company.com;

        location / {
            proxy_pass http://backend_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_connect_timeout 5s;
            proxy_read_timeout 60s;
        }
    }
}
```

### Kubernetes Pod, Service, and Ingress Fleet Config
Route traffic directly from the edge of the Kubernetes cluster down to app deployment replicas:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service-deployment
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
    spec:
      containers:
      - name: api-container
        image: nginx:alpine
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: api-loadbalancer-service
  namespace: production
spec:
  type: ClusterIP
  selector:
    app: api-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-loadbalancer
  namespace: production
  annotations:
    kubernetes.io/ingress.class: "nginx"
spec:
  rules:
  - host: api.company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-loadbalancer-service
            port:
              number: 80
```
