# Lecture 9 Master Study Guide: What are APIs & API Gateways

This study guide explores the critical mechanics of Application Programming Interfaces (APIs) and API Gateways, detailing how they act as structural contracts and secure intermediaries between frontend clients and distributed microservice backends.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS

### WHAT: Technical Definition
An **API (Application Programming Interface)** is a structured software intermediary and formal communication contract that allows two distinct software applications or subsystems to securely interact and exchange data and commands. An **API Gateway** acts as a centralized reverse proxy entry-point overlay that intercepts all incoming client API requests, orchestrating service routing, protocol translation, request throttling, logging, and security verification (such as JWT/OAuth token validation) before forwarding requests to private microservice fleets.

### WHY: The Engineering Problem Solved
Under enterprise load, exposing individual internal microservices directly to the public internet introduces severe engineering hazards:
* **Massive Attack Surface**: Every microservice must expose public IP addresses, manage public TLS certificates, and handle authentication logic individually.
* **Tight Client-Backend Coupling**: Client apps must maintain the physical IP addresses and domain endpoints of dozens of backend microservices. If a microservice is refactored, split, or renamed, the client application code breaks.
* **Network Protocol Incompatibilities**: Modern internal microservices often communicate via high-performance binary protocols (like gRPC/HTTP/2) which web browsers and unstable mobile networks cannot native-route easily.
* **Performance Degradation**: Clients are forced to execute multiple network round-trips to aggregate data from different services (e.g., getting user profile, catalog, and checkout status as separate requests), multiplying mobile network latency.

### WHERE & WHEN: Stack Layer
The API contract lives at the logical interface boundary between the Frontend Client (mobile app, web app, or SDK) and the Backend Server. The API Gateway lives as a critical gateway overlay in the edge network layer, sitting directly behind the Edge Ingress Load Balancers (L4/L7) and immediately in front of the private Virtual Private Cloud (VPC) microservices mesh.

### HOW: Step-by-Step Request Lifecycle
1. **Request Interception**: A client (such as a Flutter mobile app or browser) makes an API call (e.g. `GET /v1/catalog`).
2. **Ingress Validation**: The request hits the API Gateway. The Gateway immediately executes cross-cutting tasks: it validates the client's signature/JWT, checks the IP/User rate-limiting quotas using an in-memory Redis cluster, and filters for malformed parameters or header vulnerabilities.
3. **Dynamic Routing**: The Gateway matches the requested path against its routing tables and translates the external client-facing API protocol (like HTTPS REST/JSON) into the internal high-performance microservices protocol (like gRPC/HTTP2 or internal AMQP messages).
4. **Upstream Dispatching**: The Gateway forwards the translated payload to the target microservice.
5. **Response Transformation**: Once the microservice returns its payload, the Gateway aggregates the results (if composing multiple upstream services), filters out restricted fields, strips internal tracking headers, and streams a clean, standardized HTTP response back to the client.

---

## 2. TRADEOFF ANALYSIS

### Advantages
* **Decoupled Architecture**: Completely isolates client applications from changing backend microservice structures or service partition boundaries.
* **Centralized Security Enforcement**: Consolidates SSL/TLS termination, JWT signature validation, and CORS checking in a single optimized gateway layer, preventing microservice teams from duplicating code or security errors.
* **Aggregated Responses**: Reduces mobile network latency by allowing the Gateway to fetch data from multiple microservices concurrently and return a single, unified response payload to the client.
* **Traffic Control & Rate Limiting**: Buffers internal application servers from volumetric floods, scraper bots, and brute-force attacks by rejecting invalid or excessive traffic at the outermost edge.

### Disadvantages
* **Single Point of Failure (SPOF)**: If the API Gateway cluster falls offline or experiences a configuration mismatch, all client communications with the entire backend ecosystem are instantly broken.
* **Added Network Latency**: Every request passing through the Gateway experiences an additional network hop, payload deserialization/reserialization, and routing evaluation step, adding critical milliseconds to the end-to-end request loop.
* **Operational Complexity**: Managing dynamic routing rules, API versioning splits (e.g., deprecating `/v1` while supporting `/v2`), and SSL/TLS key rotations at the gateway layer introduces high maintenance overhead.

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES

### Zomato / Swiggy / Blinkit API Gateway Integration
When you open Swiggy or Blinkit to order groceries, your mobile client contacts a high-throughput API Gateway (typically built on **Kong** or **AWS API Gateway**). The Gateway checks your JWT session, determines if your coordinates are rate-limited, and routes your search query `/search?q=milk` directly to a high-speed Elasticsearch Search microservice. If you then complete an order, the Gateway redirects `/checkout` requests to a separate payment orchestrator while triggering asynchronous dispatch notifications through Event Brokers.

### Netflix API Gateway (Zuul)
Netflix utilizes its custom edge gateway, **Zuul**, to process billions of requests daily. Zuul manages dynamic routing, traffic scrubbing, and real-time stress testing by injecting faults (chaos monkey testing) directly at the ingress boundary to ensure backend microservices fail gracefully under simulated load.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS

### The Luxury Restaurant Maitre D'
Think of the API and API Gateway as a **High-End Luxury Restaurant Maitre D' (or Lobby Concierge)**.
* **The API (The Waiter & Menu)**: The menu tells you exactly what dishes are available to order (The Contract/Endpoints). You don't walk into the hot kitchen to grab raw ingredients; you sit down and place a structured order with the waiter (The API) who carries your request to the chefs and returns your plated meal.
* **The API Gateway (The Maitre D')**: Standing at the front door of the restaurant is the Maitre D' (The API Gateway). Before you can even talk to a waiter, he checks your reservation status (Authentication), ensures you aren't trying to walk in with 500 fake guests (Rate Limiting), directs you to the seafood section of the restaurant instead of the steakhouse (Routing), and translates your foreign language order for the local kitchen staff (Protocol Translation).

### ASCII Architecture Diagram
```
[ Mobile / Web Client ] (REST/JSON over HTTPS)
           │
           ▼ (TCP Connection / TLS Handshake)
   [ API GATEWAY ] (Edge Gateway: Kong / Nginx / AWS APIGW)
           │
           ├─► Auth Check (Verify JWT signature & scopes)
           ├─► Rate Limiter (Sliding Window counter in Redis)
           └─► Path Router (Map '/v1/catalog' -> catalog-service)
           │
           ▼ (Internal Secure VPC Network: gRPC / Protobuf / HTTP/2)
   ┌───────┼───────┐
   ▼       ▼       ▼
[Auth]  [Catalog] [Order] (Private Backend Microservices)
```

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

### Node.js (Asynchronous Streaming Gateway Proxy)
Node.js's event-driven, single-threaded model makes it an excellent choice for lightweight, high-throughput gateway proxies. By utilizing streaming piping, we can forward raw buffers from incoming sockets to upstream servers without holding entire payloads in RAM, avoiding heap exhaustion.

```typescript
// Node.js Express & Http-Proxy API Gateway
import express from 'express';
import httpProxy from 'http-proxy';
import jwt from 'jsonwebtoken';

const app = express();
const proxy = httpProxy.createProxyServer({});
const JWT_SECRET = "production_super_secret_key_1024";

// Simplified Rate Limiter Cache
const rateLimits: Record<string, number> = {};

app.use((req, res, next) => {
    // 1. Rate Limiting Check
    const clientIp = req.ip || "unknown";
    const now = Math.floor(Date.now() / 1000);
    const windowKey = `${clientIp}:${now}`;
    
    rateLimits[windowKey] = (rateLimits[windowKey] || 0) + 1;
    if (rateLimits[windowKey] > 100) { // Limit: 100 req/sec
        return res.status(429).send("Too Many Requests (HTTP 429)");
    }
    next();
});

app.use('/api/v1/catalog', (req, res) => {
    // 2. Authentication Verification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, JWT_SECRET);
        // 3. Forward Authorized Traffic to private backend catalog node
        proxy.web(req, res, { target: 'http://catalog-service.internal:8080' });
    } catch (err) {
        return res.status(403).send("Forbidden: Invalid Token");
    }
});

app.listen(80, () => console.log("API Gateway running on port 80"));
```

### Java 25+ (Imperative API Gateway utilizing Project Loom)
Using Java 25, we can write straightforward, easily debuggable imperative synchronous gateway code. Every proxy/auth task is processed inside an independent Virtual Thread, yielding high-performance execution without complex non-blocking reactive chains.

```java
// Java 25+ Virtual Thread Gateway Proxy
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.Executors;

public class ProjectLoomApiGateway {

    public static void main(String[] args) throws Exception {
        // Run HTTP Server using Virtual Thread Per Task Executor
        HttpServer server = HttpServer.create(new InetSocketAddress(80), 0);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        
        server.createContext("/api/v1/catalog", new GatewayHandler());
        server.start();
        System.out.println("Loom API Gateway started on port 80");
    }

    static class GatewayHandler implements HttpHandler {
        private final HttpClient client = HttpClient.newBuilder()
            .executor(Executors.newVirtualThreadPerTaskExecutor())
            .build();

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // 1. Auth Validation
            String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                exchange.sendResponseHeaders(401, -1); // 401 Unauthorized
                return;
            }

            // 2. Simple Routing & Proxying via Virtual Thread
            try {
                HttpRequest proxyRequest = HttpRequest.newBuilder()
                    .uri(new URI("http://catalog-service.internal:8080/v1/items"))
                    .GET()
                    .build();

                // Blocks the lightweight virtual thread, NOT the physical carrier thread
                HttpResponse<byte[]> proxyResponse = client.send(
                    proxyRequest, 
                    HttpResponse.BodyHandlers.ofByteArray()
                );

                exchange.sendResponseHeaders(proxyResponse.statusCode(), proxyResponse.body().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(proxyResponse.body());
                }
            } catch (Exception e) {
                exchange.sendResponseHeaders(502, -1); // Bad Gateway
            }
        }
    }
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER (AWS, DOCKER, KUBERNETES)

### AWS Production Architecture Mapping
1. **AWS WAF**: Intercepts raw client requests directly at the edge, applying Web Application Firewall rules to drop SQL-injection payloads and brute-force IP rate-limits.
2. **Amazon API Gateway**: Serves as the primary public entry-point. It decrypts SSL certificates, integrates with AWS Lambda Custom Authorizers to validate tokens, and handles REST endpoint integrations.
3. **AWS VPC Private Subnets**: Contains internal microservices (EKS Pods or EC2 instances) which communicate over plaintext inside secure, air-gapped security groups, inaccessible to the open internet.

### Docker Compose Local Sandbox Gateway Configuration
This compose environment establishes an API Gateway routing traffic to isolated product-service nodes on a private internal network:

```yaml
version: '3.8'

services:
  kong-gateway:
    image: kong:latest
    container_name: kong_edge_gateway
    ports:
      - "80:8000" # Proxy Ingress
      - "8443:8443" # Secure Proxy Ingress
    environment:
      KONG_DATABASE: 'off'
      KONG_DECLARATIVE_CONFIG: /etc/kong/kong.yml
    volumes:
      - ./kong.yml:/etc/kong/kong.yml:ro
    depends_on:
      - catalog-service
    networks:
      - internal-vpc

  catalog-service:
    image: node:18-alpine
    container_name: catalog_backend
    command: >
      node -e "
        const http = require('http');
        http.createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'active', source: 'Catalog Microservice' }));
        }).listen(8080);
      "
    networks:
      - internal-vpc

networks:
  internal-vpc:
    driver: bridge
```

### Kubernetes API Gateway / Ingress Controller Configuration
This manifest sets up an Nginx Ingress Controller behaving as an API Gateway path-router, enforcing rate limits and redirecting `/api/v1/catalog` directly to backend service deployments:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    # API Gateway Rate Limiting Annotations
    nginx.ingress.kubernetes.io/limit-connections: "20"
    nginx.ingress.kubernetes.io/limit-rps: "10"
    # Protocol translation and timeout configs
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "10"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "20"
spec:
  tls:
  - hosts:
    - api.company.com
    secretName: production-ssl-cert-secret
  rules:
  - host: api.company.com
    http:
      paths:
      - path: /api/v1/catalog
        pathType: Prefix
        backend:
          service:
            name: catalog-microservice
            port:
              number: 8080
```

---
*All architectural principles, request flows, and security protocols mapped in this study guide are fully grounded in the provided system design resources and standard distributed systems engineering frameworks.*
