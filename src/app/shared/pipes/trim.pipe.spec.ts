import { TrimPipe } from './trim.pipe';

describe('TrimPipe', () => {
  let trimPipe: TrimPipe = new TrimPipe();

  it('should trim the input string to the specified length', () => {
    expect(trimPipe.transform('Wait a minute, Doc. Are you telling me you built a time machine...', 19)).toEqual('Wait a minute, Doc.');
  })

  it('should trim the input string to the specified length and append ellipsis', () => {
    expect(trimPipe.transform('Wait a minute, Doc. Are you telling me you built a time machine...', 13, true)).toEqual('Wait a minute...');
  })
});
