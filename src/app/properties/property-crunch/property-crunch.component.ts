import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Params, ActivatedRoute } from '@angular/router';

import { PropertyService } from '../property.service';
import { Property } from 'src/app/shared/models/property.model';
import { STRATEGIES } from 'src/app/shared/services/app-constants.service';
import { kvObjectToArray } from 'src/app/shared/utils';
import { FormGroup, FormControl} from '@angular/forms';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-property-crunch',
  templateUrl: './property-crunch.component.html'
})
export class PropertyCrunchComponent implements OnInit, OnDestroy {
  @ViewChild('btlCrunchComponent') btlCrunchComponent;
  @ViewChild('flipCrunchComponent') flipCrunchComponent;

  property: Property;
  id: string;
  propertiesChangedSub: Subscription;
  configForm: FormGroup;
  isLoading: boolean;

  strategies: any = STRATEGIES;
  strategiesArray: any[] = kvObjectToArray(STRATEGIES);
  selectedStrategyTab: string = STRATEGIES.BTL.key;

  constructor(private propertyService: PropertyService,
              private accountService: AccountService,
              private dataStorageService: DataStorageService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.property = this.propertyService.getProperty(this.id);
        this.initConfigForm();
      }
    );

    this.propertiesChangedSub = this.propertyService.propertiesChangedSub.subscribe(properties => {
      this.property = this.propertyService.getProperty(this.id);
      const organisationId: string = this.accountService.getAccount().organisationId;
      
      if(this.isLoading) {
        this.dataStorageService.storeProperty(organisationId, this.id).then(() => {
          this.isLoading = false;  
        }, error => {
          console.error('There was an error when trying to update the property - error message: ', error);
        });
      }      
    });
  }

  initConfigForm(): void {
    let strg: string = this.property.crunch.strg;
    this.selectedStrategyTab = strg;
    this.configForm = new FormGroup({
      strg: new FormControl(strg)
    })
  }

  ngOnDestroy(): void {
    this.propertiesChangedSub.unsubscribe();
  }

  onSwitchStrategyTab($event: Event, strategy: string): void {
    $event.preventDefault();
    $event.stopPropagation();

    this.selectedStrategyTab = strategy;
  }

  onStrategyChange(): void {
    this.selectedStrategyTab = this.configForm.controls['strg'].value;
  }

  onSubmit(): void {
    const btlCrunchData: {} = this.btlCrunchComponent.getCrunchData();
    const flipCrunchData: {} = this.flipCrunchComponent.getCrunchData();

    const crunchData: {} = Object.assign({
      strg: this.configForm.controls['strg'].value,
    }, btlCrunchData, flipCrunchData);

    this.isLoading = true;
    this.propertyService.updatePropertyCrunch(this.id, crunchData);
  }
}
