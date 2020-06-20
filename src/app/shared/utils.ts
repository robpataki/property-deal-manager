import { Comparable } from './models/comparable.model';
import { Property } from './models/property.model';

/* 
 * Returns the current date's timestamp as string
*/
export function getCurrentTimestamp(): number {
  return Date.now();
}

/* 
 * Convert a UK Date string into a US Date string
 * example => 24/12/2018 -> 12/24/2918
*/
export function ukDateToUSDate(ukDate: string): string {
  if (!ukDate || !ukDate.length) {
    return ukDate;
  }

  const DELIMETER: string = '/';
  let usDateArray: string[] = ukDate.split(DELIMETER);
  
  if (!usDateArray.length || usDateArray.length < 3) {
    return ukDate;
  }

  return `${usDateArray[1]}${DELIMETER}${usDateArray[0]}${DELIMETER}${usDateArray[2]}`;
}

/* 
 * Returns the array items organised into rows, where each row has the 
 * amount of columns specified in `col`
*/
export function arrayToArrayTable(array: any[], col?:number): any[] | any[][] {
  if (!array || !col) {
    return array;
  }

  const arrayTable: any[][] = [];    
  array.map((item, index) => {
    const rowIndex = Math.floor(index/col);
    const colIndex = Math.floor(index%col);
    
    if (!arrayTable[rowIndex]) {
      arrayTable[rowIndex] = [];
    }

    arrayTable[rowIndex][colIndex] = item;
  });
  return arrayTable;
}

/* 
 * Returns an array of key/value pairs using the passed in nested object
 * This comes handy if you need an array to iterate through from your 
 * template (ie. to populate a select input with options).
 */
export function kvObjectToArray(object: {}): any[] | any {
  if (!object) {
    return object;
  }

  const entries = Object.entries(object);
  if (!entries.length || !entries[0][1]['key'] || !entries[0][1]['value']) {
    return object;
  }

  return Object.keys(object).map(key => {
    return { key: object[key].key, value: object[key].value };
  });
}

/* 
 * Generates a random string and returns it with or without the provided prefix
*/
export function generateUID(prefix?: string): string {
  const randomString: string = Math.random().toString(36).substr(2, 9);
  let result = !!prefix && typeof prefix.indexOf != 'undefined' ? prefix + randomString : randomString;
  return result;
}

/*
 * Calculate the Stamp Duty Land tax based on value and number properties owned
*/
export function calculateStampDuty(value: number): number {
  let std = 0;
  if (value < 40000) {
    return std;
  }
  
  const brackets: any[] = [
    { min: 0, max: 125000, rate: 0, additionalRate: 0.03 },
    { min: 125001, max: 250000, rate: 0.02, additionalRate: 0.05 },
    { min: 250001, max: 925000, rate: 0.05, additionalRate: 0.08 },
    { min: 925001, max: 1500000, rate: 0.1, additionalRate: 0.13 },
    { min: 1500001, max: Number.POSITIVE_INFINITY, rate: 0.12, additionalRate: 0.15 }
  ];

  let index: number = brackets.findIndex((rate) => {
    return (value >= rate.min && value <= rate.max);
  });

  std = (value - brackets[index].min) * brackets[index].additionalRate;
  for (let i = index - 1; i >= 0; i--) {
    const bracket = brackets[i];
    std += ((bracket.max - bracket.min) * bracket.additionalRate);
  }

  return +std.toFixed(2);
}

/*
    * Returns an copy of the passed in array, where the items are 
    * sorted in ascending order by the passed in key, and each item contains the original index
    * *
    * Use this for Notes, Viewings, Offers and Comparables
    * The returned array is an `indexed` array, because it comtains the original item index
  */
 export function sortArrayByKey(key: string, array: {[key: string]: any}[]): any[] {
  if (!array || !array.length) {
    return [];
  }

  return array.map((item, index) => {
    return {
      index: index,
      ...item
    }
  }).sort((a, b) => {
    if (!!a[key] && !!b[key]) {
      return (a[key] >= b[key]) ? 1 : -1;
    } else {
      return 1;
    }
  });
}