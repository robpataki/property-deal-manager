import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading: boolean = false;
  isComplete: boolean = false;
  error: string;
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;
    const email = this.form.value['email'];
    
    this.authSubscription = this.authService.resetPassword(email).subscribe(() => {
      this.isComplete = true;
      this.isLoading = false;
      this.error = null;
      this.form.reset();
    }, errorMessage => {
      this.isLoading = false;
      this.error = errorMessage;
      this.form.reset();
    });
  }  
}
