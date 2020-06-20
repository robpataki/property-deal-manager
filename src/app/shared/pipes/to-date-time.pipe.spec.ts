import { ToDateTimePipe } from "./to-date-time.pipe";

describe('ToDateTimePipe', () => {
  let toDateTimePipe: ToDateTimePipe = new ToDateTimePipe();
  let timestamp: number;

  beforeEach(() => {
    timestamp = new Date(1983, 11, 7, 11, 30).getTime();
  })

  it('should convert a timestamp into a British date string', () => {
    expect(toDateTimePipe.transform(timestamp)).toEqual('07/12/1983');
  })

  it('should convert a timestamp into a British date with hours and minutes', () => {
    expect(toDateTimePipe.transform(timestamp, true)).toEqual('07/12/1983 11:30');
  })

  it('should convert a timestamp into a British date string - with "/" separators for the date', () => {
    timestamp = new Date('12-7-1983 11:30').getTime();
    expect(toDateTimePipe.transform(timestamp, true)).toEqual('07/12/1983 11:30');
  })
});
