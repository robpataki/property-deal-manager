import { OnInit, Component, OnDestroy, ComponentFactoryResolver, ViewChild, ComponentRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { generateUID, kvObjectToArray, ukDateToUSDate } from '../../shared/utils';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { PropertyService } from '../property.service';
import { Property, PropertyDetails } from 'src/app/shared/models/property.model';
import { PROPERTY_TYPES, TENURE_TYPES, DEAL_TYPES, EPC_RATINGS } from '../../shared/services/app-constants.service';
import { ToDateTimePipe } from '../../shared/pipes/to-date-time.pipe';
import { FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { PlaceholderDirective } from 'src/app/shared/directives/placeholder.directive';
import { ConfirmActionModalComponent } from 'src/app/modals/confirm-action-modal/confirm-action-modal.component';

@Component({
  selector: 'app-property-edit',
  templateUrl: './property-edit.component.html'
})
export class PropertyEditComponent implements OnInit, OnDestroy {
  dpInputId: string = generateUID('dpi_');

  id: string;
  propertiesChangedSub: Subscription;
  property: Property;
  form: FormGroup;
  propertyTypes: any = PROPERTY_TYPES;
  dealTypes: any = DEAL_TYPES;
  dealType: string;
  MAX_LINKS: number = 4;
  isLoading: boolean;
  editMode: boolean;
  deleteMode: boolean;

  backButtonLabel: string;
  backButtonUrl: string;
  
  propertyTypesArray: any[] = kvObjectToArray(PROPERTY_TYPES);
  tenureTypesArray: any[] = kvObjectToArray(TENURE_TYPES);
  dealTypesArray: any[] = kvObjectToArray(DEAL_TYPES);
  epcRatingsArray: any[] = kvObjectToArray(EPC_RATINGS);

  @ViewChild(PlaceholderDirective, {static: false}) confirmModalHost: PlaceholderDirective;
  confirmationModalCancelSub: Subscription;
  confirmationModalConfirmSub: Subscription;
  actionConfirmModalComponentRef: ComponentRef<any>;

  constructor(private dataStorageService: DataStorageService,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private toDateTimePipe: ToDateTimePipe,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.setUpBackButton();

    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        this.property = this.propertyService.getProperty(this.id);
        this.setUpBackButton();
        
        if (!this.property && this.editMode) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.initForm();
      }
    );

    this.propertiesChangedSub = this.propertyService.propertiesChangedSub.subscribe(properties => {
      if(!this.deleteMode) {
        this.dataStorageService.storeProperty(this.id).then(() => {
          this.router.navigate(['../'], { relativeTo: this.route });
        }, error => {
          console.error('There was an error when trying to save the property - error message: ', error);
        });
      } else {
        this.dataStorageService.deleteProperty(this.id).then(() => {
          this.router.navigate(['/properties']);
        }, error => {
          console.error('There was an error when trying to delete the property - error message: ', error);
        });
      }
    });
  }

  initForm(): void {
    let bedrooms: number;
    let size: number;
    let dealType: string;
    let epc: string;
    let type: string;
    let tenureType: string;
    let askingPrice: number;
    let thumbnailUrl: string = 'https://firebasestorage.googleapis.com/v0/b/property-deal-manager.appspot.com/o/static%2Fdefault-property-thumbnail.png?alt=media&token=9bc95394-f2d2-4e86-b85d-e7497288665e';
    let marketDate: string;

    let addressLine1: string;
    let addressLine2: string;
    let town: string;
    let postcode: string;

    let links: FormArray = new FormArray([]);

    if(this.editMode) {
      bedrooms  = +this.property.bedrooms;
      size = +this.property.size;
      dealType = DEAL_TYPES[this.property.dealType].key;
      epc = EPC_RATINGS[this.property.epc].key;
      type = PROPERTY_TYPES[this.property.type].key;
      tenureType = !!this.property.tenureType ? TENURE_TYPES[this.property.tenureType].key : null;
      askingPrice = this.property.askingPrice;
      thumbnailUrl = this.property.thumbnailUrl;
      marketDate = this.toDateTimePipe.transform(this.property.marketTimestamp);

      addressLine1 = this.property.addressLine1;
      addressLine2 = this.property.addressLine2;
      town = this.property.town;
      postcode = this.property.postcode;

      this.property.links.map((link) => {
        links.push(new FormControl(link, [Validators.required]))
      });
    }

    this.form = new FormGroup({
      bedrooms: new FormControl(bedrooms),
      type: new FormControl(type),
      tenureType: new FormControl(tenureType),
      size: new FormControl(size),
      epc: new FormControl(epc),
      dealType: new FormControl(dealType),
      askingPrice: new FormControl(askingPrice, [Validators.required]),
      thumbnailUrl: new FormControl(thumbnailUrl),
      marketDate: new FormControl(marketDate),

      addressLine1: new FormControl(addressLine1, [Validators.required]),
      addressLine2: new FormControl(addressLine2),
      town: new FormControl(town),
      postcode: new FormControl(postcode, [Validators.required]),
      
      links: links
    });
  }

  getLinkControls() {
    return (this.form.get('links') as FormArray).controls;
  }

  onAddNewLink(): void {
    const links = <FormArray>this.form.get('links');
    if (links.length < this.MAX_LINKS) {
      links.push(new FormControl('', Validators.required));
    }
  }

  onRemoveLink(index: number): void {
    (<FormArray>this.form.get('links')).removeAt(index);
  }

  onSubmit(): void {
    this.isLoading = true;

    this.id = this.id || generateUID('p_');

    // Clean up and prepare the data to be passed on to the service as a PropertyDetails instance
    const usMarketDate: string = ukDateToUSDate(this.form.value.marketDate);
    const marketTimestamp: number = new Date(usMarketDate).getTime();
    const propertyDetailsData: any = Object.assign({
      uid: this.id, 
      marketTimestamp
    }, this.form.value);
    delete propertyDetailsData.marketDate;
    
    const propertyDetails: PropertyDetails = Object.assign({}, propertyDetailsData);
    
    if (this.editMode) {
      this.propertyService.updatePropertyDetails(propertyDetails);
    } else {
      this.propertyService.addProperty(propertyDetails);
    }
  }

  onDateInputChange(dateString: string): void {
    this.form.controls['marketDate'].setValue(dateString);
  }

  onDealTypeChange(): void {
    this.dealType = this.form.value.dealType;
  }

  onDelete(): void {
    this.deleteMode = true;

    this.showConfirmationModal('delete this property').then(() => {
      this.propertyService.deleteProperty(this.id);
    }, error => {});
  }

  showConfirmationModal(message: string): Promise<void> {
    const confirmModalComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmActionModalComponent);
    const hostViewContainerRef = this.confirmModalHost.viewContainerRef;
    hostViewContainerRef.clear();

    this.actionConfirmModalComponentRef = hostViewContainerRef.createComponent(confirmModalComponentFactory);
    this.actionConfirmModalComponentRef.instance.message = message;
    this.actionConfirmModalComponentRef.instance.show();

    return new Promise((resolve, reject) => {
      this.confirmationModalConfirmSub = this.actionConfirmModalComponentRef.instance.confirm.subscribe(() => {
        this.confirmationModalConfirmSub.unsubscribe();
        hostViewContainerRef.clear();
        resolve();
      });
      this.confirmationModalCancelSub = this.actionConfirmModalComponentRef.instance.cancel.subscribe(() => {
        this.confirmationModalCancelSub.unsubscribe();
        hostViewContainerRef.clear();
        reject();
      });
    });
  }

  ngOnDestroy(): void {
    this.propertiesChangedSub.unsubscribe();

    if (this.actionConfirmModalComponentRef) {
      this.actionConfirmModalComponentRef.destroy(); 
      this.confirmationModalConfirmSub.unsubscribe();
      this.confirmationModalCancelSub.unsubscribe();
    }
  }

  setUpBackButton(): void {
    this.backButtonLabel = this.editMode && !!this.id ? 'Back to property card' : 'Back to properties';
    this.backButtonUrl = this.editMode && !!this.id ? `/properties/${this.id}` : `/properties`;
  }
}