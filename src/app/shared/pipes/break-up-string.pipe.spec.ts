import { BreakUpStringPipe } from "./break-up-string";

describe('BreakUpStringPipe', () => {
  let breakUpStringPipe: BreakUpStringPipe;

  beforeEach(() => {
    breakUpStringPipe = new BreakUpStringPipe();
  })

  it('should add a break for every " " in the string', () => {
    expect(breakUpStringPipe.transform('07/12/1983 11:30')).toEqual('07/12/1983<br>11:30');
    expect(breakUpStringPipe.transform('foo bar meh')).toEqual('foo<br>bar<br>meh');
    expect(breakUpStringPipe.transform(' ')).toEqual('<br>');
    expect(breakUpStringPipe.transform('  ')).toEqual('<br><br>');
  })

  it('should return the value itself if not/or an empty a string', () => {
    expect(breakUpStringPipe.transform('')).toEqual('');
    expect(breakUpStringPipe.transform(null)).toEqual(null);
    expect(breakUpStringPipe.transform(undefined)).toEqual(undefined);
  })

});
