import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AuthService } from './auth';
import { API_URL } from './api';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stores token and user after login', () => {
    service.login('admin@empresa.com', 'secret').subscribe();

    const req = httpMock.expectOne(`${API_URL}/login.php`);
    expect(req.request.body).toEqual({ email: 'admin@empresa.com', password: 'secret' });
    req.flush({ token: 'token-123', expira: '2026-01-02 10:00:00' });

    expect(service.getToken()).toBe('token-123');
    expect(service.getUser()?.email).toBe('admin@empresa.com');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('logout clears stored credentials', () => {
    localStorage.setItem('auth_token', 'token-123');
    localStorage.setItem('auth_user', JSON.stringify({ id: 1 }));

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.getUser()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('getUser returns null and cleans up corrupted data', () => {
    localStorage.setItem('auth_user', '{not valid json');

    expect(service.getUser()).toBeNull();
    expect(service.getUser()).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });
});