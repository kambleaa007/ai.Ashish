import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProductService } from '../services/product.service';
import { ProductCreateSchema, PaginationSchema } from '../models/types';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';
import { AppError } from '../utils/errors';

const productService = new ProductService();

export class ProductController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const validated = ProductCreateSchema.parse(req.body);
      const product = await productService.createProduct(validated);
      sendSuccess(res, 201, 'Product created successfully', product);
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
      const product = await productService.getProduct(id);
      sendSuccess(res, 200, 'Product retrieved', product);
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
      const result = await productService.getAllProducts(pagination);
      sendPaginatedSuccess(res, 200, 'Products retrieved', result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (error) {
      sendError(res, 400, 'Invalid pagination parameters', 'VALIDATION_ERROR');
    }
  }

  static async getByCategory(req: AuthRequest, res: Response) {
    try {
      const { category } = req.params;
      const pagination = PaginationSchema.parse({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      });
      const result = await productService.getProductsByCategory(category, pagination);
      sendPaginatedSuccess(res, 200, `Products in category ${category}`, result.data, {
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
      const { id } = req.params;
      const validated = ProductCreateSchema.partial().parse(req.body);
      const product = await productService.updateProduct(id, validated);
      sendSuccess(res, 200, 'Product updated successfully', product);
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
      await productService.deleteProduct(id);
      sendSuccess(res, 200, 'Product deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message, error.code);
      } else {
        sendError(res, 500, 'Internal server error');
      }
    }
  }
}
