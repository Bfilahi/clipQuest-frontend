import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './auth-interceptor';
import { Auth } from '../services/auth';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment.development';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  let mockAuthService: any;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(['getToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        {provide: Auth, useValue: mockAuthService}
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });


  it('should add Authorization header if token exists', () => {
    mockAuthService.getToken.and.returnValue('mock-token');

    httpClient.get(`${environment.BASE_URL}/profile`).subscribe();
    const req = httpTestingController.expectOne(`${environment.BASE_URL}/profile`);
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');

    req.flush({});
  });

  it('should NOT add Authorization header for signup requests', () => {
    mockAuthService.getToken.and.returnValue('mock-token');

    httpClient.post(`${environment.BASE_URL}/signup`, {}).subscribe();
    const req = httpTestingController.expectOne(`${environment.BASE_URL}/signup`);
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });

  it('should NOT add Authorization header for login requests', () => {
    mockAuthService.getToken.and.returnValue('mock-token');

    httpClient.post(`${environment.BASE_URL}/login`, {}).subscribe();
    const req = httpTestingController.expectOne(`${environment.BASE_URL}/login`);
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });

  it('should NOT add Authorization header when token is null', () => {
    mockAuthService.getToken.and.returnValue(null);
    
    httpClient.get(`${environment.BASE_URL}/profile`).subscribe();
    const req = httpTestingController.expectOne(`${environment.BASE_URL}/profile`);
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });
});
