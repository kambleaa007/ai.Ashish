import { InventoryRepository } from '../repositories/inventory.repository';
import { InventoryCreate, Inventory, Pagination, StockMovementCreate } from '../models/types';
import { ValidationError } from '../utils/errors';
import { StockMovementRepository } from '../repositories/stock-movement.repository';
import { ProductRepository } from '../repositories/product.repository';
import { WarehouseRepository } from '../repositories/warehouse.repository';

export class InventoryService {
  private repository: InventoryRepository;
  private movementRepository: StockMovementRepository;
  private productRepository: ProductRepository;
  private warehouseRepository: WarehouseRepository;

  constructor() {
    this.repository = new InventoryRepository();
    this.movementRepository = new StockMovementRepository();
    this.productRepository = new ProductRepository();
    this.warehouseRepository = new WarehouseRepository();
  }

  async createInventory(data: InventoryCreate): Promise<Inventory> {
    // Validate product and warehouse exist
    const product = await this.productRepository.findById(data.productId);
    const warehouse = await this.warehouseRepository.findById(data.warehouseId);

    if (!product) {
      throw new ValidationError(`Product ${data.productId} not found`, 'PRODUCT_NOT_FOUND');
    }
    if (!warehouse) {
      throw new ValidationError(`Warehouse ${data.warehouseId} not found`, 'WAREHOUSE_NOT_FOUND');
    }

    // Check if inventory already exists for this product-warehouse combination
    const existing = await this.repository.findByProductAndWarehouse(data.productId, data.warehouseId);
    if (existing) {
      throw new ValidationError(
        `Inventory already exists for product ${data.productId} in warehouse ${data.warehouseId}`,
        'DUPLICATE_INVENTORY'
      );
    }

    try {
      return await this.repository.create(data);
    } catch (error) {
      throw new ValidationError(`Failed to create inventory: ${(error as Error).message}`);
    }
  }

  async getInventory(id: string): Promise<Inventory> {
    const inventory = await this.repository.findById(id);
    if (!inventory) {
      throw new ValidationError(`Inventory ${id} not found`, 'INVENTORY_NOT_FOUND');
    }
    return inventory;
  }

  async getAllInventory(pagination: Pagination): Promise<{ data: Inventory[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findAll(skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async getLowStockItems(pagination: Pagination): Promise<{ data: Inventory[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findLowStock(skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async getInventoryByWarehouse(warehouseId: string, pagination: Pagination): Promise<{ data: Inventory[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findByWarehouse(warehouseId, skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async getInventoryByProduct(productId: string, pagination: Pagination): Promise<{ data: Inventory[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findByProduct(productId, skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async updateInventory(id: string, quantity: number, userId: string): Promise<Inventory> {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new ValidationError(`Inventory ${id} not found`, 'INVENTORY_NOT_FOUND');
    }

    // Create stock movement for audit trail
    if (quantity !== current.quantity) {
      const movement: StockMovementCreate = {
        productId: current.productId,
        toWarehouseId: current.warehouseId,
        quantity: Math.abs(quantity - current.quantity),
        type: quantity > current.quantity ? 'INBOUND' : 'OUTBOUND',
        notes: `Inventory adjustment from ${current.quantity} to ${quantity}`,
      };
      await this.movementRepository.create(movement, userId);
    }

    try {
      return await this.repository.update(id, { quantity });
    } catch (error) {
      throw new ValidationError(`Failed to update inventory: ${(error as Error).message}`);
    }
  }

  async transferInventory(
    inventoryId: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    quantity: number,
    userId: string
  ): Promise<{ from: Inventory; to: Inventory }> {
    const fromInventory = await this.repository.findById(inventoryId);
    if (!fromInventory) {
      throw new ValidationError(`Inventory ${inventoryId} not found`, 'INVENTORY_NOT_FOUND');
    }

    if (fromInventory.quantity < quantity) {
      throw new ValidationError(`Insufficient inventory. Available: ${fromInventory.quantity}`, 'INSUFFICIENT_INVENTORY');
    }

    // Reduce quantity from source
    const updated = await this.repository.update(inventoryId, {
      quantity: fromInventory.quantity - quantity,
    });

    // Find or create inventory in destination warehouse
    let toInventory = await this.repository.findByProductAndWarehouse(fromInventory.productId, toWarehouseId);
    if (!toInventory) {
      toInventory = await this.repository.create({
        productId: fromInventory.productId,
        warehouseId: toWarehouseId,
        quantity,
        minThreshold: 0,
        maxThreshold: 10000,
      });
    } else {
      toInventory = await this.repository.update(toInventory.id, {
        quantity: toInventory.quantity + quantity,
      });
    }

    // Record stock movement
    const movement: StockMovementCreate = {
      productId: fromInventory.productId,
      fromWarehouseId,
      toWarehouseId,
      quantity,
      type: 'TRANSFER',
      notes: `Transfer from ${fromWarehouseId} to ${toWarehouseId}`,
    };
    await this.movementRepository.create(movement, userId);

    return { from: updated, to: toInventory };
  }

  async deleteInventory(id: string): Promise<boolean> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new ValidationError(`Failed to delete inventory: ${(error as Error).message}`);
    }
  }

  getRepository() {
    return this.repository;
  }
}
