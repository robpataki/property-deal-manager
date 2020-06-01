/* 
 * Returns the current date's timestamp as string
*/
export function getCurrentTimestamp(): string {
  return (Date.now()).toString();
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