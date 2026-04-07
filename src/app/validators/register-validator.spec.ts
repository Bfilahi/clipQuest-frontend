import { FormControl, FormGroup } from '@angular/forms';
import { RegisterValidator } from './register-validator';

describe('RegisterValidator', () => {
  let group: FormGroup;

  beforeEach(() => {
    group = new FormGroup({
      password: new FormControl(''),
      confirmPassword: new FormControl('')
    });
  });


  it('should return null if controls match', () => {
    group.get('password')?.setValue('0123456789');
    group.get('confirmPassword')?.setValue('0123456789');

    const validator = RegisterValidator.match('password', 'confirmPassword');
    const result = validator(group);

    expect(result).toBeNull();
    expect(group.get('confirmPassword')?.errors).toBeNull();
  });

  it('should return noMatch if controls do not match', () => {
    group.get('password')?.setValue('0123456789');
    group.get('confirmPassword')?.setValue('01234');

    const validator = RegisterValidator.match('password', 'confirmPassword');
    const result = validator(group);

    expect(result).toEqual({noMatch: true});
    expect(group.get('confirmPassword')?.errors).toEqual({noMatch: true});
  });

  it('should return controlNotFound if controls are missing', () => {
    const validator = RegisterValidator.match('nothing', 'confirmPassword');
    const result = validator(group);

    expect(result).toEqual({ controlNotFound: false });
  });
});
