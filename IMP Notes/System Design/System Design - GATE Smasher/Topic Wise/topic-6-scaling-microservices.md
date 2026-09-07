# Topic 6 Master Study Guide: Horizontal vs. Vertical Scaling & Microservices Architecture

## 1. WHAT, WHY, WHERE, HOW (Technical Mechanics)

### Vertical vs. Horizontal Scaling
* **Vertical Scaling (Scale Up)**: Increasing a single machine's resource capacity by upgrading its physical CPU cores, RAM pool, or storage controllers. 
  * **Limitations**: You hit a physical hardware boundary (e.g., maximum memory capacity of the server motherboard). Upgrades often require downtime.
* **Horizontal Scaling (Scale Out)**: Adding more server nodes to your fleet and distributing client traffic across them utilizing load balancers.
  * **Advantages**: No theoretical limits. You can scale horizontally dynamically during traffic surges.

### Monolithic vs. Microservices Architecture
* **Monolithic Architecture**: All business features (user accounts, search, payments, shipping, notifications) are packaged together inside a single, unified codebase and deployed to servers as one atomic binary.
  * **The Challenge**: If one single feature experiences a memory leak, the entire application crashes. Deployments are risky, and database locking becomes a major bottleneck.
* **Microservices Architecture**: The application is decomposed into multiple, small, independent services organized around specific business boundaries. Each service maintains its own localized code repository, its own independent deployment pipelines, and its own dedicated database instances.

### Stateless vs. Stateful Backend Services
* **Stateful Services**: The application server stores user session data in its local RAM or files. If Server A fails, the user loses their active session state because Server B doesn't know who they are. This represents a major bottleneck for horizontal scaling.
* **Stateless Services**: The application server stores **no local state**. Every incoming client request contains all authentication evidence (e.g., a stateless JWT) required to complete the task. Any server node in your horizontal fleet can process any incoming request seamlessly.

---

## 2. TRADEOFFS (Advantages & Disadvantages under High Load)

| Metric | Monolithic Architecture | Microservices Architecture |
| :--- | :--- | :--- |
| **Development Speed** | High at first. Fast local debugging. | Low at first. Requires robust distributed coordination. |
| **Deployment Complexity** | Low. Deploy a single file/container. | High. Each service has individual build/release cycles. |
| **Operational Costs** | Moderate. Single deployment targets. | High. Dozens of small pods, network monitoring, and traces required. |
| **Fault Isolation** | Poor. A memory leak in `/search` crashes everything. | Excellent. If `search-service` crashes, `payment-service` keeps running. |
| **Scalability Granularity** | Poor. Must scale the entire monolith. | Excellent. Scale only the services under pressure (e.g., the video service). |

---

## 3. PRODUCTION EXAMPLES
* **Amazon**: Migrated from a massive monolithic C++ web server named "Obidos" to a highly distributed, decoupled microservices model. They broke their application into thousands of small, specialized services managed by isolated "two-pizza teams." The product page checkout flow now initiates hundreds of microservice API calls behind the scenes (payment, catalog, recommendation engines, inventory checks).
* **Uber**: Decomposed their monolith as their driver/rider network scaled. As a monolithic application, concurrent database row locks on driver geolocation tables caused severe performance degradation. Decoupling into isolated services (Driver Geolocation Service, Ride Matching Service, Billing Service) allowed Uber to scale their datastores horizontally using dedicated, sharded database systems tailored for each service’s read/write patterns.

---

## 4. MEMORY ANCHORS

### The 20-Year Non-Tech Analogy: The Single Master Chef vs. The Assembly Line Restaurant
* **Monolith (The Single Master Chef)**: You operate a restaurant where a single master chef (The Monolith) handles every single task—taking orders, chopping vegetables, cooking steaks, washing dishes, and processing billing cards. He is extremely fast for small crowds, but if he cuts his finger or slips (App Crash), the entire restaurant halts.
* **Microservices (The Assembly Line)**: You reorganize your kitchen into an assembly line. Worker 1 handles order intake, Worker 2 chops vegetables, Worker 3 cooks steaks, and Worker 4 washes dishes. If Worker 4 slips and takes a break, you keep taking orders and cooking steaks—the restaurant remains functional. You can also easily hire 3 more steak cooks (Horizontal Scaling) if your customers are ordering mostly steaks, without needing to hire extra dishwashers.

### ASCII Architecture Diagram
```
     [ Monolith Architecture ]                        [ Microservices Architecture ]
    ┌────────────────────────┐                             ┌────────────────┐
    │     [User Service]     │                             │ [User Service] │───> [User DB]
    │    [Search Service]    │                             └────────────────┘
    │   [Payment Service]    │                             ┌────────────────┐
    └────────────────────────┘                             │[Search Service]│───> [Search DB]
                 │                                         └────────────────┘
                 v                                         ┌────────────────┐
          [ Monolith DB ]                                  │[PaymentService]│───> [Payment DB]
                                                           └────────────────┘
```

---

## 5. LANGUAGES

### Node.js / TypeScript (Stateless JWT Authentication Handler)
By using JSON Web Tokens (JWT), Node.js services do not need to query a session database or store local memory records, remaining 100% stateless:
```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request { user?: any; }

// Stateless Authentication Middleware
export function authenticateStatelessToken(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer JWT

    if (!token) return res.sendStatus(401);

    // Cryptographic signature check: No database lookup required!
    jwt.verify(token, process.env.JWT_ACCESS_SECRET as string, (err, decodedUser) => {
        if (err) return res.sendStatus(403);
        req.user = decodedUser;
        next(); // Proceed to route handler
    });
}
```

### Java 25+ (Project Loom Decoupled Multi-Service Client Aggregator)
The following code simulates a Gateway orchestrating concurrent, parallel API fetches to individual microservices on Project Loom virtual threads:
```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class MicroserviceAggregator {
    private final HttpClient client = HttpClient.newBuilder()
        .executor(Executors.newVirtualThreadPerTaskExecutor()) // Loom Thread pool
        .build();

    public String aggregateUserData(String userId) throws Exception {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // Initiate concurrent parallel non-blocking fetches to services
            Future<HttpResponse<String>> userFuture = executor.submit(() -> 
                client.send(createRequest("http://user-service/users/" + userId), HttpResponse.BodyHandlers.ofString()));

            Future<HttpResponse<String>> orderFuture = executor.submit(() -> 
                client.send(createRequest("http://order-service/orders/user/" + userId), HttpResponse.BodyHandlers.ofString()));

            // Blocking join: Safe as these execute on Virtual Threads
            String userJson = userFuture.get().body();
            String orderJson = orderFuture.get().body();

            return "{ \"user\": " + userJson + ", \"orders\": " + orderJson + " }";
        }
    }

    private HttpRequest createRequest(String url) throws Exception {
        return HttpRequest.newBuilder().uri(new URI(url)).GET().build();
    }
}
```

---

## 6. INFRASTRUCTURE

### Production-Grade Docker Compose Config (Stateless Microservices Fleet)
This compose blueprint configures isolated, stateless microservice nodes sitting behind an Nginx reverse proxy gateway:
```yaml
# docker-compose-microservices.yml
version: '3.8'

services:
  nginx_gateway:
    image: nginx:alpine
    container_name: production_edge_gateway
    ports:
      - "80:80"
    volumes:
      - ./gateway.conf:/etc/nginx/nginx.conf
    depends_on:
      - user_service
      - search_service
    networks:
      - cluster_network

  user_service:
    image: node:18-alpine
    container_name: stateless_user_service
    environment:
      - NODE_ENV=production
    networks:
      - cluster_network

  search_service:
    image: openjdk:21-slim
    container_name: stateless_search_service
    networks:
      - cluster_network

networks:
  cluster_network:
    driver: bridge
```
