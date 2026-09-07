# Lecture 23 Master Study Guide: SQL vs. NoSQL Databases

Selecting the right database is a fundamental decision in system design. This guide establishes a structured decision framework comparing Relational SQL databases and Distributed NoSQL architectures.

---

## 1. THE COMPREHENSIVE CORE FOUNDATIONS
*   **WHAT**: **SQL Databases** (Relational) store data in structured tables with fixed schemas and explicit foreign-key relationships. **NoSQL Databases** (Non-Relational) store data in flexible, schema-less formats such as Documents, Key-Value pairs, Column-Families, or Graphs.
*   **WHY**: SQL databases ensure strict consistency and support complex, ad-hoc queries with multi-table joins. However, they scale primarily vertically (adding more CPU/RAM). NoSQL databases scale horizontally (adding more cheap servers) by sacrificing immediate consistency and complex joins, allowing them to handle massive read/write volumes and un-structured data formats.
*   **WHERE & WHEN**:
    *   **SQL**: Best for financial ledger accounting, e-commerce checkouts, identity registries, and complex reporting workloads.
    *   **NoSQL**: Best for large-scale social feeds, chat history, document storage, fast caching, and dense network relationships.
*   **HOW**:
    *   **SQL Storage Engine**: SQL databases typically use **B-Tree index engines**. These structures map keys sequentially, which optimizes random read and range scan performance but requires locking disk blocks during writes.
    *   **NoSQL Storage Engine**: NoSQL systems frequently use **LSM (Log-Structured Merge-Tree) Engines** for fast writes (Cassandra) or in-memory key-value maps (Redis), optimizing write throughput and scale-out distribution.

---

## 2. TRADEOFF ANALYSIS

| Feature | SQL Databases (Relational) | NoSQL Databases (Distributed) |
| :--- | :--- | :--- |
| **Schema** | Rigid, static, defined ahead of time. | Flexible, dynamic, schema-on-read. |
| **Scaling** | Vertical (Scale Up: bigger machine). | Horizontal (Scale Out: sharded nodes). |
| **Data Integrity**| Enforces Referential Integrity (Foreign Keys). | Application-level validation only. |
| **Transactions** | Strong ACID guarantees on multi-row actions. | Eventual consistency (BASE) with exceptions. |
| **Joins** | Native, highly optimized, multi-table. | Joins are unsupported; requires denormalization. |

---

## 3. CONCRETE SYSTEM DESIGN ARCHITECTURE EXAMPLES
**Instagram** implements a hybrid architecture. User account metadata, profiles, and billing are stored in a partitioned SQL database (**PostgreSQL**) to guarantee strict transactional consistency. However, the feed photos, comments, and reels are stored in **Cassandra** (NoSQL Column-Family) and **MongoDB** (NoSQL Document) to support massive, globally distributed write volumes and rapid localized edge delivery.

---

## 4. THE 20-YEAR MENTAL MODEL & ACCOMPANYING TEXT DIAGRAMS
*   **Mental Model**: Think of organizing a massive business filing system.
    *   **SQL (The Strict Registry Office)**: All folders are standardized and filed in steel cabinets. Every folder has the exact same fields (Name, Date, ID). If you try to file a document with a missing field, the registry clerk rejects it. It's perfectly organized, but scaling it up requires buying a bigger, more expensive cabinet.
    *   **NoSQL (The Cardboard Box Depot)**: You have dozens of labeled cardboard boxes spread across a large warehouse. If a new folder comes in, you just throw it into the matching box. It doesn't matter if some folders contain more information than others. To scale up, you just buy more cardboard boxes and space them out.

```
  [ SQL Tabular Relations ]
  Table: Users             Table: Orders
  ┌────┬─────────┐         ┌────┬─────────┬─────────┐
  │ ID │ Name    │◄───┐    │ ID │ User_ID │ Amount  │
  ├────┼─────────┤    └────┼────┼─────────┼─────────┤
  │ 1  │ "Amit"  │         │ 99 │ 1       │ $45.00  │
  └────┴─────────┘         └────┴─────────┴─────────┘

  [ NoSQL Document Model (MongoDB JSON) ]
  {
     "_id": "User_1",
     "name": "Amit",
     "orders": [ { "id": "99", "amount": 45.00 } ],
     "dynamic_attribute": "dynamic_value" # No schema limits
  }
```

---

## 5. LANGUAGE-SPECIFIC PARADIGMS & IMPLEMENTATION MATRICES

#### JavaScript / TypeScript & NoSQL Integration
Connecting to MongoDB using Mongoose.
```typescript
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    orders: [{ amount: Number, item: String }],
    dynamicFields: Schema.Types.Mixed // Fully dynamic schema-less column
});

const UserModel = mongoose.model('User', UserSchema);

async function saveUserDoc() {
    await UserModel.create({
        name: "Amit",
        orders: [{ amount: 45.00, item: "Book" }],
        customInfo: "Any dynamic data here is saved without database alterations"
    });
}
```

#### Java SQL Transaction Integration
Using Spring Boot JPA with multi-table relation mapping.
```java
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<OrderEntity> orders; // Strong structural relationship
}
```

---

## 6. INFRASTRUCTURE & ORCHESTRATION LAYER
*   **AWS**: Amazon RDS (SQL) vs. Amazon DynamoDB / DocumentDB (NoSQL).
*   **Docker Compose (Hybrid SQL/NoSQL sandbox)**:
```yaml
version: '3.8'
services:
  relational-db:
    image: postgres:alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: sql_password

  document-db:
    image: mongo:latest
    ports:
      - "27017:27017"
```
*   **Kubernetes (K8s)**:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: database-ssd-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
  storageClassName: premium-ssd-sc
```
