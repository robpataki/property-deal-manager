import { FormatFullAddressPipe } from "./format-full-address.pipe";

describe('FormatFullAddressPipe', () => {
  const formatFullAddressPipe: FormatFullAddressPipe = new FormatFullAddressPipe();
  const addressLine1: string = 'Flat 2, The Bear';
  const addressLine2: string = '12 Arbour Road';
  const town: string = 'Highbury';
  const postcode: string = 'N5 2XH';

  it('should return the formatted full address', () => {
    expect(formatFullAddressPipe.transform(addressLine1, addressLine2, town, postcode)).toEqual('Flat 2, The Bear, 12 Arbour Road, Highbury, N5 2XH');
  })

  it('should return the formatted full address with a \'line-break\'', () => {
    expect(formatFullAddressPipe.transform(addressLine1, addressLine2, town, postcode, true)).toEqual('Flat 2, The Bear, 12 Arbour Road,<span class="br-sm"></span> Highbury, N5 2XH');
  })

  it('should return the formatted full address without the first line', () => {
    expect(formatFullAddressPipe.transform(null, addressLine2, town, postcode)).toEqual(', 12 Arbour Road, Highbury, N5 2XH');
  })

  it('should return the formatted full address without the second line', () => {
    expect(formatFullAddressPipe.transform(addressLine1, null, town, postcode)).toEqual('Flat 2, The Bear, Highbury, N5 2XH');
  })

  it('should return the formatted full address without the town', () => {
    expect(formatFullAddressPipe.transform(addressLine1, addressLine2, null, postcode)).toEqual('Flat 2, The Bear, 12 Arbour Road, N5 2XH');
  })

  it('should return the formatted full address without the postcode', () => {
    expect(formatFullAddressPipe.transform(addressLine1, addressLine2, town, null)).toEqual('Flat 2, The Bear, 12 Arbour Road, Highbury');
  })

  it('should return the formatted full address without the postcode', () => {
    expect(formatFullAddressPipe.transform(addressLine1, addressLine2, town, null)).toEqual('Flat 2, The Bear, 12 Arbour Road, Highbury');
  })

  it('should return the formatted full address - with lines wrapped in spans', () => {
    expect(formatFullAddressPipe.transform(addressLine1, addressLine2, town, postcode, false, true)).toEqual('<span>Flat 2, The Bear</span><span>, 12 Arbour Road</span><span>, Highbury</span><span>, N5 2XH</span>');
  })
});
