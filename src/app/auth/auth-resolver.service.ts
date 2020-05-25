import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthResolverService implements Resolve<void> {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  resolve() {
    // If user is already logged in, redirect them to the account page.
    if (this.authService.hasActiveSession) {
      this.router.navigate(['/account']);
    }
  }
}
