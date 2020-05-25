export class Property {
  constructor(
    public uid: string,
    public addressLine1: string,
    public addressLine2: string,
    public postcode: string,
    public town: string,
    public thumbnailUrl: string,
    public epc: string,
    public size: number,
    public type: string,
    public dealType: string
  ) {}  
}