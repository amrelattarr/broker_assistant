import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  try {
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.navigate(['/home']);
      return false;
    }
  } catch {}
  return true;
};


