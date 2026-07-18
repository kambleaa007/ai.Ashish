import { UserRepository } from '../repositories/user.repository';
import { User, UserCreate, Pagination, JWTPayload } from '../models/types';
import { ValidationError, UnauthorizedError } from '../utils/errors';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(data: UserCreate): Promise<User> {
    // Check for duplicate email
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ValidationError(`User with email ${data.email} already exists`, 'DUPLICATE_EMAIL');
    }

    try {
      return await this.repository.create(data);
    } catch (error) {
      throw new ValidationError(`Failed to create user: ${(error as Error).message}`);
    }
  }

  async getUser(id: string): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new ValidationError(`User ${id} not found`, 'USER_NOT_FOUND');
    }
    return user;
  }

  async getAllUsers(pagination: Pagination): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await this.repository.findAll(skip, pagination.limit);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async updateUser(id: string, data: Partial<Omit<UserCreate, 'password'>>): Promise<User> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw new ValidationError(`Failed to update user: ${(error as Error).message}`);
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new ValidationError(`Failed to delete user: ${(error as Error).message}`);
    }
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const userWithHash = await this.repository.findByEmail(email);
    if (!userWithHash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await this.repository.verifyPassword(email, password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const user = await this.repository.findById(userWithHash.id);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  generateToken(user: User): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  }

  verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  getRepository() {
    return this.repository;
  }
}
