import { CurrencyPipe } from "./currency.pipe";

describe('CurrencyPipe', () => {
  let currencyPipe: CurrencyPipe;

  beforeEach(() => {
    currencyPipe = new CurrencyPipe();
  })

  it('should display currency in the correct format', () => {
    expect(currencyPipe.transform(10000)).toEqual('£10,000');
    expect(currencyPipe.transform(20000000)).toEqual('£20,000,000');
  })

  it('should display currency in the correct format even if null or 0 is passed in', () => {
    expect(currencyPipe.transform(0)).toEqual('£0');
    expect(currencyPipe.transform(null)).toEqual('£0');
  })

  it('should display currency in the correct format - with 2 decimal digits', () => {
    expect(currencyPipe.transform(0, true)).toEqual('£0.00');
    expect(currencyPipe.transform(1000, true)).toEqual('£1,000.00');
    expect(currencyPipe.transform(0.4321, true)).toEqual('£0.43');
  })

});
