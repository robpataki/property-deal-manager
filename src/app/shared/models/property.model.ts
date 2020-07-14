import { Note } from './note.model';
import { Offer } from './offer.model';
import { Viewing } from './viewing.model';

// PropertyDetails doesn't include the arrays other than the links
export interface PropertyDetails {
  uid: string;
  createTimestamp: number,
  
  addressLine1: string;
  addressLine2: string;
  town: string;
  postcode: string;
  
  thumbnailUrl: string;
  bedrooms: number;
  size: number;
  epc: string;
  type: string;
  tenureType: string;
  dealType: string;
  askingPrice: number;
  marketTimestamp: number;
  
  links?: string[];
  crunch?: any;
  comparables?: string[];
}

export class Property implements PropertyDetails {
  constructor(
    public uid: string,
    public createTimestamp: number,
    
    public addressLine1: string,
    public addressLine2: string,
    public town: string,
    public postcode: string,
    
    public thumbnailUrl: string,
    public bedrooms: number,
    public size: number,
    public epc: string,
    public type: string,
    public tenureType: string,
    public dealType: string,
    public askingPrice: number,
    public marketTimestamp: number,
    
    public links?: string[],
    public crunch?: any,
    public comparables?: string[],
    
    public notes?: Note[],
    public offers?: Offer[],
    public viewings?: Viewing[]
  ) {}  
}