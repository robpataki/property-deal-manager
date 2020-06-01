import { Injectable } from '@angular/core';
import { Resolve, ResolveEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { concat, tap } from 'rxjs/operators';

import { AccountResolverService } from '../../account/account-resolver.service';
import { PropertiesResolverService } from '../../properties/properties-resolver.service';
import { PropertyService } from '../../properties/property.service';
import { AccountService } from '../../account/account.service';

@Injectable()
export class AccountAndPropertiesResolverService implements Resolve<any>{
  constructor(private accountResolver: AccountResolverService,
              private propertiesResolver: PropertiesResolverService,
              private propertiesService: PropertyService,
              private accountService: AccountService) {}

  resolve(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.accountResolver.resolve().then((account) => {
        this.propertiesResolver.resolve().then(properties => {
          resolve({account: account, properties: properties});
        }, error => {
          reject(error);
        })
      }, (error) => {
        reject(error);
      })
    });
  }
}