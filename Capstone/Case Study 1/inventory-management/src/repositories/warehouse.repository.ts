import { v4 as uuidv4 } from 'uuid';
import { Warehouse, WarehouseCreate } from '../models/types';
import { NotFoundError } from '../utils/errors';

// In-memory store (will be replaced with database)
let warehouseStore: Warehouse[] = [];

export class WarehouseRepository {
  async create(data: WarehouseCreate): Promise<Warehouse> {
    const warehouse: Warehouse = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    warehouseStore.push(warehouse);
    return warehouse;
  }

  async findById(id: string): Promise<Warehouse | null> {
    return warehouseStore.find(w => w.id === id) || null;
  }

  async findAll(skip: number = 0, take: number = 10): Promise<[Warehouse[], number]> {
    const total = warehouseStore.length;
    const data = warehouseStore.slice(skip, skip + take);
    return [data, total];
  }

  async update(id: string, data: Partial<WarehouseCreate>): Promise<Warehouse> {
    const warehouse = await this.findById(id);
    if (!warehouse) {
      throw new NotFoundError(`Warehouse with ID ${id} not found`);
    }

    const updated: Warehouse = {
      ...warehouse,
      ...data,
      updatedAt: new Date(),
    };

    const index = warehouseStore.findIndex(w => w.id === id);
    warehouseStore[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = warehouseStore.findIndex(w => w.id === id);
    if (index === -1) {
      throw new NotFoundError(`Warehouse with ID ${id} not found`);
    }
    warehouseStore.splice(index, 1);
    return true;
  }

  async clear(): Promise<void> {
    warehouseStore = [];
  }
}
