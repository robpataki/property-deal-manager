import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              router: RouterStateSnapshot): boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    
    return this.authService.authSession.pipe(
      take(1), 
      map(authSession => {
        const isAuthenticated = !!authSession;

        if (isAuthenticated) {
          if (authSession.expirationTimestamp > Date.now()) {
            // If the session token hasn't expired yet, carry on
            return true;
          } else {
            // If the session token expired, sign user out
            this.authService.signOut();
          }
        }

        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}