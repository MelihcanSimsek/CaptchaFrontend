import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const logoutGuard: CanActivateFn = (route, state) => {
   const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.loggedIn()) {
    return true;
  } else {
    return router.createUrlTree(['/home']);
  }
};
