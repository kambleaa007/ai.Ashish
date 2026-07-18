import { UserService } from '../services/user.service';
import { WarehouseService } from '../services/warehouse.service';
import { ProductService } from '../services/product.service';
import { InventoryService } from '../services/inventory.service';
import { StockMovementService } from '../services/stock-movement.service';
import { AppError } from '../utils/errors';
import { GraphQLScalarType } from 'graphql';

const userService = new UserService();
const warehouseService = new WarehouseService();
const productService = new ProductService();
const inventoryService = new InventoryService();
const stockMovementService = new StockMovementService();

export const resolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime scalar type',
    serialize: (value: any) => value?.toISOString(),
    parseValue: (value: any) => new Date(value),
    parseLiteral: (ast: any) => new Date(ast.value),
  }),

  Query: {
    // User queries
    async me(_, __, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return userService.getUser(context.user.id);
    },

    async user(_, { id }: { id: string }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return userService.getUser(id);
    },

    async users(_, { page = 1, limit = 10 }: { page: number; limit: number }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await userService.getAllUsers({ page, limit, sort: '', order: 'DESC' });
      return result.data;
    },

    // Warehouse queries
    async warehouse(_, { id }: { id: string }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return warehouseService.getWarehouse(id);
    },

    async warehouses(_, { page = 1, limit = 10 }: { page: number; limit: number }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await warehouseService.getAllWarehouses({ page, limit, sort: '', order: 'DESC' });
      return {
        data: result.data,
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };
    },

    // Product queries
    async product(_, { id }: { id: string }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return productService.getProduct(id);
    },

    async products(_, { page = 1, limit = 10 }: { page: number; limit: number }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await productService.getAllProducts({ page, limit, sort: '', order: 'DESC' });
      return {
        data: result.data,
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };
    },

    async productsByCategory(
      _,
      { category, page = 1, limit = 10 }: { category: string; page: number; limit: number },
      context: any
    ) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await productService.getProductsByCategory(category, { page, limit, sort: '', order: 'DESC' });
      return {
        data: result.data,
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };
    },

    // Inventory queries
    async inventory(_, { id }: { id: string }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return inventoryService.getInventory(id);
    },

    async allInventory(_, { page = 1, limit = 10 }: { page: number; limit: number }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await inventoryService.getAllInventory({ page, limit, sort: '', order: 'DESC' });
      return {
        data: result.data,
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };
    },

    async lowStockItems(_, { page = 1, limit = 10 }: { page: number; limit: number }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await inventoryService.getLowStockItems({ page, limit, sort: '', order: 'DESC' });
      return {
        data: result.data,
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };
    },

    async inventoryByWarehouse(
      _,
      { warehouseId, page = 1, limit = 10 }: { warehouseId: string; page: number; limit: number },
      context: any
    ) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await inventoryService.getInventoryByWarehouse(warehouseId, { page, limit, sort: '', order: 'DESC' });
      return {
        data: result.data,
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };
    },

    async inventoryByProduct(
      _,
      { productId, page = 1, limit = 10 }: { productId: string; page: number; limit: number },
      context: any
    ) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await inventoryService.getInventoryByProduct(productId, { page, limit, sort: '', order: 'DESC' });
      return {
        data: result.data,
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };
    },

    // Stock movement queries
    async stockMovement(_, { id }: { id: string }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return stockMovementService.getMovement(id);
    },

    async stockMovements(_, { page = 1, limit = 10 }: { page: number; limit: number }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await stockMovementService.getAllMovements({ page, limit, sort: '', order: 'DESC' });
      return {
        data: result.data,
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };
    },

    async stockMovementsByProduct(
      _,
      { productId, page = 1, limit = 10 }: { productId: string; page: number; limit: number },
      context: any
    ) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await stockMovementService.getMovementsByProduct(productId, { page, limit, sort: '', order: 'DESC' });
      return {
        data: result.data,
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };
    },

    async stockMovementsByWarehouse(
      _,
      { warehouseId, page = 1, limit = 10 }: { warehouseId: string; page: number; limit: number },
      context: any
    ) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await stockMovementService.getMovementsByWarehouse(warehouseId, { page, limit, sort: '', order: 'DESC' });
      return {
        data: result.data,
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };
    },

    async stockMovementsByType(
      _,
      { type, page = 1, limit = 10 }: { type: string; page: number; limit: number },
      context: any
    ) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      const result = await stockMovementService.getMovementsByType(type, { page, limit, sort: '', order: 'DESC' });
      return {
        data: result.data,
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };
    },
  },

  Mutation: {
    // User mutations
    async register(_, { email, password, name, role }: any, context: any) {
      return userService.createUser({ email, password, name, role: role || 'STAFF' });
    },

    async login(_, { email, password }: { email: string; password: string }, context: any) {
      return userService.login(email, password);
    },

    async updateUser(_, { id, name, role }: any, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return userService.updateUser(id, { name, role });
    },

    async deleteUser(_, { id }: { id: string }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return userService.deleteUser(id);
    },

    // Warehouse mutations
    async createWarehouse(_, { name, location, capacity, manager, contact }: any, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return warehouseService.createWarehouse({ name, location, capacity, manager, contact });
    },

    async updateWarehouse(_, { id, ...data }: any, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return warehouseService.updateWarehouse(id, data);
    },

    async deleteWarehouse(_, { id }: { id: string }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return warehouseService.deleteWarehouse(id);
    },

    // Product mutations
    async createProduct(_, { name, sku, description, price, category, supplier }: any, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return productService.createProduct({ name, sku, description, price, category, supplier });
    },

    async updateProduct(_, { id, ...data }: any, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return productService.updateProduct(id, data);
    },

    async deleteProduct(_, { id }: { id: string }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return productService.deleteProduct(id);
    },

    // Inventory mutations
    async createInventory(_, { productId, warehouseId, quantity, minThreshold, maxThreshold }: any, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return inventoryService.createInventory({ productId, warehouseId, quantity, minThreshold, maxThreshold });
    },

    async updateInventoryQuantity(_, { id, quantity }: { id: string; quantity: number }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return inventoryService.updateInventory(id, quantity, context.user.id);
    },

    async transferInventory(
      _,
      { id, fromWarehouseId, toWarehouseId, quantity }: any,
      context: any
    ) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return inventoryService.transferInventory(id, fromWarehouseId, toWarehouseId, quantity, context.user.id);
    },

    async deleteInventory(_, { id }: { id: string }, context: any) {
      if (!context.user) {
        throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
      }
      return inventoryService.deleteInventory(id);
    },
  },

  // Field resolvers for nested data
  Inventory: {
    async product(inventory: any) {
      return productService.getProduct(inventory.productId);
    },
    async warehouse(inventory: any) {
      return warehouseService.getWarehouse(inventory.warehouseId);
    },
  },

  StockMovement: {
    async product(movement: any) {
      return productService.getProduct(movement.productId);
    },
    async fromWarehouse(movement: any) {
      return movement.fromWarehouseId ? warehouseService.getWarehouse(movement.fromWarehouseId) : null;
    },
    async toWarehouse(movement: any) {
      return warehouseService.getWarehouse(movement.toWarehouseId);
    },
  },
};
