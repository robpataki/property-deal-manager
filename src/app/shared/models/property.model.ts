import { Note } from './note.model';
import { Offer } from './offer.model';
import { Viewing } from './viewing.model';

// PropertyDetails doesn't include the arrays other than the links
export interface PropertyDetails {
  uid: string;
  createTimestamp: string,
  addressLine1: string;
  addressLine2: string;
  town: string;
  postcode: string;
  thumbnailUrl: string;
  bedrooms: string;
  size: number;
  epc: string;
  type: string;
  dealType: string;
  askingPrice: number;
  marketTimestamp: string;
  
  links?: string[];
}

export class Property implements PropertyDetails {
  constructor(
    public uid: string,
    public createTimestamp: string,
    public addressLine1: string,
    public addressLine2: string,
    public postcode: string,
    public town: string,
    public thumbnailUrl: string,
    public bedrooms: string,
    public size: number,
    public epc: string,
    public type: string,
    public dealType: string,
    public askingPrice: number,
    public marketTimestamp: string,
    
    public links?: string[],

    public notes?: Note[],
    public offers?: Offer[],
    public viewings?: Viewing[]
  ) {}  
}