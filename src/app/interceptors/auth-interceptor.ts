import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { environment } from '../../environments/environment.development';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(Auth);

  const apiUrl: string = environment.BASE_URL;

  if(req.url.includes(`${apiUrl}/signup`) || req.url.includes(`${apiUrl}/login`))
    return next(req);

  const token: string | null = auth.getToken();

  if(token){
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(clonedRequest);
  }

  return next(req);
};
