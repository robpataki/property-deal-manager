import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';

import { DataStorageService } from '../shared/services/data-storage.service';
import { EstateAgentService } from './estate-agent.service';

@Injectable()
export class EstateAgentsResolverService implements Resolve<any> {
  constructor(
    private dataStorageService: DataStorageService,
    private estateAgentService: EstateAgentService
  ) {}

  resolve() {
    const estateAgents = this.estateAgentService.getEstateAgents();

    if (!estateAgents.length) {
      return this.dataStorageService.fetchEstateAgents();
    } else {
      return new Promise((resolve) => {
        resolve(estateAgents);
      });
    }
  }
}
