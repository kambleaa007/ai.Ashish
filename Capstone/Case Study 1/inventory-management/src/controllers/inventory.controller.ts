import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { InventoryService } from '../services/inventory.service';
import { InventoryCreateSchema, PaginationSchema } from '../models/types';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';
import { AppError } from '../utils/errors';
import { z } from 'zod';

const inventoryService = new InventoryService();

export class InventoryController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const validated = InventoryCreateSchema.parse(req.body);
      const inventory = await inventoryService.createInventory(validated);
      sendSuccess(res, 201, 'Inventory created successfully', inventory);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message, error.code);
      } else {
        sendError(res, 400, 'Validation error', 'VALIDATION_ERROR');
      }
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const inventory = await inventoryService.getInventory(id);
      sendSuccess(res, 200, 'Inventory retrieved', inventory);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message, error.code);
      } else {
        sendError(res, 500, 'Internal server error');
      }
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    try {
      const pagination = PaginationSchema.parse({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      });
      const result = await inventoryService.getAllInventory(pagination);
      sendPaginatedSuccess(res, 200, 'Inventory retrieved', result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (error) {
      sendError(res, 400, 'Invalid pagination parameters', 'VALIDATION_ERROR');
    }
  }

  static async getLowStock(req: AuthRequest, res: Response) {
    try {
      const pagination = PaginationSchema.parse({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      });
      const result = await inventoryService.getLowStockItems(pagination);
      sendPaginatedSuccess(res, 200, 'Low stock items retrieved', result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (error) {
      sendError(res, 400, 'Invalid pagination parameters', 'VALIDATION_ERROR');
    }
  }

  static async getByWarehouse(req: AuthRequest, res: Response) {
    try {
      const { warehouseId } = req.params;
      const pagination = PaginationSchema.parse({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      });
      const result = await inventoryService.getInventoryByWarehouse(warehouseId, pagination);
      sendPaginatedSuccess(res, 200, `Inventory for warehouse ${warehouseId}`, result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (error) {
      sendError(res, 400, 'Invalid parameters', 'VALIDATION_ERROR');
    }
  }

  static async getByProduct(req: AuthRequest, res: Response) {
    try {
      const { productId } = req.params;
      const pagination = PaginationSchema.parse({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      });
      const result = await inventoryService.getInventoryByProduct(productId, pagination);
      sendPaginatedSuccess(res, 200, `Inventory for product ${productId}`, result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (error) {
      sendError(res, 400, 'Invalid parameters', 'VALIDATION_ERROR');
    }
  }

  static async updateQuantity(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = z.object({ quantity: z.number().nonnegative() }).parse(req.body);
      const inventory = await inventoryService.updateInventory(id, quantity, req.user?.id || 'system');
      sendSuccess(res, 200, 'Inventory quantity updated', inventory);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message, error.code);
      } else {
        sendError(res, 400, 'Validation error', 'VALIDATION_ERROR');
      }
    }
  }

  static async transfer(req: AuthRequest, res: Response) {
    try {
      const { fromWarehouseId, toWarehouseId, quantity } = z
        .object({
          fromWarehouseId: z.string().uuid(),
          toWarehouseId: z.string().uuid(),
          quantity: z.number().positive(),
        })
        .parse(req.body);
      const { id } = req.params;
      const result = await inventoryService.transferInventory(
        id,
        fromWarehouseId,
        toWarehouseId,
        quantity,
        req.user?.id || 'system'
      );
      sendSuccess(res, 200, 'Inventory transferred successfully', result);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message, error.code);
      } else {
        sendError(res, 400, 'Validation error', 'VALIDATION_ERROR');
      }
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await inventoryService.deleteInventory(id);
      sendSuccess(res, 200, 'Inventory deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message, error.code);
      } else {
        sendError(res, 500, 'Internal server error');
      }
    }
  }
}
