import { v4 as uuidv4 } from 'uuid';
import { Inventory, InventoryCreate } from '../models/types';
import { NotFoundError } from '../utils/errors';

let inventoryStore: Inventory[] = [];

const getStatus = (quantity: number, minThreshold: number): 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' => {
  if (quantity === 0) return 'OUT_OF_STOCK';
  if (quantity <= minThreshold) return 'LOW_STOCK';
  return 'IN_STOCK';
};

export class InventoryRepository {
  async create(data: InventoryCreate): Promise<Inventory> {
    const status = getStatus(data.quantity, data.minThreshold);
    const inventory: Inventory = {
      ...data,
      id: uuidv4(),
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inventoryStore.push(inventory);
    return inventory;
  }

  async findById(id: string): Promise<Inventory | null> {
    return inventoryStore.find(i => i.id === id) || null;
  }

  async findByProductAndWarehouse(productId: string, warehouseId: string): Promise<Inventory | null> {
    return (
      inventoryStore.find(
        i => i.productId === productId && i.warehouseId === warehouseId
      ) || null
    );
  }

  async findByWarehouse(warehouseId: string, skip: number = 0, take: number = 10): Promise<[Inventory[], number]> {
    const filtered = inventoryStore.filter(i => i.warehouseId === warehouseId);
    const total = filtered.length;
    const data = filtered.slice(skip, skip + take);
    return [data, total];
  }

  async findByProduct(productId: string, skip: number = 0, take: number = 10): Promise<[Inventory[], number]> {
    const filtered = inventoryStore.filter(i => i.productId === productId);
    const total = filtered.length;
    const data = filtered.slice(skip, skip + take);
    return [data, total];
  }

  async findAll(skip: number = 0, take: number = 10): Promise<[Inventory[], number]> {
    const total = inventoryStore.length;
    const data = inventoryStore.slice(skip, skip + take);
    return [data, total];
  }

  async findLowStock(skip: number = 0, take: number = 10): Promise<[Inventory[], number]> {
    const filtered = inventoryStore.filter(i => i.status !== 'IN_STOCK');
    const total = filtered.length;
    const data = filtered.slice(skip, skip + take);
    return [data, total];
  }

  async update(id: string, data: Partial<InventoryCreate>): Promise<Inventory> {
    const inventory = await this.findById(id);
    if (!inventory) {
      throw new NotFoundError(`Inventory with ID ${id} not found`);
    }

    const updated: Inventory = {
      ...inventory,
      ...data,
      status: getStatus(data.quantity ?? inventory.quantity, data.minThreshold ?? inventory.minThreshold),
      updatedAt: new Date(),
    };

    const index = inventoryStore.findIndex(i => i.id === id);
    inventoryStore[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = inventoryStore.findIndex(i => i.id === id);
    if (index === -1) {
      throw new NotFoundError(`Inventory with ID ${id} not found`);
    }
    inventoryStore.splice(index, 1);
    return true;
  }

  async clear(): Promise<void> {
    inventoryStore = [];
  }
}
