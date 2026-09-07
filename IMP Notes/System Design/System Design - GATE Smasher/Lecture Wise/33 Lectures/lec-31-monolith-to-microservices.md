# Lecture 31 Monolithic vs. Microservices Architecture

Scaling complex organizations and systems requires selecting the right software architecture. This guide analyzes Monolithic architectures versus Microservices decompositions.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS
*   **WHAT**: A **Monolithic Architecture** compiles all software modules, business logic, and database schemas into a single, unified execution binary. A **Microservices Architecture** decomposes these business domains into small, self-contained, and independently deployable services that communicate via lightweight network protocols (e.g., HTTP REST, gRPC, or message brokers).
*   **WHY**: Monoliths are highly performant and simple to deploy, but they hit an **Organizational and Scaling Wall** under high load. A single bug or resource leak in one module (e.g., memory leak in catalog search) crashes the entire application. Microservices allow scaling components independently, isolating failure zones, and enabling decoupled, autonomous engineering teams.
*   **WHERE & WHEN**:
    *   **Monolith**: Ideal for early-stage startups, MVPs, systems with low team counts, and low-complexity transactional flows.
    *   **Microservices**: Essential for enterprise organizations with large, distributed development teams and diverse scale requirements.
*   **HOW**:
    1.  **Decompose Database Boundaries**: The primary step in microservices migration is splitting the single database into **Database-per-Service** configurations to prevent lateral data dependencies.
    2.  **API Gateway Routing**: External clients query a central API Gateway, which redirects requests to corresponding internal microservices.
    3.  **Asynchronous Communication**: Services communicate asynchronously using message brokers (e.g., Kafka) to avoid tight coupling and cascade failures.

---

## 2. TRADEOFF ANALYSIS

| Metric | Monolithic Architecture | Microservices Architecture |
| :--- | :--- | :--- |
| **Deployment Complexity**| Very Low (Single war/jar/binary unit). | High (Requires CI/CD pipelines and K8s). |
| **Fault Isolation** | Poor. Single bug can trigger complete outage. | Excellent. Payment failure does not crash Catalog. |
| **Network Latency** | Near Zero. In-memory function calls. | High. Added latency from serialization and network hops. |
| **Scaling Granularity** | Low. Must duplicate the entire application. | Extremely High. Scale only the bottleneck service. |
| **Data Consistency** | Strong. Native SQL multi-table transactions. | Eventual. Requires distributed transaction patterns (e.g., Sagas). |

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES
**Amazon** transitioned from a massive monolithic "Obidos" codebase to a decentralized, microservices-driven architecture. In their early monolith, a spike in holiday retail checkout transactions degraded catalog search speeds for all users. Amazon restructured their system into thousands of independent microservices (e.g., Pricing Service, Recommendation Service, Inventory Service). Each service is managed by an autonomous team, enabling independent scaling and rapid, continuous deployments.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS
*   **Mental Model**: Think of the organizational model of a restaurant.
    *   **Monolith (The Solo Bistro Chef)**: A single chef cooks, serves, cleans tables, manages the register, and locks the door. It is highly efficient for small crowds. But if the chef cuts their finger (system exception), the entire restaurant shuts down immediately.
    *   **Microservices (The Five-Star Kitchen Crew)**: The restaurant deploys specialized stations: a Head Chef, a Sous Chef, a Pastry Chef, waiters, and dishwashers. If the dishwasher gets sick, guests still get their entrees, and the restaurant remains open. The stations coordinate through a central order slip line (API Gateway / Message Broker).

```
  [ MONOLITHIC ARCHITECTURE ]
  ┌────────────────────────────────────────────────────────┐
  │ [ API Ingress ] ───► [ Catalog ] ───► [ Checkout ]     │
  │                           └──► [ Central SQL DB ]      │
  └────────────────────────────────────────────────────────┘

  [ MICROSERVICES DECOUPLING ]
  ┌───────────────┐          ┌───────────────────┐
  │ Catalog Serv  ├─────────►│ Catalog DB (Mongo)│
  └───────▲───────┘          └───────────────────┘
          │ (REST)
    [ API Gateway ]
          │ (gRPC)
  ┌───────▼───────┐          ┌───────────────────┐
  │ Checkout Serv ├─────────►│ Payment DB (Postg)│
  └───────────────┘          └───────────────────┘
```

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

#### JavaScript / TypeScript (Gateway Orchestration)
Configuring a fast API gateway proxy router in Node.js.
```typescript
import express from 'express';
import proxy from 'express-http-proxy';
const app = express();

// Route traffic to decoupled microservice targets based on path prefixes
app.use('/catalog', proxy('http://catalog-service.production:8081'));
app.use('/checkout', proxy('http://checkout-service.production:8082'));

app.listen(80, () => console.log("Monolith Router running"));
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER
*   **AWS**: Amazon EKS (Elastic Kubernetes Service) orchestrating dozens of microservice containers inside a private VPC.
*   **Docker (Decoupled Multi-Container local runtime)**:
```yaml
version: '3.8'
services:
  catalog-service:
    build: ./catalog
    ports: ["8081:8081"]
  checkout-service:
    build: ./checkout
    ports: ["8082:8082"]
```
*   **Kubernetes (K8s pod traffic scaling thresholds)**:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: checkout-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: checkout-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```
