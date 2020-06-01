import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface OfferRaw {
  price: string;
  note?: string;
}

@Component({
  selector: 'app-make-offer-modal',
  templateUrl: './make-offer-modal.component.html'
})
export class MakeOfferModalComponent implements OnInit {
  @Output() offerMade: EventEmitter<OfferRaw> = new EventEmitter<OfferRaw>();
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('makeOfferModalCloseButton', {static: false}) closeButton: ElementRef<HTMLElement>;

  makeOfferForm: FormGroup;
  isLoading: boolean;
  isComplete: boolean;
  closeTimeout: any;
  resetTimeOut: any;
  closeDelay: number = 2000;
  resetDelay: number = 200;

  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.makeOfferForm = new FormGroup({
      price: new FormControl(null, Validators.required),
      note: new FormControl(null)
    });
  }

  onSubmit(event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isLoading = true;
    this.offerMade.emit({
      note: this.makeOfferForm.value['note'],
      price: this.makeOfferForm.value['price']
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
    this.makeOfferForm.reset();
    this.resetTimeOut = this.clearTimeout(this.resetTimeOut);
  }

  clearTimeout(timeOut: any): void {
    if (timeOut) {
      clearTimeout(timeOut);
      timeOut = null
      return null;
    }
  }

}
