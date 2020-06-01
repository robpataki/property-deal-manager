import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-note-modal',
  templateUrl: './add-note-modal.component.html'
})
export class AddNoteModalComponent implements OnInit {
  @Output() noteAdded: EventEmitter<string> = new EventEmitter<string>();
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('addNoteModalCloseButton', {static: false}) closeButton: ElementRef<HTMLElement>;

  addNoteForm: FormGroup;
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
    this.addNoteForm = new FormGroup({
      note: new FormControl(null, Validators.required)
    });
  }

  onSubmit(event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isLoading = true;
    this.noteAdded.emit(this.addNoteForm.value['note']);
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
    this.addNoteForm.reset();
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
