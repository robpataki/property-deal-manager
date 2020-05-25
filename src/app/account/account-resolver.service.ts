import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';

import { DataStorageService } from '../shared/data-storage.service';
import { AccountService } from './account.service';
import { Account } from './account.model';

@Injectable()
export class AccountResolverService implements Resolve<Account> {
  constructor(
    private dataStorageService: DataStorageService,
    private accountService: AccountService
  ) {}

  resolve() {
    const account = this.accountService.getAccount();

    if (!account) {
      return this.dataStorageService.fetchAccount();
    } else {
      return account;
    }
  }
}
