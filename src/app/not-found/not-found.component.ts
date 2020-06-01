import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Data } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit, OnDestroy {
  errorMessage: string;
  routerDataSubscription: Subscription;
  isUserAuthenticated: boolean = false;
  authSub: Subscription;

  constructor(private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.errorMessage = this.route.snapshot.data['message'];

    this.routerDataSubscription = this.route.data.subscribe(
      (data: Data) => {
        this.errorMessage = data['message'];
      }
    );

    this.authSub = this.authService.authSession.subscribe(authSession => {
      this.isUserAuthenticated = !!authSession;
    });
  }

  ngOnDestroy(): void {
    this.routerDataSubscription.unsubscribe();
    this.authSub.unsubscribe();
  }

}
