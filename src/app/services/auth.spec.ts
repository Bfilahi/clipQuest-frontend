import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';
import { Auth } from './auth';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { PLATFORM_ID } from '@angular/core';


describe('Auth', () => {
  let authService: Auth;
  let httpTestingController: HttpTestingController;
  let mockResponse: {token: string};
  let registerRequest: RegisterRequest;
  let loginRequest: LoginRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), 
        provideHttpClientTesting(), 
        provideRouter([]),
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);

    mockResponse = { token: 'fake-token' };
    registerRequest = {
      firstName: 'Mario',
      lastName: 'Rossi',
      age: 30,
      email: 'mario.rossi@example.com',
      password: 'password',
      phoneNumber: '0123456789'
    };
    loginRequest = { email: 'mario.rossi@example.com', password: 'password' };
    localStorage.clear();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    authService = TestBed.inject(Auth);
    
    expect(authService).toBeTruthy();
  });

  describe('isLoggedIn() signal', () => {
    it('should set false to isLoggedIn to start', () => {
      authService = TestBed.inject(Auth);
  
      expect(authService.isLoggedIn()).toBe(false);
    });
  
    it('should return true if token exists in localStorage', () => {
      localStorage.setItem('jwt', 'fake-token');
  
      authService = TestBed.inject(Auth);
  
      expect(authService.isLoggedIn()).toBe(true);
    });
  });

  describe('signup()', () => {
    it('should call signup() with correct URL', () => {
      authService = TestBed.inject(Auth);

      authService.signup(registerRequest).subscribe();

      let req = httpTestingController.expectOne(`${environment.BASE_URL}/auth/signup`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
    });

    it('should handle signup failure', () => {
      authService = TestBed.inject(Auth);

      authService.signup(registerRequest).subscribe({
        next: () => fail('Should have failed with 409'),
        error: (err) => expect(err.status).toBe(409)
      });

      let req = httpTestingController.expectOne(`${environment.BASE_URL}/auth/signup`);
      req.flush('Email already exists', { status: 409, statusText: 'Conflict'});
    });
  });

  describe('login()', () => {
    let req: TestRequest;

    beforeEach(() => {
      authService = TestBed.inject(Auth);

      authService.login(loginRequest).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      req = httpTestingController.expectOne(`${environment.BASE_URL}/auth/login`);
      req.flush(mockResponse);
    });

    it('should call post with the correct URL and body', () => {
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
    });

    it('should save token to localStorage', () => {
      expect(localStorage.getItem('jwt')).toEqual(mockResponse.token);
    });

    it('should set isLoggedIn to true', () => {
      expect(authService.isLoggedIn()).toBe(true);
    });
  });

  describe('login() - error handling', () => {
    it('should handle login failure', () => {
      authService = TestBed.inject(Auth);

      authService.login(loginRequest).subscribe({
        next: () => fail('Should have failed with 401'),
        error: (err) => expect(err.status).toBe(401)
      });

      let req = httpTestingController.expectOne(`${environment.BASE_URL}/auth/login`);
      req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized'});

      expect(authService.isLoggedIn()).toBe(false);
      expect(localStorage.getItem('jwt')).toBeNull();
    });
  });

  describe('logout()', () => {
    let req: TestRequest;

    beforeEach(() => {
      authService = TestBed.inject(Auth);

      authService.login(loginRequest).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      req = httpTestingController.expectOne(`${environment.BASE_URL}/auth/login`);
      req.flush(mockResponse);
    });

    it('should remove token from localStorage', () => {
      authService.logout();

      expect(localStorage.getItem('jwt')).toEqual(null);
    });

    it('should set isLoggedIn to false', () => {
      authService.logout();

      expect(authService.isLoggedIn()).toEqual(false);
    });
  });

  describe('returnUrl', () => {
    beforeEach(() => {
      authService = TestBed.inject(Auth);
    });

    it('should have default returnUrl of "/"', () => {
      expect(authService.getReturnUrl()).toBe('/');
    });

    it('should update returnUrl via setReturnUrl()', () => {
      authService.setReturnUrl('/fake-url');

      expect(authService.getReturnUrl()).toBe('/fake-url');
    });

    it('should set returnUrl to router.url after login', () => {
      authService.login(loginRequest).subscribe(req => expect(req).toEqual(mockResponse));

      let req = httpTestingController.expectOne(`${environment.BASE_URL}/auth/login`);
      req.flush(mockResponse);
      expect(authService.getReturnUrl()).toBe('/');
    });

    it('should set returnUrl to router.url after logout', () => {
      authService.login(loginRequest).subscribe((req) => expect(req).toEqual(mockResponse));

      let req = httpTestingController.expectOne(`${environment.BASE_URL}/auth/login`);
      req.flush(mockResponse);

      authService.logout();

      expect(authService.getReturnUrl()).toBe('/');
    });
  });

  describe('getToken()', () => {
    beforeEach(() => {
      authService = TestBed.inject(Auth);
    });

    it('should return null for getToken() if localStorage is empty', () => {
      expect(authService.getToken()).toBeNull();
    });

    it('should return the correct token for getToken() if user is logged in', () => {
      authService.login(loginRequest).subscribe();

      let req = httpTestingController.expectOne(`${environment.BASE_URL}/auth/login`);
      req.flush(mockResponse);
      expect(authService.getToken()).toBe(mockResponse.token);
    })
  });
});

describe('Auth - SSR (non-browser)', () => {
  let authService: Auth;
  let httpTestingController: HttpTestingController;
  let mockResponse: {token: string};
  let registerRequest: RegisterRequest;
  let loginRequest: LoginRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), 
        provideHttpClientTesting(), 
        provideRouter([]),
        {provide: PLATFORM_ID, useValue: 'server'}
      ]
    });

    authService = TestBed.inject(Auth);
    httpTestingController = TestBed.inject(HttpTestingController);

    mockResponse = { token: 'fake-token' };
    registerRequest = {
      firstName: 'Mario',
      lastName: 'Rossi',
      age: 30,
      email: 'mario.rossi@example.com',
      password: 'password',
      phoneNumber: '0123456789',
    };
    loginRequest = { email: 'mario.rossi@example.com', password: 'password' };
    localStorage.clear();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return null for getToken() in SSR', () => {
    localStorage.setItem('jwt', 'fake-token');
    expect(authService.getToken()).toBeNull();
  });

  it('should not save token to localStorage on login', () => {
    authService.login(loginRequest).subscribe();

    let req = httpTestingController.expectOne(`${environment.BASE_URL}/auth/login`);
    req.flush(mockResponse);
    expect(localStorage.getItem('jwt')).toBeNull();
  });

  it('should not remove token from localStorage on logout() in SSR', () => {
    localStorage.setItem('jwt', 'fake-token');
    authService.logout();

    expect(localStorage.getItem('jwt')).toBe('fake-token');
  });

  it('should not set isLoggedIn to true on init even if token exists in localStorage', () => {
    localStorage.setItem('jwt', 'fake-token');
    authService = TestBed.inject(Auth);

    expect(authService.isLoggedIn()).toBe(false);
  });
});
