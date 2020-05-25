import { Component, OnInit, OnDestroy } from '@angular/core';
import { Property } from 'src/app/shared/property.model';
import { Subscription } from 'rxjs';
import { PropertyService } from '../property.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit, OnDestroy {
  properties: Property[] = [];
  propertiesChangedSup: Subscription;

  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.propertiesChangedSup = this.propertyService.propertiesChangedSub.subscribe((properties: Property[]) => {
      this.properties = properties;
    });
    this.properties = this.propertyService.getProperties();
  }

  ngOnDestroy(): void {
    this.propertiesChangedSup.unsubscribe();
  }

}
