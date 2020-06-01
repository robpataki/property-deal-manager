import { Component, OnInit, Input } from '@angular/core';

import { Property } from 'src/app/shared/models/property.model';
import { PROPERTY_TYPES, DEAL_TYPES } from '../../shared/services/app-constants.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html'
})
export class PropertyDetailComponent implements OnInit {
  @Input() property: Property;
  propertyTypes: any = PROPERTY_TYPES;
  dealTypes: any = DEAL_TYPES;

  constructor() { }

  ngOnInit(): void {
  }

}
