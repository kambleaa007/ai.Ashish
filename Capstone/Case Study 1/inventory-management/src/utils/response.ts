import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(res: Response, statusCode: number, message: string, data?: T): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  } as ApiResponse<T>);
};

export const sendPaginatedSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T[],
  pagination: { page: number; limit: number; total: number }
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

export const sendError = (res: Response, statusCode: number, message: string, code?: string): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: code,
  });
};
