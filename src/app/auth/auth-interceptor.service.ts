import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { firebaseConfig } from 'src/environments/environment';

// URLs that do not need the AUTH token
const URL_WHITELIST: string[] = [
  firebaseConfig.authRefreshTokenUrl
]

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.authSession.pipe(
      take(1), 
      exhaustMap(authSession => {
        // If not logged in, just use the original request (no login token attached)
        if (!authSession || URL_WHITELIST.includes(req.url)) {
          return next.handle(req);
        }

        // If logged in, attach the token to every request
        const modifiedReq = req.clone({ 
          params: new HttpParams().set('auth', authSession.token) 
        });
        return next.handle(modifiedReq);
      }));
  }
}