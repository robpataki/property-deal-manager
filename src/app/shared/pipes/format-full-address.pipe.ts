import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'formatFullAddress'
})
export class FormatFullAddressPipe implements PipeTransform {
  transform(addressLine1: string, addressLine2: string, town: string, postcode: string, withBreak?: boolean, wrapUp?: boolean): string {
    const lineBreakSpan: string = `<span class="br-sm"></span>`;

    let fullAddress: string = ``;
    if (!!addressLine1 && addressLine1.length) {
      fullAddress = `${wrapUp ? '<span>' : ''}${addressLine1}${wrapUp ? '</span>' : ''}`;
    }
    
    if (!!addressLine2 && addressLine2.length) {
      fullAddress += `${wrapUp ? '<span>' : ''}, ${addressLine2}${wrapUp ? '</span>' : ''}`
    }
    
    if (!!town && town.length) {
      fullAddress += `${wrapUp ? '<span>' : ''},${withBreak ? lineBreakSpan : ''} ${town}${wrapUp ? '</span>' : ''}`
    }
  
    if (!!postcode && postcode.length) {
      fullAddress += `${wrapUp ? '<span>' : ''},${withBreak && !town ? lineBreakSpan : ''} ${postcode}${wrapUp ? '</span>' : ''}`
    }

    return fullAddress;
  }
}
