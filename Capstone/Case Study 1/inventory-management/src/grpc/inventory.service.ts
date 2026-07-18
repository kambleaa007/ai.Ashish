import * as grpc from '@grpc/grpc-js';
import { InventoryService } from '../services/inventory.service';
import { convertInventoryToGRPC } from './utils';
import { AppError } from '../utils/errors';

const inventoryService = new InventoryService();

export const inventoryServiceImplementation = {
  createInventory: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { productId, warehouseId, quantity, minThreshold, maxThreshold } = call.request;
      const inventory = await inventoryService.createInventory({
        productId,
        warehouseId,
        quantity,
        minThreshold,
        maxThreshold,
      });
      callback(null, convertInventoryToGRPC(inventory));
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: err.message || 'Failed to create inventory',
      });
    }
  },

  getInventory: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { value: id } = call.request;
      const inventory = await inventoryService.getInventory(id);
      callback(null, convertInventoryToGRPC(inventory));
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.NOT_FOUND,
        message: err.message || 'Inventory not found',
      });
    }
  },

  updateInventoryQuantity: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { id, quantity } = call.request;
      const inventory = await inventoryService.updateInventory(id, quantity, 'grpc-user');
      callback(null, convertInventoryToGRPC(inventory));
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: err.message || 'Failed to update inventory',
      });
    }
  },

  transferInventory: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { id, fromWarehouseId, toWarehouseId, quantity } = call.request;
      const result = await inventoryService.transferInventory(
        id,
        fromWarehouseId,
        toWarehouseId,
        quantity,
        'grpc-user'
      );
      callback(null, {
        from: convertInventoryToGRPC(result.from),
        to: convertInventoryToGRPC(result.to),
      });
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: err.message || 'Failed to transfer inventory',
      });
    }
  },

  deleteInventory: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { value: id } = call.request;
      const success = await inventoryService.deleteInventory(id);
      callback(null, { success });
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: err.message || 'Failed to delete inventory',
      });
    }
  },

  listInventory: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { page = 1, limit = 10 } = call.request;
      const result = await inventoryService.getAllInventory({ page, limit, sort: '', order: 'DESC' });
      callback(null, {
        inventories: result.data.map(convertInventoryToGRPC),
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to list inventory',
      });
    }
  },

  getLowStockItems: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { page = 1, limit = 10 } = call.request;
      const result = await inventoryService.getLowStockItems({ page, limit, sort: '', order: 'DESC' });
      callback(null, {
        inventories: result.data.map(convertInventoryToGRPC),
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to get low stock items',
      });
    }
  },

  getInventoryByWarehouse: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { warehouseId, pagination } = call.request;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const result = await inventoryService.getInventoryByWarehouse(warehouseId, { page, limit, sort: '', order: 'DESC' });
      callback(null, {
        inventories: result.data.map(convertInventoryToGRPC),
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to get inventory by warehouse',
      });
    }
  },

  getInventoryByProduct: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { productId, pagination } = call.request;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const result = await inventoryService.getInventoryByProduct(productId, { page, limit, sort: '', order: 'DESC' });
      callback(null, {
        inventories: result.data.map(convertInventoryToGRPC),
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to get inventory by product',
      });
    }
  },
};
