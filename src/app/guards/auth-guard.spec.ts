import { TestBed } from '@angular/core/testing';
import { CanActivateFn, provideRouter, Router } from '@angular/router';

import { authGuard } from './auth-guard';
import { Auth } from '../services/auth';
import { signal } from '@angular/core';


describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let mockAuthService: jasmine.SpyObj<Auth>;
  let router: Router;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj([''], { isLoggedIn: signal<boolean>(false) });

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: mockAuthService }
      ]
    });

    router = TestBed.inject(Router);
  });


  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should NOT navigate when the user is authenticated', () => {
    mockAuthService.isLoggedIn.set(true);
    spyOn(router, 'navigate');

    executeGuard({} as any, {} as any);

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate when the user is not logged in', () => {
    mockAuthService.isLoggedIn.set(false);
    spyOn(router, 'navigate');

    executeGuard({} as any, {} as any);

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
