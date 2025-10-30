import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../../shared/input-component/input-component";
import { Alert } from "../../shared/alert/alert";
import { RegisterValidator } from '../../../validators/register-validator';
import { Auth } from '../../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { SubmitButton } from "../../shared/submit-button/submit-button";

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, Alert, SubmitButton],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  public alertMsg: string = 'Please wait! your account is being created.';
  public alertColor: any = 'blue';
  public showAlert: boolean = false;


  public registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    age: new FormControl('', [
      Validators.required,
      Validators.min(18),
      Validators.max(100)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,

    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(12),
      Validators.maxLength(12)
    ])
  }, [RegisterValidator.match('password', 'confirmPassword')]);


  constructor(private authService: Auth){}


  public register(form: FormGroup){
    form.disable();
    
    this.alertMsg = 'Please wait! your account is being created.';
    this.alertColor = 'blue';
    this.showAlert = true;

    const request: RegisterRequest = {
      firstName: form.value.name.split(' ')[0],
      lastName: form.value.name.split(' ')[1],
      age: form.value.age,
      email: form.value.email,
      password: form.value.password,
      phoneNumber: form.value.phoneNumber
    }

    this.authService.signup(request).subscribe({
      next: () => {
        this.alertColor = 'green';
        this.alertMsg = 'Signup successful';
        form.reset();
        form.enable();
      },
      error: (err: HttpErrorResponse) => {
        this.alertColor = 'red';
        this.alertMsg = err.error.message || 'Signup failed';
        console.error(err);
        form.enable();
      }
    });
  }
}
