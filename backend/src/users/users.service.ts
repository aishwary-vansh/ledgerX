import { randomUUID as uuid } from 'crypto';
// src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';

// In-memory store — swap to TypeORM repository for production DB
let userStore: User[] = [];
let idCounter = 1;

@Injectable()
export class UsersService {
  // ─── Seed ────────────────────────────────────────────────────────────
  async seed(email: string, password: string, name: string, role: UserRole = 'admin') {
    const exists = userStore.find((u) => u.email === email);
    if (exists) return exists;

    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id: String(idCounter++),
      email,
      name,
      passwordHash,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    userStore.push(user);
    return user;
  }

  // ─── Find ─────────────────────────────────────────────────────────────
  async findByEmail(email: string): Promise<User | undefined> {
    return userStore.find((u) => u.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return userStore.find((u) => u.id === id);
  }

  // ─── Create ───────────────────────────────────────────────────────────
  async create(email: string, password: string, name: string): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id: String(idCounter++),
      email,
      name,
      passwordHash,
      role: 'viewer',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    userStore.push(user);
    return user;
  }

  // ─── Safe profile (no hash) ───────────────────────────────────────────
  toProfile(user: User) {
    const { passwordHash, ...profile } = user;
    return profile;
  }
}
