import {
  getCurrentTimestamp,
  arrayToArrayTable,
  ukDateToUSDate,
  generateUID,
  kvObjectToArray } from './utils';

describe('Utils / getCurrentTimestamp()', () => {
  it('should return the current timestamp as a string', () => {
    const currentTimestamp: number = new Date(2020, 7, 15, 12, 30).getTime();
    const timestampSpy = spyOn(Date, 'now').and.returnValue(currentTimestamp);
    expect(getCurrentTimestamp()).toEqual('1597491000000');
  })
})

describe('Utils / ukDateToUSDate()', () => {
  it('should convert the UK date format into a US date format ', () => {
    expect(ukDateToUSDate('24/12/1983')).toEqual('12/24/1983');
  })

  it('should return the value untouched if it\'s not a valid UK formatted date string', () => {
    expect(ukDateToUSDate('28 02 2018')).toEqual('28 02 2018');
    expect(ukDateToUSDate('28/02')).toEqual('28/02');
    expect(ukDateToUSDate('')).toEqual('');
    expect(ukDateToUSDate(null)).toEqual(null);
  })
})

describe('Utils / arrayToArrayTable()', () => {
  it('should return the array with the items arranged into columns and rows ', () => {
    let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let arrayTable = arrayToArrayTable(array, 4);
    expect(arrayTable).toEqual([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10]]);
  })

  it('should return the array if no columns are specified ', () => {
    let array = [1, 2, 3];
    expect(arrayToArrayTable(array, 0)).toEqual([1, 2, 3]);
    expect(arrayToArrayTable(array)).toEqual([1, 2, 3]);
    expect(arrayToArrayTable(array, null)).toEqual([1, 2, 3]);
  })

  it('should return null if array is null ', () => {
    expect(arrayToArrayTable(null)).toEqual(null);
    expect(arrayToArrayTable(null, 42)).toEqual(null);
  })
})

describe('Utils / kvObjectToArray()', () => {
  it('should convert the list of key/value objects into an array of key/value objects', () => {
    expect(kvObjectToArray({greeting: {key: 'hello', value: 'world'}})).toEqual([{key: 'hello', value: 'world'}]);
    
    const input = {
      'a': {
        key: 'a',
        value: 'apple'
      }, 'b': {
        key: 'b',
        value: 'banana'
      }, 'c': {
        key: 'c',
        value: 'cherry'
      }
    }
    const expectedOutput: {key: string, value: string}[] = [
      {key: 'a', value: 'apple'},
      {key: 'b', value: 'banana'},
      {key: 'c', value: 'cherry'}
    ];
    
    expect(kvObjectToArray(input)).toEqual(expectedOutput);
  })

  it('should return the invalid input value', () => {
    expect(kvObjectToArray({ greeting: { key: 'hello' } })).toEqual({greeting: {key: 'hello'}});
    expect(kvObjectToArray({ hello: 'world' })).toEqual({hello: 'world'});
    expect(kvObjectToArray({})).toEqual({});
    expect(kvObjectToArray([1, 2, 3])).toEqual([1, 2, 3]);
    expect(kvObjectToArray(1234)).toEqual(1234);
    expect(kvObjectToArray('')).toEqual('');
    expect(kvObjectToArray(null)).toEqual(null);
    expect(kvObjectToArray(undefined)).toEqual(undefined);    
  })
})

describe('Utils / generateUID()', () => {
  it('should return a random string with the passed in prefix', () => {
    const input: string = 'hello_';
    const generatedUID :string = generateUID(input);
    
    expect(generatedUID.indexOf(input)).toEqual(0);
    expect(generatedUID.length).toEqual(input.length + 9);
  })

  it('should return a unique id', () => {
    const input: string = 'world_';
    const generatedUID1 :string = generateUID(input);
    const generatedUID2 :string = generateUID(input);

    expect(generatedUID1.length).toEqual(generatedUID2.length);
    expect(generatedUID1).not.toEqual(generatedUID2);
  })

  it('should return a 9 character long random string if the prefix is not valid', () => {
    const generatedUID1 :string = generateUID(null);
    const generatedUID2 :string = generateUID('');
    const generatedUID3 :string = generateUID();

    expect(generatedUID1.length).toEqual(9);
    expect(generatedUID2.length).toEqual(9);
    expect(generatedUID3.length).toEqual(9);

    expect(generatedUID1).not.toEqual(generatedUID2);
    expect(generatedUID1).not.toEqual(generatedUID3);
    expect(generatedUID2).not.toEqual(generatedUID3);
  })
})

