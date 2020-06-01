import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Property } from 'src/app/shared/models/property.model';
import { PropertyService } from '../property.service';
import { arrayToArrayTable } from  '../../shared/utils';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html'
})
export class PropertyListComponent implements OnInit, OnDestroy {
  properties: Property[] = [];
  sortedProperties: Property[] = [];
  propertiesChangedSup: Subscription;

  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.initProperties(this.propertyService.getProperties());

    this.propertiesChangedSup = this.propertyService.propertiesChangedSub.subscribe((properties: Property[]) => {
      this.initProperties(properties);
    });
  }

  initProperties(properties: Property[]): void {
    this.properties = properties;
    this.sortedProperties = this.sortPropertiesByKey('createTimestamp', true);
  }

  sortPropertiesByKey(key: string, desc?: boolean): Property[] {
    let sortedProperties = this.properties.slice();
    sortedProperties.sort((a, b) => {
      if (desc) {
        return (+a[key] <= +b[key]) ? 1 : -1;
      } else {
        return (+a[key] >= +b[key]) ? 1 : -1;
      }
    });
    
    return sortedProperties;
  }

  ngOnDestroy(): void {
    this.propertiesChangedSup.unsubscribe();
  }

}
