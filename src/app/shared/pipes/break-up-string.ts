import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breakUp'
})
export class BreakUpStringPipe implements PipeTransform {

  transform(value: string): string {
    if (!value || !value.length) {
      return value;
    }
    
    let valueWithBreaks = value.split(' ').join('<br>');
    return valueWithBreaks;
  }

}
