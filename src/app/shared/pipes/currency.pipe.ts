import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'appCurrency'
})
export class CurrencyPipe implements PipeTransform {
  transform(money: number, showDigits?: boolean): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: showDigits ? 2 : 0,
      maximumFractionDigits: showDigits ? 2 : 0
    }).format(money);
  }
}