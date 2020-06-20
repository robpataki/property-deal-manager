import { Pipe, PipeTransform, Injectable } from '@angular/core';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

@Injectable()
@Pipe({
  name: 'timeFromNow'
})
export class TimeFromNowPipe implements PipeTransform {
  transform(timestamp: number): string {
    if (!timestamp) {
      return timestamp + '';
    } else {
      const testDate = new Date(timestamp);
      if (isNaN(testDate.getTime())) {
        return timestamp + '';
      }
    }

    return formatDistanceToNowStrict(+timestamp, { addSuffix: true });
  }
}
