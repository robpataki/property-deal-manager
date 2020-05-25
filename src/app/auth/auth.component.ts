import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  error: String;
  isLoading: boolean;
  form: FormGroup;
  authSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required)
    });
  }

  ngOnDestroy(): void {
    this.isLoading = false;
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    const email = this.form.value.email;
    const password = this.form.value.password;

    this.isLoading = true;
    
    this.authSubscription = this.authService.signIn(email, password).subscribe((dataRes) => {
      this.error = null;
      this.isLoading = false;
      this.form.reset();
      this.router.navigate(['/properties']);
    }, errorMessage => {
      this.error = errorMessage;
      this.isLoading = false;
      this.form.reset();
    });
  }
}
