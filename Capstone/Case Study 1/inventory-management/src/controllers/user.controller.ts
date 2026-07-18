import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';
import { UserCreateSchema, PaginationSchema } from '../models/types';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';
import { AppError } from '../utils/errors';
import { z } from 'zod';

const userService = new UserService();

export class UserController {
  static async register(req: AuthRequest, res: Response) {
    try {
      const validated = UserCreateSchema.parse(req.body);
      const user = await userService.createUser(validated);
      sendSuccess(res, 201, 'User registered successfully', user);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message, error.code);
      } else {
        sendError(res, 400, 'Validation error', 'VALIDATION_ERROR');
      }
    }
  }

  static async login(req: AuthRequest, res: Response) {
    try {
      const { email, password } = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
      const result = await userService.login(email, password);
      sendSuccess(res, 200, 'Login successful', {
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message, error.code);
      } else {
        sendError(res, 400, 'Validation error', 'VALIDATION_ERROR');
      }
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 401, 'User not authenticated', 'UNAUTHORIZED');
      }
      const user = await userService.getUser(req.user.id);
      sendSuccess(res, 200, 'Profile retrieved', user);
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
      const result = await userService.getAllUsers(pagination);
      sendPaginatedSuccess(res, 200, 'Users retrieved', result.data, {
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
      const validated = z
        .object({ name: z.string().optional(), role: z.enum(['ADMIN', 'MANAGER', 'STAFF']).optional() })
        .parse(req.body);
      const user = await userService.updateUser(id, validated);
      sendSuccess(res, 200, 'User updated successfully', user);
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
      await userService.deleteUser(id);
      sendSuccess(res, 200, 'User deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message, error.code);
      } else {
        sendError(res, 500, 'Internal server error');
      }
    }
  }
}
