import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';
import { Observable } from 'rxjs';

import { DataStorageService } from '../shared/services/data-storage.service';
import { AccountService } from './account.service';

@Injectable()
export class AccountResolverService implements Resolve<any> {
  constructor(
    private dataStorageService: DataStorageService,
    private accountService: AccountService
  ) {}

  resolve() {
    const account = this.accountService.getAccount();

    if (!account) {
      return this.dataStorageService.fetchAccount();
    } else {
      return new Promise((resolve) => {
        resolve(account);
      });
    }
  }
}
