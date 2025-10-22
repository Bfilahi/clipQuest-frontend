import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly authUrl: string = `${environment.BASE_URL}/auth`;
  private isBrowser: boolean = false;

  public isLoggedIn = signal<boolean>(false);


  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) { 

    this.isBrowser = isPlatformBrowser(platformId);
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
        })
      )
  }

  public logout(){
    localStorage.removeItem('jwt');
    this.isLoggedIn.set(false);
  }

  public getToken(): string | null{
    return localStorage.getItem('jwt');
  }


  private saveToken(token: string){
    if(this.isBrowser)
      localStorage.setItem('jwt', token);
  }
}
