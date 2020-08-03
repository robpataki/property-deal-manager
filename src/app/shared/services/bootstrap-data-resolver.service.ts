import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { AccountResolverService } from '../../account/account-resolver.service';
import { PropertiesResolverService } from '../../properties/properties-resolver.service';
import { ComparablesResolverService } from 'src/app/comparables/comparables-resolver.service';
import { EstateAgentsResolverService } from 'src/app/estate-agents/estate-agents-resolver.service';

@Injectable()
export class BootstrapDataResolverService implements Resolve<any>{
  constructor(private accountResolver: AccountResolverService,
              private propertiesResolver: PropertiesResolverService,
              private comparablesResolver: ComparablesResolverService,
              private estateAgentsResolver: EstateAgentsResolverService) {}

  resolve(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.accountResolver.resolve().then((account) => {
        this.propertiesResolver.resolve().then(properties => {
          this.comparablesResolver.resolve().then(comparables => {
            this.estateAgentsResolver.resolve().then(estateAgents => {
              resolve({
                account,
                properties,
                comparables,
                estateAgents
              });
            }, error => {
              reject(error);
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
