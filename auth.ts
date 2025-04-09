// authrole.guard.ts
import { createAuthGuard } from 'keycloak-angular';
import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserRoleService } from './user-role.service';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  __: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const router = inject(Router);
  const userRoleService = inject(UserRoleService);

  const requiredRole = route.data['role'];

  if (!requiredRole) {
    return false;
  }

  // Ensure roles are loaded (do this only once per app load ideally)
  if (!userRoleService.roles.length) {
    await userRoleService.loadRoles();
  }

  if (userRoleService.hasRole(requiredRole)) {
    return true;
  }

  return router.parseUrl('/forbidden');
};

export const canActivateAuthRole = createAuthGuard(isAccessAllowed);