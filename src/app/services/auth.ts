import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { LoginResponse } from '../response/loginResponse';


@Injectable({
  providedIn: 'root'
})
export class Auth {

  private authUrl: string = `${environment.BASE_URL}/auth`;
  private isBrowser: boolean = false;

  public isLoggedIn = signal<boolean>(false);
  private returnUrl = signal<string>('/');


  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) { 

    this.isBrowser = isPlatformBrowser(platformId);
    this.checkAuthStatus();
  }


  public setReturnUrl(url: string) {
    this.returnUrl.set(url);
  }

  public getReturnUrl(): string {
    return this.returnUrl();
  }


  public signup(request: RegisterRequest){
    return this.http.post<void>(`${this.authUrl}/signup`, request);
  }

  public login(request: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, request)
      .pipe(
        tap(response => {
          this.saveToken(response.token);
          this.isLoggedIn.set(true);
          this.returnUrl.set(this.router.url)
        })
      )
  }

  public logout(){
    if(this.isBrowser)
      localStorage.removeItem('jwt');

    this.isLoggedIn.set(false);
    this.returnUrl.set(this.router.url);
  }

  public getToken(): string | null{
    if(this.isBrowser)
      return localStorage.getItem('jwt');
    return null;
  }


  private saveToken(token: string){
    if(this.isBrowser)
      localStorage.setItem('jwt', token);
  }

  private checkAuthStatus(){
    if(this.isBrowser){
      if(localStorage.getItem('jwt'))
        this.isLoggedIn.set(true);
    }
  }
}
