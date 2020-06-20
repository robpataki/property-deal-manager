import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';

declare let $: any;

@Component({
  selector: 'app-confirm-action-modal',
  templateUrl: './confirm-action-modal.component.html'
})
export class ConfirmActionModalComponent {
  @ViewChild('confirmActionModal', {static: true}) modal: ElementRef<HTMLElement>;
  @ViewChild('confirmActionModalCloseButton', {static: true}) closeButton: ElementRef<HTMLElement>;
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() showModal = this.show;
  @Input() message: string = 'do this thing';
  @Input() additionalMessage: string = '';

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  show(): void {
    $(this.modal.nativeElement).modal('show');
  }
}