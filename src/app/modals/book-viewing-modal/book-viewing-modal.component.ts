import { Component, OnInit, EventEmitter, ElementRef, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from '../../shared/custom-validators';
import { generateUID } from '../../shared/utils';

export interface BookingRaw {
  date: string;
  hours: string;
  minutes: string;
  note: string;
}

@Component({
  selector: 'app-book-viewing-modal',
  templateUrl: './book-viewing-modal.component.html'
})
export class BookViewingModalComponent implements OnInit {
  @Output() viewingBooked: EventEmitter<BookingRaw> = new EventEmitter<BookingRaw>();
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('bookViewingModalCloseButton', {static: false}) closeButton: ElementRef<HTMLElement>;

  bookViewingForm: FormGroup;
  isLoading: boolean;
  isComplete: boolean;
  closeTimeout: any;
  resetTimeOut: any;
  closeDelay: number = 2000;
  resetDelay: number = 200;
  dpInputId: string = generateUID('dpi_');

  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.bookViewingForm = new FormGroup({
      date: new FormControl(null, [
        Validators.required, CustomValidators.date
      ]),
      hours: new FormControl(null, [
        Validators.required, Validators.minLength(1), Validators.maxLength(2), CustomValidators.hour
      ]),
      minutes: new FormControl(null, [
        Validators.required, Validators.minLength(1), Validators.maxLength(2), , CustomValidators.minute
      ]),
      note: new FormControl(null)
    });
  }

  onSubmit(event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isLoading = true;
    this.viewingBooked.emit({
      date: this.bookViewingForm.value['date'],
      hours: this.bookViewingForm.value['hours'],
      minutes: this.bookViewingForm.value['minutes'],
      note: this.bookViewingForm.value['note']
    });

    
  }

  onComplete(): void {
    this.isLoading = false;
    this.isComplete = true;
    
    this.closeTimeout = setTimeout(this.close.bind(this), this.closeDelay);
  }

  close(): void {
    this.closeTimeout = clearTimeout(this.closeTimeout);
    (<HTMLElement>this.closeButton.nativeElement).click();
    this.onClose();
  }

  onClose(): void {
    this.resetTimeOut = setTimeout(() => {
      this.reset.bind(this);
      this.modalClosed.emit();
    }, this.resetDelay);
  }

  reset(): void {
    this.isLoading = false;
    this.isComplete = false;
    this.bookViewingForm.reset();
    this.resetTimeOut = this.clearTimeout(this.resetTimeOut);
  }

  clearTimeout(timeOut: any): void {
    if (timeOut) {
      clearTimeout(timeOut);
      timeOut = null
      return null;
    }
  }

  onDateInputChange(dateString: string): void {
    this.bookViewingForm.controls['date'].setValue(dateString);
  }
}
