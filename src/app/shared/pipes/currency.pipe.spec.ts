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

});
