import { Component, OnInit, ComponentFactoryResolver, ComponentRef, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { ComparableService } from '../comparable.service';
import { Comparable } from 'src/app/shared/models/comparable.model';
import { PROPERTY_TYPES, TENURE_TYPES, EPC_RATINGS, NOTE_TYPES } from 'src/app/shared/services/app-constants.service';
import { kvObjectToArray, generateUID, ukDateToUSDate, getCurrentTimestamp } from 'src/app/shared/utils';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToDateTimePipe } from 'src/app/shared/pipes/to-date-time.pipe';
import { AccountService } from 'src/app/account/account.service';
import { Subscription } from 'rxjs';
import { Note } from 'src/app/shared/models/note.model';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { PropertyService } from 'src/app/properties/property.service';
import { PlaceholderDirective } from 'src/app/shared/directives/placeholder.directive';
import { ConfirmActionModalComponent } from 'src/app/modals/confirm-action-modal/confirm-action-modal.component';

@Component({
  selector: 'app-comparable-edit',
  templateUrl: './comparable-edit.component.html'
})
export class ComparableEditComponent implements OnInit {
  id: string;
  propertyId: string;

  comparablesChangedSub: Subscription;
  propertyComparablesChangedSub: Subscription;

  @ViewChild(PlaceholderDirective, {static: false}) confirmModalHost: PlaceholderDirective;
  confirmationModalCancelSub: Subscription;
  confirmationModalConfirmSub: Subscription;
  actionConfirmModalComponentRef: ComponentRef<any>;

  comparable: Comparable;
  form: FormGroup;
  propertyTypes: any = PROPERTY_TYPES;
  MAX_LINKS: number = 4;
  isLoading: boolean;
  editMode: boolean;
  deleteMode: boolean;
  
  backButtonLabel: string;
  backButtonUrl: string;

  propertyTypesArray: any[] = kvObjectToArray(PROPERTY_TYPES);
  tenureTypesArray: any[] = kvObjectToArray(TENURE_TYPES);
  epcRatingsArray: any[] = kvObjectToArray(EPC_RATINGS);

  dpInputId: string = generateUID('dpi_');

  constructor(private accountService: AccountService,
              private comparableService: ComparableService,
              private propertyService: PropertyService,
              private route: ActivatedRoute,
              private toDateTimePipe: ToDateTimePipe,
              private router: Router,
              private dataStorageService: DataStorageService,
              private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.setUpBackButton();

    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        this.comparable = this.comparableService.getComparable(this.id);

        if (!this.comparable && this.editMode) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.initForm();
      }
    );

    this.route.queryParams.subscribe(params => {
      this.propertyId = params['propertyId'];
      this.setUpBackButton();
    });

    this.comparablesChangedSub = this.comparableService.comparablesChanged.subscribe(comparables => {      
      if (!this.deleteMode) {
        this.dataStorageService.storeComparable(this.id).then(() => {
          let navigateToUrl: string = `/comparables/${this.id}`;
          if (!this.editMode && !!this.propertyId) {
            this.propertyService.addComparableToProperty(this.propertyId, this.id);
            return;
          }
  
          if (!!this.propertyId) {
            navigateToUrl += `?propertyId=${this.propertyId}`;
          }
  
          this.router.navigateByUrl(navigateToUrl);
        }, error => {
          console.error('There was an error when trying to save the comparable - error message: ', error);
        });
      } else {
        console.log('[ComparableEditComponent] - comparablesChanged(deleteMode)');
        this.dataStorageService.deleteComparable(this.id).then(() => {
          console.log('[ComparableEditComponent] - comparablesChanged(deleteMode) - Comparable deleted from DB');
          if (this.comparable.properties.length) {
            this.propertyService.deleteComparable(this.id);
          } else {
            this.router.navigate(['/comparables']);
          }
        });
      }
    });

    // Then add the comparable to the property itself
    this.propertyComparablesChangedSub = this.propertyService.propertiesChangedSub.subscribe(properties => {      
      if (!this.deleteMode) {
        console.log('[ComparableEditComponent] - propertiesChangedSub() - Change detected.');
        this.dataStorageService.storeProperty(this.propertyId).then(() => {
          // this.router.navigate(['/comparables', this.id], { queryParams: { propertyId: this.propertyId } });
          this.router.navigate(['/properties', this.propertyId], { fragment: 's-comparables' });
        }, (error) => {
          console.error('There was an error when trying to add the comparable to the property - error message: ', error);  
        });
      } else {
        console.log('[ComparableEditComponent] - propertiesChangedSub(deleteMode) - Change detected.');
        this.dataStorageService.storeUpdatedPropertyComparables(this.comparable.properties).then(comparables => {
          console.log('[ComparableEditComponent] - DONE! - comparables: ', comparables);
          if (this.propertyId) {
            this.router.navigate(['/properties', this.propertyId], { fragment: 's-comparables' });
          } else {
            this.router.navigate(['/comparables']);
          }
        });
      }
    });
  }

  setUpBackButton(): void {
    if (!this.editMode) {
      if (!!this.propertyId) {
        this.backButtonLabel = 'Back to property card';
        this.backButtonUrl = `/properties/${this.propertyId}#s-comparables`;
      } else {
        this.backButtonLabel = 'Back to comparables';
        this.backButtonUrl = `/comparables`;
      }
    } else {
      this.backButtonLabel = 'Back to comparable card';
      this.backButtonUrl = `/comparables/${this.id}`;

      if (!!this.propertyId) {
        this.backButtonUrl += `?propertyId=${this.propertyId}`;
      }
    }
  }

  initForm(): void {
    let bedrooms: number;
    let size: number;
    let epc: string;
    let type: string;
    let tenureType: string;
    let soldPrice: number;
    let thumbnailUrl: string = 'https://firebasestorage.googleapis.com/v0/b/property-deal-manager.appspot.com/o/static%2Fdefault-property-thumbnail.png?alt=media&token=9bc95394-f2d2-4e86-b85d-e7497288665e';
    let soldDate: string;

    let addressLine1: string;
    let addressLine2: string;
    let town: string;
    let postcode: string;

    let links: FormArray = new FormArray([]);

    if(this.editMode) {
      bedrooms  = !isNaN(+this.comparable.bedrooms) ? this.comparable.bedrooms : null;
      size = !isNaN(+this.comparable.size) ? this.comparable.size : null;
      epc = !!this.comparable.epc ? EPC_RATINGS[this.comparable.epc].key : null;
      type = !!this.comparable.type ? PROPERTY_TYPES[this.comparable.type].key : null;
      tenureType = !!this.comparable.tenureType ? TENURE_TYPES[this.comparable.tenureType].key : null;
      soldPrice = this.comparable.soldPrice;
      thumbnailUrl = this.comparable.thumbnailUrl;
      soldDate = this.toDateTimePipe.transform(this.comparable.soldTimestamp);

      addressLine1 = this.comparable.addressLine1;
      addressLine2 = this.comparable.addressLine2;
      town = this.comparable.town;
      postcode = this.comparable.postcode;

      this.comparable.links.map((link) => {
        links.push(new FormControl(link, [Validators.required]))
      });
    }

    this.form = new FormGroup({
      bedrooms: new FormControl(bedrooms),
      type: new FormControl(type),
      tenureType: new FormControl(tenureType),
      size: new FormControl(size),
      epc: new FormControl(epc),
      soldPrice: new FormControl(soldPrice, [Validators.required]),
      thumbnailUrl: new FormControl(thumbnailUrl),
      soldDate: new FormControl(soldDate),

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

  onDateInputChange(dateString: string): void {
    this.form.controls['soldDate'].setValue(dateString);
  }

  getUserName(): string {
    return this.accountService.getAccount().user.public_profile.displayName;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.id = this.id || generateUID('c_');
    const usSoldDate: string = ukDateToUSDate(this.form.value.soldDate);
    const soldTimestamp: number = new Date(usSoldDate).getTime();

    const comparable: Comparable = new Comparable(
      this.id,
      getCurrentTimestamp(),
      
      this.form.value.addressLine1,
      this.form.value.addressLine2,
      this.form.value.town,
      this.form.value.postcode,
      
      this.form.value.thumbnailUrl,
      this.form.value.bedrooms,
      this.form.value.size,
      this.form.value.epc,
      this.form.value.type,
      this.form.value.tenureType,
      this.form.value.soldPrice,
      soldTimestamp,
      
      [],
      [new Note(
        'Comparable card created',
        getCurrentTimestamp(),
        NOTE_TYPES.NOT.key,
        this.getUserName()
      )],
      this.form.value.links
    );

    if (!!this.propertyId) {
      comparable.properties = [this.propertyId];
    } else {
      
    }

    if (this.editMode) {
      this.comparableService.setComparable(this.id, comparable);
    } else {
      this.comparableService.addComparable(comparable);
    }
  }

  onCancel(): void {
    this.router.navigateByUrl(this.backButtonUrl);
  }

  onDelete(): void {
    this.deleteMode = true;

    const message: string = 'delete this comparable';
    let additionalMessage: string = '';

    if (this.comparable.properties.length > 1) {
      additionalMessage = `This comparable is used by ${this.comparable.properties.length} properties. Deleting the comparable will automatically remove it from all ${this.comparable.properties.length} properties`;
    }

    console.log('[ComparableEditComponent] - onDelete(BEFORE) - ', this.id, this.comparableService.getComparables(), this.comparable.properties);
    this.showConfirmationModal(message, additionalMessage).then(() => {
      this.isLoading = true;
      this.comparableService.deleteComparable(this.id);
      console.log('[ComparableEditComponent] - onDelete(AFTER) - ', this.id, this.comparableService.getComparables(), this.comparable.properties);
    }, error => {});
  }

  showConfirmationModal(message: string, additionalMessage?: string): Promise<void> {
    const confirmModalComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmActionModalComponent);
    const hostViewContainerRef = this.confirmModalHost.viewContainerRef;
    hostViewContainerRef.clear();

    this.actionConfirmModalComponentRef = hostViewContainerRef.createComponent(confirmModalComponentFactory);
    this.actionConfirmModalComponentRef.instance.message = message;
    if (additionalMessage) {
      this.actionConfirmModalComponentRef.instance.additionalMessage = additionalMessage;
    }
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
    this.comparablesChangedSub.unsubscribe();
    this.propertyComparablesChangedSub.unsubscribe();

    if (this.actionConfirmModalComponentRef) {
      this.actionConfirmModalComponentRef.destroy(); 
      this.confirmationModalConfirmSub.unsubscribe();
      this.confirmationModalCancelSub.unsubscribe();
    }
  }
}
