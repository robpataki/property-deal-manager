import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';

import { DataStorageService } from '../shared/services/data-storage.service';
import { PropertyService } from './property.service';
import { Property } from '../shared/models/property.model';

@Injectable()
export class PropertiesResolverService implements Resolve<any> {
  constructor(
    private dataStorageService: DataStorageService,
    private propertyService: PropertyService
  ) {}

  resolve() {
    const properties = this.propertyService.getProperties();

    if (!properties.length) {
      return this.dataStorageService.fetchProperties();
    } else {
      return new Promise((resolve) => {
        resolve(properties);
      });
    }
  }
}
