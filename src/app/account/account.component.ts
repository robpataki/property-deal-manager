import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Account } from './account.model';
import { AccountService } from './account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../shared/models/user.model';
import { Organisation } from '../shared/models/organisation.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  uid: string;
  account: Account;
  user: User;
  organisation: Organisation;
  accountChangeSub: Subscription;
  isLoading: boolean = false;

  constructor(private authService: AuthService,
              private accountService: AccountService) {}

  ngOnInit(): void {
    this.uid = this.authService.uid;

    this.account = this.accountService.getAccount();
    this.user = this.account.user;
    this.organisation = this.account.organisation;

    this.accountChangeSub = this.accountService.accountChanged.subscribe(account => {
      if (account) {
        this.account = account;
        this.user = account.user;
        this.organisation = account.organisation;
      }
    });

    this.initForm();
  }

  private initForm() {
    let firstName = this.user.private_profile.firstName;
    let lastName = this.user.private_profile.lastName;
    let displayName = this.user.public_profile.displayName;
    let email = this.user.private_profile.email || this.authService.email; // Load from auth data as default

    // Get existing data from Auth service (email), and account service (first name, last name)
    this.userForm = new FormGroup({
      firstName: new FormControl(firstName, Validators.required),
      lastName: new FormControl(lastName, Validators.required),
      displayName: new FormControl(displayName, Validators.required),
      profilePhoto: new FormControl(null),
      email: new FormControl({ value: email, disabled: !!email }, [Validators.required, Validators.email])
    });
  }
  
  onSubmit(): void {
    return;
  }

  onPhotoChanged(event): void {
    return;
  }

  onSelectPhoto(): void {
    return;
  }

  ngOnDestroy(): void {
    this.isLoading = false;
    this.accountChangeSub.unsubscribe();
  }
}
