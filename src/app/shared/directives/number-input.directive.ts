import { Directive } from '@angular/core';

const REGEXP: RegExp = new RegExp('^[0-9]*$');

@Directive({
  selector: '[appNumberInput]',
  host: {
    '(input)': 'onChange($event)',
    '(keypress)': 'onKeyPress($event)',
    'autocomplete': 'off'
  }
})
export class NumberInputDirective {
  cachedValue: string = '';

  constructor() {}

  // Allow numerical values and reject anything else
  onKeyPress(event) {
    const keyCode = event.charCode;
    if (keyCode >= 48 && keyCode <= 57) {
      return true;
    }

    return false;
  }

  // Handle copy-paste and autofill values, and value deletion
  onChange($event) {
    const el = $event.target;
    if ($event.data) {
      if (REGEXP.test($event.data)) {
        this.cachedValue = el.value;
      } else {
        el.value = this.cachedValue;
      }
    } else {
      if (!$event.isTrusted) {
        // Autofill and copy/paste bit
        if (REGEXP.test(el.value)) {
          this.cachedValue = el.value;
        } else {
          el.value = this.cachedValue;
        }
      } else if (!$event.inputType || $event.inputType.indexOf('delete') < 0) {
        // Deleting bit
        el.value = this.cachedValue;
      } else {
        this.cachedValue = el.value;
      }
    }
  }

}
