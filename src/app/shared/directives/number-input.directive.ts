import { Directive } from '@angular/core';

const REGEXP: RegExp = new RegExp('^[0-9]*$');

@Directive({
  selector: '[appNumberInput]',
  host: {
    '(input)': 'onChange($event)',
    '(keypress)': 'onKeyPress($event)',
    '(keydown)': 'onKeyDown($event)',
    'autocomplete': 'off'
  }
})
export class NumberInputDirective {
  cachedValue: string = '';

  constructor() {}

  // Allow numerical values and reject anything else
  onKeyPress($event) {
    const charCode = $event.charCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    return false;
  }

  onKeyDown($event) {
    const keyCode = $event.keyCode;
    const el = $event.target;
    if (keyCode === 38) {
      el.value = +el.value + 1;
    } else if (keyCode === 40) {
      el.value = +el.value > 0 ? +el.value - 1 : 0;
    }
    return true;
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
