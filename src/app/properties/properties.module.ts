import { NgModule } from '@angular/core';

import { PropertyListComponent } from './property-list/property-list.component';
import { PropertiesRoutingModule } from './properties-routing.module';
import { SharedModule } from '../shared/modules/shared.module';
import { PropertyComponent } from './property/property.component';
import { AddNoteModalComponent } from '../modals/add-note-modal/add-note-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MakeOfferModalComponent } from '../modals/make-offer-modal/make-offer-modal.component';
import { BookViewingModalComponent } from '../modals/book-viewing-modal/book-viewing-modal.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyEditComponent } from './property-edit/property-edit.component';
import { DatePickerModule } from '../datepicker/datepicker.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
    AddNoteModalComponent,
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
    DatePickerModule
  ],
  exports: [
    SharedModule
  ]
})
export class PropertiesModule {}