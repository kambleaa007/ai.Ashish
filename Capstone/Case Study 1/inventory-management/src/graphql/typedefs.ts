import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # Scalars
  scalar DateTime

  # Enums
  enum InventoryStatus {
    IN_STOCK
    LOW_STOCK
    OUT_OF_STOCK
  }

  enum UserRole {
    ADMIN
    MANAGER
    STAFF
  }

  enum StockMovementType {
    INBOUND
    OUTBOUND
    TRANSFER
    ADJUSTMENT
  }

  # Pagination
  type PageInfo {
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
  }

  # User
  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  # Warehouse
  type Warehouse {
    id: ID!
    name: String!
    location: String!
    capacity: Float!
    manager: String!
    contact: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type WarehouseConnection {
    data: [Warehouse!]!
    pageInfo: PageInfo!
  }

  # Product
  type Product {
    id: ID!
    name: String!
    sku: String!
    description: String
    price: Float!
    category: String!
    supplier: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ProductConnection {
    data: [Product!]!
    pageInfo: PageInfo!
  }

  # Inventory
  type Inventory {
    id: ID!
    productId: ID!
    product: Product
    warehouseId: ID!
    warehouse: Warehouse
    quantity: Float!
    minThreshold: Float!
    maxThreshold: Float!
    status: InventoryStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type InventoryConnection {
    data: [Inventory!]!
    pageInfo: PageInfo!
  }

  type InventoryTransferResult {
    from: Inventory!
    to: Inventory!
  }

  # Stock Movement
  type StockMovement {
    id: ID!
    productId: ID!
    product: Product
    fromWarehouseId: String
    fromWarehouse: Warehouse
    toWarehouseId: ID!
    toWarehouse: Warehouse
    quantity: Float!
    type: StockMovementType!
    notes: String
    createdAt: DateTime!
    createdBy: ID!
  }

  type StockMovementConnection {
    data: [StockMovement!]!
    pageInfo: PageInfo!
  }

  # Query
  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users(page: Int = 1, limit: Int = 10): [User!]!

    # Warehouse queries
    warehouse(id: ID!): Warehouse
    warehouses(page: Int = 1, limit: Int = 10): WarehouseConnection!

    # Product queries
    product(id: ID!): Product
    products(page: Int = 1, limit: Int = 10): ProductConnection!
    productsByCategory(category: String!, page: Int = 1, limit: Int = 10): ProductConnection!

    # Inventory queries
    inventory(id: ID!): Inventory
    allInventory(page: Int = 1, limit: Int = 10): InventoryConnection!
    lowStockItems(page: Int = 1, limit: Int = 10): InventoryConnection!
    inventoryByWarehouse(warehouseId: ID!, page: Int = 1, limit: Int = 10): InventoryConnection!
    inventoryByProduct(productId: ID!, page: Int = 1, limit: Int = 10): InventoryConnection!

    # Stock movement queries
    stockMovement(id: ID!): StockMovement
    stockMovements(page: Int = 1, limit: Int = 10): StockMovementConnection!
    stockMovementsByProduct(productId: ID!, page: Int = 1, limit: Int = 10): StockMovementConnection!
    stockMovementsByWarehouse(warehouseId: ID!, page: Int = 1, limit: Int = 10): StockMovementConnection!
    stockMovementsByType(type: StockMovementType!, page: Int = 1, limit: Int = 10): StockMovementConnection!
  }

  # Mutation
  type Mutation {
    # User mutations
    register(email: String!, password: String!, name: String!, role: UserRole): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(id: ID!, name: String, role: UserRole): User
    deleteUser(id: ID!): Boolean!

    # Warehouse mutations
    createWarehouse(name: String!, location: String!, capacity: Float!, manager: String!, contact: String!): Warehouse!
    updateWarehouse(id: ID!, name: String, location: String, capacity: Float, manager: String, contact: String): Warehouse!
    deleteWarehouse(id: ID!): Boolean!

    # Product mutations
    createProduct(name: String!, sku: String!, description: String, price: Float!, category: String!, supplier: String!): Product!
    updateProduct(id: ID!, name: String, sku: String, description: String, price: Float, category: String, supplier: String): Product!
    deleteProduct(id: ID!): Boolean!

    # Inventory mutations
    createInventory(productId: ID!, warehouseId: ID!, quantity: Float!, minThreshold: Float!, maxThreshold: Float!): Inventory!
    updateInventoryQuantity(id: ID!, quantity: Float!): Inventory!
    transferInventory(id: ID!, fromWarehouseId: ID!, toWarehouseId: ID!, quantity: Float!): InventoryTransferResult!
    deleteInventory(id: ID!): Boolean!
  }

  # Subscription (optional, for real-time updates)
  type Subscription {
    inventoryUpdated(warehouseId: ID): Inventory!
    stockMovement: StockMovement!
  }
`;
