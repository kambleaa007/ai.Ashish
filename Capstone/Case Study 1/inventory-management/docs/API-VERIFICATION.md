# API Verification Guide

This document provides comprehensive verification steps for all three API protocols: REST, GraphQL, and gRPC.

## Prerequisites

- Node.js and npm installed
- Postman installed (for REST/GraphQL verification)
- grpcurl installed (for gRPC verification)
- All dependencies installed (`npm install`)
- Environment variables configured (`.env` file)

## Starting the Server

```bash
# Build TypeScript
npm run build

# Start the server (REST, GraphQL, and gRPC)
npm start

# Or run with TypeScript directly
npm run dev
```

The server will start with:
- REST API: `http://localhost:3000/api/v1`
- GraphQL: `http://localhost:3000/graphql`
- gRPC: `localhost:50051`

## REST API Verification

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Expected Response:
```json
{
  "status": "ok",
  "timestamp": "2026-07-18T12:00:00.000Z"
}
```

### 2. Authentication Flow

#### Register User
```bash
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "STAFF"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Save the returned token for subsequent requests.

#### Get Profile
```bash
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Warehouse Operations

#### Create Warehouse
```bash
curl -X POST http://localhost:3000/api/v1/warehouses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Warehouse",
    "location": "New York",
    "capacity": 5000,
    "manager": "John Doe",
    "contact": "john@warehouse.com"
  }'
```

#### List Warehouses
```bash
curl -X GET "http://localhost:3000/api/v1/warehouses?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Specific Warehouse
```bash
curl -X GET http://localhost:3000/api/v1/warehouses/{warehouse_id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Product Operations

#### Create Product
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP001",
    "description": "High performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "supplier": "TechCorp"
  }'
```

#### List Products
```bash
curl -X GET "http://localhost:3000/api/v1/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Products by Category
```bash
curl -X GET "http://localhost:3000/api/v1/products/category/Electronics" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Inventory Operations

#### Create Inventory
```bash
curl -X POST http://localhost:3000/api/v1/inventory \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "{product_id}",
    "warehouseId": "{warehouse_id}",
    "quantity": 100,
    "minThreshold": 10,
    "maxThreshold": 500
  }'
```

#### Get Low Stock Items
```bash
curl -X GET "http://localhost:3000/api/v1/inventory/status/low-stock" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Transfer Inventory
```bash
curl -X POST http://localhost:3000/api/v1/inventory/{inventory_id}/transfer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fromWarehouseId": "{warehouse_id_1}",
    "toWarehouseId": "{warehouse_id_2}",
    "quantity": 25
  }'
```

### 6. Using Postman Collection

1. Import the Postman collection: `postman/Inventory-API.postman_collection.json`
2. Import the environment: `postman/Inventory-API-Environment.postman_environment.json`
3. Update environment variables if needed (base_url, etc.)
4. Start with the "Login" request to get an auth token
5. Run other requests with the token automatically included

## GraphQL API Verification

### 1. Access GraphQL Playground

Open browser: `http://localhost:3000/graphql`

### 2. Sample Queries

#### Query Warehouses
```graphql
query {
  warehouses(page: 1, limit: 10) {
    data {
      id
      name
      location
      capacity
      manager
    }
    pageInfo {
      page
      limit
      total
      totalPages
    }
  }
}
```

#### Mutation: Create Product
```graphql
mutation {
  createProduct(
    name: "New Product"
    sku: "SKU001"
    price: 99.99
    category: "Electronics"
    supplier: "Supplier Inc"
  ) {
    id
    name
    sku
    price
    createdAt
  }
}
```

#### Query: Low Stock Items
```graphql
query {
  lowStockItems(page: 1, limit: 10) {
    data {
      id
      productId
      quantity
      status
      minThreshold
    }
    pageInfo {
      total
      totalPages
    }
  }
}
```

#### Authentication in GraphQL

Add token to request headers:
```
Authorization: Bearer YOUR_TOKEN
```

## gRPC API Verification

### 1. Install grpcurl

```bash
# macOS
brew install grpcurl

# Linux
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest

# Or download from: https://github.com/fullstorydev/grpcurl/releases
```

### 2. List Services

```bash
grpcurl -plaintext localhost:50051 list
```

Expected output:
```
inventory.InventoryService
inventory.ProductService
inventory.WarehouseService
```

### 3. List Methods

```bash
grpcurl -plaintext localhost:50051 list inventory.WarehouseService
```

### 4. Create Warehouse (gRPC)

```bash
grpcurl -plaintext \
  -d @ \
  localhost:50051 inventory.WarehouseService.CreateWarehouse << 'EOF'
{
  "name": "gRPC Warehouse",
  "location": "Test Location",
  "capacity": 1000,
  "manager": "Test Manager",
  "contact": "test@example.com"
}
EOF
```

### 5. List Warehouses (gRPC)

```bash
grpcurl -plaintext \
  -d '{"page": 1, "limit": 10}' \
  localhost:50051 inventory.WarehouseService.ListWarehouses
```

### 6. Get Warehouse (gRPC)

```bash
grpcurl -plaintext \
  -d '{"value": "warehouse-id"}' \
  localhost:50051 inventory.WarehouseService.GetWarehouse
```

## Test Execution

### Run Unit Tests

```bash
npm test
```

### Run with Coverage

```bash
npm test -- --coverage
```

### Run Specific Test File

```bash
npm test -- warehouse.repository.spec.ts
```

## Performance Testing

### Load Testing with Artillery

```bash
# Install artillery
npm install -g artillery

# Create test script and run
artillery quick --count 100 --num 10 http://localhost:3000/api/v1/warehouses
```

## Expected Status Codes

- **200 OK**: Successful GET/PUT/PATCH
- **201 Created**: Successful POST
- **400 Bad Request**: Validation error
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change PORT in .env
PORT=3001
```

### Module Not Found

```bash
npm install
npm run build
```

### gRPC Connection Refused

Ensure gRPC server is running:
```bash
npm start
```

Check gRPC port (default 50051) is not blocked.

## API Endpoints Summary

| Operation | REST | GraphQL | gRPC |
|-----------|------|---------|------|
| Create Warehouse | POST /warehouses | createWarehouse | CreateWarehouse |
| Read Warehouse | GET /warehouses/{id} | warehouse | GetWarehouse |
| List Warehouses | GET /warehouses | warehouses | ListWarehouses |
| Update Warehouse | PUT /warehouses/{id} | updateWarehouse | UpdateWarehouse |
| Delete Warehouse | DELETE /warehouses/{id} | deleteWarehouse | DeleteWarehouse |

## Documentation

- **OpenAPI Spec**: `docs/openapi.yaml`
- **Architecture**: `docs/ARCHITECTURE_ANALYSIS.md` (generated by AI agent)
- **API Guide**: `docs/API_GUIDE.md` (generated by AI agent)
- **Test Cases**: `docs/TEST_CASES.md` (generated by AI agent)
