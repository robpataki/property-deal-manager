import { Component, OnInit, Input } from '@angular/core';

import { Comparable } from 'src/app/shared/models/comparable.model';
import { PROPERTY_TYPES, STRATEGIES } from '../../shared/services/app-constants.service';

@Component({
  selector: 'app-comparable-detail',
  templateUrl: './comparable-detail.component.html'
})
export class ComparableDetailComponent {
  @Input() comparable: Comparable;
  propertyTypes: any = PROPERTY_TYPES;
  strategies: any = STRATEGIES;
}
