import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register } from './register';
import { Auth } from '../../../services/auth';
import { By } from '@angular/platform-browser';
import { Alert } from '../../shared/alert/alert';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  let mockAuthService: jasmine.SpyObj<Auth>;


  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['signup']);

    await TestBed.configureTestingModule({
      imports: [Register, Alert],
      providers: [
        {provide: Auth, useValue: mockAuthService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    fixture.detectChanges();

    expect(component.alertMsg).toBe('Please wait! your account is being created.');
    expect(component.alertColor).toBe('blue');
    expect(component.showAlert).toBeFalse();
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

  });

  describe('name validation', () => {
    const nameValidationTests: {value: any, valid: boolean}[] = [
      { value: 'Joe', valid: true },
      { value: 'Christopher', valid: true },
      { value: 'Anne-Marie', valid: true },
      { value: "O'Connor", valid: true },

      { value: 'Jo', valid: false },
      { value: 'A', valid: false },
      { value: '  ', valid: false },

      { value: '', valid: false },
      { value: null, valid: false },
      { value: undefined, valid: false },

      { value: '     ', valid: false },
    ];

    nameValidationTests.forEach((test) => {
      it(`should validate name: ${test.value}`, () => {
        const nameControl = component.registerForm.get('name');
        nameControl?.patchValue(test.value);

        fixture.detectChanges();

        expect(nameControl?.valid).toBe(test.valid);
      });
    });
  });

  describe('age validation', () => {
    const ageValidationTests: { value: any; valid: boolean }[] = [
      { value: 18, valid: true },
      { value: 100, valid: true },
      { value: 25, valid: true },
      { value: '50', valid: true },

      { value: 17, valid: false },
      { value: 101, valid: false },
      { value: 0, valid: false },
      { value: -1, valid: false },
      { value: 150, valid: false },

      { value: '', valid: false },
      { value: null, valid: false },
      { value: undefined, valid: false },
      { value: 25.5, valid: true },
    ];

    ageValidationTests.forEach((test) => {
      it(`should validate the age: ${test.value}`, () => {
        const ageControl = component.registerForm.get('age');
        ageControl?.patchValue(test.value);

        fixture.detectChanges();

        expect(ageControl?.valid).toBe(test.valid);
      });
    });
  });

  describe('email validation', () => {
    const emailValidationTests: {value: any, valid: boolean}[] = [
      { value: 'user@email.com', valid: true },
      { value: 'user@email', valid: false },
      { value: 0, valid: false },
      { value: -1, valid: false },
      { value: 1, valid: false },
      { value: null, valid: false },
      { value: undefined, valid: false },
      { value: 'first.last@email.com', valid: true },
      { value: 'user@email.dev', valid: true },
      { value: '@email.com', valid: false },
      { value: 'user.com', valid: false },
      { value: 'user123@email.com', valid: true },
    ];
  
    emailValidationTests.forEach((test) => {
      it(`should validate the email address: ${test.value}`, () => {
        const emailControl = component.registerForm.get('email');
        emailControl?.patchValue(test.value);
  
        fixture.detectChanges();
  
        expect(emailControl?.valid).toBe(test.valid);
      });
    });
  });

  describe('password validation', () => {
    const passwordValidationTests: {value: any, valid: boolean}[] = [
      { value: 'P4ssword!', valid: true },
      { value: 'Valid123', valid: true },
      { value: 'LongerPassword99', valid: true },
      { value: '123Abcde', valid: true },
      { value: 'abcdeF12', valid: true },
  
      { value: 'Ab1', valid: false },
      { value: 'Short1a', valid: false },
  
      { value: 'password123', valid: false },
      { value: 'PASSWORD123', valid: false },
      { value: 'Passwordly', valid: false },
      { value: '12345678', valid: false },
  
      { value: '', valid: false },
      { value: ' ', valid: false },
      { value: null, valid: false },
      { value: undefined, valid: false },
      { value: 12345678, valid: false },
      { value: 'ABCDEFGH', valid: false },
    ];
  
    passwordValidationTests.forEach((test) => {
      it(`should validate password: ${test.value}`, () => {
        const passwordControl = component.registerForm.get('password');
        passwordControl?.patchValue(test.value);
  
        fixture.detectChanges();
  
        expect(passwordControl?.valid).toBe(test.valid);
      });
    });

    it('should have form error when passwords do not match', () => {
      const passwordControl = component.registerForm.get('password');
      const confirmPasswordControl = component.registerForm.get('confirmPassword');

      passwordControl?.patchValue('validPassword123');
      confirmPasswordControl?.patchValue('differentPassword123');
      fixture.detectChanges();

      expect(confirmPasswordControl?.errors).toEqual({noMatch: true});
    });
  });

  describe('phone number validation', () => {
    const phoneValidationTests: { value: any; valid: boolean }[] = [
      { value: '123-456-7890', valid: true },
      { value: '123456789012', valid: true },

      { value: '1234567890', valid: false },
      { value: '+123456789', valid: false },
      { value: '123-456-78901', valid: false },
      { value: '1', valid: false },

      { value: '', valid: false },
      { value: null, valid: false },
      { value: undefined, valid: false },
      { value: 123456789012, valid: true },

      { value: '     ', valid: false},
      { value: 'ABC-DEF-GHIJ', valid: true },
    ];

    phoneValidationTests.forEach((test) => {
      it(`should validate the phone number: ${test.value}`, () => {
        const phoneControl = component.registerForm.get('phoneNumber');
        phoneControl?.patchValue(test.value);

        fixture.detectChanges();

        expect(phoneControl?.valid).toBe(test.valid);
      });
    });
  });

  describe('register()', () => {
    it('should set alertColor and alertMsg to default before the request resolves', () => {
      mockAuthService.signup.and.returnValue(of());

      spyOn(component.registerForm, 'reset');
      component.register(component.registerForm);

      expect(component.alertColor).toBe('blue');
      expect(component.alertMsg).toBe('Please wait! your account is being created.');
    });

  it('should set alertColor and alertMsg on successful signup', () => {
      mockAuthService.signup.and.returnValue(of(void 0));

      spyOn(component.registerForm, 'reset');
      component.register(component.registerForm);

      expect(component.alertColor).toBe('green');
      expect(component.alertMsg).toBe('Signup successful');
    });  

    it('should call form.reset() on successful signup', () => {
      mockAuthService.signup.and.returnValue(of(void 0));

      spyOn(component.registerForm, 'reset');
      component.register(component.registerForm);

      expect(component.registerForm.reset).toHaveBeenCalled();
    });

    it('should call form.enable() on successful signup', () => {
      mockAuthService.signup.and.returnValue(of(void 0));

      spyOn(component.registerForm, 'enable');
      component.register(component.registerForm);

      expect(component.registerForm.enable).toHaveBeenCalled();
    });
  });

  describe('register() - Error handling', () => {
    it('should set alertColor to "red" and alertMsg to "Signup failed" on error', () => {
      const error = new HttpErrorResponse({ status: 500 });
      mockAuthService.signup.and.returnValue(throwError(() => error));

      spyOn(component.registerForm, 'reset');
      component.register(component.registerForm);

      expect(component.alertColor).toBe('red');
      expect(component.alertMsg).toBe('Signup failed');
    });

    it('should log error when signup() fails', () => {
      const error = new HttpErrorResponse({ status: 500 });
      const consoleSpy = spyOn(console, 'error');
      mockAuthService.signup.and.returnValue(throwError(() => error));

      spyOn(component.registerForm, 'reset');
      component.register(component.registerForm);

      expect(consoleSpy).toHaveBeenCalledWith(error);
    });

    it('should call form.enable() when signup() fails', () => {
      const error = new HttpErrorResponse({ status: 500 });
      mockAuthService.signup.and.returnValue(throwError(() => error));

      spyOn(component.registerForm, 'enable');
      component.register(component.registerForm);

      expect(component.registerForm.enable).toHaveBeenCalled();
    });
  });

});
