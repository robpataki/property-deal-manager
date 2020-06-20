import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Property } from 'src/app/shared/models/property.model';
import { PropertyService } from '../property.service';
import { arrayToArrayTable, sortArrayByKey } from  '../../shared/utils';

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
    this.sortedProperties = sortArrayByKey('createTimestamp', this.properties).reverse();
  }

  ngOnDestroy(): void {
    this.propertiesChangedSup.unsubscribe();
  }

}
