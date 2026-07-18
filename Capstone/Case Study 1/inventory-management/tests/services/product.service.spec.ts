import { ProductService } from '../../src/services/product.service';
import { ProductCreate, Product } from '../../src/models/types';
import { ValidationError } from '../../src/utils/errors';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
  });

  afterEach(async () => {
    await service.getRepository().clear();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const data: ProductCreate = {
        name: 'Laptop',
        sku: 'LAP001',
        description: 'High performance laptop',
        price: 999.99,
        category: 'Electronics',
        supplier: 'TechCorp',
      };

      const product = await service.createProduct(data);

      expect(product).toBeDefined();
      expect(product.name).toBe(data.name);
      expect(product.sku).toBe('LAP001');
    });

    it('should throw error for duplicate SKU', async () => {
      const data: ProductCreate = {
        name: 'Product 1',
        sku: 'SKU001',
        price: 100,
        category: 'Category',
        supplier: 'Supplier',
      };

      await service.createProduct(data);

      await expect(service.createProduct(data)).rejects.toThrow(ValidationError);
    });
  });

  describe('getProduct', () => {
    it('should get a product by ID', async () => {
      const data: ProductCreate = {
        name: 'Mouse',
        sku: 'MOUSE001',
        price: 25,
        category: 'Accessories',
        supplier: 'Peripherals Inc',
      };

      const created = await service.createProduct(data);
      const product = await service.getProduct(created.id);

      expect(product.id).toBe(created.id);
      expect(product.name).toBe(data.name);
    });

    it('should throw error for non-existent product', async () => {
      await expect(service.getProduct('non-existent-id')).rejects.toThrow(ValidationError);
    });
  });

  describe('getAllProducts', () => {
    it('should return paginated products', async () => {
      const data1: ProductCreate = {
        name: 'Product 1',
        sku: 'P001',
        price: 100,
        category: 'Cat1',
        supplier: 'Supplier1',
      };

      const data2: ProductCreate = {
        name: 'Product 2',
        sku: 'P002',
        price: 200,
        category: 'Cat2',
        supplier: 'Supplier2',
      };

      await service.createProduct(data1);
      await service.createProduct(data2);

      const result = await service.getAllProducts({ page: 1, limit: 10, sort: '', order: 'DESC' });

      expect(result.data.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category', async () => {
      const data1: ProductCreate = {
        name: 'Laptop',
        sku: 'LAP001',
        price: 999,
        category: 'Electronics',
        supplier: 'Tech',
      };

      const data2: ProductCreate = {
        name: 'Book',
        sku: 'BOOK001',
        price: 20,
        category: 'Books',
        supplier: 'Publisher',
      };

      await service.createProduct(data1);
      await service.createProduct(data2);

      const result = await service.getProductsByCategory('Electronics', { page: 1, limit: 10, sort: '', order: 'DESC' });

      expect(result.data.length).toBe(1);
      expect(result.data[0].category).toBe('Electronics');
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const data: ProductCreate = {
        name: 'Original',
        sku: 'ORIG001',
        price: 100,
        category: 'Cat',
        supplier: 'Supplier',
      };

      const created = await service.createProduct(data);
      const updated = await service.updateProduct(created.id, {
        price: 150,
      });

      expect(updated.price).toBe(150);
      expect(updated.name).toBe(data.name);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const data: ProductCreate = {
        name: 'To Delete',
        sku: 'DEL001',
        price: 100,
        category: 'Cat',
        supplier: 'Supplier',
      };

      const created = await service.createProduct(data);
      const result = await service.deleteProduct(created.id);

      expect(result).toBe(true);

      await expect(service.getProduct(created.id)).rejects.toThrow();
    });
  });
});
