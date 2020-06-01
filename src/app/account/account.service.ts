import { Injectable } from '@angular/core';

import { Account } from './account.model';
import { Subject } from 'rxjs';

@Injectable()
export class AccountService {
  private _account: Account;
  accountChanged: Subject<Account> = new Subject<Account>();

  constructor() {}

  getAccount(): Account {
    return this._account;
  }

  setAccount(account: Account): void {
    this._account = account;
    this.emitAccountChanged();
  }

  emitAccountChanged(): void {
    this.accountChanged.next(this._account);
  }

  reset(): void {
    this.setAccount(null);
  }
}