import { Component, OnInit, Input } from '@angular/core';

import { Property } from 'src/app/shared/models/property.model';
import { PROPERTY_TYPES, DEAL_TYPES, STRATEGIES } from '../../shared/services/app-constants.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html'
})
export class PropertyDetailComponent implements OnInit {
  @Input() property: Property;
  propertyTypes: any = PROPERTY_TYPES;
  dealTypes: any = DEAL_TYPES;
  strategies: any = STRATEGIES;
  lastActivityTimestamp: number;

  constructor() {}

  ngOnInit(): void {
    this.lastActivityTimestamp = !!this.property.notes && !!this.property.notes.length ? +this.property.notes[this.property.notes.length-1].timestamp : 0;
  }

}
