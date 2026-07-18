import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from '../../src/utils/errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create AppError with status code and message', () => {
      const error = new AppError(500, 'Internal error', 'INTERNAL_ERROR');

      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Internal error');
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('ValidationError', () => {
    it('should create ValidationError with 400 status', () => {
      const error = new ValidationError('Invalid input');

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('NotFoundError', () => {
    it('should create NotFoundError with 404 status', () => {
      const error = new NotFoundError('Resource not found');

      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
      expect(error.code).toBe('NOT_FOUND');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create UnauthorizedError with 401 status', () => {
      const error = new UnauthorizedError('Unauthorized access');

      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Unauthorized access');
      expect(error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('ForbiddenError', () => {
    it('should create ForbiddenError with 403 status', () => {
      const error = new ForbiddenError('Forbidden');

      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Forbidden');
      expect(error.code).toBe('FORBIDDEN');
    });
  });
});
