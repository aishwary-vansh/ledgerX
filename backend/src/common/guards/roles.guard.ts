// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/user.entity';

/**
 * Checks that the JWT-authenticated user has one of the required roles.
 * Must be used AFTER JwtAuthGuard so request.user is populated.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Authentication required');

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Role '${user.role}' is not authorised. Required: ${requiredRoles.join(' | ')}`,
      );
    }

    return true;
  }
}
