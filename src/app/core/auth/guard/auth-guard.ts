import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const platform = inject(PLATFORM_ID);
  const router = inject(Router);

  if (isPlatformBrowser(platform)) {
    const token = localStorage.getItem('freshToken');

    if (token) {
      return true;
    }

    return router.parseUrl('/login');
  }

  return true;
};