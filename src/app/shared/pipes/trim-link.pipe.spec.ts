import { TrimLinkPipe } from './trim-link.pipe';

describe('TrimLinkPipe', () => {
  let trimLinkPipe: TrimLinkPipe = new TrimLinkPipe();

  it('should remove the URL protocol bits from the beginning of the link', () => {
    expect(trimLinkPipe.transform('https://www.rightmove.co.uk/')).toEqual('rightmove.co.uk/');
    expect(trimLinkPipe.transform('https://rightmove.co.uk/')).toEqual('rightmove.co.uk/');
    expect(trimLinkPipe.transform('www.rightmove.co.uk/')).toEqual('rightmove.co.uk/');
  })

  it('should return any invalid links untouched', () => {
    expect(trimLinkPipe.transform('')).toEqual('');
    expect(trimLinkPipe.transform(' ')).toEqual(' ');
    expect(trimLinkPipe.transform('//')).toEqual('//');
    expect(trimLinkPipe.transform(undefined)).toEqual(undefined);
    expect(trimLinkPipe.transform(null)).toEqual(null);
  })
});
