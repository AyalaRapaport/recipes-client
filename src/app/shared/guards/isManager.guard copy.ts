import { CanActivateFn } from '@angular/router';
import { UsersService } from '../services/users.service';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const isManagerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)

  return authService.currentUser?.role == 'admin' ? true : false;
};
