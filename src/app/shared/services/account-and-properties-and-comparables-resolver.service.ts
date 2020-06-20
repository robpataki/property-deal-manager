import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { AccountResolverService } from '../../account/account-resolver.service';
import { PropertiesResolverService } from '../../properties/properties-resolver.service';
import { ComparablesResolverService } from 'src/app/comparables/comparables-resolver.service';

@Injectable()
export class AccountAndPropertiesAndComparablesResolverService implements Resolve<any>{
  constructor(private accountResolver: AccountResolverService,
              private propertiesResolver: PropertiesResolverService,
              private comparablesResolver: ComparablesResolverService) {}

  resolve(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.accountResolver.resolve().then((account) => {
        this.propertiesResolver.resolve().then(properties => {
          this.comparablesResolver.resolve().then(comparables => {
            resolve({
              account,
              properties,
              comparables
            });
          }, error => {
            reject(error);
          });
        }, error => {
          reject(error);
        })
      }, (error) => {
        reject(error);
      })
    });
  }
}