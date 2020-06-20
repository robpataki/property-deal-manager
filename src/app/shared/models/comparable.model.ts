import { Note } from './note.model';

export class Comparable {
  constructor(
    public uid: string,
    public timestamp: number,
    
    public addressLine1: string,
    public addressLine2: string,
    public town: string,
    public postcode: string,

    public thumbnailUrl: string,
    public bedrooms: number,
    public size: number,
    public epc: string,
    public type: string,
    public soldPrice: number,
    public soldTimestamp: number,
    
    public properties: string[],
    public notes: Note[],
    public links: string[]
  ) {}
}