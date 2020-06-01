import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DatePickerComponent } from './datepicker.component';
import { SharedModule } from '../shared/modules/shared.module';
import { CustomDateParserFormatterService } from './datepicker-formatter.service';

@NgModule({
  imports: [FormsModule, NgbModule, SharedModule],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent, SharedModule],
  providers: [
    CustomDateParserFormatterService
  ],
  bootstrap: [DatePickerComponent]
})
export class DatePickerModule {}
