import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { ComparablesRoutingModule } from './comparables-routing.module';
import { SharedModule } from '../shared/modules/shared.module';
import { DatePickerModule } from '../datepicker/datepicker.module';

import { ComparableComponent } from './comparable/comparable.component';
import { ComparableLinkComponent } from './comparable-link/comparable-link.component';
import { ComparableEditComponent } from './comparable-edit/comparable-edit.component';
import { ComparableListComponent } from './comparable-list/comparable-list.component';
import { ComparableDetailComponent } from './comparable-detail/comparable-detail.component';
import { AddNoteModalModule } from '../modals/add-note-modal/add-note-modal.module';

@NgModule({
  declarations: [
    ComparableComponent,
    ComparableLinkComponent,
    ComparableEditComponent,
    ComparableListComponent,
    ComparableDetailComponent
  ],
  imports: [
    SharedModule,
    ComparablesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    DatePickerModule,
    AddNoteModalModule
  ],
  exports: [
    SharedModule
  ]
})
export class ComparablesModule {}
