import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Person } from 'src/app/shared/models/person.model';
import { NegotiatorDetails } from 'src/app/shared/models/negotiator-details.model';


@Component({
  selector: 'app-add-negotiator-modal',
  templateUrl: './add-negotiator-modal.component.html'
})
export class AddNegotiatorModalComponent implements OnInit {
  @Output() negotiatorAdded: EventEmitter<NegotiatorDetails> = new EventEmitter<NegotiatorDetails>();
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('addNegotiatorModalCloseButton', {static: false}) closeButton: ElementRef<HTMLElement>;

  addNegotiatorForm: FormGroup;
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
    const firstName: string = '';
    const lastName: string = '';
    const phone: string = '';
    const email: string = '';

    this.addNegotiatorForm = new FormGroup({
      firstName: new FormControl(firstName, [Validators.required]),
      lastName: new FormControl(lastName, [Validators.required]),
      phone: new FormControl(phone),
      email: new FormControl(email, [Validators.email])
    });
  }

  onSubmit(event): void {
    event.preventDefault();
    event.stopPropagation();

    this.isLoading = true;
    this.negotiatorAdded.emit(this.addNegotiatorForm.value);
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
    this.addNegotiatorForm.reset();
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
