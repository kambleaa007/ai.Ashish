import { v4 as uuidv4 } from 'uuid';
import { Product, ProductCreate } from '../models/types';
import { NotFoundError } from '../utils/errors';

let productStore: Product[] = [];

export class ProductRepository {
  async create(data: ProductCreate): Promise<Product> {
    const product: Product = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    productStore.push(product);
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    return productStore.find(p => p.id === id) || null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    return productStore.find(p => p.sku === sku) || null;
  }

  async findAll(skip: number = 0, take: number = 10): Promise<[Product[], number]> {
    const total = productStore.length;
    const data = productStore.slice(skip, skip + take);
    return [data, total];
  }

  async findByCategory(category: string, skip: number = 0, take: number = 10): Promise<[Product[], number]> {
    const filtered = productStore.filter(p => p.category === category);
    const total = filtered.length;
    const data = filtered.slice(skip, skip + take);
    return [data, total];
  }

  async update(id: string, data: Partial<ProductCreate>): Promise<Product> {
    const product = await this.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    const updated: Product = {
      ...product,
      ...data,
      updatedAt: new Date(),
    };

    const index = productStore.findIndex(p => p.id === id);
    productStore[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = productStore.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    productStore.splice(index, 1);
    return true;
  }

  async clear(): Promise<void> {
    productStore = [];
  }
}
