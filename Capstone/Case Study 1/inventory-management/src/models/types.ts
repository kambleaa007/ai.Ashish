import { z } from 'zod';

// Warehouse Schemas
export const WarehouseCreateSchema = z.object({
  name: z.string().min(1, 'Warehouse name is required').max(255),
  location: z.string().min(1, 'Location is required').max(500),
  capacity: z.number().positive('Capacity must be positive'),
  manager: z.string().min(1, 'Manager name is required'),
  contact: z.string().email('Valid email is required'),
});

export const WarehouseSchema = WarehouseCreateSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Warehouse = z.infer<typeof WarehouseSchema>;
export type WarehouseCreate = z.infer<typeof WarehouseCreateSchema>;

// Product Schemas
export const ProductCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  sku: z.string().min(1, 'SKU is required').max(50).toUpperCase(),
  description: z.string().max(1000).optional(),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required').max(100),
  supplier: z.string().min(1, 'Supplier is required').max(255),
});

export const ProductSchema = ProductCreateSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductCreate = z.infer<typeof ProductCreateSchema>;

// Inventory Schemas
export const InventoryCreateSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  warehouseId: z.string().uuid('Invalid warehouse ID'),
  quantity: z.number().nonnegative('Quantity cannot be negative'),
  minThreshold: z.number().nonnegative('Min threshold cannot be negative'),
  maxThreshold: z.number().nonnegative('Max threshold cannot be negative'),
});

export const InventorySchema = InventoryCreateSchema.extend({
  id: z.string().uuid(),
  status: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Inventory = z.infer<typeof InventorySchema>;
export type InventoryCreate = z.infer<typeof InventoryCreateSchema>;

// Stock Movement Schemas (for tracking transfers)
export const StockMovementCreateSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  fromWarehouseId: z.string().uuid('Invalid source warehouse ID').optional(),
  toWarehouseId: z.string().uuid('Invalid destination warehouse ID'),
  quantity: z.number().positive('Quantity must be positive'),
  type: z.enum(['INBOUND', 'OUTBOUND', 'TRANSFER', 'ADJUSTMENT']),
  notes: z.string().max(500).optional(),
});

export const StockMovementSchema = StockMovementCreateSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  createdBy: z.string().uuid(),
});

export type StockMovement = z.infer<typeof StockMovementSchema>;
export type StockMovementCreate = z.infer<typeof StockMovementCreateSchema>;

// User Schemas (for authentication)
export const UserCreateSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(255),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']).default('STAFF'),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;

// API Key Schema
export const ApiKeySchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  name: z.string(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  expiresAt: z.date().optional(),
  active: z.boolean().default(true),
});

export type ApiKey = z.infer<typeof ApiKeySchema>;

// JWT Payload Schema
export const JWTPayloadSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']),
  iat: z.number(),
  exp: z.number(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

// Query filter schemas
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['ASC', 'DESC']).default('DESC'),
});

export type Pagination = z.infer<typeof PaginationSchema>;
