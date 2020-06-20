export class Note {
  constructor(
    public text: string,
    public timestamp: number,
    public type: string,
    public userName: string,

    public propertyId?: string
  ) {}
}