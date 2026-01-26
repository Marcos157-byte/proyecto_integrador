import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 👉 aquí obtienes los roles que pide el decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 👉 aquí imprimes para verificar
    console.log("📌 Roles requeridos:", requiredRoles);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    console.log("👤 Usuario en request:", user);

    if (!user) return false;

    const userRoles: string[] = Array.isArray(user.roles)
      ? user.roles.map((r: string) => r.toLowerCase())
      : user.rol
      ? [user.rol.toLowerCase()]
      : [];

    console.log("✅ Roles del usuario:", userRoles);

    return requiredRoles.some((role) => userRoles.includes(role.toLowerCase()));
  }
}