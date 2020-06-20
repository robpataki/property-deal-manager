import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';

import { DataStorageService } from '../shared/services/data-storage.service';
import { ComparableService } from './comparable.service';

@Injectable()
export class ComparablesResolverService implements Resolve<any> {
  constructor(
    private dataStorageService: DataStorageService,
    private comparableService: ComparableService
  ) {}

  resolve() {
    const comparables = this.comparableService.getComparables();

    if (!comparables.length) {
      return this.dataStorageService.fetchComparables();
    } else {
      return new Promise((resolve) => {
        resolve(comparables);
      });
    }
  }
}
