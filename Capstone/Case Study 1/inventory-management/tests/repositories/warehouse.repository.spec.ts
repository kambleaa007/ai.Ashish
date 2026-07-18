import { WarehouseRepository } from '../../src/repositories/warehouse.repository';
import { WarehouseCreate } from '../../src/models/types';

describe('WarehouseRepository', () => {
  let repository: WarehouseRepository;

  beforeEach(() => {
    repository = new WarehouseRepository();
  });

  afterEach(async () => {
    await repository.clear();
  });

  describe('create', () => {
    it('should create a warehouse', async () => {
      const data: WarehouseCreate = {
        name: 'Main Warehouse',
        location: 'New York',
        capacity: 1000,
        manager: 'John Doe',
        contact: 'john@warehouse.com',
      };

      const warehouse = await repository.create(data);

      expect(warehouse).toBeDefined();
      expect(warehouse.name).toBe(data.name);
      expect(warehouse.id).toBeDefined();
      expect(warehouse.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('findById', () => {
    it('should find a warehouse by ID', async () => {
      const data: WarehouseCreate = {
        name: 'Test Warehouse',
        location: 'Chicago',
        capacity: 500,
        manager: 'Jane Doe',
        contact: 'jane@warehouse.com',
      };

      const created = await repository.create(data);
      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe(data.name);
    });

    it('should return null for non-existent warehouse', async () => {
      const found = await repository.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all warehouses with pagination', async () => {
      const data1: WarehouseCreate = {
        name: 'Warehouse 1',
        location: 'Location 1',
        capacity: 100,
        manager: 'Manager 1',
        contact: 'manager1@warehouse.com',
      };

      const data2: WarehouseCreate = {
        name: 'Warehouse 2',
        location: 'Location 2',
        capacity: 200,
        manager: 'Manager 2',
        contact: 'manager2@warehouse.com',
      };

      await repository.create(data1);
      await repository.create(data2);

      const [warehouses, total] = await repository.findAll(0, 10);

      expect(warehouses.length).toBe(2);
      expect(total).toBe(2);
    });
  });

  describe('update', () => {
    it('should update a warehouse', async () => {
      const data: WarehouseCreate = {
        name: 'Original',
        location: 'Location',
        capacity: 100,
        manager: 'Manager',
        contact: 'manager@warehouse.com',
      };

      const created = await repository.create(data);
      const updated = await repository.update(created.id, {
        name: 'Updated',
        capacity: 200,
      });

      expect(updated.name).toBe('Updated');
      expect(updated.capacity).toBe(200);
      expect(updated.location).toBe(data.location);
    });

    it('should throw error for non-existent warehouse', async () => {
      await expect(
        repository.update('non-existent-id', { name: 'Updated' })
      ).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a warehouse', async () => {
      const data: WarehouseCreate = {
        name: 'To Delete',
        location: 'Location',
        capacity: 100,
        manager: 'Manager',
        contact: 'manager@warehouse.com',
      };

      const created = await repository.create(data);
      const result = await repository.delete(created.id);

      expect(result).toBe(true);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });

    it('should throw error for non-existent warehouse', async () => {
      await expect(repository.delete('non-existent-id')).rejects.toThrow();
    });
  });
});
