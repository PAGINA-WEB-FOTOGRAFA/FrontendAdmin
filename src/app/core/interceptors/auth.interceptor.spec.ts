import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth';
import { API_URL } from '../services/api';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('adds the Authorization header when a token exists', () => {
    auth.setToken('token-123');

    http.get(`${API_URL}/get_ventas.php`).subscribe();

    const req = httpMock.expectOne(`${API_URL}/get_ventas.php`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');
    req.flush([]);
  });

  it('does not add the header without a token', () => {
    http.get(`${API_URL}/get_ventas.php`).subscribe();

    const req = httpMock.expectOne(`${API_URL}/get_ventas.php`);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush([]);
  });

  it('logs out and redirects to /login on 401', () => {
    auth.setToken('token-123');
    const logoutSpy = spyOn(auth, 'logout');
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);

    http.get(`${API_URL}/get_ventas.php`).subscribe({ error: () => undefined });

    const req = httpMock.expectOne(`${API_URL}/get_ventas.php`);
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(logoutSpy).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/login']);
  });

  it('does not logout or redirect on 401 from the login endpoint', () => {
    const logoutSpy = spyOn(auth, 'logout').and.callThrough();
    const navSpy = spyOn(router, 'navigate');

    http.post(`${API_URL}/login.php`, {}).subscribe({ error: () => undefined });

    const req = httpMock.expectOne(`${API_URL}/login.php`);
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(logoutSpy).not.toHaveBeenCalled();
    expect(navSpy).not.toHaveBeenCalled();
  });
});
