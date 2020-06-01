import { ToDateTimePipe } from "./to-date-time.pipe";

describe('ToDateTimePipe', () => {
  let toDateTimePipe: ToDateTimePipe = new ToDateTimePipe();
  let timestampString: string;

  beforeEach(() => {
    timestampString = new Date(1983, 11, 7, 11, 30).getTime().toString();
  })

  it('should convert a timestamp into a British date string', () => {
    expect(toDateTimePipe.transform(timestampString)).toEqual('07/12/1983');
  })

  it('should convert a timestamp into a British date with hours and minutes', () => {
    expect(toDateTimePipe.transform(timestampString, true)).toEqual('07/12/1983 11:30');
  })

  it('should convert a timestamp into a British date string - with "/" separators for the date', () => {
    timestampString = new Date('12-7-1983 11:30').getTime().toString();
    expect(toDateTimePipe.transform(timestampString, true)).toEqual('07/12/1983 11:30');
  })
});
