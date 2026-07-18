# System Architecture Documentation

## Overview

The Inventory Management API follows a layered, multi-protocol architecture designed for scalability, maintainability, and flexibility. The system exposes the same business logic through three distinct protocols: REST, GraphQL, and gRPC.

## Layered Architecture

### 1. Presentation Layer

#### REST API (Express.js)
- **Port**: 3000
- **Endpoints**: `/api/v1/*`
- **Controllers**: Handle HTTP requests and responses
- **Routes**: Define URL patterns and route handlers
- **Response Format**: JSON with consistent structure

#### GraphQL API (Apollo Server)
- **Port**: 3000 (same as REST)
- **Endpoint**: `/graphql`
- **Schema**: Type definitions for queries and mutations
- **Resolvers**: Business logic for field resolution
- **Introspection**: Full API schema available for clients

#### gRPC Services
- **Port**: 50051
- **Protocol**: HTTP/2 with Protocol Buffers
- **Services**: Defined in `proto/inventory.proto`
- **Performance**: Binary protocol, streaming support

### 2. Application Layer

#### Controllers (REST)
```
src/controllers/
├── warehouse.controller.ts
├── product.controller.ts
├── inventory.controller.ts
└── user.controller.ts
```

- Request validation using Zod schemas
- Delegate to service layer
- Format responses using utility functions
- Handle errors gracefully

#### GraphQL Resolvers
```
src/graphql/
├── typedefs.ts    # Schema definition
└── resolvers.ts   # Field resolvers
```

- Query resolvers for read operations
- Mutation resolvers for write operations
- Authentication checks on every resolver
- Nested data fetching with batching potential

#### gRPC Service Implementations
```
src/grpc/
├── warehouse.service.ts
├── product.service.ts
├── inventory.service.ts
└── utils.ts       # Type conversions
```

- Implement service interfaces from proto
- Convert between proto and internal types
- Stream support for list operations
- Error handling with gRPC status codes

### 3. Business Logic Layer (Services)

```
src/services/
├── user.service.ts
├── warehouse.service.ts
├── product.service.ts
├── inventory.service.ts
└── stock-movement.service.ts
```

**Responsibilities**:
- Validate business rules
- Coordinate between repositories
- Handle transactions
- Manage complex operations (e.g., inventory transfer)
- Generate audit trails
- Implement service-to-service logic

**Key Services**:

**UserService**
- Registration and login
- JWT token generation and verification
- Password hashing with bcrypt
- User CRUD operations

**WarehouseService**
- Warehouse management
- Capacity tracking
- Location-based queries
- Manager assignment

**ProductService**
- Product catalog management
- SKU uniqueness enforcement
- Category-based filtering
- Supplier tracking

**InventoryService**
- Inventory CRUD operations
- Status calculation (IN_STOCK, LOW_STOCK, OUT_OF_STOCK)
- Warehouse and product relationships
- Transfer between warehouses with audit trail

**StockMovementService**
- Movement history tracking
- Query by product, warehouse, or type
- Audit trail for inventory changes

### 4. Data Access Layer (Repositories)

```
src/repositories/
├── user.repository.ts
├── warehouse.repository.ts
├── product.repository.ts
├── inventory.repository.ts
└── stock-movement.repository.ts
```

**Current Implementation**: In-memory arrays (for demo/testing)

**Methods** (CRUD + Query):
- `create(data)` - Insert new record
- `findById(id)` - Retrieve by ID
- `findAll(skip, take)` - List with pagination
- `update(id, data)` - Modify existing
- `delete(id)` - Remove record
- `find*(criteria)` - Domain-specific queries

**Future**: Replace with database drivers (MongoDB, PostgreSQL, etc.)

### 5. Data Models & Validation

```
src/models/types.ts
```

**Schema Definitions** (Zod):
- `WarehouseCreateSchema` - Input validation
- `ProductCreateSchema` - Input validation
- `InventoryCreateSchema` - Input validation
- `UserCreateSchema` - Input validation

**Type Definitions**:
- `Warehouse`, `Product`, `Inventory`, `User`, etc.
- Full type inference from Zod schemas
- TypeScript strict mode support

## Middleware Stack

```
src/middleware/
├── auth.middleware.ts       # JWT/API Key verification
└── error.middleware.ts      # Global error handling
```

### Authentication Flow

```
Request
  ↓
Extract Authorization Header
  ↓
Parse "Bearer <token>" or "X-API-Key: <key>"
  ↓
Verify JWT Signature / Validate API Key
  ↓
Set req.user with user context
  ↓
Pass to next middleware/controller
```

### Error Handling

```
Application Error (AppError subclass)
  ↓
Error Middleware catches
  ↓
Format error response
  ↓
Send appropriate HTTP status code
  ↓
Log error for debugging
  ↓
Return JSON error response
```

## Data Flow Examples

### Create Inventory (REST)
```
POST /api/v1/inventory
  ↓
InventoryController.create()
  ↓
InventoryCreateSchema.parse() ← Validation
  ↓
InventoryService.createInventory()
  ↓
Validate Product exists → ProductRepository.findById()
Validate Warehouse exists → WarehouseRepository.findById()
Check for duplicate → InventoryRepository.findByProductAndWarehouse()
  ↓
InventoryRepository.create() ← Persist
  ↓
Return Inventory object
  ↓
sendSuccess() → JSON response
```

### List Warehouses (GraphQL)
```
POST /graphql
  { query: "{ warehouses(page: 1, limit: 10) { ... } }" }
  ↓
Apollo Server processes GraphQL
  ↓
Verify Authentication
  ↓
Warehouse Query Resolver
  ↓
WarehouseService.getAllWarehouses()
  ↓
WarehouseRepository.findAll()
  ↓
Calculate pagination (page, limit, total, totalPages)
  ↓
Return WarehouseConnection with data and pageInfo
  ↓
GraphQL formats and returns response
```

### Transfer Inventory (gRPC)
```
TransferInventory gRPC Call
  ↓
inventoryServiceImplementation.transferInventory()
  ↓
InventoryService.transferInventory(id, fromId, toId, qty, userId)
  ↓
Validate source inventory exists
Check quantity sufficiency
Validate destination warehouse exists
  ↓
Reduce source inventory quantity
Increase destination inventory quantity (create if needed)
Create StockMovement audit entry
  ↓
Return InventoryTransferResponse { from, to }
  ↓
Convert to proto format using utils
  ↓
Send gRPC response
```

## Authentication & Authorization

### JWT Authentication
- **Algorithm**: HS256
- **Payload**: `{ id, email, role, iat, exp }`
- **Secret**: Configured via `JWT_SECRET` env var
- **Duration**: Configurable via `JWT_EXPIRE` (default 24h)

### Role-Based Access Control (RBAC)
```
ADMIN
├── All operations
├── User management
└── System administration

MANAGER
├── Warehouse management
├── Product management
├── Inventory operations
└── Stock transfers

STAFF
├── View inventory
├── Update quantities
└── View warehouse info
```

### Middleware Chain
```
authMiddleware() ← Extract and verify JWT
  ↓
roleMiddleware(['ADMIN']) ← Check user role
  ↓
Controller Logic
```

## Error Handling Strategy

### Error Hierarchy

```
Error
  ├── AppError
  │   ├── ValidationError (400)
  │   ├── UnauthorizedError (401)
  │   ├── ForbiddenError (403)
  │   └── NotFoundError (404)
  │
  └── Generic Error (500)
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "statusCode": 400
}
```

## Scalability Considerations

### Current Limitations
- In-memory storage (data lost on restart)
- Single process (no clustering)
- No database indexing
- No caching layer

### Future Improvements

**Database**
```
Implement MongoDB/PostgreSQL
Add connection pooling
Implement query optimization
Add database replication
```

**Caching**
```
Add Redis layer
Cache frequently accessed data
Implement cache invalidation strategy
Use HTTP caching headers
```

**Async Processing**
```
Message queue (Bull, RabbitMQ, Kafka)
Background job processing
Event-driven architecture
Webhooks for notifications
```

**Performance**
```
Database query optimization
API response compression (gzip)
Connection keep-alive
HTTP/2 push
GraphQL query depth limiting
```

## Testing Architecture

### Test Pyramid
```
        Integration Tests (10%)
       
     Unit Tests (60%)
     
  Repository Tests (30%)
```

### Test Coverage

**Repositories** (30%)
- CRUD operations
- Query methods
- Data consistency

**Services** (60%)
- Business logic
- Validation rules
- Error conditions
- Edge cases

**Integration** (10%)
- API endpoints
- Full request-response cycle
- Database interactions

## Deployment Architecture

### Development
```
Local Machine
  ├── REST API (localhost:3000)
  ├── GraphQL (localhost:3000/graphql)
  └── gRPC (localhost:50051)
```

### Production
```
Load Balancer (nginx)
  ├── Server Instance 1
  ├── Server Instance 2
  └── Server Instance N
  
Database Cluster
  ├── Primary
  ├── Replica 1
  └── Replica 2

Cache Layer (Redis)
Message Queue (RabbitMQ/Kafka)
Monitoring (Prometheus/Grafana)
```

## AI/MCP Integration

### Agent Loop Architecture

```
MCP Agent Loop
  ├── Task: Documentation Generation
  │   └── Claude API → Generate API docs
  │
  ├── Task: Test Case Generation
  │   └── Claude API → Create test scenarios
  │
  ├── Task: Code Review
  │   └── Claude API → Analyze code
  │
  ├── Task: Architecture Analysis
  │   └── Claude API → Review design
  │
  └── Task: Performance Optimization
      └── Claude API → Suggest improvements
```

## Development Workflow

### Adding New Endpoint

1. **Define Schema** (models/types.ts)
   ```typescript
   export const NewEntitySchema = z.object({...})
   ```

2. **Create Repository** (repositories/new.repository.ts)
   ```typescript
   export class NewRepository { ... }
   ```

3. **Create Service** (services/new.service.ts)
   ```typescript
   export class NewService { ... }
   ```

4. **Create Controller** (controllers/new.controller.ts)
   ```typescript
   export class NewController { ... }
   ```

5. **Add Routes** (routes/new.routes.ts)
   ```typescript
   router.get('/', NewController.getAll)
   ```

6. **Update App** (app.ts)
   ```typescript
   app.use('/api/v1/new', newRoutes)
   ```

7. **Add GraphQL** (graphql/typedefs.ts, resolvers.ts)

8. **Add gRPC** (proto/inventory.proto, grpc/new.service.ts)

9. **Write Tests** (tests/new.spec.ts)

## Security Architecture

### Defense Layers

```
Layer 1: Helmet.js (Security Headers)
  ├── Content-Security-Policy
  ├── X-Frame-Options
  └── X-Content-Type-Options

Layer 2: Input Validation (Zod Schemas)
  ├── Type checking
  ├── Length validation
  └── Format validation

Layer 3: Authentication (JWT)
  ├── Token verification
  └── Signature validation

Layer 4: Authorization (RBAC)
  ├── Role checking
  └── Permission validation

Layer 5: Error Handling
  ├── No stack traces to client
  └── Sanitized error messages
```

## Monitoring & Observability

### Metrics to Track
- Request count and latency
- Error rates
- Authentication failures
- Authorization failures
- Database query performance
- Memory usage
- CPU usage

### Logging Strategy
- Request ID for tracing
- Timestamp and log level
- User context (when available)
- Error stack traces
- Performance metrics

---

**Document Version**: 1.0  
**Last Updated**: July 18, 2026  
**Maintained By**: Development Team
