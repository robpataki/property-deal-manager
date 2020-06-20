import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { ComparableBadgeComponent } from '../../comparable-badge/comparable-badge.component';
import { BackButtonComponent } from '../../back-button/back-button.component';
import { NumberInputDirective } from '../directives/number-input.directive';
import { DateInputDirective } from '../directives/date-input.directive';
import { CurrencyPipe } from '../pipes/currency.pipe';
import { ToDateTimePipe } from '../pipes/to-date-time.pipe';
import { BreakUpStringPipe } from '../pipes/break-up-string';
import { TimeFromNowPipe } from '../pipes/time-from-now.pipe';
import { TrimPipe } from '../pipes/trim.pipe';
import { TrimLinkPipe } from '../pipes/trim-link.pipe';
import { ConfirmActionModalComponent } from 'src/app/modals/confirm-action-modal/confirm-action-modal.component';
import { PlaceholderDirective } from '../directives/placeholder.directive';
import { FormatFullAddressPipe } from '../pipes/format-full-address.pipe';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    BackButtonComponent,
    PlaceholderDirective,
    ConfirmActionModalComponent,
    ComparableBadgeComponent,
    NumberInputDirective,
    DateInputDirective,
    BreakUpStringPipe,
    ToDateTimePipe,
    CurrencyPipe,
    TrimPipe,
    TrimLinkPipe,
    TimeFromNowPipe,
    FormatFullAddressPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    LoadingSpinnerComponent,
    BackButtonComponent,
    PlaceholderDirective,
    ConfirmActionModalComponent,
    ComparableBadgeComponent,
    NumberInputDirective,
    DateInputDirective,
    BreakUpStringPipe,
    ToDateTimePipe,
    CurrencyPipe,
    TrimPipe,
    TrimLinkPipe,
    TimeFromNowPipe,
    FormatFullAddressPipe
  ],
  providers: [
    ToDateTimePipe,
    CurrencyPipe,
    TrimPipe,
    TrimLinkPipe,
    TimeFromNowPipe,
    FormatFullAddressPipe
  ]
})
export class SharedModule {}