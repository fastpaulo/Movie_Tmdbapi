import { inject } from '@angular/core/primitives/di';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router :Router = inject(Router);
  const protectedRoutes = ['/home'];
  return protectedRoutes.includes(state.url) && !sessionStorage.getItem('user') ? router.parseUrl('/') : true;
};
