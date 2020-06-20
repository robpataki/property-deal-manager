import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { format as formatDate } from 'date-fns';

@Injectable()
@Pipe({
  name: 'toDateTime'
})
export class ToDateTimePipe implements PipeTransform {
  transform(timestamp: number, withTime: boolean = false): string {
    if (!timestamp) {
      return timestamp + '';
    }
    
    const format = withTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy';

    return formatDate(new Date(+timestamp), format);
  }

}
