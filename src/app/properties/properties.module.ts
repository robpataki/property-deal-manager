import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PropertiesRoutingModule } from './properties-routing.module';
import { AddNoteModalModule } from '../modals/add-note-modal/add-note-modal.module';
import { SharedModule } from '../shared/modules/shared.module';
import { DatePickerModule } from '../datepicker/datepicker.module';

import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyComponent } from './property/property.component';
import { MakeOfferModalComponent } from '../modals/make-offer-modal/make-offer-modal.component';
import { BookViewingModalComponent } from '../modals/book-viewing-modal/book-viewing-modal.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyEditComponent } from './property-edit/property-edit.component';
import { PropertyCrunchComponent } from './property-crunch/property-crunch.component';
import { PropertyBTLCrunchComponent } from './property-crunch/property-btl-crunch/property-btl-crunch.component';
import { PropertyFlipCrunchComponent } from './property-crunch/property-flip-crunch/property-flip-crunch.component';
import { PropertyCrunchSummaryComponent } from './property/property-crunch-summary/property-crunch-summary.component';

@NgModule({
  declarations: [
    PropertyListComponent,
    PropertyDetailComponent,
    PropertyComponent,
    PropertyEditComponent,
    MakeOfferModalComponent,
    BookViewingModalComponent,
    PropertyCrunchComponent,
    PropertyBTLCrunchComponent,
    PropertyFlipCrunchComponent,
    PropertyCrunchSummaryComponent
  ],
  imports: [
    SharedModule,
    PropertiesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    DatePickerModule,
    AddNoteModalModule
  ],
  exports: [
    SharedModule
  ]
})
export class PropertiesModule {}