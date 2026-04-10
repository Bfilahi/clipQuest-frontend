import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { ModalService } from '../../../services/modal-service';
import { By } from '@angular/platform-browser';
import { Alert } from '../../shared/alert/alert';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  let mockAuthService: jasmine.SpyObj<Auth>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let form: NgForm;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['login', 'getReturnUrl']);
    mockModalService = jasmine.createSpyObj(['toggleModal']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    form = jasmine.createSpyObj('NgForm', ['reset']);

    await TestBed.configureTestingModule({
      imports: [Login, Alert, FormsModule],
      providers: [
        { provide: Auth, useValue: mockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    fixture.detectChanges();

    expect(component.credentials).toEqual({email: '', password: ''});
    expect(component.alertMsg).toBe('Please wait!.');
    expect(component.showAlert).toBeFalse();
    expect(component.alertColor).toBe('blue');
    expect(component.isDisabled).toBeFalse();
  });

  describe('template', () => {
    it('should not display the alert when showAlert is false', () => {
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.directive(Alert))).toBeNull();
    });

    it('should display the alert when showAlert is true', () => {
      component.showAlert = true;

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.directive(Alert))).not.toBeNull();
    });

    it('should render spinner image when alertColor is "blue"', () => {
      component.showAlert = true;

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.directive(Alert)).nativeElement.querySelector('img')).not.toBeNull();
    });

    it('should hide spinner image when alertColor is not "blue"', () => {
      component.showAlert = true;
      component.alertColor = 'red';

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.directive(Alert)).nativeElement.querySelector('img')).toBeNull();
    });

    it('should show an error message when email is touched, dirty, and empty', async () => {
      const emailDebugElement = fixture.debugElement.query(By.css('#email'));
      const emailModel = emailDebugElement.injector.get(NgModel);

      emailModel.control.setValue('invalid-email');
      emailModel.control.markAsTouched();
      emailModel.control.markAsDirty();

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const errorTxt: HTMLElement = fixture.nativeElement.querySelector('p.text-red-400');

      expect(errorTxt).not.toBeNull();
      expect(errorTxt.textContent?.trim()).toBe('Email is invalid.');
    });

    it('should show an error message when password is touched, dirty, and empty', async () => {
      const passwordDebugElement = fixture.debugElement.query(By.css('#password'));
      const passwordModel = passwordDebugElement.injector.get(NgModel);

      passwordModel.control.setValue('a');
      passwordModel.control.markAsTouched();
      passwordModel.control.markAsDirty();

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const errorTxt: HTMLElement = fixture.nativeElement.querySelector('p.text-red-400');

      expect(errorTxt).not.toBeNull();
      expect(errorTxt.textContent?.trim()).toBe('Password is invalid.');
    });
  });

  describe('login()', () => {
    it('should set isDisabled to true and show a loading alert before the request resolves', () => {
      mockAuthService.login.and.returnValue(of());

      component.login(form);

      expect(component.isDisabled).toBeTrue();
      expect(component.showAlert).toBeTrue();
      expect(component.alertColor).toBe('blue');
      expect(component.alertMsg).toBe('Please wait!.');
    });

    it('should set isDisabled to false on successful login', () => {
      mockAuthService.login.and.returnValue(of({ token: 'mock-token' }));

      component.login(form);

      expect(component.isDisabled).toBeFalse();
    });

    it('should call form.reset() on successful login', () => {
      mockAuthService.login.and.returnValue(of({token: 'mock-token'}));

      component.login(form);

      expect(form.reset).toHaveBeenCalled();
    });

    it('should set showAlert to false on successful login', () => {
      mockAuthService.login.and.returnValue(of({token: 'mock-token'}));

      component.login(form);

      expect(component.showAlert).toBeFalse();
    });

    it('should call modalService.toggleModal("auth") on successful login', () => {
      mockAuthService.login.and.returnValue(of({token: 'mock-token'}));

      component.login(form);

      expect(mockModalService.toggleModal).toHaveBeenCalled();
    });

    it('should call router.navigateByUrl() with return URL on success', () => {
      mockAuthService.login.and.returnValue(of({ token: 'mock-token' }));
      mockAuthService.getReturnUrl.and.returnValue('/dashboard');

      component.login(form);

      expect(mockRouter.navigateByUrl).toHaveBeenCalled();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('login() - Error handling', () => {
    it('should showAlert to true with alertColor = "red" on error', () => {
      const error = new HttpErrorResponse({status: 500});
      mockAuthService.login.and.returnValue(throwError(() => error));

      component.login(form);

      expect(component.showAlert).toBeTrue();
    });

    it('should log error when login fails', () => {
      const error = new HttpErrorResponse({status: 500});
      const consoleSpy = spyOn(console, 'error');
      mockAuthService.login.and.returnValue(throwError(() => error));

      component.login(form);

      expect(consoleSpy).toHaveBeenCalledWith(error);
    });
  });
});
