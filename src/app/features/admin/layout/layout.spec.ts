import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';

import { AdminLayout } from './layout';
import { AuthService, AuthUser } from '../../../core/services/auth';

describe('AdminLayout', () => {
  let component: AdminLayout;
  let fixture: ComponentFixture<AdminLayout>;
  let auth: AuthService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AdminLayout],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    auth = TestBed.inject(AuthService);

    fixture = TestBed.createComponent(AdminLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reads the logged user from the auth service', () => {
    const user: AuthUser = { id: 1, nombre: 'Cami', email: 'cami@empresa.com' };
    auth.setUser(user);

    component.user = auth.getUser();

    expect(component.user?.nombre).toBe('Cami');
  });

  it('logout clears credentials and navigates to /login', () => {
    auth.setToken('token-123');
    const logoutSpy = spyOn(auth, 'logout').and.callThrough();
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);

    component.logout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/login']);
  });
});