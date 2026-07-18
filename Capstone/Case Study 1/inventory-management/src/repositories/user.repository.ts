import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User, UserCreate } from '../models/types';
import { NotFoundError } from '../utils/errors';

let userStore: Array<User & { passwordHash: string }> = [];

export class UserRepository {
  async create(data: UserCreate): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user: User & { passwordHash: string } = {
      id: uuidv4(),
      email: data.email,
      name: data.name,
      role: data.role || 'STAFF',
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordHash,
    };
    userStore.push(user);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = userStore.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async findByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    return userStore.find(u => u.email === email) || null;
  }

  async findAll(skip: number = 0, take: number = 10): Promise<[User[], number]> {
    const total = userStore.length;
    const data = userStore.slice(skip, skip + take).map(({ passwordHash, ...rest }) => rest);
    return [data, total];
  }

  async update(id: string, data: Partial<Omit<UserCreate, 'password'>>): Promise<User> {
    const user = userStore.find(u => u.id === id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    const updated = { ...user, ...data, updatedAt: new Date() };
    const index = userStore.findIndex(u => u.id === id);
    userStore[index] = updated;

    const { passwordHash, ...rest } = updated;
    return rest;
  }

  async delete(id: string): Promise<boolean> {
    const index = userStore.findIndex(u => u.id === id);
    if (index === -1) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    userStore.splice(index, 1);
    return true;
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  async clear(): Promise<void> {
    userStore = [];
  }
}
