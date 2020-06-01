import { FormControl } from "@angular/forms";

export class CustomValidators {
  static date(control: FormControl): {[s: string]: boolean}  {
    const DATE_REGEXP = new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/);
  
    if (!DATE_REGEXP.test(control.value)) {
      return { 'invalidDate': true };
    }
    return null;
  }

  static hour(control: FormControl): {[s: string]: boolean}  {
    const value = parseInt(control.value);
    if (!(value >= 0 && value <= 24)) {
      return { 'invalidHour': true };
    }
    return null
  }
  
  static minute(control: FormControl): {[s: string]: boolean}  {
    const value = parseInt(control.value);
    if (!(value >= 0 && value <= 60)) {
      return { 'invalidMinute': true };
    }
    return null
  }
}