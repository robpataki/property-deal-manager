import { Injectable } from '@angular/core';

import { Account } from './account.model';
import { Subject } from 'rxjs';

@Injectable()
export class AccountService {
  account: Account;
  accountChanged: Subject<Account> = new Subject<Account>();

  constructor() {}

  getAccount(): Account {
    return this.account;
  }

  setAccount(account: Account): void {
    this.account = account;
    this.emitAccountChanged();
  }

  emitAccountChanged(): void {
    this.accountChanged.next(this.account);
  }

  reset(): void {
    this.setAccount(null);
  }
}