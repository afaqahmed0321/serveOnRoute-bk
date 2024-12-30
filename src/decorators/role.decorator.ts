import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ROLE } from '@enums/role.enum';
import { RolesGuard } from '@guards/roles.guard';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export function Auth(...roles: ROLE[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}