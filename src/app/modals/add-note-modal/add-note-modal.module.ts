import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AddNoteModalComponent } from './add-note-modal.component';
import { SharedModule } from '../../shared/modules/shared.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    AddNoteModalComponent
  ],
  exports: [
    AddNoteModalComponent,
    SharedModule
  ],
  providers: [],
  bootstrap: [
    AddNoteModalComponent
  ]
})
export class AddNoteModalModule {}
