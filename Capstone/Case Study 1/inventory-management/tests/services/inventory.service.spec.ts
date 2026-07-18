import { InventoryService } from '../../src/services/inventory.service';
import { ProductService } from '../../src/services/product.service';
import { WarehouseService } from '../../src/services/warehouse.service';
import { ValidationError } from '../../src/utils/errors';

describe('InventoryService', () => {
  let inventoryService: InventoryService;
  let productService: ProductService;
  let warehouseService: WarehouseService;

  beforeEach(() => {
    inventoryService = new InventoryService();
    productService = new ProductService();
    warehouseService = new WarehouseService();
  });

  afterEach(async () => {
    await inventoryService.getRepository().clear();
    await productService.getRepository().clear();
    await warehouseService.getRepository().clear();
  });

  describe('createInventory', () => {
    it('should create inventory for valid product and warehouse', async () => {
      const product = await productService.createProduct({
        name: 'Test Product',
        sku: 'TEST001',
        price: 100,
        category: 'Test',
        supplier: 'Test Supplier',
      });

      const warehouse = await warehouseService.createWarehouse({
        name: 'Test Warehouse',
        location: 'Test Location',
        capacity: 1000,
        manager: 'Test Manager',
        contact: 'test@warehouse.com',
      });

      const inventory = await inventoryService.createInventory({
        productId: product.id,
        warehouseId: warehouse.id,
        quantity: 100,
        minThreshold: 10,
        maxThreshold: 500,
      });

      expect(inventory).toBeDefined();
      expect(inventory.productId).toBe(product.id);
      expect(inventory.warehouseId).toBe(warehouse.id);
      expect(inventory.status).toBe('IN_STOCK');
    });

    it('should throw error for invalid product', async () => {
      const warehouse = await warehouseService.createWarehouse({
        name: 'Test Warehouse',
        location: 'Test Location',
        capacity: 1000,
        manager: 'Test Manager',
        contact: 'test@warehouse.com',
      });

      await expect(
        inventoryService.createInventory({
          productId: 'invalid-id',
          warehouseId: warehouse.id,
          quantity: 100,
          minThreshold: 10,
          maxThreshold: 500,
        })
      ).rejects.toThrow(ValidationError);
    });

    it('should set status to OUT_OF_STOCK when quantity is 0', async () => {
      const product = await productService.createProduct({
        name: 'Test Product',
        sku: 'TEST001',
        price: 100,
        category: 'Test',
        supplier: 'Test Supplier',
      });

      const warehouse = await warehouseService.createWarehouse({
        name: 'Test Warehouse',
        location: 'Test Location',
        capacity: 1000,
        manager: 'Test Manager',
        contact: 'test@warehouse.com',
      });

      const inventory = await inventoryService.createInventory({
        productId: product.id,
        warehouseId: warehouse.id,
        quantity: 0,
        minThreshold: 10,
        maxThreshold: 500,
      });

      expect(inventory.status).toBe('OUT_OF_STOCK');
    });

    it('should set status to LOW_STOCK when quantity is below threshold', async () => {
      const product = await productService.createProduct({
        name: 'Test Product',
        sku: 'TEST001',
        price: 100,
        category: 'Test',
        supplier: 'Test Supplier',
      });

      const warehouse = await warehouseService.createWarehouse({
        name: 'Test Warehouse',
        location: 'Test Location',
        capacity: 1000,
        manager: 'Test Manager',
        contact: 'test@warehouse.com',
      });

      const inventory = await inventoryService.createInventory({
        productId: product.id,
        warehouseId: warehouse.id,
        quantity: 5,
        minThreshold: 10,
        maxThreshold: 500,
      });

      expect(inventory.status).toBe('LOW_STOCK');
    });
  });

  describe('transferInventory', () => {
    it('should transfer inventory between warehouses', async () => {
      const product = await productService.createProduct({
        name: 'Test Product',
        sku: 'TEST001',
        price: 100,
        category: 'Test',
        supplier: 'Test Supplier',
      });

      const warehouse1 = await warehouseService.createWarehouse({
        name: 'Warehouse 1',
        location: 'Location 1',
        capacity: 1000,
        manager: 'Manager 1',
        contact: 'manager1@warehouse.com',
      });

      const warehouse2 = await warehouseService.createWarehouse({
        name: 'Warehouse 2',
        location: 'Location 2',
        capacity: 1000,
        manager: 'Manager 2',
        contact: 'manager2@warehouse.com',
      });

      const inv1 = await inventoryService.createInventory({
        productId: product.id,
        warehouseId: warehouse1.id,
        quantity: 100,
        minThreshold: 10,
        maxThreshold: 500,
      });

      const result = await inventoryService.transferInventory(
        inv1.id,
        warehouse1.id,
        warehouse2.id,
        50,
        'test-user'
      );

      expect(result.from.quantity).toBe(50);
      expect(result.to.quantity).toBe(50);
    });

    it('should throw error when insufficient inventory', async () => {
      const product = await productService.createProduct({
        name: 'Test Product',
        sku: 'TEST001',
        price: 100,
        category: 'Test',
        supplier: 'Test Supplier',
      });

      const warehouse1 = await warehouseService.createWarehouse({
        name: 'Warehouse 1',
        location: 'Location 1',
        capacity: 1000,
        manager: 'Manager 1',
        contact: 'manager1@warehouse.com',
      });

      const warehouse2 = await warehouseService.createWarehouse({
        name: 'Warehouse 2',
        location: 'Location 2',
        capacity: 1000,
        manager: 'Manager 2',
        contact: 'manager2@warehouse.com',
      });

      const inv1 = await inventoryService.createInventory({
        productId: product.id,
        warehouseId: warehouse1.id,
        quantity: 30,
        minThreshold: 10,
        maxThreshold: 500,
      });

      await expect(
        inventoryService.transferInventory(inv1.id, warehouse1.id, warehouse2.id, 50, 'test-user')
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getLowStockItems', () => {
    it('should return items not in stock', async () => {
      const product = await productService.createProduct({
        name: 'Test Product',
        sku: 'TEST001',
        price: 100,
        category: 'Test',
        supplier: 'Test Supplier',
      });

      const warehouse = await warehouseService.createWarehouse({
        name: 'Test Warehouse',
        location: 'Test Location',
        capacity: 1000,
        manager: 'Test Manager',
        contact: 'test@warehouse.com',
      });

      await inventoryService.createInventory({
        productId: product.id,
        warehouseId: warehouse.id,
        quantity: 5,
        minThreshold: 10,
        maxThreshold: 500,
      });

      const result = await inventoryService.getLowStockItems({ page: 1, limit: 10, sort: '', order: 'DESC' });

      expect(result.data.length).toBe(1);
      expect(result.data[0].status).toBe('LOW_STOCK');
    });
  });
});
