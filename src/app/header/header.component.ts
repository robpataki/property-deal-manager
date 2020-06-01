import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated: boolean = false;
  authSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.authSub = this.authService.authSession.subscribe(authSession => {
      this.isUserAuthenticated = !!authSession;
    })
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  onSignOut(): void {
    this.authService.signOut();
  }
}
