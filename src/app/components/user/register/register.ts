import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../../shared/input-component/input-component";
import { Alert } from "../../shared/alert/alert";
import { RegisterValidator } from '../../../validators/register-validator';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, Alert],
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

  public register(){
    this.alertMsg = 'Please wait! your account is being created.';
    this.alertColor = 'blue';
    this.showAlert = true;
  }
}
