import * as grpc from '@grpc/grpc-js';
import { WarehouseService } from '../services/warehouse.service';
import { convertWarehouseToGRPC } from './utils';
import { AppError } from '../utils/errors';

const warehouseService = new WarehouseService();

export const warehouseServiceImplementation = {
  createWarehouse: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { name, location, capacity, manager, contact } = call.request;
      const warehouse = await warehouseService.createWarehouse({
        name,
        location,
        capacity,
        manager,
        contact,
      });
      callback(null, convertWarehouseToGRPC(warehouse));
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: err.message || 'Failed to create warehouse',
      });
    }
  },

  getWarehouse: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { value: id } = call.request;
      const warehouse = await warehouseService.getWarehouse(id);
      callback(null, convertWarehouseToGRPC(warehouse));
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.NOT_FOUND,
        message: err.message || 'Warehouse not found',
      });
    }
  },

  updateWarehouse: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { id, name, location, capacity, manager, contact } = call.request;
      const warehouse = await warehouseService.updateWarehouse(id, {
        name,
        location,
        capacity,
        manager,
        contact,
      });
      callback(null, convertWarehouseToGRPC(warehouse));
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: err.message || 'Failed to update warehouse',
      });
    }
  },

  deleteWarehouse: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { value: id } = call.request;
      const success = await warehouseService.deleteWarehouse(id);
      callback(null, { success });
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: err.message || 'Failed to delete warehouse',
      });
    }
  },

  listWarehouses: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { page = 1, limit = 10 } = call.request;
      const result = await warehouseService.getAllWarehouses({ page, limit, sort: '', order: 'DESC' });
      callback(null, {
        warehouses: result.data.map(convertWarehouseToGRPC),
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
        message: 'Failed to list warehouses',
      });
    }
  },
};
