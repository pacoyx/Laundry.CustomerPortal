import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Permission } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

export const permissionGuard = (permission: Permission): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    if (authService.hasPermission(permission)) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };
};
