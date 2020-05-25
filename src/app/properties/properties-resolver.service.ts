import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';

import { DataStorageService } from '../shared/data-storage.service';
import { PropertyService } from './property.service';
import { Property } from '../shared/property.model';

@Injectable()
export class PropertiesResolverService implements Resolve<Property[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private propertyService: PropertyService
  ) {}

  resolve() {
    const properties = this.propertyService.getProperties();

    if (!properties.length) {
      return this.dataStorageService.fetchProperties();
    } else {
      return properties;
    }
  }
}
