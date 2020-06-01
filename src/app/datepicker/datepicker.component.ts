import {Component, Output, EventEmitter, ElementRef, ViewChild, Input, OnInit } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbInputDatepickerConfig,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';

import  { generateUID } from '../shared/utils';

import { CustomDateParserFormatterService } from './datepicker-formatter.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  providers: [
    NgbInputDatepickerConfig,
    {
      provide: NgbDateParserFormatter,
      useClass: CustomDateParserFormatterService
    }
  ]
})

export class DatePickerComponent implements OnInit {
  @Input('id') id: string = generateUID('dpc_');
  @Input('date') date: string;
  @Output() update: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('dateInput', {static: false}) dateInput: ElementRef;

  model: NgbDateStruct;

  constructor(config: NgbInputDatepickerConfig,
              private calendar: NgbCalendar,
              private formatter: CustomDateParserFormatterService) {
    // customize default values of datepickers used by this component tree
    config.minDate = {year: 2010, month: 1, day: 1};
    config.maxDate = {year: 2099, month: 12, day: 31};

    // days that don't belong to current month are not visible
    config.outsideDays = 'hidden';

    // weekends are disabled
    config.markDisabled = (date: NgbDate) => calendar.getWeekday(date) >= 6;

    // setting datepicker popup to close only on click outside
    config.autoClose = 'outside';

    // setting the positioning of the datepicker - relative to the input field
    config.placement = ['bottom-left'];
  }

  ngOnInit(): void {
    if (!!this.date && this.date.length) {
      this.model = this.formatter.parse(this.date);
    }
  }

  onDateSelect(): void {
    this.emitChangeEvent();
  }

  onClose(): void {
    this.emitChangeEvent();
  }

  onInputChange(): void {
    this.emitChangeEvent();
  }

  emitChangeEvent(): void {
    const dateString = (this.dateInput.nativeElement as HTMLInputElement).value;
    this.update.emit(dateString);
  }
}
