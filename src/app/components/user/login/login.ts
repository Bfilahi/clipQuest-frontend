import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { Alert } from '../../shared/alert/alert';
import { ModalService } from '../../../services/modal-service';
import { SubmitButton } from "../../shared/submit-button/submit-button";

@Component({
  selector: 'app-login',
  imports: [FormsModule, Alert, SubmitButton],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  public credentials = {
    email: '',
    password: ''
  }

  public alertMsg: string = 'Please wait!.';
  public showAlert: boolean = false;
  public alertColor: any = 'blue';

  public isDisabled: boolean = false;


  constructor(
    private authService: Auth,
    private modalService: ModalService,
    private router: Router
  ){}



  public login(form: NgForm){
    this.isDisabled = true;
    
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait!.'

    const request: LoginRequest = {
      email: this.credentials.email,
      password: this.credentials.password
    }

    this.authService.login(request).subscribe({
      next: () => {
        form.reset();
        this.showAlert = false;
        this.modalService.toggleModal('auth');
        this.router.navigateByUrl(`${this.authService.getReturnUrl()}`);
        this.isDisabled = false;
      },
      error: (err: HttpErrorResponse) => {
        this.showAlert = true;
        this.alertColor = 'red';
        this.alertMsg = err.error.message || 'Login failed';
        console.error(err);
        this.isDisabled = false;
      }
    });
  }
}
