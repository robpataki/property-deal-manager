import { OnInit, Component, Input } from '@angular/core';

import { Property } from 'src/app/shared/models/property.model';
import { STRATEGIES } from '../../../shared/services/app-constants.service';

@Component({
  selector: 'app-property-crunch-summary',
  templateUrl: './property-crunch-summary.component.html'
})
export class PropertyCrunchSummaryComponent implements OnInit {
  @Input() property: Property;
  
  primaryStrategy: string;
  selectedStrategyTab: string;
  strategies: any = STRATEGIES;
  hasCrunch: boolean;
  hasBTLCrunch: boolean;
  hasFLPCrunch: boolean;

  ngOnInit(): void {
    this.hasBTLCrunch = !!this.property.crunch.BTL;
    this.hasFLPCrunch = !!this.property.crunch.FLP;
    this.hasCrunch = this.hasBTLCrunch && this.hasFLPCrunch;

    this.primaryStrategy = this.property.crunch.strg;
    this.selectedStrategyTab = this.primaryStrategy;
  }

  onSwitchStrategyTab($event: Event, strategy: string): void {
    $event.preventDefault();
    $event.stopPropagation();

    this.selectedStrategyTab = strategy;
  }
}