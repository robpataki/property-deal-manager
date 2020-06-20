import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComparableService } from '../comparable.service';
import { Comparable } from 'src/app/shared/models/comparable.model';
import { FormGroup, FormControl } from '@angular/forms';
import { PROPERTY_TYPES } from 'src/app/shared/services/app-constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from 'src/app/properties/property.service';
import { Property } from 'src/app/shared/models/property.model';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';

@Component({
  selector: 'app-comparable-link',
  templateUrl: './comparable-link.component.html'
})
export class ComparableLinkComponent implements OnInit, OnDestroy {
  comparables: Comparable[] = [];
  form: FormGroup;
  propertyTypes: any = PROPERTY_TYPES;
  propertyId: string;
  property: Property;
  postcode: string;
  isLoading: boolean;
  selectedComparable: Comparable;
  
  backButtonLabel: string;
  backButtonUrl: string;

  constructor(private comparableService: ComparableService,
              private propertyService: PropertyService,
              private dataStorageService: DataStorageService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.propertyId = params['propertyId'];

      if (!this.propertyId) {
        this.router.navigate(['/not-found']);
      }

      this.property = this.propertyService.getProperty(this.propertyId);
      this.postcode = this.property.postcode;
      this.setUpBackButton();
    });

    this.initForm();
  }

  ngOnDestroy(): void {

  }

  setUpBackButton(): void {
    if (!!this.propertyId) {
      this.backButtonLabel = 'Back to property card';
      this.backButtonUrl = `/properties/${this.propertyId}#s-comparables`;
    } else {
      this.backButtonLabel = 'Back to comparables';
      this.backButtonUrl = `/comparables`;
    }
  }

  initForm(): void {
    this.form = new FormGroup({
      postcode: new FormControl(this.postcode)
    });
  }

  onPostcodeInput(): void {
    const postcode: string = this.form.value.postcode;
    if (postcode.length) {
      this.comparables = this.comparableService.getComparablesByPostcode(postcode);
    } else {
      this.comparables = [];
    }
  }

  onAddComparable(index: number): void {
    this.isLoading = true;

    this.selectedComparable = this.comparables[index];
    this.comparableService.addPropertyToComparable(this.selectedComparable.uid, this.propertyId, true);
    this.propertyService.addComparableToProperty(this.propertyId, this.selectedComparable.uid, true);
    
    this.dataStorageService.storeComparable(this.selectedComparable.uid).then(() => {
      this.dataStorageService.storeProperty(this.propertyId).then(() => {
        this.router.navigate(['/properties', this.propertyId], { fragment: 's-comparables' });
      }, error => {
        console.error('There was an error when trying to add the complarable on the property - error message: ', error);
      });
    }, error => {
      console.error('There was an error when trying to add the property to the comparable - error message: ', error);
    });
  }
}