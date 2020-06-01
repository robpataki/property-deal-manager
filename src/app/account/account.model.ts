import { User } from '../shared/models/user.model';
import { Organisation } from '../shared/models/organisation.model';

export class Account {
  constructor(
    public user: User,
    public organisation: Organisation
  )  {}

  get userId(): string {
    return this.user.uid;
  }

  get organisationId(): string {
    return this.organisation.uid;
  }
}