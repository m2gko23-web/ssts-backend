import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '@common/enums/roles.enum';

export const ROLES_KEY = 'roles';

/**
 * @Roles(Role.ADMIN, Role.SUPERVISOR)
 * Restrict endpoint to specific roles
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/**
 * @CurrentUser()
 * Extract the authenticated user from request
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

/**
 * @Public()
 * Mark endpoint as publicly accessible (no JWT required)
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);