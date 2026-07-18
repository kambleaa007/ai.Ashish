import { WarehouseRepository } from '../repositories/warehouse.repository';
import { WarehouseCreate, Warehouse, Pagination } from '../models/types';
import { ValidationError } from '../utils/errors';

export class WarehouseService {
  private repository: WarehouseRepository;

  constructor() {
    this.repository = new WarehouseRepository();
  }

  async createWarehouse(data: WarehouseCreate): Promise<Warehouse> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw new ValidationError(`Failed to create warehouse: ${(error as Error).message}`);
    }
  }

  async getWarehouse(id: string): Promise<Warehouse> {
    const warehouse = await this.repository.findById(id);
    if (!warehouse) {
      throw new ValidationError(`Warehouse ${id} not found`, 'WAREHOUSE_NOT_FOUND');
    }
    return warehouse;
  }

  async getAllWarehouses(pagination: Pagination): Promise<{ data: Warehouse[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findAll(skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async updateWarehouse(id: string, data: Partial<WarehouseCreate>): Promise<Warehouse> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw new ValidationError(`Failed to update warehouse: ${(error as Error).message}`);
    }
  }

  async deleteWarehouse(id: string): Promise<boolean> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new ValidationError(`Failed to delete warehouse: ${(error as Error).message}`);
    }
  }

  getRepository() {
    return this.repository;
  }
}
