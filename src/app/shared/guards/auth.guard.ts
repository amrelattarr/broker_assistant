import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  try {
    const token = localStorage.getItem('auth_token');
    if (token) {
      return true;
    }
  } catch {}
  router.navigate(['/login']);
  return false;
};


