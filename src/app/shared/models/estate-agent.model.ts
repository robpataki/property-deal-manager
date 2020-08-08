import { Note } from './note.model';
import { Person } from './person.model';

export class EstateAgent {
  constructor(
    public uid: string,
    public timestamp: number,

    public name: string,
    public branchName: string,
    public email: string,
    public phone: string,
    public thumbnailUrl: string,

    public addressLine1: string,
    public addressLine2: string,
    public town: string,
    public postcode: string,

    public propertyIds: string[],
    public negotiators: Person[],
    public notes: Note[],
    public links: string[]
  ) {}
}
