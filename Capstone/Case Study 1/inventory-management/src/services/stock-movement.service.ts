import { StockMovementRepository } from '../repositories/stock-movement.repository';
import { StockMovement, Pagination } from '../models/types';
import { ValidationError } from '../utils/errors';

export class StockMovementService {
  private repository: StockMovementRepository;

  constructor() {
    this.repository = new StockMovementRepository();
  }

  async getMovement(id: string): Promise<StockMovement> {
    const movement = await this.repository.findById(id);
    if (!movement) {
      throw new ValidationError(`Stock movement ${id} not found`, 'MOVEMENT_NOT_FOUND');
    }
    return movement;
  }

  async getAllMovements(pagination: Pagination): Promise<{ data: StockMovement[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findAll(skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async getMovementsByProduct(productId: string, pagination: Pagination): Promise<{ data: StockMovement[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findByProduct(productId, skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async getMovementsByWarehouse(warehouseId: string, pagination: Pagination): Promise<{ data: StockMovement[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findByWarehouse(warehouseId, skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async getMovementsByType(type: string, pagination: Pagination): Promise<{ data: StockMovement[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findByType(type, skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async deleteMovement(id: string): Promise<boolean> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new ValidationError(`Failed to delete movement: ${(error as Error).message}`);
    }
  }

  getRepository() {
    return this.repository;
  }
}
