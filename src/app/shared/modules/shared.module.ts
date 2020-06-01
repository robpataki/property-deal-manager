import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

import { NumberInputDirective } from '../directives/number-input.directive';
import { DateInputDirective } from '../directives/date-input.directive';
import { CurrencyPipe } from '../pipes/currency.pipe';
import { ToDateTimePipe } from '../pipes/to-date-time.pipe';
import { BreakUpStringPipe } from '../pipes/break-up-string';
import { TimeFromNowPipe } from '../pipes/time-from-now.pipe';
import { TrimPipe } from '../pipes/trim.pipe';
import { TrimLinkPipe } from '../pipes/trim-link.pipe';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    NumberInputDirective,
    DateInputDirective,
    BreakUpStringPipe,
    ToDateTimePipe,
    CurrencyPipe,
    TrimPipe,
    TrimLinkPipe,
    TimeFromNowPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    LoadingSpinnerComponent,
    NumberInputDirective,
    DateInputDirective,
    BreakUpStringPipe,
    ToDateTimePipe,
    CurrencyPipe,
    TrimPipe,
    TrimLinkPipe,
    TimeFromNowPipe
  ],
  providers: [
    ToDateTimePipe,
    CurrencyPipe,
    TrimPipe,
    TrimLinkPipe,
    TimeFromNowPipe
  ]
})
export class SharedModule {}