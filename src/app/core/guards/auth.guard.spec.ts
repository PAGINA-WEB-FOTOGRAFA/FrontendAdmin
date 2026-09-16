import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { authGuard, loginGuard } from './auth.guard';
import { AuthService } from '../services/auth';

describe('AuthGuard', () => {
  let auth: AuthService;
  let router: Router;
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient()],
    });
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  it('authGuard allows navigation when logged in', () => {
    spyOn(auth, 'isLoggedIn').and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBeTrue();
  });

  it('authGuard redirects to /login when not logged in', () => {
    spyOn(auth, 'isLoggedIn').and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result?.toString()).toBe('/login');
  });

  it('loginGuard redirects to /admin when already logged in', () => {
    spyOn(auth, 'isLoggedIn').and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => loginGuard(route, state));

    expect(result?.toString()).toBe('/admin');
  });

  it('loginGuard allows access to login when not logged in', () => {
    spyOn(auth, 'isLoggedIn').and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => loginGuard(route, state));

    expect(result).toBeTrue();
  });

  it('redirects to the same login route used by the router', () => {
    spyOn(auth, 'isLoggedIn').and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toEqual(router.createUrlTree(['/login']));
  });
});
