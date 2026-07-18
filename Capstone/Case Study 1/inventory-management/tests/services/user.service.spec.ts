import { UserService } from '../../src/services/user.service';
import { ValidationError, UnauthorizedError } from '../../src/utils/errors';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  afterEach(async () => {
    await service.getRepository().clear();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const user = await service.createUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'STAFF',
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('STAFF');
    });

    it('should throw error for duplicate email', async () => {
      await service.createUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'STAFF',
      });

      await expect(
        service.createUser({
          email: 'test@example.com',
          password: 'password456',
          name: 'Another User',
          role: 'STAFF',
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('login', () => {
    it('should login with correct credentials', async () => {
      await service.createUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'ADMIN',
      });

      const result = await service.login('test@example.com', 'password123');

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error for invalid credentials', async () => {
      await service.createUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'STAFF',
      });

      await expect(service.login('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw error for non-existent user', async () => {
      await expect(service.login('nonexistent@example.com', 'password')).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('generateToken and verifyToken', () => {
    it('should generate and verify token', async () => {
      const user = await service.createUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'MANAGER',
      });

      const token = service.generateToken(user);
      const payload = service.verifyToken(token);

      expect(payload.id).toBe(user.id);
      expect(payload.email).toBe(user.email);
      expect(payload.role).toBe('MANAGER');
    });

    it('should throw error for invalid token', () => {
      expect(() => service.verifyToken('invalid-token')).toThrow(UnauthorizedError);
    });
  });

  describe('getUser', () => {
    it('should get user by ID', async () => {
      const created = await service.createUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'STAFF',
      });

      const user = await service.getUser(created.id);

      expect(user.id).toBe(created.id);
      expect(user.email).toBe('test@example.com');
    });

    it('should throw error for non-existent user', async () => {
      await expect(service.getUser('non-existent-id')).rejects.toThrow(ValidationError);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const user = await service.createUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'STAFF',
      });

      const updated = await service.updateUser(user.id, {
        name: 'Updated Name',
        role: 'MANAGER',
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.role).toBe('MANAGER');
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const user = await service.createUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'STAFF',
      });

      const result = await service.deleteUser(user.id);
      expect(result).toBe(true);

      await expect(service.getUser(user.id)).rejects.toThrow(ValidationError);
    });
  });
});
