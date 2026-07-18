import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { WarehouseService } from '../services/warehouse.service';
import { WarehouseCreateSchema, PaginationSchema } from '../models/types';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';
import { AppError, ValidationError } from '../utils/errors';

const warehouseService = new WarehouseService();

export class WarehouseController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const validated = WarehouseCreateSchema.parse(req.body);
      const warehouse = await warehouseService.createWarehouse(validated);
      sendSuccess(res, 201, 'Warehouse created successfully', warehouse);
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
      // FIX: Cast parameter safely to string for Express 5 parameters type-matching
      const id = String(req.params.id);
      const warehouse = await warehouseService.getWarehouse(id);
      sendSuccess(res, 200, 'Warehouse retrieved', warehouse);
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
      const result = await warehouseService.getAllWarehouses(pagination);
      sendPaginatedSuccess(res, 200, 'Warehouses retrieved', result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (error) {
      sendError(res, 400, 'Invalid pagination parameters', 'VALIDATION_ERROR');
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      // FIX: Cast parameters safely to string
      const id = String(req.params.id);
      const validated = WarehouseCreateSchema.partial().parse(req.body);
      const warehouse = await warehouseService.updateWarehouse(id, validated);
      sendSuccess(res, 200, 'Warehouse updated successfully', warehouse);
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
      // FIX: Cast parameters safely to string
      const id = String(req.params.id);
      await warehouseService.deleteWarehouse(id);
      sendSuccess(res, 200, 'Warehouse deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message, error.code);
      } else {
        sendError(res, 500, 'Internal server error');
      }
    }
  }
}
