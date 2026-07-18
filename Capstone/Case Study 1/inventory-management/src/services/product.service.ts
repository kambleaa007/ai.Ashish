import { ProductRepository } from '../repositories/product.repository';
import { ProductCreate, Product, Pagination } from '../models/types';
import { ValidationError } from '../utils/errors';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async createProduct(data: ProductCreate): Promise<Product> {
    // Check for duplicate SKU
    const existing = await this.repository.findBySku(data.sku);
    if (existing) {
      throw new ValidationError(`Product with SKU ${data.sku} already exists`, 'DUPLICATE_SKU');
    }

    try {
      return await this.repository.create(data);
    } catch (error) {
      throw new ValidationError(`Failed to create product: ${(error as Error).message}`);
    }
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new ValidationError(`Product ${id} not found`, 'PRODUCT_NOT_FOUND');
    }
    return product;
  }

  async getAllProducts(pagination: Pagination): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findAll(skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async getProductsByCategory(category: string, pagination: Pagination): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findByCategory(category, skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async updateProduct(id: string, data: Partial<ProductCreate>): Promise<Product> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw new ValidationError(`Failed to update product: ${(error as Error).message}`);
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new ValidationError(`Failed to delete product: ${(error as Error).message}`);
    }
  }

  getRepository() {
    return this.repository;
  }
}
