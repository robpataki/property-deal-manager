import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Property } from 'src/app/shared/property.model';
import { PropertyService } from '../property.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit, OnDestroy {
  propertyChangedSub: Subscription;
  property: Property;
  id: string;
  fullAddress: String;

  constructor(private propertyService: PropertyService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.property = this.propertyService.getProperty(this.id);

        this.fullAddress = this.property.addressLine1;
        if (this.property.addressLine2.length) {
          this.fullAddress += `, ${this.property.addressLine2}`;
        }
        this.fullAddress += `, ${this.property.town}, ${this.property.postcode}`;
      }
    );
  }

  ngOnDestroy(): void {
    
  }
}
