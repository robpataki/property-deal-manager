import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {

  transform(value: string, length: number, ellipsis?: boolean): string {
    if (!value || !value.length || !length) {
      return value;
    }

    return value.substr(0, length) + (ellipsis ? '...' : '');
  }

}
