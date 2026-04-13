// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Called by LocalStrategy — verifies email + password.
   * Returns stripped user (no hash) or null on mismatch.
   */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return null;

    return this.usersService.toProfile(user);
  }

  /** Issue a JWT after successful LocalStrategy validation */
  async login(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  /** Register a new viewer account then immediately issue a token */
  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto.email, dto.password, dto.name);
    const profile = this.usersService.toProfile(user);
    return this.login(profile);
  }
}
