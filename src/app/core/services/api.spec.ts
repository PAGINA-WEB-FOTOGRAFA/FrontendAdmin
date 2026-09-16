import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ApiService, API_URL } from './api';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to the API URL', () => {
    service.post('test', { hola: 'mundo' }).subscribe((res) => expect(res).toEqual({ ok: true }));

    const req = httpMock.expectOne(`${API_URL}/test`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ hola: 'mundo' });
    req.flush({ ok: true });
  });
});