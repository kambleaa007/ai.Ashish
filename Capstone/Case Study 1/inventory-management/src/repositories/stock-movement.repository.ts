import { v4 as uuidv4 } from 'uuid';
import { StockMovement, StockMovementCreate } from '../models/types';
import { NotFoundError } from '../utils/errors';

let movementStore: StockMovement[] = [];

export class StockMovementRepository {
  async create(data: StockMovementCreate, userId: string): Promise<StockMovement> {
    const movement: StockMovement = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      createdBy: userId,
    };
    movementStore.push(movement);
    return movement;
  }

  async findById(id: string): Promise<StockMovement | null> {
    return movementStore.find(m => m.id === id) || null;
  }

  async findByProduct(productId: string, skip: number = 0, take: number = 10): Promise<[StockMovement[], number]> {
    const filtered = movementStore.filter(m => m.productId === productId);
    const total = filtered.length;
    const data = filtered.slice(skip, skip + take);
    return [data, total];
  }

  async findByWarehouse(warehouseId: string, skip: number = 0, take: number = 10): Promise<[StockMovement[], number]> {
    const filtered = movementStore.filter(
      m => m.toWarehouseId === warehouseId || m.fromWarehouseId === warehouseId
    );
    const total = filtered.length;
    const data = filtered.slice(skip, skip + take);
    return [data, total];
  }

  async findAll(skip: number = 0, take: number = 10): Promise<[StockMovement[], number]> {
    const total = movementStore.length;
    const data = movementStore.slice(skip, skip + take);
    return [data, total];
  }

  async findByType(type: string, skip: number = 0, take: number = 10): Promise<[StockMovement[], number]> {
    const filtered = movementStore.filter(m => m.type === type);
    const total = filtered.length;
    const data = filtered.slice(skip, skip + take);
    return [data, total];
  }

  async delete(id: string): Promise<boolean> {
    const index = movementStore.findIndex(m => m.id === id);
    if (index === -1) {
      throw new NotFoundError(`Stock movement with ID ${id} not found`);
    }
    movementStore.splice(index, 1);
    return true;
  }

  async clear(): Promise<void> {
    movementStore = [];
  }
}
