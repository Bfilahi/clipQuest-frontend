import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitButton } from './submit-button';
import { FormControl, FormGroup } from '@angular/forms';


describe('SubmitButton', () => {
  let component: SubmitButton;
  let fixture: ComponentFixture<SubmitButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitButton);
    component = fixture.componentInstance;

    component.form = new FormGroup({
      test: new FormControl('')
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable button when form is invalid', () => {
    (component.form as FormGroup).setErrors({invalid: true});

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
  });

  it('should disable button when form is disabled', () => {
    (component.form as FormGroup).setErrors({disabled: true});

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
  });

  it('should disable button when isDisabled is true', () => {
    component.isDisabled = true;

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
  });

  it('should enable button when form is enabled/valid', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeFalse();
  });

  it('should enable button when isDisabled is false', () => {
    component.isDisabled = false;

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeFalse();
  });
});
