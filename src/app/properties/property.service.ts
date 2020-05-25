import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Property } from '../shared/property.model';

@Injectable()
export class PropertyService {
  properties: Property[] = [];
  propertiesChangedSub: Subject<Property[]> = new Subject<Property[]>();

  constructor() {};

  getProperties(): Property[] {
    return this.properties.slice(); 
  }

  setProperties(properties: Property[]): void {
    this.properties = properties;
    this.emitPropertiesChanged();
  }

  getProperty(uid: string): Property {
    return this.properties.find((property) => {
      return property.uid === uid;
    });
  }

  emitPropertiesChanged(): void {
    this.propertiesChangedSub.next(this.properties.slice());
  }

  reset(): void {
    this.setProperties([]);
  }
}