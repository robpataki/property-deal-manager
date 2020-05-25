import { NgModule } from '@angular/core';

import { PropertyListComponent } from './property-list/property-list.component';
import { PropertiesRoutingModule } from './properties-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PropertyComponent } from './property/property.component';

@NgModule({
  declarations: [
    PropertyListComponent,
    PropertyComponent
  ],
  imports: [
    SharedModule,
    PropertiesRoutingModule
  ],
  exports: [
    SharedModule
  ]
})
export class PropertiesModule {}